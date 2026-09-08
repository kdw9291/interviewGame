/** 한글 단어 끝 음절의 받침 유무에 따라 "와/과" 중 알맞은 조사를 붙인다. */
export function withJosaWa(word: string): string {
  const lastChar = word.charCodeAt(word.length - 1);
  const isHangul = lastChar >= 0xac00 && lastChar <= 0xd7a3;
  if (!isHangul) return `${word}와`;

  const hasBatchim = (lastChar - 0xac00) % 28 !== 0;
  return `${word}${hasBatchim ? "과" : "와"}`;
}
