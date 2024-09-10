import React, { useState, useEffect } from "react";
import FileSelector from "./components/FileSelector";
import Quiz from "./components/Quiz";
import Result from "./components/Result";
import "./App.css";

// 文章の型定義
interface Sentence {
  日本語: string;
  英語: string;
}

// ファイルオプションの型定義
interface FileOption {
  fileName: string;
  label: string;
}

const App: React.FC = () => {
  // 状態変数の定義
  const [files, setFiles] = useState<FileOption[]>([]); // 利用可能なファイルのリスト
  const [selectedFile, setSelectedFile] = useState<string | null>(null); // 選択されたファイル
  const [sentences, setSentences] = useState<Sentence[]>([]); // ロードされた文章
  const [quizStarted, setQuizStarted] = useState(false); // クイズが開始されたかどうか
  const [quizFinished, setQuizFinished] = useState(false); // クイズが終了したかどうか
  const [score, setScore] = useState(0); // ユーザーのスコア

  // コンポーネントのマウント時に実行
  useEffect(() => {
    // 利用可能なファイルのリストを設定
    setFiles([
      { fileName: "sentences1.json", label: "６歳までに覚える２０パターン" },
      { fileName: "sentences2.json", label: "８歳までに覚える２２パターン" },
      { fileName: "sentences3.json", label: "12歳までに覚える２４パターン" },
      { fileName: "sentences4.json", label: "teenまでに覚える１４パターン" },
      { fileName: "sentences5.json", label: "上記全部まとめた８０パターン" },
    ]);
  }, []);

  // ファイルが選択された時の処理
  const handleFileSelect = (file: string) => {
    setSelectedFile(file);
    // 選択されたファイルから文章をロード
    fetch(`/${file}`)
      .then((response) => response.json())
      .then((data) => setSentences(data));
  };

  // クイズを開始する処理
  const startQuiz = () => {
    setQuizStarted(true);
    setQuizFinished(false);
    setScore(0);
  };

  // クイズが終了した時の処理
  const finishQuiz = (finalScore: number) => {
    setQuizFinished(true);
    setScore(finalScore);
  };

  // クイズをリセットする処理
  const resetQuiz = () => {
    setSelectedFile(null);
    setSentences([]);
    setQuizStarted(false);
    setQuizFinished(false);
    setScore(0);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-responsive-title font-bold mb-6 text-center leading-tight">
        ８０パターンで英語が止まらない
      </h1>
      {/* ファイルが選択されていない場合、FileSelector を表示 */}
      {!selectedFile && (
        <FileSelector files={files} onSelect={handleFileSelect} />
      )}
      {/* ファイルが選択されクイズが開始されていない場合、開始ボタンを表示 */}
      {selectedFile && !quizStarted && (
        <button
          onClick={startQuiz}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          出題を開始！
        </button>
      )}
      {/* クイズが開始され終了していない場合、Quiz コンポーネントを表示 */}
      {quizStarted && !quizFinished && (
        <Quiz sentences={sentences} onFinish={finishQuiz} />
      )}
      {/* クイズが終了した場合、Result コンポーネントを表示 */}
      {quizFinished && <Result score={score} onReset={resetQuiz} />}
    </div>
  );
};

export default App;
