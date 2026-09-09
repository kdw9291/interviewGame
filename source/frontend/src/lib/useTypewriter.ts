import { useEffect, useState } from "react";

/**
 * 텍스트를 한 글자씩 순차 노출한다. 면접관 리액션 문구에 타이핑 효과를 준다.
 * text가 바뀌면 처음부터 다시 시작한다. onChar는 글자가 추가될 때마다
 * 호출되어(타이핑 효과음 재생 등) 쓸 수 있다.
 *
 * 초기 글자 표시까지 setInterval 콜백 안에서 처리해 effect 본문에서
 * setState를 동기 호출하지 않는다(react-hooks/set-state-in-effect 회피).
 */
export function useTypewriter(
  text: string,
  speedMs = 22,
  onChar?: () => void
): string {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!text) return;

    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      onChar?.();
      if (i >= text.length) clearInterval(interval);
    }, speedMs);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speedMs]);

  return text ? displayed : "";
}
