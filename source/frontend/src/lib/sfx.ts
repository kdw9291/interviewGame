"use client";

/**
 * Web Audio API로 합성한 효과음.
 * 지금은 실제 음원 파일 없이 오실레이터로 소리를 만든다.
 * 나중에 실제 음원(mp3 등)을 받으면 각 재생 함수 내부만
 * `new Audio("/sfx/xxx.mp3").play()`로 바꾸면 되고, 호출부는 그대로 둔다.
 */

let audioContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return null;
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }
  return audioContext;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType,
  delay = 0,
  peakGain = 0.15
) {
  const ctx = getContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  const startTime = ctx.currentTime + delay;
  gainNode.gain.setValueAtTime(peakGain, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

/** 질문/리액션 타이핑 중 한 글자당 나는 짧은 클릭음. */
export function playTypeClick() {
  playTone(1400, 0.02, "square", 0, 0.02);
}

/** 채점 대기(생각 중) 동안의 시계 초침 소리. */
export function playThinkingTick() {
  playTone(900, 0.03, "square", 0, 0.04);
}

/** 통과/합격 — 도장이 쾅 찍히는 듯한 낮은 임팩트음. */
export function playPassStamp() {
  playTone(140, 0.28, "sine", 0, 0.22);
  playTone(90, 0.32, "sine", 0.03, 0.16);
}

/** 즉시 탈락 — 두 음이 번갈아 울리는 경고음. */
export function playFailBuzzer() {
  playTone(320, 0.16, "sawtooth", 0, 0.15);
  playTone(220, 0.22, "sawtooth", 0.16, 0.15);
}
