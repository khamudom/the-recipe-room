"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import styles from "./modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Use portal to render modal at the document body level
  if (typeof window === "undefined") return null;

  return createPortal(
    <>
      <div className={styles.overlay} />
      <div className={styles.modalContainer}>
        <div
          ref={modalRef}
          className={`${styles.modal} ${className || ""}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
        >
          {title && (
            <div className={styles.header}>
              <h2 id="modal-title" className={styles.title}>
                {title}
              </h2>
              <button
                onClick={onClose}
                className={styles.closeButton}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
          )}
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </>,
    document.body
  );
}
