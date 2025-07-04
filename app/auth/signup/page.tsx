"use client";

import { useRouter } from "next/navigation";
import { AuthForm } from "../../../components/auth-form/auth-form";
import styles from "./signup.module.css";

export default function SignUpPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Join The Recipe Room</h1>
        <p className={styles.subtitle}>
          Create your account to start collecting and sharing recipes
        </p>
        <AuthForm mode="signup" onSuccess={handleSuccess} />
        <p className={styles.footer}>
          Already have an account?{" "}
          <a href="/auth/signin" className={styles.link}>
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
}
