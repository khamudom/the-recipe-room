import React from "react";
import ReactMarkdown from "react-markdown";
import styles from "./ai-chef-message.module.css";

type Props = { sender: "user" | "ai"; text: string };

export function AIChefMessage({ sender, text }: Props) {
  const isUser = sender === "user";
  return (
    <div className={`${styles.messageContainer} ${isUser ? "" : styles.ai}`}>
      <div
        className={`${styles.messageBubble} ${
          isUser ? styles.user : styles.ai
        }`}
      >
        {isUser ? (
          text
        ) : (
          <ReactMarkdown
            components={{
              // Style code blocks
              code: ({ className, children, ...props }: any) => {
                const match = /language-(\w+)/.exec(className || "");
                return !props.inline ? (
                  <pre className={styles.codeBlock}>
                    <code className={className} {...props}>
                      {children}
                    </code>
                  </pre>
                ) : (
                  <code className={styles.inlineCode} {...props}>
                    {children}
                  </code>
                );
              },
              // Style paragraphs
              p: ({ children }) => <p className={styles.paragraph}>{children}</p>,
              // Style lists
              ul: ({ children }) => <ul className={styles.list}>{children}</ul>,
              ol: ({ children }) => <ol className={styles.list}>{children}</ol>,
              li: ({ children }) => <li className={styles.listItem}>{children}</li>,
              // Style headings
              h1: ({ children }) => <h1 className={styles.heading}>{children}</h1>,
              h2: ({ children }) => <h2 className={styles.heading}>{children}</h2>,
              h3: ({ children }) => <h3 className={styles.heading}>{children}</h3>,
              h4: ({ children }) => <h4 className={styles.heading}>{children}</h4>,
              h5: ({ children }) => <h5 className={styles.heading}>{children}</h5>,
              h6: ({ children }) => <h6 className={styles.heading}>{children}</h6>,
              // Style blockquotes
              blockquote: ({ children }) => (
                <blockquote className={styles.blockquote}>{children}</blockquote>
              ),
              // Style strong and emphasis
              strong: ({ children }) => <strong className={styles.strong}>{children}</strong>,
              em: ({ children }) => <em className={styles.emphasis}>{children}</em>,
            }}
          >
            {text}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
