export   const components = {
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