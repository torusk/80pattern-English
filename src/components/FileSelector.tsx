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
      <h2 className="text-xl font-semibold mb-4">コースを選択してください：</h2>
      <ul className="space-y-2">
        {/* 利用可能なファイルのリストをマップしてボタンを生成 */}
        {files.map((fileOption, index) => (
          <li key={index} className="mb-2">
            <button
              onClick={() => onSelect(fileOption.fileName)}
              className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-2 px-4 rounded transition duration-300"
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
