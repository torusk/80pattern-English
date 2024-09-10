import React from "react";

// コンポーネントのプロプス定義
interface ResultProps {
  score: number; // 最終スコア
  onReset: () => void; // リセット時のコールバック関数
}

const Result: React.FC<ResultProps> = ({ score, onReset }) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-4">結果</h2>
      <p className="text-lg mb-4">あなたのスコア: {score} / 10</p>
      <button
        onClick={onReset}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        もう一度プレイする
      </button>
    </div>
  );
};

export default Result;
