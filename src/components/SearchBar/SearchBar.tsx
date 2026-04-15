"use client";

import Image from "next/image";
import styles from "./SearchBar.module.scss";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.searchIcon} aria-hidden="true">
        <Image src="/icons/search.svg" width={16} height={16} alt="" unoptimized />
      </span>

      <input
        className={styles.input}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search a game..."
        aria-label="Search games"
        autoComplete="off"
        spellCheck={false}
      />

      {value && (
        <button
          className={styles.clearBtn}
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
        >
          ×
        </button>
      )}
    </div>
  );
}
