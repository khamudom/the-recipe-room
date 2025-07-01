import React from "react";
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
        {text}
      </div>
    </div>
  );
}
