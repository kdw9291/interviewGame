import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-paper-dark/10 bg-wood-dark px-4 py-6 text-center">
      <p className="font-typewriter text-[11px] tracking-widest text-paper/50">
        <Link href="/about" className="hover:text-paper/80">
          게임 소개
        </Link>
        <span className="mx-3 text-paper/20">·</span>
        <Link href="/privacy" className="hover:text-paper/80">
          개인정보처리방침
        </Link>
      </p>
      <p className="mt-2 font-typewriter text-[10px] tracking-widest text-paper/30">
        억까 면접관 살아남기 · 개인이 비상업적으로 운영하는 프로젝트입니다
      </p>
    </footer>
  );
}
