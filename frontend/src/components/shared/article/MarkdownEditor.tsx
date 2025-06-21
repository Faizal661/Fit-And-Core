import React, { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { components } from "./MarkdownComponents";
import didYouMean from "didyoumean";
import { dictionary } from "../../../constants/dictionary";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const MarkdownEditor: React.FC<Props> = ({ value, onChange }) => {
  const [preview, setPreview] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    word: string | null;
  } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = document.querySelector("textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText =
      value.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      value.substring(end);

    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + prefix.length;
      textarea.selectionEnd = start + prefix.length + selectedText.length;
    }, 0);
  };

  const handleRightClick = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    e.preventDefault();

    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const text = value;

    // Extract word under the cursor
    const wordRegex = /\b\w+\b/g;
    let match;
    let wordUnderCursor = "";
    while ((match = wordRegex.exec(text)) !== null) {
      const start = match.index;
      const end = wordRegex.lastIndex;
      if (cursorPos >= start && cursorPos <= end) {
        wordUnderCursor = match[0];
        break;
      }
    }

    if (!wordUnderCursor) return;

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      word: wordUnderCursor,
    });
  };

  const applySuggestion = (suggestedWord: string) => {
    if (!contextMenu?.word) return;
    const wordToReplace = contextMenu.word;

    const newValue = value.replace(
      new RegExp(`\\b${wordToReplace}\\b`, "g"),
      suggestedWord
    );

    onChange(newValue);
    setContextMenu(null);
  };

  const toolbarButtons = [
    { name: "Bold", action: () => insertMarkdown("**", "**"), icon: "B" },
    { name: "Italic", action: () => insertMarkdown("*", "*"), icon: "I" },
    { name: "Heading 1", action: () => insertMarkdown("# ", ""), icon: "H1" },
    { name: "Heading 2", action: () => insertMarkdown("## ", ""), icon: "H2" },
    { name: "Heading 3", action: () => insertMarkdown("### ", ""), icon: "H3" },
    {
      name: "Link",
      action: () => insertMarkdown("[Link_text", "](https://example.com)"),
      icon: "🔗",
    },
    {
      name: "Image",
      action: () => insertMarkdown("![alternative_text](", ")"),
      icon: "🖼️",
    },
    {
      name: "Bulleted List",
      action: () => insertMarkdown("- ", ""),
      icon: "•",
    },
    {
      name: "Numbered List",
      action: () => insertMarkdown("1. ", ""),
      icon: "1.",
    },
    {
      name: "Code Block",
      action: () => insertMarkdown("```\n", "\n```"),
      icon: "</>",
    },
  ];

  const suggestion = contextMenu?.word
    ? didYouMean(contextMenu.word, dictionary)
    : null;

  return (
    <div className="mt-4 w-80 md:w-full overflow-hidden border-1">
      <div className="flex justify-between p-2 bg-slate-900 border-1 border-black  ">
        {!preview && (
          <div className="space-y-2 md:space-y-0 md:flex space-x-2 ">
            {toolbarButtons.map((button) => (
              <button
                key={button.name}
                type="button"
                onClick={button.action}
                className="px-2 py-1 text-sm bg-slate-800 hover:bg-slate-700 text-white hover:cursor-pointer"
                title={button.name}
              >
                {button.icon}
              </button>
            ))}
          </div>
        )}
        <div className={!preview ? "ml-auto" : ""}>
          <button
            onClick={() => setPreview(!preview)}
            type="button"
            className="text-black bg-white px-3 py-1 text-sm hover:cursor-pointer hover:bg-slate-300"
          >
            {preview ? "Edit" : "Preview"}
          </button>
        </div>
      </div>

      {preview ? (
        <div className="bg-slate-100 p-4 overflow-auto max-h-[500px] min-h-[300px] max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl ">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {value}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          className="w-full h-64 p-3 bg-slate-100 text-black focus:outline-none min-h-[300px]"
          spellCheck={true}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onContextMenu={handleRightClick}
          placeholder="Write your article content in Markdown format..."
        />
      )}

      {contextMenu && suggestion && (
        <div
          className="absolute bg-white shadow-lg border rounded text-sm z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            onClick={() => applySuggestion(suggestion)}
            className="block w-full px-4 py-2 hover:bg-blue-100 text-left"
          >
            Replace with "{suggestion}"
          </button>
          <button
            onClick={() => setContextMenu(null)}
            className="block w-full px-4 py-2 hover:bg-gray-100 text-left"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};
