"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "../../../components/auth-form";
import styles from "./page.module.css";

type AuthMode = "signin" | "signup" | "forgot-password";

// Constants for better maintainability and performance
const AUTH_CONTENT = {
  signup: {
    title: "Join The Recipe Room",
    subtitle: "Create an account to start sharing your favorite recipes",
  },
  "forgot-password": {
    title: "Reset Your Password",
    subtitle: "Enter your email to receive a password reset link",
  },
  signin: {
    title: "Welcome Back",
    subtitle: "Sign in to access your recipe collection",
  },
} as const;

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");

  const handleSuccess = () => {
    router.push("/");
  };

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
  };

  const currentContent = AUTH_CONTENT[mode];

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>{currentContent.title}</h1>
        <p className={styles.subtitle}>{currentContent.subtitle}</p>
        <AuthForm
          mode={mode}
          onSuccess={handleSuccess}
          onModeChange={handleModeChange}
        />
      </div>
    </div>
  );
}
