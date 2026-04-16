'use client';

import { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import { useGameSection } from '@/hooks/useGameSection';
import GameCard, { GameCardSkeleton } from '@/components/GameCard/GameCard';
import type { GameSection } from '@/types/game';
import styles from './GameRow.module.scss';

const SKELETON_COUNT = 8;

interface GameRowProps {
  section: GameSection;
  onViewAll: (section: GameSection) => void;
}

export default function GameRow({ section, onViewAll }: GameRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useGameSection(section.id, section.params);

  const games = useMemo(
    () => data?.pages.flatMap((p) => p.data.items ?? []) ?? [],
    [data]
  );

  // Horizontal infinite scroll sentinel
  const handleSentinelIntersect = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const el = sentinelRef.current;
    const root = scrollRef.current;
    if (!el || !root) return;
    const observer = new IntersectionObserver(handleSentinelIntersect, {
      root,
      threshold: 0.1,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleSentinelIntersect]);

  // Track scroll position for arrow button states
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [updateScrollState, games]);

  const rafRef = useRef<number | null>(null);
  const scrollTargetRef = useRef<number | null>(null);

  const scroll = useCallback((dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;

    // Read actual card width from DOM so mobile/tablet sizes are correct
    const firstCard = el.querySelector('article');
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width + 8 : 179;
    const cols = Math.max(Math.floor(el.clientWidth / cardWidth), 1);

    // Accumulate onto in-flight target so rapid clicks build momentum
    const base = scrollTargetRef.current ?? el.scrollLeft;
    const newTarget = Math.max(
      0,
      Math.min(base + dir * cardWidth * cols, el.scrollWidth - el.clientWidth)
    );
    scrollTargetRef.current = newTarget;

    // Spring loop already running — it will pick up the new target automatically
    if (rafRef.current !== null) return;

    // Exponential-decay spring: each frame closes a fixed fraction of remaining
    // distance. k=7 at 60fps ≈ 11% per frame → reaches 99% in ~40 frames (~660ms)
    const k = 7;
    let prevTime = performance.now();
    let pos = el.scrollLeft;

    const animate = (now: number) => {
      // Cap dt so a tab-switch / repaint spike doesn't teleport the scroll
      const dt = Math.min((now - prevTime) / 1000, 0.05);
      prevTime = now;
      const target = scrollTargetRef.current!;
      pos += (target - pos) * (1 - Math.exp(-k * dt));
      el.scrollLeft = pos;
      if (Math.abs(target - pos) > 0.25) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        el.scrollLeft = target;
        rafRef.current = null;
        scrollTargetRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  return (
    <section id={section.id} className={styles.section}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <Image
            src={section.iconImage}
            alt=""
            aria-hidden="true"
            width={28}
            height={24}
            className={styles.iconImg}
          />
          <h2 className={styles.title}>{section.label}</h2>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.viewAllBtn}
            onClick={() => onViewAll(section)}
          >
            View All
          </button>
          {/* Figma node 1:1070 — single 50×34 frame with both chevrons */}
          <div className={styles.arrowGroup}>
            <button
              type="button"
              className={styles.arrowHalf}
              aria-label="Scroll left"
              disabled={!canScrollLeft}
              onClick={() => scroll(-1)}
            >
              <Image src="/icons/chevron-left.svg" width={6} height={11} alt="" unoptimized />
            </button>
            <button
              type="button"
              className={styles.arrowHalf}
              aria-label="Scroll right"
              disabled={!canScrollRight}
              onClick={() => scroll(1)}
            >
              <Image src="/icons/chevron-right.svg" width={6} height={11} alt="" unoptimized />
            </button>
          </div>
        </div>
      </div>

      <div className={styles.rowWrapper}>
        <div className={styles.row} ref={scrollRef}>
          {isLoading &&
            Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <GameCardSkeleton key={i} />
            ))}

          {!isLoading &&
            games.map((game) => (
              <GameCard
                key={game.slug}
                game={game}
              />
            ))}

          {isFetchingNextPage &&
            Array.from({ length: 4 }).map((_, i) => (
              <GameCardSkeleton key={`fetch-${i}`} />
            ))}

          <div ref={sentinelRef} className={styles.rowSentinel} aria-hidden="true" />
        </div>

        <div className={styles.fade} aria-hidden="true" />
      </div>

      {!isLoading && !isError && games.length === 0 && (
        <div className={styles.rowWrapper}>
          <div className={styles.emptyRow}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={styles.ghostCard}>
                <span className={styles.ghostIcon}>⏳</span>
                <span className={styles.ghostLabel}>Dropping Soon</span>
              </div>
            ))}
          </div>
          <div className={styles.fade} aria-hidden="true" />
        </div>
      )}

      {isError && (
        <div className={styles.errorState}>
          <span className={styles.errorIcon}>⚠️</span>
          <p className={styles.errorText}>Failed to load. Please try again.</p>
        </div>
      )}
    </section>
  );
}
