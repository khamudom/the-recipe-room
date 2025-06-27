"use client";

import Link from "next/link";
import styles from "./navigation.module.css";
import Image from "next/image";
import AvatarDropdown from "./avatar-dropdown";

export default function Navigation() {
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
          <AvatarDropdown />
        </div>
      </div>
    </nav>
  );
}
