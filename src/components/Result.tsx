import React from "react";

interface ResultProps {
  score: number;
  onReset: () => void;
  onReviewIncorrect: () => void;
  incorrectCount: number;
  totalAnswered: number;
}

const Result: React.FC<ResultProps> = ({
  score,
  onReset,
  onReviewIncorrect,
  incorrectCount,
  totalAnswered,
}) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-4">結果</h2>
      <p className="text-lg mb-4">
        あなたのスコア: {score} / {totalAnswered}
      </p>
      {incorrectCount > 0 && (
        <button
          onClick={onReviewIncorrect}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 mr-4 my-4"
        >
          間違えた問題を解く ({incorrectCount}問)
        </button>
      )}
      <button
        onClick={onReset}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 mr-4"
      >
        もう一度チャレンジする!
      </button>
    </div>
  );
};

export default Result;
