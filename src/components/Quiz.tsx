import React, { useState, useEffect, KeyboardEvent } from "react";

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

  // クイズの文章をシャッフルして設定
  useEffect(() => {
    if (isReviewMode) {
      setQuizSentences(sentences);
    } else {
      setQuizSentences(sentences.sort(() => 0.5 - Math.random()).slice(0, 10));
    }
  }, [sentences, isReviewMode]);

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
      <input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        onKeyDown={handleKeyDown}
        className="border border-gray-300 p-2 w-full mb-2 rounded"
        placeholder={
          waitingForNext
            ? "青ボタンを押して次の問題へ"
            : "英語で入力してください"
        }
        disabled={showAnswer}
      />
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
        className="mt-4 bg-green-500 hover:bg--600 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        終了する
      </button>
    </div>
  );
};

export default Quiz;
