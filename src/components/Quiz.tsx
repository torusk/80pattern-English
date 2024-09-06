import React, { useState, useEffect } from 'react';

interface Sentence {
  日本語: string;
  英語: string;
}

interface QuizProps {
  sentences: Sentence[];
  onFinish: (score: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ sentences, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [quizSentences, setQuizSentences] = useState<Sentence[]>([]);

  useEffect(() => {
    // 10問をランダムに選択
    setQuizSentences(sentences.sort(() => 0.5 - Math.random()).slice(0, 10));
  }, [sentences]);

  const handleSubmit = () => {
    if (userAnswer.trim().toLowerCase() === quizSentences[currentIndex].英語.trim().toLowerCase()) {
      setScore(score + 1);
    }

    if (currentIndex < 9) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
    } else {
      onFinish(score + 1);
    }
  };

  if (quizSentences.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">問題 {currentIndex + 1} / 10</h2>
      <p className="mb-2">日本語: {quizSentences[currentIndex].日本語}</p>
      <input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        className="border p-2 w-full mb-2"
        placeholder="英語で入力してください"
      />
      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        回答
      </button>
    </div>
  );
};

export default Quiz;
