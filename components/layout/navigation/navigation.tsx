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
            src="/logo-trr.png"
            alt="Recipe Room Logo"
            width={40}
            height={40}
            priority
            sizes="50px"
            quality={90}
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
