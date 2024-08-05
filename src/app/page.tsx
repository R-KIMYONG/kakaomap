"use client";
import { useEffect, useState } from "react";
import KakaoMapPage from "@/components/kakaomap";
import { Position } from "@/types/kakaomap.type";

export default function Home() {
  const [myPosition, setMyPosition] = useState<Position | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          setMyPosition({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("getCurrentPosition error: ", error);
        }
      );
    } else {
      console.error("예상치못한 에러 발생했습니다.");
    }
  }, []);

  if (myPosition === null) {
    return <div>Loading...</div>;
  }

  return <KakaoMapPage initialPosition={myPosition} />;
}
