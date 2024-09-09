import React, { useState, useEffect } from "react";

// 文章の型定義
interface Sentence {
  日本語: string;
  英語: string;
}

// コンポーネントのプロプス定義
interface QuizProps {
  sentences: Sentence[]; // 全ての文章
  onFinish: (score: number) => void; // クイズ終了時のコールバック関数
}

const Quiz: React.FC<QuizProps> = ({ sentences, onFinish }) => {
  // 状態変数の定義
  const [currentIndex, setCurrentIndex] = useState(0); // 現在の問題のインデックス
  const [userAnswer, setUserAnswer] = useState(""); // ユーザーの回答
  const [score, setScore] = useState(0); // 現在のスコア
  const [quizSentences, setQuizSentences] = useState<Sentence[]>([]); // クイズ用にランダムに選択された文章
  const [showAnswer, setShowAnswer] = useState(false); // 答えを表示するかどうか
  const [isCorrect, setIsCorrect] = useState(false); // 回答が正解かどうか

  // コンポーネントのマウント時に実行
  useEffect(() => {
    // 10問をランダムに選択
    setQuizSentences(sentences.sort(() => 0.5 - Math.random()).slice(0, 10));
  }, [sentences]);

  // 回答を提出する処理
  const handleSubmit = () => {
    const correctAnswer = quizSentences[currentIndex].英語.trim().toLowerCase();
    const isAnswerCorrect = userAnswer.trim().toLowerCase() === correctAnswer;

    setIsCorrect(isAnswerCorrect);
    setShowAnswer(true);

    if (isAnswerCorrect) {
      setScore(score + 1);
    }

    // 3秒後に次の問題に進む
    setTimeout(() => {
      if (currentIndex < 9) {
        setCurrentIndex(currentIndex + 1);
        setUserAnswer("");
        setShowAnswer(false);
      } else {
        onFinish(isAnswerCorrect ? score + 1 : score);
      }
    }, 3000);
  };

  // Enterキーを押した時の処理
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  if (quizSentences.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        問題 {currentIndex + 1} / 10
      </h2>
      <p className="mb-2">日本語: {quizSentences[currentIndex].日本語}</p>
      <input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        onKeyPress={handleKeyPress}
        className="border p-2 w-full mb-2"
        placeholder="英語で入力してください"
        disabled={showAnswer}
      />
      {showAnswer && (
        <div
          className={`mt-2 p-2 ${isCorrect ? "bg-green-100" : "bg-red-100"}`}
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
    </div>
  );
};

export default Quiz;
