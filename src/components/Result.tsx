import React from "react";

// コンポーネントのプロプス定義
interface ResultProps {
  score: number; // 最終スコア
  onReset: () => void; // リセット時のコールバック関数
}

const Result: React.FC<ResultProps> = ({ score, onReset }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">結果</h2>
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
