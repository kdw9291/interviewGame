import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // source/backend가 이 프로젝트(source/frontend) 바깥에 있으므로
  // 모노레포 루트(source/)를 파일 추적 루트로 지정해 Vercel 배포 시
  // backend 소스가 서버리스 함수 번들에서 누락되지 않게 한다.
  outputFileTracingRoot: path.join(__dirname, ".."),
};

export default nextConfig;
