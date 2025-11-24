# 대화 내용 백업 가이드

## 백업된 내용

이 디렉토리(`conversation_backup/`)에는 Gemini Code Assist와의 전체 대화 세션이 백업되어 있습니다.

### 포함된 파일들

1. **문서 파일**
   - `task.md` - 작업 체크리스트 (여러 버전)
   - `implementation_plan.md` - 구현 계획 (여러 버전)
   - `walkthrough.md` - 검증 결과 (여러 버전)

2. **스크린샷 & 녹화**
   - `*.webp` - 브라우저 작업 녹화 파일
   - `*.png` - 스크린샷
   - 인증 검증, 자산 등록, GitHub 저장소 생성 등의 과정

3. **메타데이터**
   - `*.metadata.json` - 각 문서의 메타데이터
   - `*.resolved.*` - 문서의 버전 히스토리

## 백업 방법

### 자동 백업 (권장)

프로젝트를 GitHub에 푸시할 때 자동으로 백업됩니다:

```bash
git add .docs/conversation_backup/
git commit -m "backup: Update conversation history"
git push origin main
```

### 수동 백업

대화 세션 디렉토리를 직접 복사:

```bash
# Windows
xcopy "C:\Users\SDS\.gemini\antigravity\brain\5d97b06c-266d-42f4-86de-203848483ff9" ".docs\conversation_backup\" /E /I /Y

# 또는 탐색기에서 직접 복사
# 원본: C:\Users\SDS\.gemini\antigravity\brain\5d97b06c-266d-42f4-86de-203848483ff9
# 대상: d:\dev\catalog\.docs\conversation_backup\
```

## 대화 ID

현재 대화 세션 ID: `5d97b06c-266d-42f4-86de-203848483ff9`

이 ID를 사용하여 Gemini Code Assist에서 대화를 다시 찾을 수 있습니다.

## 복원 방법

다른 PC에서 작업을 이어가려면:

1. GitHub에서 프로젝트 클론
2. `.docs/conversation_backup/` 폴더 확인
3. 필요한 경우 문서 파일들을 참조

## 주의사항

- 대화 백업은 **용량이 클 수 있습니다** (스크린샷, 녹화 파일 포함)
- `.gitignore`에서 제외하려면: `.docs/conversation_backup/` 추가
- 민감한 정보가 포함될 수 있으니 공개 저장소에 올릴 때 주의하세요

## 파일 크기 최적화

용량이 큰 미디어 파일을 제외하고 문서만 백업하려면:

```bash
# 문서 파일만 복사
copy "C:\Users\SDS\.gemini\antigravity\brain\5d97b06c-266d-42f4-86de-203848483ff9\*.md" ".docs\conversation_backup\"
```
