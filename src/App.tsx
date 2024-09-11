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
  const [incorrectSentences, setIncorrectSentences] = useState<Sentence[]>([]);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [totalAnswered, setTotalAnswered] = useState(0);

  useEffect(() => {
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

  const startQuiz = (reviewMode: boolean = false) => {
    setQuizStarted(true);
    setQuizFinished(false);
    setScore(0);
    setIsReviewMode(reviewMode);
    setTotalAnswered(0);
  };

  const finishQuiz = (
    finalScore: number,
    wrongSentences: Sentence[],
    answered: number
  ) => {
    setQuizFinished(true);
    setScore(finalScore);
    setIncorrectSentences(wrongSentences);
    setTotalAnswered(answered);
  };

  const resetQuiz = () => {
    setSelectedFile(null);
    setSentences([]);
    setQuizStarted(false);
    setQuizFinished(false);
    setScore(0);
    setIncorrectSentences([]);
    setIsReviewMode(false);
    setTotalAnswered(0);
  };

  // タイトルを表示するかどうかを決定する
  const showTitle = !selectedFile;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {showTitle && (
        <h2 className="text-xl font-semibold mb-4">
          80パターンで英語が止まらない
        </h2>
      )}
      {!selectedFile && (
        <FileSelector files={files} onSelect={handleFileSelect} />
      )}
      {selectedFile && !quizStarted && (
        <button
          onClick={() => startQuiz(false)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          出題を開始！
        </button>
      )}
      {quizStarted && !quizFinished && (
        <Quiz
          sentences={isReviewMode ? incorrectSentences : sentences}
          onFinish={finishQuiz}
          isReviewMode={isReviewMode}
        />
      )}
      {quizFinished && (
        <Result
          score={score}
          onReset={resetQuiz}
          onReviewIncorrect={() => startQuiz(true)}
          incorrectCount={incorrectSentences.length}
          totalAnswered={totalAnswered}
        />
      )}
    </div>
  );
};

export default App;
