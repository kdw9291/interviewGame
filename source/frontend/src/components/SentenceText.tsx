interface SentenceTextProps {
  text: string;
  className?: string;
}

/**
 * 마침표(.!?) 뒤에서 문장 단위로 줄을 나누고, 단어 중간이 잘리지 않도록
 * break-keep을 적용해 가독성을 높인다. 긴 안내문·질문·설명 문구에 쓴다.
 */
export default function SentenceText({ text, className }: SentenceTextProps) {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);

  return (
    <span className={`break-keep ${className ?? ""}`}>
      {sentences.map((sentence, i) => (
        <span key={i} className="block">
          {sentence}
        </span>
      ))}
    </span>
  );
}
