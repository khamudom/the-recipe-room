"use client";

import React, { useState, useCallback, useRef } from "react";
import { AIChefButton } from "./ai-chef-button/ai-chef-button";
import { AIChefChatWindow } from "./ai-chef-chat-window/ai-chef-chat-window";

export function AIChefWidget() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleAIChefClick = useCallback(() => {
    setIsChatOpen((prev) => !prev);
  }, []);

  const handleCloseChat = useCallback(() => {
    setIsChatOpen(false);
  }, []);

  return (
    <>
      <AIChefButton ref={buttonRef} onClick={handleAIChefClick} />
      {isChatOpen && (
        <>
          <div
            className="ai-chef-overlay"
            onClick={handleCloseChat}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(2px)",
              zIndex: 999,
              animation: "fadeIn 0.2s ease-out",
            }}
          />
          <AIChefChatWindow onClose={handleCloseChat} buttonRef={buttonRef} />
        </>
      )}
    </>
  );
}
