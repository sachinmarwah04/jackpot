"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { NAV_TABS, VENDORS } from "@/types/game";
import styles from "./Filters.module.scss";

interface FiltersProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  activeVendor: string;
  onVendorChange: (vendor: string) => void;
}

export default function Filters({ activeTab, onTabChange, activeVendor, onVendorChange }: FiltersProps) {
  const isFavorites = activeTab === "favorites";
  const favBtnRef = useRef<HTMLButtonElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // bounce on heart:land
  useEffect(() => {
    const onLand = () => {
      const el = favBtnRef.current;
      if (!el) return;
      el.classList.remove(styles.bouncing);
      void el.offsetWidth;
      el.classList.add(styles.bouncing);
    };
    window.addEventListener("heart:land", onLand);
    return () => window.removeEventListener("heart:land", onLand);
  }, []);

  // close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const selectedLabel = VENDORS.find((v) => v.value === activeVendor)?.label ?? "All Providers";

  return (
    <div className={styles.wrapper}>
      {/* Row 1: scrollable tabs */}
      <nav className={styles.nav} aria-label="Game categories">
        {NAV_TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            className={`${styles.tab} ${activeTab === id ? styles.active : ""}`}
            onClick={() => onTabChange(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Row 2: dropdown + fav button */}
      <div className={styles.vendorRow}>
        <div
          ref={dropdownRef}
          className={`${styles.dropdown} ${dropdownOpen ? styles.dropdownOpen : ""}`}
        >
        <button
          type="button"
          className={`${styles.dropdownTrigger} ${activeVendor ? styles.dropdownActive : ""}`}
          onClick={() => setDropdownOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={dropdownOpen}
        >
          <span>{selectedLabel}</span>
          <Image
            src="/icons/chevron-down.svg"
            width={12}
            height={12}
            alt=""
            unoptimized
            className={styles.dropdownChevron}
          />
        </button>

        <ul className={styles.dropdownList} role="listbox">
          {VENDORS.map(({ value, label }) => (
            <li
              key={value}
              role="option"
              aria-selected={activeVendor === value}
              className={`${styles.dropdownItem} ${activeVendor === value ? styles.dropdownItemActive : ""}`}
              onMouseDown={() => {
                onVendorChange(value);
                setDropdownOpen(false);
              }}
            >
              {label}
              {activeVendor === value && (
                <Image src="/icons/check.svg" width={12} height={12} alt="" unoptimized />
              )}
            </li>
          ))}
        </ul>
        </div>

        <button
          ref={favBtnRef}
          type="button"
          data-fav-btn
          className={`${styles.favBtn} ${isFavorites ? styles.favActive : ""}`}
          aria-label={isFavorites ? "Showing favorites" : "Show favorites"}
          onClick={() => onTabChange(isFavorites ? "" : "favorites")}
        >
          <Image
            src={isFavorites ? "/icons/heart-red.svg" : "/icons/heart.svg"}
            width={16}
            height={16}
            alt=""
            unoptimized
          />
        </button>
      </div>
    </div>
  );
}
