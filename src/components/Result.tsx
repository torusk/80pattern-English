import React from 'react';

interface ResultProps {
  score: number;
  onReset: () => void;
}

const Result: React.FC<ResultProps> = ({ score, onReset }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">クイズ結果</h2>
      <p className="mb-4">あなたのスコア: {score} / 10</p>
      <button
        onClick={onReset}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        もう一度プレイする
      </button>
    </div>
  );
};

export default Result;
