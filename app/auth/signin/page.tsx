"use client";

import { useRouter } from "next/navigation";
import AuthForm from "../../../components/auth-form";
import styles from "./page.module.css";

export default function SignInPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>
          Sign in to access your recipe collection
        </p>
        <AuthForm mode="signin" onSuccess={handleSuccess} />
        <p className={styles.footer}>
          Don't have an account?{" "}
          <a href="/auth/signup" className={styles.link}>
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}
