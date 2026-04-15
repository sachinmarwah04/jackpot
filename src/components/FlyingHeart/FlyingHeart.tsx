"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

interface Particle {
  id: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

let nextId = 0;

export default function FlyingHeartLayer() {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setMounted(true);

    const onFly = (e: Event) => {
      const { fromX, fromY } = (e as CustomEvent<{ fromX: number; fromY: number }>).detail;
      const target = document.querySelector("[data-fav-btn]")?.getBoundingClientRect();
      if (!target) return;

      setParticles((prev) => [
        ...prev,
        {
          id: nextId++,
          fromX,
          fromY,
          toX: target.left + target.width / 2,
          toY: target.top + target.height / 2,
        },
      ]);
    };

    window.addEventListener("heart:fly", onFly);
    return () => window.removeEventListener("heart:fly", onFly);
  }, []);

  const remove = (id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
    window.dispatchEvent(new CustomEvent("heart:land"));
  };

  if (!mounted) return null;

  return createPortal(
    <>
      {particles.map((p) => (
        /* Outer div: moves only on X axis at constant speed */
        <div
          key={p.id}
          style={
            {
              position: "fixed",
              left: p.fromX,
              top: p.fromY,
              "--dx": `${p.toX - p.fromX}px`,
              "--dy": `${p.toY - p.fromY}px`,
              pointerEvents: "none",
              zIndex: 9999,
              animation: "heartFlyX 0.72s linear forwards",
            } as React.CSSProperties
          }
          onAnimationEnd={() => remove(p.id)}
        >
          {/* Inner div: moves on Y axis with arc + scale + fade */}
          <div
            style={{
              transform: "translate(-50%, -50%)",
              animation: "heartFlyY 0.72s ease-in forwards",
            }}
          >
            <Image src="/icons/heart-red.svg" width={18} height={18} alt="" unoptimized />
          </div>
        </div>
      ))}
    </>,
    document.body
  );
}
