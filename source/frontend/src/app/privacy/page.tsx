import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 · 억까 면접관 살아남기",
  description: "억까 면접관 살아남기가 수집하는 정보와 처리 방침을 안내합니다.",
};

const EFFECTIVE_DATE = "2026년 9월 18일";

export default function PrivacyPage() {
  return (
    <div className="flex flex-1 flex-col items-center bg-wood-dark px-4 py-10 sm:py-16">
      <div className="w-full max-w-3xl">
        <header className="mb-8 text-center">
          <p className="font-typewriter text-xs tracking-[0.3em] text-gold-bright/80">
            PRIVACY POLICY
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-paper drop-shadow-[0_2px_0_rgba(0,0,0,0.5)] sm:text-4xl">
            개인정보처리방침
          </h1>
        </header>

        <div className="paper-texture space-y-6 rounded-sm border border-paper-dark/60 px-6 py-6 text-sm leading-relaxed text-wood shadow-lg sm:px-8 sm:py-8">
          <p>
            &lsquo;억까 면접관 살아남기&rsquo;(이하 &lsquo;이 서비스&rsquo;)는 개인이
            비상업적으로 운영하는 웹 게임입니다. 회원가입이나 로그인 절차가 없으며,
            이름·이메일·연락처 등 신원을 확인할 수 있는 정보를 수집하지 않습니다.
            이 방침은 이 서비스가 예외적으로 수집·이용하는 최소한의 정보에 대해
            안내합니다.
          </p>

          <section>
            <h2 className="mb-2 font-typewriter text-sm tracking-widest text-stamp-red">
              1. 수집하는 정보
            </h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <b>닉네임</b> — &lsquo;명예의 전당(오늘의 레전드 불합격)&rsquo;에 결과를
                공개로 게시할 때 이용자가 직접 입력하는 선택 항목입니다. 입력하지
                않으면 &lsquo;익명의 취준생&rsquo;으로 저장됩니다.
              </li>
              <li>
                <b>면접 답변 및 AI 채점 결과</b> — 명예의 전당에 박제하기를 선택한
                경우에만, 제출한 질문·답변·점수·AI 리액션이 함께 공개 게시됩니다.
              </li>
              <li>
                <b>IP 주소의 단방향 해시값</b> — 원본 IP 주소는 저장하지 않고,
                복원이 불가능한 SHA-256 해시로 변환한 값만 어뷰징(동일 인물의
                반복 게시) 방지 목적으로 보관합니다.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-typewriter text-sm tracking-widest text-stamp-red">
              2. 정보의 이용 목적과 보관
            </h2>
            <p>
              위 정보는 &lsquo;명예의 전당&rsquo; 콘텐츠를 게시하고 서비스 남용을
              방지하는 목적으로만 이용됩니다. 데이터는 Supabase(클라우드 데이터베이스
              서비스)에 저장되며, 본인이 게시한 내용의 삭제를 원하는 경우 아래
              문의처로 요청하면 확인 후 삭제합니다.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-typewriter text-sm tracking-widest text-stamp-red">
              3. 쿠키와 광고
            </h2>
            <p>
              이 서비스는 Google AdSense를 통해 광고를 게재할 수 있으며, Google 등
              제3자 광고 사업자가 쿠키를 사용해 이용자의 관심사에 기반한 광고를
              보여줄 수 있습니다. 맞춤 광고를 원하지 않는 경우{" "}
              <a
                href="https://adssettings.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-stamp-red underline"
              >
                Google 광고 설정
              </a>
              에서 개인 맞춤 광고를 비활성화할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-typewriter text-sm tracking-widest text-stamp-red">
              4. 문의처
            </h2>
            <p>
              이 서비스는 개인이 비상업적으로 운영하는 프로젝트입니다. 개인정보
              처리에 관한 문의나 게시물 삭제 요청은{" "}
              <a
                href="https://github.com/kdw9291/interviewGame/issues"
                target="_blank"
                rel="noreferrer"
                className="text-stamp-red underline"
              >
                GitHub 저장소 이슈
              </a>
              로 남겨주시면 확인하겠습니다.
            </p>
          </section>

          <p className="text-right font-typewriter text-xs text-wood/50">
            시행일자: {EFFECTIVE_DATE}
          </p>
        </div>
      </div>
    </div>
  );
}
