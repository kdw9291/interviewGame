# backend

Phase 2부터 채워지는 서버 전용 로직 모듈 자리입니다.

- Gemini Free Key Pool 라운드로빈 로테이션 로직
- Supabase `answer_cache` 조회/저장 유틸
- 비상 셔터 모드(폴백 엔진) 로직

이 프로젝트는 Next.js App Router의 API Routes(`source/frontend/src/app/api/*`)가
실제 서버 엔드포인트 역할을 합니다. 이 디렉토리의 코드는 해당 API Routes가
가져다 쓰는 순수 로직(입출력에 Next.js 의존성이 없는 모듈)만 둡니다.
