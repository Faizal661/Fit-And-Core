import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const MarkdownEditor: React.FC<Props> = ({ value, onChange }) => {
  const [preview, setPreview] = useState(false);

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = document.querySelector("textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = 
      value.substring(0, start) + 
      prefix + selectedText + suffix + 
      value.substring(end);
    
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + prefix.length;
      textarea.selectionEnd = start + prefix.length + selectedText.length;
    }, 0);
  };

  const toolbarButtons = [
    { name: "Bold", action: () => insertMarkdown("**", "**"), icon: "B" },
    { name: "Italic", action: () => insertMarkdown("*", "*"), icon: "I" },
    { name: "Heading 1", action: () => insertMarkdown("# ", ""), icon: "H1" },
    { name: "Heading 2", action: () => insertMarkdown("## ", ""), icon: "H2" },
    { name: "Heading 3", action: () => insertMarkdown("### ", ""), icon: "H3" },
    { name: "Link", action: () => insertMarkdown("[", "](https://example.com)"), icon: "🔗" },
    { name: "Image", action: () => insertMarkdown("![alt text](", ")"), icon: "🖼️" },
    { name: "Bulleted List", action: () => insertMarkdown("- ", ""), icon: "•" },
    { name: "Numbered List", action: () => insertMarkdown("1. ", ""), icon: "1." },
    { name: "Code Block", action: () => insertMarkdown("```\n", "\n```"), icon: "</>" },
  ];

  const components = {
    h1: ({ node, ...props }: any) => <h1 className="text-3xl font-bold mt-6 mb-4 text-black" {...props} />,
    h2: ({ node, ...props }: any) => <h2 className="text-2xl font-bold mt-5 mb-3 text-black" {...props} />,
    h3: ({ node, ...props }: any) => <h3 className="text-xl font-bold mt-4 mb-2 text-black" {...props} />,
    h4: ({ node, ...props }: any) => <h4 className="text-lg font-bold mt-3 mb-2 text-black" {...props} />,
    p: ({ node, ...props }: any) => <p className="my-3 text-black" {...props} />,
    a: ({ node, ...props }: any) => <a className="text-blue-400 underline hover:text-blue-300" {...props} />,
    ul: ({ node, ...props }: any) => <ul className="list-disc pl-6 my-3" {...props} />,
    ol: ({ node, ...props }: any) => <ol className="list-decimal pl-6 my-3" {...props} />,
    li: ({ node, ...props }: any) => <li className="ml-2 my-1" {...props} />,
    blockquote: ({ node, ...props }: any) => <blockquote className="border-l-4 border-blue-500 pl-4 italic my-3" {...props} />,
    code: ({ node, inline, ...props }: any) => 
      inline 
        ? <code className="bg-slate-700 rounded px-1 py-0.5 text-sm" {...props} />
        : <code className="block bg-slate-900 rounded p-3 overflow-x-auto text-sm my-4 text-white" {...props} />,
    pre: ({ node, ...props }: any) => <pre className="bg-transparent my-0" {...props} />,
    img: ({ node, ...props }: any) => <img className="max-w-full h-auto my-4 rounded" {...props} />,
  };

  return (
    <div className="mt-4 w-80 md:w-full border border-blue-700 rounded overflow-hidden">
      <div className="flex justify-between p-2 bg-slate-900 border-b border-blue-700">
        {!preview && (
          <div className="space-y-2 md:space-y-0 md:flex space-x-2 ">
            {toolbarButtons.map((button) => (
              <button
                key={button.name}
                type="button"
                onClick={button.action}
                className="px-2 py-1 text-sm bg-slate-800 hover:bg-slate-700 text-white rounded"
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
            className="text-white bg-blue-600 px-3 py-1 text-sm rounded hover:bg-blue-700"
          >
            {preview ? "Edit" : "Preview"}
          </button>
        </div>
      </div>

      {preview ? (
        <div className="bg-slate-100 p-4 overflow-auto max-h-[500px] min-h-[300px] max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            components={components}
          >
            {value}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          className="w-full h-64 p-3 bg-slate-100 text-black focus:outline-none min-h-[300px]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your article content in Markdown format..."
        />
      )}
    </div>
  );
};
