import React from "react";

// ファイルオプションの型定義
interface FileOption {
  fileName: string;
  label: string;
}

// コンポーネントのプロプス定義
interface FileSelectorProps {
  files: FileOption[]; // 利用可能なファイルのリスト
  onSelect: (file: string) => void; // ファイル選択時のコールバック関数
}

const FileSelector: React.FC<FileSelectorProps> = ({ files, onSelect }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">コースを選択してください：</h2>
      <ul>
        {/* 利用可能なファイルのリストをマップしてボタンを生成 */}
        {files.map((fileOption, index) => (
          <li key={index} className="mb-2">
            <button
              onClick={() => onSelect(fileOption.fileName)}
              className="level"
            >
              {fileOption.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileSelector;
