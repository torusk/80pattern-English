import React, { useState, useEffect } from "react";

interface Sentence {
  日本語: string;
  英語: string;
}

interface QuizProps {
  sentences: Sentence[];
  onFinish: (score: number, wrongSentences: Sentence[]) => void;
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

  useEffect(() => {
    if (isReviewMode) {
      setQuizSentences(sentences);
    } else {
      setQuizSentences(sentences.sort(() => 0.5 - Math.random()).slice(0, 10));
    }
  }, [sentences, isReviewMode]);

  const handleSubmit = () => {
    const correctAnswer = quizSentences[currentIndex].英語.trim().toLowerCase();
    const isAnswerCorrect = userAnswer.trim().toLowerCase() === correctAnswer;

    setIsCorrect(isAnswerCorrect);
    setShowAnswer(true);

    if (isAnswerCorrect) {
      setScore(score + 1);
    } else {
      setWrongSentences([...wrongSentences, quizSentences[currentIndex]]);
    }

    setTimeout(() => {
      if (currentIndex < quizSentences.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setUserAnswer("");
        setShowAnswer(false);
      } else {
        onFinish(isAnswerCorrect ? score + 1 : score, wrongSentences);
      }
    }, 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
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
        onKeyPress={handleKeyPress}
        className="border border-gray-300 p-2 w-full mb-2 rounded"
        placeholder="英語で入力してください"
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
    </div>
  );
};

export default Quiz;
