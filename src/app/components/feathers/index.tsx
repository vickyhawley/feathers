'use client';
import React, { useEffect, useState } from "react";
import styles from './feathers.module.css';
import { Heart } from "react-feather";


type FeatherState = {
  id: number;
  name: string;
  left: number;
  rotate: number;
  landed: boolean;
};

export default function FeatherPile() {
  const [feathers, setFeathers] = useState<FeatherState[]>([]);
  const [landedFeathers, setLandedFeathers] = useState<boolean>(false)
  const [showRisingIcon, setShowRisingIcon] = useState(false);

  useEffect(() => {
    async function fetchCasualties() {
      const res = await fetch(
        "https://data.techforpalestine.org/api/v2/killed-in-gaza.json"
      );
      const data = await res.json();
      console.log('how many?', data)

      setFeathers(data.slice(0, 1000));
    }

    fetchCasualties();
  }, []);

  useEffect(() => {
    if (feathers.length > 0) {
      setTimeout(() => setShowRisingIcon(true), 1000); // slight delay
    }
  }, [feathers]);

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        background: "#111",
        width: '100vw',
      
      }}
    >
      {feathers.map(({ id, name, landed }, index) => {
       const left = Math.random() * 100;
       const rotate = Math.random() * 180;
       const delay = Math.random() * 3;
       const duration = 3 + Math.random() * 6;

       return(
        <div
          key={id}
          className={`${styles.feather} ${landed ? styles.landed : ""}`}
          style={{
            left: `${left}vw`,
            '--rotate': `${rotate}deg`,
            '--delay': `${delay}s`,
            '--duration': `${duration}s`,
          } as React.CSSProperties}
        >
          <div className={styles["featherInner"]}>
          <svg width="30" height="30" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 21C1 21 2.48948 20.3995 4.5 19.4176M21 1C21 1 20.2887 7.23168 19 11C18.5164 12.4142 16.3888 16.9236 15.5 18.5L13 18.7691L14.6962 19.1376M21 1C21 1 19.9538 3.52147 18.324 6.5M21 1L19 2.5L19.1408 2.76192L18.5 3V3.5H18V4L17.1747 4.21172C17.1747 4.21172 16.8892 4.89454 16 5.5C12.5233 7.86719 9.56723 7.27156 6 9.5C5.4029 9.873 4.5 10.5 4.5 10.5L4.3 13L3.5 11M14.6962 19.1376C14.6962 19.1376 11.6939 20.6265 9 21C6.47821 21.3496 2.5 20.5 2.5 20.5C2.5 20.5 0.164031 15.6356 1.5 13C2.09031 11.8354 3.5 11 3.5 11M14.6962 19.1376L12.5 18.6605L12 17.5M6 18.6605C8.40526 17.4049 11.1589 15.7563 13 14C14.3882 12.6758 15.7115 10.8573 16.8679 9M6 18.6605L4 16M6 18.6605C5.77657 18.7771 5.55614 18.8904 5.33973 19M3.5 11L4.5 13.5L6.5 14.5M8.5 17.5L10.5 18.6605M2.5 17.5L4 19L4.5 19.4176M5.33973 19L6.5 20M5.33973 19C5.05192 19.1458 4.77122 19.2852 4.5 19.4176M17.1747 8.5L15 7.5M17.1747 8.5C17.3769 8.16573 17.5735 7.83151 17.7638 7.5M17.1747 8.5C17.0738 8.66676 16.9715 8.83354 16.8679 9M18.324 6.5L17.1747 6M18.324 6.5C18.1442 6.82869 17.9572 7.16295 17.7638 7.5M17.7638 7.5L18.324 8M16.8679 9H18" stroke="white" stroke-width="0.5"/>
</svg>

              <span className={styles.name}>{name}</span>
          </div>
        </div>)
})}

{/* Rising icon */}
{showRisingIcon && (
        <div className={styles.risingIcon}>
          <Heart size={80} color="#ff5a5f" />
        </div>
      )}
    </div>
  );
}

