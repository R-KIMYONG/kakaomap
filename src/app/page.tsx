"use client";
import { useEffect, useState } from "react";
// import KakaoMapPage from "@/components/kakaomap";
import { Position } from "@/types/kakaomap.type";
import Script from "next/script";
import dynamic from "next/dynamic";

const KakaoMapPage = dynamic(() => import("@/components/kakaomap"), {
  ssr: false,
});
const Kakao_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`;
const DynamicScript = dynamic(() => import("next/script"), { ssr: false });
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
  if (myPosition === null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <DynamicScript
        strategy="beforeInteractive"
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&autoload=false`}
        onLoad={() => setIsKakaoScriptLoaded(true)}
      />
      {isKakaoScriptLoaded && myPosition && (
        <KakaoMapPage initialPosition={myPosition} />
      )}
    </>
  );
}
