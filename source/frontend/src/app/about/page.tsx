import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "게임 소개 · 억까 면접관 살아남기",
  description:
    "억까 면접관 살아남기가 어떤 게임인지, 어떻게 플레이하는지, 왜 만들었는지 소개합니다.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col items-center bg-wood-dark px-4 py-10 sm:py-16">
      <div className="w-full max-w-3xl">
        <header className="mb-8 text-center">
          <p className="font-typewriter text-xs tracking-[0.3em] text-gold-bright/80">
            ABOUT · 이 게임에 대하여
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-paper drop-shadow-[0_2px_0_rgba(0,0,0,0.5)] sm:text-4xl">
            억까 면접관 살아남기
          </h1>
        </header>

        <div className="paper-texture space-y-6 rounded-sm border border-paper-dark/60 px-6 py-6 text-sm leading-relaxed text-wood shadow-lg sm:px-8 sm:py-8">
          <section>
            <h2 className="mb-2 font-typewriter text-sm tracking-widest text-stamp-red">
              어떤 게임인가요
            </h2>
            <p>
              &lsquo;억까 면접관 살아남기&rsquo;는 상식과 모범답안이 통하지 않는 면접장에서
              오직 뻔뻔함, 궤변, 과장된 아부, 버즈워드로 살아남아야 하는 역발상 B급
              블랙코미디 게임입니다. 실제 면접 코칭이나 훈련이 아니라, 취업준비생과
              직장인이 일상에서 느끼는 면접·조직 문화의 부조리함을 유쾌하게 풀어내기
              위해 만들었습니다.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-typewriter text-sm tracking-widest text-stamp-red">
              어떻게 즐기나요
            </h2>
            <p>
              먼저 대기실에서 면접관 한 명을 선택합니다. 이후 3~5턴에 걸쳐 각자의
              황당한 질문에 120자 이내로 답변을 제출하면, AI가 그 답변을 즉석에서
              0~100점으로 채점합니다. 40점 미만을 받으면 그 자리에서 바로
              불합격이고, 전 턴을 통과하면서 평균 70점 이상을 기록해야 최종
              합격증을 받을 수 있습니다. 합격증과 불합격 사유서는 모두 이미지로
              저장해 공유할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-typewriter text-sm tracking-widest text-stamp-red">
              면접관은 누구인가요
            </h2>
            <p>
              대기업 꼰대 임원 &lsquo;김부장&rsquo;은 상식적인 답변을 무례로 여기고
              뻔뻔한 아부와 궤변을 사랑합니다. 열정페이 스타트업 대표
              &lsquo;박대표&rsquo;는 허세 가득한 버즈워드와 근거 없는 확신에
              감동합니다. 4차원 저승사자 인사과장 &lsquo;염과장&rsquo;은 상식으로는
              절대 풀리지 않는 초자연적인 질문만 던집니다. 세 면접관 모두 정답이
              아니라 순발력과 캐릭터에 맞는 뻔뻔함을 원합니다.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-typewriter text-sm tracking-widest text-stamp-red">
              오늘의 레전드 불합격
            </h2>
            <p>
              탈락한 답변 중 마음에 드는 것은 닉네임을 붙여 &lsquo;명예의 전당&rsquo;에
              박제할 수 있습니다. 대기실의 &lsquo;오늘의 레전드 불합격&rsquo; 탭에서
              다른 플레이어들이 어떤 답변으로 떨어졌는지 구경할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-typewriter text-sm tracking-widest text-stamp-red">
              어떻게 만들었나요
            </h2>
            <p>
              개인이 취미로 만든 비상업 프로젝트입니다. 채점은 Gemini API가
              면접관별 페르소나 프롬프트를 기준으로 실시간으로 수행하며, AI 응답이
              지연되거나 실패하는 경우에도 게임이 끊기지 않도록 캐시와 룰 기반
              폴백 장치를 함께 두었습니다.
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-typewriter text-sm tracking-widest text-stamp-red">
              자주 묻는 질문
            </h2>
            <div className="space-y-3">
              <p>
                <b>Q. 정답을 말했는데 왜 떨어지나요?</b>
                <br />
                이 게임에서는 상식적이고 모범적인 답변이 오히려 감점 요인입니다.
                면접관의 성격에 맞는 뻔뻔함과 순발력을 보여줄수록 높은 점수를
                받습니다.
              </p>
              <p>
                <b>Q. 매번 같은 질문이 나오나요?</b>
                <br />
                면접관마다 30개의 질문 풀이 있고, 그중 3~5개가 매 판마다 무작위로
                뽑힙니다.
              </p>
              <p>
                <b>Q. 개인정보는 어떻게 처리되나요?</b>
                <br />
                자세한 내용은{" "}
                <Link href="/privacy" className="text-stamp-red underline">
                  개인정보처리방침
                </Link>
                을 참고해주세요.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
