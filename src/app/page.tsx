"use client";
import { useEffect, useState } from "react";
// import KakaoMapPage from "@/components/kakaomap";
import { Position } from "@/types/kakaomap.type";
import Script from "next/script";
import dynamic from "next/dynamic";

const KakaoMapPage = dynamic(() => import("@/components/kakaomap"), {
  ssr: false,
});
const Kakao_SDK_URL = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;

export default function Home() {
  const [myPosition, setMyPosition] = useState<Position | null>(null);
  const [isKakaoScriptLoaded, setIsKakaoScriptLoaded] = useState(false);
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
  console.log("Kakao API Key:", process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY);
  const handleScriptLoad = () => {
    setIsKakaoScriptLoaded(true);
  };
  if (myPosition === null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Script
        src={Kakao_SDK_URL}
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
      {isKakaoScriptLoaded && myPosition && (
        <KakaoMapPage initialPosition={myPosition} />
      )}
    </>
  );
}
