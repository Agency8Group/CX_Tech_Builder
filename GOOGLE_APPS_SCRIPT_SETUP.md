# 🚀 Google Apps Script 설정 가이드

포트폴리오 웹사이트의 문의 폼을 실제로 작동시키기 위한 Google Apps Script 설정 방법입니다.

## 📋 설정 단계

### 1단계: Google Apps Script 프로젝트 생성

1. **Google Apps Script 접속**

    - https://script.google.com 접속
    - Google 계정으로 로그인

2. **새 프로젝트 생성**
    - "새 프로젝트" 클릭
    - 프로젝트 이름: "포트폴리오 문의 시스템"

### 2단계: 코드 복사

1. **기본 코드 삭제**

    - `Code.gs` 파일의 모든 내용 삭제

2. **포트폴리오용 코드 붙여넣기**
    - `portfolio_google_apps_script.js` 파일의 내용을 복사
    - `Code.gs`에 붙여넣기

### 3단계: Google Sheets 연결

1. **새 Google Sheets 생성**

    - https://sheets.google.com 접속
    - 새 스프레드시트 생성
    - 스프레드시트 이름: "포트폴리오 문의 관리"

2. **Apps Script와 연결**
    - Apps Script로 돌아가기
    - `checkDeployment()` 함수 실행하여 연결 확인

### 4단계: 웹 앱 배포

1. **배포 설정**

    - "배포" → "새 배포" 클릭
    - 유형: "웹 앱"
    - 설명: "포트폴리오 문의 시스템 v1"

2. **권한 설정**

    - "액세스 권한": "모든 사용자"
    - "실행자": "나"

3. **배포 실행**
    - "배포" 버튼 클릭
    - 권한 승인

### 5단계: URL 복사

1. **웹 앱 URL 확인**

    - 배포 후 생성된 URL 복사
    - 예: `https://script.google.com/macros/s/AKfycbz.../exec`

2. **포트폴리오에 적용**
    - `script.js` 파일에서 `SCRIPT_URL` 수정:
    ```javascript
    const SCRIPT_URL = "여기에_복사한_URL_붙여넣기";
    ```

## 🧪 테스트 방법

### 1. Apps Script에서 테스트

```javascript
// Apps Script 편집기에서 실행
testSaveInquiry();
checkSheetStatus();
```

### 2. 포트폴리오에서 테스트

1. 브라우저에서 `http://localhost:8000` 접속
2. 문의 폼 작성 및 제출
3. Google Sheets에서 데이터 확인

## 📊 데이터 구조

### Google Sheets 컬럼

| A열        | B열  | C열    | D열    | E열    |
| ---------- | ---- | ------ | ------ | ------ |
| 타임스탬프 | 이름 | 이메일 | 회사명 | 메시지 |

### 예시 데이터

```
2024-01-15 14:30:00 | 홍길동 | hong@company.com | ABC회사 | 프로젝트 문의드립니다.
```

## 🔧 문제 해결

### 1. CORS 오류

-   `doOptions()` 함수가 제대로 설정되었는지 확인
-   배포 URL이 올바른지 확인

### 2. 데이터 저장 안됨

-   Google Sheets 권한 확인
-   `checkSheetStatus()` 함수로 시트 상태 확인

### 3. 폼 제출 안됨

-   브라우저 개발 도구에서 네트워크 탭 확인
-   콘솔에서 오류 메시지 확인

## 📝 추가 기능 (선택사항)

### 이메일 알림 설정

```javascript
// portfolio_google_apps_script.js에서 주석 해제
function sendEmailNotification(data) {
    const recipient = "yoonwhan0@naver.com";
    // ... 이메일 알림 코드
}
```

### 자동 백업 설정

```javascript
// 매일 자동 백업
function createDailyTrigger() {
    ScriptApp.newTrigger("backupData").timeBased().everyDays(1).create();
}
```

## 🎯 완료 확인

✅ **모든 설정이 완료되면:**

-   포트폴리오에서 문의 폼 제출
-   Google Sheets에 데이터 자동 저장
-   실시간 알림 메시지 표시
-   폼 자동 초기화

## 📞 지원

문제가 발생하면 다음을 확인해주세요:

1. Google Apps Script 로그 확인
2. 브라우저 개발 도구 콘솔 확인
3. Google Sheets 권한 설정 확인

---

**🚀 이제 포트폴리오의 문의 폼이 실제로 작동합니다!**
