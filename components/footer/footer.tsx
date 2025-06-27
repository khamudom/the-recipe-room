"use client";

import { DEFAULT_FOOTER_QUOTE } from "@/lib/constants";
import styles from "./footer.module.css";

interface FooterProps {
  notification?: string | null;
  quote?: string;
}

export function Footer({
  notification,
  quote = DEFAULT_FOOTER_QUOTE,
}: FooterProps) {
  return (
    <div className={styles.footer}>
      <div className={styles.footerLine}></div>
      {notification && (
        <div className={styles.notification}>{notification}</div>
      )}
      <p className={styles.footerText}>{quote}</p>
    </div>
  );
}
