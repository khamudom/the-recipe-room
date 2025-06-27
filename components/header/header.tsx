"use client";

import { DEFAULT_PAGE_TITLE, DEFAULT_PAGE_SUBTITLE } from "@/lib/constants";
import styles from "./header.module.css";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({
  title = DEFAULT_PAGE_TITLE,
  subtitle = DEFAULT_PAGE_SUBTITLE,
}: HeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.titleSection}>
        <h1 className={styles.mainTitle}>{title}</h1>
      </div>
      <div className={styles.decorativeLine}></div>
      <p className={styles.subtitle}>{subtitle}</p>
    </div>
  );
}
