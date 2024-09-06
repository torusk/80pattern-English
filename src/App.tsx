import React, { useState, useEffect } from "react";
import FileSelector from "./components/FileSelector";
import Quiz from "./components/Quiz";
import Result from "./components/Result";
import "./App.css";

interface Sentence {
  日本語: string;
  英語: string;
}

interface FileOption {
  fileName: string;
  label: string;
}

const App: React.FC = () => {
  const [files, setFiles] = useState<FileOption[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // ファイル名とラベルのペアを準備
    setFiles([
      { fileName: "sentences1.json", label: "６歳までに覚える２０パターン" },
      { fileName: "sentences2.json", label: "８歳までに覚える２２パターン" },
      { fileName: "sentences3.json", label: "12歳までに覚える２４パターン" },
      { fileName: "sentences4.json", label: "teenまでに覚える１４パターン" },
      { fileName: "sentences5.json", label: "上記全部まとめた８０パターン" },
    ]);
  }, []);

  const handleFileSelect = (file: string) => {
    setSelectedFile(file);
    fetch(`/${file}`)
      .then((response) => response.json())
      .then((data) => setSentences(data));
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setQuizFinished(false);
    setScore(0);
  };

  const finishQuiz = (finalScore: number) => {
    setQuizFinished(true);
    setScore(finalScore);
  };

  const resetQuiz = () => {
    setSelectedFile(null);
    setSentences([]);
    setQuizStarted(false);
    setQuizFinished(false);
    setScore(0);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        ８０パターンで英語が止まらない
      </h1>
      {!selectedFile && (
        <FileSelector files={files} onSelect={handleFileSelect} />
      )}
      {selectedFile && !quizStarted && (
        <button
          onClick={startQuiz}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          出題を開始！
        </button>
      )}
      {quizStarted && !quizFinished && (
        <Quiz sentences={sentences} onFinish={finishQuiz} />
      )}
      {quizFinished && <Result score={score} onReset={resetQuiz} />}
    </div>
  );
};

export default App;
