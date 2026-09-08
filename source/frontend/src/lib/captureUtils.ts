const COLOR_PROPS = [
  "color",
  "backgroundColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "outlineColor",
  "textDecorationColor",
] as const;

// oklab()/oklch()/color-mix() 등 최신 CSS 색상 함수를 감지한다 (한 단계 중첩 괄호까지 허용).
const FUNCTIONAL_COLOR_RE = /(oklab|oklch|lab|lch|color-mix)\(((?:[^()]|\([^()]*\))*)\)/g;

let sharedCtx: CanvasRenderingContext2D | null = null;

/**
 * getComputedStyle이 돌려주는 색상 문자열은 브라우저에 따라 rgb()가 아니라
 * oklab()/color-mix() 그대로일 수 있다. html2canvas(-pro)는 아직 이런 최신
 * 색상 함수를 완전히 지원하지 않으므로, 1x1 캔버스에 실제로 칠해 픽셀값을
 * 읽어내는 방식으로 rgba()로 확정 짓는다.
 */
function toRgba(value: string): string {
  if (!sharedCtx) {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    sharedCtx = canvas.getContext("2d");
  }
  if (!sharedCtx) return value;

  sharedCtx.clearRect(0, 0, 1, 1);
  sharedCtx.fillStyle = value;
  sharedCtx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = sharedCtx.getImageData(0, 0, 1, 1).data;
  return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`;
}

function normalizeIfFunctionalColor(value: string): string {
  if (!FUNCTIONAL_COLOR_RE.test(value)) return value;
  FUNCTIONAL_COLOR_RE.lastIndex = 0;
  return value.replace(FUNCTIONAL_COLOR_RE, (match) => toRgba(match));
}

/**
 * Tailwind v4의 알파 투명도 유틸(`/NN`)은 oklab()/color-mix()로 계산되는데,
 * html2canvas(-pro)는 아직 이를 지원하지 않아 캡처가 실패한다.
 * 클론 노드에 정규화된 rgba 값을 인라인으로 굳혀서 우회한다.
 */
export function inlineComputedColors(original: Element, clone: Element): void {
  if (original instanceof HTMLElement && clone instanceof HTMLElement) {
    const computed = getComputedStyle(original);
    for (const prop of COLOR_PROPS) {
      clone.style[prop] = normalizeIfFunctionalColor(computed[prop]);
    }
    if (computed.backgroundImage !== "none") {
      clone.style.backgroundImage = normalizeIfFunctionalColor(computed.backgroundImage);
    }
  }

  for (let i = 0; i < original.children.length; i++) {
    const originalChild = original.children[i];
    const cloneChild = clone.children[i];
    if (originalChild && cloneChild) {
      inlineComputedColors(originalChild, cloneChild);
    }
  }
}
