'use client';
import React, { useEffect, useState } from "react";
import { Feather } from "react-feather";
import styles from './feathers.module.css';

type Casualty = {
  name: string;
  id: number;
};

type FeatherState = {
  id: number;
  name: string;
  left: number;
  rotate: number;
  landed: boolean;
};

export default function FeatherPile() {
  const [feathers, setFeathers] = useState<FeatherState[]>([]);

  useEffect(() => {
    async function fetchCasualties() {
      const res = await fetch(
        "https://data.techforpalestine.org/api/v2/killed-in-gaza/page-1.json"
      );
      const data = await res.json();

      // Create feathers with random positions
      const randomizedFeathers = data.slice(0, 50).map((person: any, idx: number) => ({
        id: person.id ?? idx,
        name: person.name,
        left: Math.random() * 90, // vw
        rotate: Math.random() * 90 - 40, // -30 to 30
        landed: false,
      }));
      console.log('what are the random values?', randomizedFeathers)

      setFeathers(randomizedFeathers);
    }

    fetchCasualties();
  }, []);

  useEffect(() => {
    // Trigger landing after fall animation ends
    const timers = feathers.map((feather, idx) =>
      setTimeout(() => {
        setFeathers((prev) =>
          prev.map((f) =>
            f.id === feather.id ? { ...f, landed: true } : f
          )
        );
      }, 4000 + idx * 200) // staggered delays
    );

    return () => timers.forEach(clearTimeout);
  }, [feathers.length]);

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        background: "#111",
      }}
    >
      {feathers.map(({ id, name, left, rotate, landed }, index) => (
        <div
          key={id}
          className={`${styles.feather} ${landed ? styles.landed : ""}`}
          style={{
            left: `${left}vw`,
            transform: `rotate(${rotate}deg)`,
            animationDelay: `${Math.random() * 2000}ms`,
            // bottom: landed ? `${index * 2}px` : undefined,
      zIndex: landed ? index : undefined,
      '--rotate': `${rotate}deg` as React.CSSProperties['rotate'],
          } as React.CSSProperties}
        >
          <div className={styles["feather-wrapper"]}>
            <Feather size={80} color="#fff" />
            <span className={styles["feather-name"]}>{name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

