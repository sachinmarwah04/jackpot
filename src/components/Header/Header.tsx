"use client";

import Link from "next/link";
import Image from "next/image";
import { useGameStore } from "@/store/useGameStore";
import styles from "./Header.module.scss";

export default function Header() {
  const { setActiveTab, setActiveSection, setSearchQuery } = useGameStore();

  const handleLogoClick = () => {
    setActiveTab("");
    setActiveSection(null);
    setSearchQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo} aria-label="Jackpot home" onClick={handleLogoClick}>
          <Image
            src="/jackpot-logo.png"
            alt="Jackpot"
            width={140}
            height={26}
            className={styles.logoImg}
          />
        </Link>

        {/* Right-side actions */}
        <div className={styles.right}>
          {/* Search icon — exact from Figma node 1:1915 */}
          <button type="button" className={styles.iconBtn} aria-label="Search">
            <Image src="/icons/header-search.svg" width={44} height={44} alt="" unoptimized />
          </button>

          <button type="button" className={styles.iconBtn} aria-label="Live chat">
            <Image src="/icons/header-chat.svg" width={44} height={44} alt="" unoptimized />
          </button>

          <button type="button" className={styles.loginBtn}>
            Login
          </button>
          <button type="button" className={styles.registerBtn}>
            Register
          </button>
        </div>
      </div>
    </header>
  );
}
