import React, { useState, useRef, useEffect, RefObject } from "react";
import { AIChefMessage } from "../ai-chef-message/ai-chef-message";
import { LoadingSpinner } from "../../loading-spinner/loading-spinner";
import { sendMessageToAI } from "../utils/openai";
import styles from "./ai-chef-chat-window.module.css";

type Message = {
  sender: "user" | "ai";
  text: string;
};

type Props = {
  onClose: () => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
};

export function AIChefChatWindow({ onClose, buttonRef }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chatWindowRef.current &&
        !chatWindowRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, buttonRef]);

  // Auto-scroll to bottom when messages change or loading state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const aiResponse = await sendMessageToAI(input);
      setMessages((prev) => [
        ...prev,
        { sender: "ai" as const, text: aiResponse },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.chatWindow} ref={chatWindowRef}>
      <div className={styles.header}>
        <h3>Chef&apos;s Kitchen Chat</h3>
        <button onClick={onClose} className={styles.closeButton}>
          ✕
        </button>
      </div>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <AIChefMessage key={index} sender={msg.sender} text={msg.text} />
        ))}
        {loading && (
          <div className={styles.loadingContainer}>
            <LoadingSpinner
              size="medium"
              text="Chef is thinking..."
              centered={false}
              animationPath="/assets/lottie/chat-bubble/Animation - 1751394047556.json"
            />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputArea}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about food..."
          className={styles.input}
          rows={3}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className={styles.sendButton}
        >
          Send
        </button>
      </div>
    </div>
  );
}
