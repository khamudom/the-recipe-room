"use client";

import Link from "next/link";
import { useAuth } from "../lib/auth-context";
import styles from "./navigation.module.css";
import Image from "next/image";

export default function Navigation() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/recipebox.png"
            alt="Recipe Room Logo"
            width={40}
            height={40}
          />
          The Recipe Room
        </Link>

        <div className={styles.menu}>
          <Link href="/" className={styles.link}>
            Recipes
          </Link>

          {user ? (
            <>
              <Link href="/recipes/new" className={styles.link}>
                Add Recipe
              </Link>
              <div className={styles.userSection}>
                <span className={styles.userEmail}>{user.email}</span>
                <button
                  onClick={handleSignOut}
                  className={styles.signOutButton}
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className={styles.link}>
                Sign In
              </Link>
              <Link href="/auth/signup" className={styles.link}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
