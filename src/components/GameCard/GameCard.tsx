"use client";

import { useState, useCallback, useRef } from "react";
import type { Game } from "@/types/game";
import { useGameStore } from "@/store/useGameStore";
import styles from "./GameCard.module.scss";
import Image from "next/image";

interface GameCardProps {
  game: Game;
}

export function GameCardSkeleton() {
  return <div className={styles.skeleton} aria-hidden="true" />;
}

export default function GameCard({ game }: GameCardProps) {
  const [loaded, setLoaded] = useState(false);
  const [popping, setPopping] = useState(false);
  const favBtnRef = useRef<HTMLButtonElement>(null);
  const { isFavorite, toggleFavorite } = useGameStore();
  const favorited = isFavorite(game.slug);

  const blurUrl = game.thumbnailBlur
    ? game.thumbnailBlur.startsWith("data:")
      ? game.thumbnailBlur
      : `data:image/jpeg;base64,${game.thumbnailBlur}`
    : undefined;

  const handleFav = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const rect = favBtnRef.current?.getBoundingClientRect();
      const cx = rect ? rect.left + rect.width / 2 : 0;
      const cy = rect ? rect.top + rect.height / 2 : 0;

      if (!favorited && rect) {
        // favoriting — heart flies FROM this card TO filter button
        setPopping(true);
        window.dispatchEvent(
          new CustomEvent("heart:fly", { detail: { fromX: cx, fromY: cy } })
        );
      }

      toggleFavorite(game);
    },
    [game, toggleFavorite, favorited]
  );

  return (
    <article
      className={styles.card}
      style={
        game.borderColor
          ? ({ background: game.borderColor, "--glow": game.borderColor } as React.CSSProperties)
          : undefined
      }
    >
      <div
        className={styles.imageWrapper}
        style={blurUrl ? { backgroundImage: `url(${blurUrl})` } : undefined}
      >
        <Image
          src={game.thumbnail}
          alt={game.name}
          fill
          sizes="(max-width: 479px) 135px, (max-width: 767px) 150px, (max-width: 1023px) 160px, 171px"
          className={`${styles.image} ${loaded ? styles.loaded : ""}`}
          onLoad={() => setLoaded(true)}
        />
      </div>

      <button
        ref={favBtnRef}
        type="button"
        className={`${styles.favBtn} ${favorited ? styles.favorited : ""} ${popping ? styles.popping : ""}`}
        onAnimationEnd={() => setPopping(false)}
        aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
        onClick={handleFav}
      >
        <Image
          src={favorited ? "/icons/heart-red.svg" : "/icons/heart.svg"}
          width={14}
          height={14}
          alt=""
          unoptimized
        />
      </button>
    </article>
  );
}
