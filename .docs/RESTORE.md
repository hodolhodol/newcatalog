# 다른 PC에서 프로젝트 복원 가이드

## 🎯 한 줄 프롬프트로 복원하기

Gemini Code Assist에서 다음 프롬프트를 사용하세요:

```
다른 PC에서 antigravity를 이용해서 작업한 것을 github의 hodolhodol/newcatalog에 보관했어. 이 PC에 복원해줘.
```

그러면 AI가 이 가이드를 참고하여 자동으로 복원을 도와줄 것입니다.

---

## 📋 수동 복원 단계별 가이드

### 1단계: 저장소 클론

```bash
# 원하는 위치로 이동 (예: d:/dev/)
cd d:/dev/

# GitHub에서 클론
git clone https://github.com/hodolhodol/newcatalog.git
cd newcatalog
```

### 2단계: 의존성 설치

```bash
npm install
```

### 3단계: 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 추가:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

**NEXTAUTH_SECRET 생성**:
```bash
# PowerShell에서
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# 또는 온라인 생성기 사용
# https://generate-secret.vercel.app/32
```

### 4단계: 데이터베이스 초기화

```bash
# Prisma 클라이언트 생성
npx prisma generate

# 데이터베이스 스키마 적용
npx prisma db push
```

### 5단계: 테스트 데이터 추가 (선택사항)

```bash
npx tsx scripts/seed.ts
```

생성되는 테스트 계정:
- **Admin**: admin@company.com
- **Owner**: owner@company.com
- **Employee**: employee@company.com

### 6단계: 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 접속

---

## 📚 대화 히스토리 복원

### 대화 백업 위치

프로젝트를 클론하면 다음 위치에 대화 내용이 백업되어 있습니다:

```
newcatalog/.docs/conversation_backup/
├── task.md                    # 작업 체크리스트 (최종 버전)
├── implementation_plan.md     # 구현 계획 (최종 버전)
├── walkthrough.md            # 검증 결과 (최종 버전)
├── task.md.resolved.*        # 작업 체크리스트 버전 히스토리
├── implementation_plan.md.resolved.*  # 구현 계획 버전 히스토리
├── walkthrough.md.resolved.* # 검증 결과 버전 히스토리
└── *.webp, *.png            # 스크린샷 및 작업 녹화
```

### 대화 세션 ID

원본 대화 세션 ID: `5d97b06c-266d-42f4-86de-203848483ff9`

### 문서 확인

```bash
# 현재 작업 상태 확인
cat .docs/task.md

# 구현 계획 확인
cat .docs/implementation_plan.md

# 검증 결과 확인
cat .docs/walkthrough.md

# 설정 가이드 확인
cat .docs/SETUP.md

# 대화 백업 가이드 확인
cat .docs/conversation_backup/README.md
```

---

## 🤖 AI 어시스턴트와 작업 이어가기

### Gemini Code Assist에서 컨텍스트 제공

새 PC에서 Gemini Code Assist를 열고 다음과 같이 프롬프트를 작성하세요:

```
이 프로젝트는 In-House Software Catalog System이야.
다음 문서들을 참고해서 작업을 이어가고 싶어:

1. .docs/task.md - 현재 작업 진행 상황
2. .docs/implementation_plan.md - 전체 구현 계획
3. .docs/walkthrough.md - 지금까지의 검증 결과

Phase 1과 Phase 2는 완료되었고, 현재는 Phase 3 (Analytics & Dashboard) 작업을 시작하려고 해.
```

### 이전 대화 참조하기

```
.docs/conversation_backup/ 폴더에 이전 PC에서의 작업 히스토리가 있어.
특히 다음 파일들을 참고해줘:
- implementation_plan.md.resolved.* (구현 계획 변경 히스토리)
- task.md.resolved.* (작업 진행 히스토리)
```

---

## 🔍 복원 확인 체크리스트

### ✅ 환경 설정 확인

```bash
# Node.js 버전 확인 (18+ 필요)
node --version

# npm 버전 확인
npm --version

# 의존성 설치 확인
npm list --depth=0

# Prisma 클라이언트 확인
npx prisma --version
```

### ✅ 데이터베이스 확인

```bash
# 데이터베이스 파일 존재 확인
ls dev.db

# Prisma Studio로 데이터 확인
npx prisma studio
```

### ✅ 빌드 확인

```bash
# 프로덕션 빌드 테스트
npm run build
```

### ✅ 개발 서버 확인

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 확인
# http://localhost:3000
```

---

## 🚨 문제 해결

### 문제 1: npm install 실패

```bash
# 캐시 클리어 후 재시도
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 문제 2: Prisma 에러

```bash
# Prisma 클라이언트 재생성
npx prisma generate

# 데이터베이스 재설정
rm dev.db
npx prisma db push
npx tsx scripts/seed.ts
```

### 문제 3: 빌드 에러

```bash
# TypeScript 에러 확인
npx tsc --noEmit

# ESLint 확인
npm run lint
```

### 문제 4: 포트 충돌

```bash
# 다른 포트로 실행
PORT=3001 npm run dev
```

---

## 📝 작업 이어가기 팁

### 1. 현재 상태 파악

```bash
# Git 상태 확인
git status

# 최근 커밋 확인
git log --oneline -10

# 브랜치 확인
git branch -a
```

### 2. 새 작업 시작 전

```bash
# 최신 코드 받기
git pull origin main

# 새 브랜치 생성 (선택사항)
git checkout -b feature/new-feature
```

### 3. 작업 후 커밋

```bash
# 변경사항 확인
git status
git diff

# 스테이징
git add .

# 커밋
git commit -m "feat: 새로운 기능 추가"

# 푸시
git push origin main
```

### 4. 대화 백업 업데이트

작업 중 중요한 대화가 있었다면:

```bash
# 대화 디렉토리 백업 (대화 ID는 변경될 수 있음)
xcopy "C:\Users\[USERNAME]\.gemini\antigravity\brain\[CONVERSATION_ID]" ".docs\conversation_backup\" /E /I /Y

# Git에 커밋
git add .docs/conversation_backup/
git commit -m "backup: Update conversation history"
git push origin main
```

---

## 🎓 추가 리소스

### 프로젝트 문서

- **README.md**: 프로젝트 개요 및 시작 가이드
- **.docs/task.md**: 작업 체크리스트
- **.docs/implementation_plan.md**: 상세 구현 계획
- **.docs/walkthrough.md**: 검증 및 테스트 결과
- **.docs/SETUP.md**: 이 파일
- **.docs/conversation_backup/README.md**: 대화 백업 가이드

### 기술 스택 문서

- [Next.js 16 문서](https://nextjs.org/docs)
- [Prisma 문서](https://www.prisma.io/docs)
- [NextAuth.js 문서](https://next-auth.js.org)
- [Tailwind CSS v4 문서](https://tailwindcss.com/docs)
- [Shadcn/UI 문서](https://ui.shadcn.com)

---

## 📞 도움이 필요하면

Gemini Code Assist에서:

```
.docs/SETUP.md 파일을 참고해서 프로젝트 복원을 도와줘.
[구체적인 문제 설명]
```

---

**마지막 업데이트**: 2025-11-24
**프로젝트 버전**: Phase 1 & 2 완료
**저장소**: https://github.com/hodolhodol/newcatalog
