"use client";

import { useEffect } from "react";

interface AdBannerProps {
  slot: string;
}

/**
 * Google AdSense 반응형 배너.
 * NEXT_PUBLIC_ADSENSE_CLIENT가 없으면(심사 전/로컬 개발) 자리표시 박스만 보여주고,
 * 있으면 실제 광고 슬롯을 렌더링한다 (명세서 2.3 방어막3, 5장 AdSense 연동).
 */
export default function AdBanner({ slot }: AdBannerProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!client) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // 애드블록 등으로 실패해도 게임 플레이에는 영향이 없어야 한다.
    }
  }, [client]);

  if (!client) {
    return (
      <div className="flex h-24 w-full max-w-xl items-center justify-center rounded-sm border border-dashed border-paper-dark/30 font-typewriter text-[11px] tracking-widest text-paper/30">
        AD BANNER (AdSense 승인 후 표시)
      </div>
    );
  }

  return (
    <ins
      className="adsbygoogle block w-full max-w-xl"
      style={{ display: "block" }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
