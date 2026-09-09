"use client";

import { useEffect } from "react";

interface AdBannerProps {
  slot: string;
}

// 실제 AdSense 광고 단위(ad unit) ID는 숫자로만 구성된다.
// 승인 전에는 "lobby"/"resultCard" 같은 자리표시 문자열이 들어오므로,
// 그 상태에서 adsbygoogle.push()를 호출하면 존재하지 않는 슬롯이라
// "No slot size for availableWidth=0" 런타임 에러가 난다.
const VALID_SLOT_ID = /^\d+$/;

/**
 * Google AdSense 반응형 배너.
 * NEXT_PUBLIC_ADSENSE_CLIENT가 없거나(심사 전/로컬 개발) 실제 슬롯 ID를
 * 아직 발급받지 못했으면 자리표시 박스만 보여주고, 둘 다 준비되면 실제
 * 광고 슬롯을 렌더링한다 (명세서 2.3 방어막3, 5장 AdSense 연동).
 */
export default function AdBanner({ slot }: AdBannerProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const hasValidSlot = VALID_SLOT_ID.test(slot);

  useEffect(() => {
    if (!client || !hasValidSlot) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // 애드블록 등으로 실패해도 게임 플레이에는 영향이 없어야 한다.
    }
  }, [client, hasValidSlot]);

  if (!client || !hasValidSlot) {
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
