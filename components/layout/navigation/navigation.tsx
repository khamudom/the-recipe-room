"use client";

import Link from "next/link";
import styles from "./navigation.module.css";
import Image from "next/image";
import { AvatarDropdown } from "../../ui/avatar-dropdown/avatar-dropdown";

export function Navigation() {
  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link href="/" className={styles.logoContainer}>
          <Image
            src="/recipebox.png"
            alt="Recipe Room Logo"
            width={50}
            height={50}
          />
          <div className={styles.logoText}>The Recipe Room</div>
        </Link>
        <div className={styles.menu}>
          <AvatarDropdown />
        </div>
      </div>
    </nav>
  );
}
