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
        <AIChefChatWindow onClose={handleCloseChat} buttonRef={buttonRef} />
      )}
    </>
  );
}
