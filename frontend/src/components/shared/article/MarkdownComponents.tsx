/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import React from 'react';
// import { Node } from 'unist'; 

type CommonProps=any;
// interface CommonProps {
//   node: Node;
//   children?: React.ReactNode;
//   className?: string;
//   [key: string]: any;
// }


export   const components = {
    h1: ({ node, ...props }: CommonProps) => <h1 className="text-3xl font-bold mt-6 mb-4 text-black" {...props} />,
    h2: ({ node, ...props }: CommonProps) => <h2 className="text-2xl font-bold mt-5 mb-3 text-black" {...props} />,
    h3: ({ node, ...props }: CommonProps) => <h3 className="text-xl font-bold mt-4 mb-2 text-black" {...props} />,
    h4: ({ node, ...props }: CommonProps) => <h4 className="text-lg font-bold mt-3 mb-2 text-black" {...props} />,
    p: ({ node, ...props }: CommonProps) => <p className="my-3 text-black" {...props} />,
    a: ({ node, ...props }: CommonProps) => <a className="text-blue-400 underline hover:text-blue-300" {...props} />,
    ul: ({ node, ...props }: CommonProps) => <ul className="list-disc pl-6 my-3" {...props} />,
    ol: ({ node, ...props }: CommonProps) => <ol className="list-decimal pl-6 my-3" {...props} />,
    li: ({ node, ...props }: CommonProps) => <li className="ml-2 my-1" {...props} />,
    blockquote: ({ node, ...props }: CommonProps) => <blockquote className="border-l-4 border-blue-500 pl-4 italic my-3" {...props} />,
    code: ({ node, inline, ...props }: CommonProps) => 
      inline 
        ? <code className="bg-slate-700 rounded px-1 py-0.5 text-sm" {...props} />
        : <code className="block bg-slate-900 rounded p-3 overflow-x-auto text-sm my-4 text-white" {...props} />,
    pre: ({ node, ...props }: CommonProps) => <pre className="bg-transparent my-0" {...props} />,
    img: ({ node, ...props }: CommonProps) => <img className="max-w-full h-auto my-4 rounded" {...props} />,
  };