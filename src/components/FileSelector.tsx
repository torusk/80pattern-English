import React from "react";

interface FileOption {
  fileName: string;
  label: string;
}

interface FileSelectorProps {
  files: FileOption[];
  onSelect: (file: string) => void;
}

const FileSelector: React.FC<FileSelectorProps> = ({ files, onSelect }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">コースを選択してください：</h2>
      <ul>
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
