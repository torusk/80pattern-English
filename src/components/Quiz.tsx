import React, { useState, useEffect, KeyboardEvent } from "react";

// 型定義の追加
interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  readonly isFinal: boolean;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface Sentence {
  日本語: string;
  英語: string;
}

interface QuizProps {
  sentences: Sentence[];
  onFinish: (
    score: number,
    wrongSentences: Sentence[],
    totalAnswered: number
  ) => void;
  isReviewMode: boolean;
}

const Quiz: React.FC<QuizProps> = ({ sentences, onFinish, isReviewMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [quizSentences, setQuizSentences] = useState<Sentence[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wrongSentences, setWrongSentences] = useState<Sentence[]>([]);
  const [waitingForNext, setWaitingForNext] = useState(false);

  // 追加: 音声認識関連の状態
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  // クイズの文章をシャッフルして設定
  useEffect(() => {
    if (isReviewMode) {
      setQuizSentences(sentences);
    } else {
      setQuizSentences(
        [...sentences].sort(() => 0.5 - Math.random()).slice(0, 10)
      );
    }

    // 音声認識の初期化
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.lang = "en-US";
      recog.continuous = false;
      recog.interimResults = false;

      recog.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setUserAnswer(transcript);
      };

      recog.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recog);
    } else {
      console.error("このブラウザは音声認識をサポートしていません。");
    }
  }, [sentences, isReviewMode]);

  // 音声認識の開始・停止
  const toggleRecording = () => {
    if (recognition) {
      if (isRecording) {
        recognition.stop();
      } else {
        recognition.start();
        setIsRecording(true);
      }
    }
  };

  // 回答を提出する処理
  const handleSubmit = () => {
    if (waitingForNext) {
      // 次の問題に移動する準備ができている場合
      moveToNextQuestion();
      return;
    }

    const correctAnswer = quizSentences[currentIndex].英語.trim().toLowerCase();
    const isAnswerCorrect = userAnswer.trim().toLowerCase() === correctAnswer;

    setIsCorrect(isAnswerCorrect);
    setShowAnswer(true);
    setWaitingForNext(true);

    if (isAnswerCorrect) {
      setScore(score + 1);
    } else {
      setWrongSentences([...wrongSentences, quizSentences[currentIndex]]);
    }
  };

  // 次の問題に移動する処理
  const moveToNextQuestion = () => {
    if (currentIndex < quizSentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer("");
      setShowAnswer(false);
      setWaitingForNext(false);
    } else {
      onFinish(score, wrongSentences, currentIndex + 1);
    }
  };

  // キーボードイベントの処理
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // デフォルトの挙動を防ぐ
      handleSubmit();
    }
  };

  // クイズを早期に終了する処理
  const handleEarlyFinish = () => {
    onFinish(score, wrongSentences, currentIndex + 1);
  };

  if (quizSentences.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        問題 {currentIndex + 1} / {quizSentences.length}
      </h2>
      <p className="mb-2">日本語: {quizSentences[currentIndex].日本語}</p>
      <div className="flex items-center mb-2">
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          className="border border-gray-300 p-2 w-full rounded"
          placeholder={
            waitingForNext
              ? "青ボタンを押して次の問題へ"
              : "英語で入力してください"
          }
          disabled={showAnswer}
        />
        {recognition && (
          <button
            onClick={toggleRecording}
            className={`ml-2 p-2 rounded-full ${
              isRecording ? "bg-red-500" : "bg-blue-500"
            } text-white`}
          >
            {isRecording ? "■" : "🎤"}
          </button>
        )}
      </div>
      {showAnswer && (
        <div
          className={`mt-2 p-2 rounded ${
            isCorrect
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isCorrect ? (
            <p className="text-green-700">正解です！</p>
          ) : (
            <p className="text-red-700">
              惜しい！正しい答えは: {quizSentences[currentIndex].英語}
            </p>
          )}
        </div>
      )}
      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 mr-2"
      >
        {waitingForNext ? "次の問題" : "回答する"}
      </button>
      <button
        onClick={handleEarlyFinish}
        className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        終了する
      </button>
    </div>
  );
};

export default Quiz;
