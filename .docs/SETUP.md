# 다른 PC에서 작업 이어서 하기

## 1. 저장소 클론

```bash
git clone https://github.com/hodolhodol/newcatalog.git
cd newcatalog
```

## 2. 의존성 설치

```bash
npm install
```

## 3. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 추가:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-here-generate-new-one"
NEXTAUTH_URL="http://localhost:3000"
```

**중요**: `NEXTAUTH_SECRET`은 새로 생성하세요:
```bash
openssl rand -base64 32
```

## 4. 데이터베이스 초기화

```bash
npx prisma generate
npx prisma db push
```

## 5. 데이터베이스 시드 (선택사항)

테스트 데이터를 추가하려면:

```bash
npx tsx scripts/seed.ts
```

이렇게 하면 다음 사용자가 생성됩니다:
- **Admin**: admin@company.com
- **Owner**: owner@company.com  
- **Employee**: employee@company.com

## 6. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 으로 접속

## 7. 프로젝트 문서 확인

작업 진행 상황과 계획은 다음 파일들을 참고하세요:

- **`.docs/task.md`**: 현재 작업 진행 상황 체크리스트
- **`.docs/implementation_plan.md`**: 전체 구현 계획 및 기술 스펙
- **`.docs/walkthrough.md`**: 검증 및 테스트 결과

## 8. 작업 후 커밋 & 푸시

작업을 마친 후:

```bash
git add .
git commit -m "작업 내용 설명"
git push origin main
```

## 주의사항

- `.env` 파일은 Git에 커밋되지 않으므로 각 PC에서 새로 생성해야 합니다
- `dev.db` (SQLite 데이터베이스)도 Git에 포함되지 않으므로 각 PC에서 새로 생성됩니다
- `public/uploads/` 폴더의 업로드된 파일들도 Git에 포함되지 않습니다

## 현재 완료된 기능

### Phase 1: 핵심 기능 (✅ 완료)
- 인증 및 사용자 관리
- 자산 등록 및 수정
- 파일 업로드
- 관리자 승인 워크플로우
- 카탈로그 검색 및 탐색
- 사용 요청 플로우
- 리뷰 및 평점

### Phase 2: UI/UX 폴리싱 (✅ 완료)
- ServiceNow 스타일 디자인
- 반응형 레이아웃
- 글래스모피즘 효과
- 개선된 카드 디자인

### Phase 3-4: 예정
- 분석 대시보드
- AI 기반 QnA
- 추천 엔진
- 알림 시스템
