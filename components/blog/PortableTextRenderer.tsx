import {
    PortableText,
    type PortableTextComponents,
  } from "@portabletext/react";
  import type { PortableTextBlock } from "next-sanity";
  
  type PortableTextRendererProps = {
    value?: PortableTextBlock[];
  };
  
  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => (
        <p className="mb-6 leading-relaxed">
          {children}
        </p>
      ),
  
      h2: ({ children }) => (
        <h2 className="mb-5 mt-12 text-3xl font-medium leading-tight">
          {children}
        </h2>
      ),
  
      h3: ({ children }) => (
        <h3 className="mb-4 mt-10 text-2xl font-medium leading-tight">
          {children}
        </h3>
      ),
  
      blockquote: ({ children }) => (
        <blockquote className="my-10 border-l border-[#8a7f70] pl-6 italic">
          {children}
        </blockquote>
      ),
    },

    marks: {
        strong: ({ children }) => (
          <strong className="font-semibold text-[#1c1b19]">
            {children}
          </strong>
        ),
      
        em: ({ children }) => (
          <em className="italic">
            {children}
          </em>
        ),
        link: ({ children, value }) => {
            const href = value?.href;
          
            if (!href) {
              return <>{children}</>;
            }
          
            const isExternal = href.startsWith("http");
          
            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                {children}
              </a>
            );
          },
      },

    list: {
        bullet: ({ children }) => (
          <ul className="mb-6 ml-6 list-disc space-y-2">
            {children}
          </ul>
        ),
      
        number: ({ children }) => (
          <ol className="mb-6 ml-6 list-decimal space-y-2">
            {children}
          </ol>
        ),
      },

    listItem: {
        bullet: ({ children }) => (
          <li className="pl-1">{children}</li>
        ),
      
        number: ({ children }) => (
          <li className="pl-1">{children}</li>
        ),
      },
  };
  
  export function PortableTextRenderer({
    value,
  }: PortableTextRendererProps) {
    if (!value || value.length === 0) {
      return null;
  }
  return <PortableText value={value} components={components} />;
}