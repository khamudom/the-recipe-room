"use client";

import React, { useState, useCallback } from "react";
import { AIChefButton } from "./ai-chef-control/ai-chef-control";
import { AIChefChatWindow } from "./ai-chef-chat-window/ai-chef-chat-window";

export function GlobalAIChef() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleAIChefClick = useCallback(() => {
    setIsChatOpen(true);
  }, []);

  const handleCloseChat = useCallback(() => {
    setIsChatOpen(false);
  }, []);

  return (
    <>
      <AIChefButton onClick={handleAIChefClick} />
      {isChatOpen && <AIChefChatWindow onClose={handleCloseChat} />}
    </>
  );
}
