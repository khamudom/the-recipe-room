"use client";

import React, { useCallback, useRef } from "react";
import { AIChefButton } from "./ai-chef-button/ai-chef-button";
import { AIChefChatWindow } from "./ai-chef-chat-window/ai-chef-chat-window";
import { useAppSelector, useAppDispatch } from "@/lib/store/store-hooks";
import { openAIChefChat, closeAIChefChat } from "@/lib/store/slices/uiSlice";

export function AIChefWidget() {
  const isChatOpen = useAppSelector((state) => state.ui.isAIChefChatOpen);
  const dispatch = useAppDispatch();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleAIChefClick = useCallback(() => {
    if (isChatOpen) {
      dispatch(closeAIChefChat());
    } else {
      dispatch(openAIChefChat());
    }
  }, [isChatOpen, dispatch]);

  const handleCloseChat = useCallback(() => {
    dispatch(closeAIChefChat());
  }, [dispatch]);

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
