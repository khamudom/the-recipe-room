"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../../lib/auth-context";
import styles from "./avatar-dropdown.module.css";

export default function AvatarDropdown() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setTimeout(() => {
        if (
          dropdownMenuRef.current &&
          !dropdownMenuRef.current.contains(event.target as Node) &&
          avatarButtonRef.current &&
          !avatarButtonRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      }, 0);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle focus leaving dropdown
  useEffect(() => {
    if (!isOpen) return;
    const handleFocus = (event: FocusEvent) => {
      if (
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(event.relatedTarget as Node)
      ) {
        setIsOpen(false);
        avatarButtonRef.current?.focus();
      }
    };
    const dropdown = dropdownMenuRef.current;
    if (dropdown) {
      dropdown.addEventListener("focusout", handleFocus);
    }
    return () => {
      if (dropdown) {
        dropdown.removeEventListener("focusout", handleFocus);
      }
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
    avatarButtonRef.current?.focus();
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <button
        className={styles.avatarButton}
        onClick={toggleDropdown}
        aria-label="User menu"
        aria-expanded={isOpen}
        ref={avatarButtonRef}
      >
        {user ? (
          <div className={styles.avatar}>
            <span className={styles.initials}>
              {user.email ? getInitials(user.email) : "U"}
            </span>
          </div>
        ) : (
          <div className={styles.avatar}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronUp : ""}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={styles.dropdown}
          ref={dropdownMenuRef}
          tabIndex={-1}
          onClick={(e) => {
            // Close dropdown when clicking on any interactive element
            const target = e.target as HTMLElement;
            if (
              target.tagName === "A" ||
              target.tagName === "BUTTON" ||
              target.closest("a") ||
              target.closest("button")
            ) {
              setIsOpen(false);
            }
          }}
        >
          {user && (
            <div className={styles.userInfo}>
              <span className={styles.userEmail}>{user.email}</span>
            </div>
          )}
          <Link href="/" className={styles.dropdownItem}>
            Recipes
          </Link>
          <Link href="/" className={styles.dropdownItem}>
            Shopping List - Coming Soon
          </Link>
          <Link href="/" className={styles.dropdownItem}>
            AI Chef - Coming Soon
          </Link>
          <div className={styles.divider} />
          {user ? (
            <button onClick={handleSignOut} className={styles.dropdownItem}>
              Sign Out
            </button>
          ) : (
            <>
              <Link href="/auth/signin" className={styles.dropdownItem}>
                Sign In
              </Link>
              <Link href="/auth/signup" className={styles.dropdownItem}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
