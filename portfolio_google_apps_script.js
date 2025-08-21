/**
 * ===== Google Apps Script - 포트폴리오 문의 시스템 =====
 * 
 * 핵심 기능:
 * 1. HTML 폼에서 문의 받기 (이름, 이메일, 회사명, 메시지)
 * 2. 문의를 Google Sheets에 저장
 * 3. CORS 설정 및 에러 처리
 * 
 * ===== 필수 설정 (절대 지우지 마세요!) =====
 * - doPost(): POST 요청 처리 (핵심!)
 * - doOptions(): CORS preflight 처리 (핵심!)
 * - createResponse(): CORS 헤더 설정 (핵심!)
 */

/**
 * ===== 웹 앱 배포용 함수 (절대 지우지 마세요!) =====
 * 현재는 외부 웹사이트에서 직접 호출하므로 간단한 응답만 반환합니다.
 */
function doGet() {
  return ContentService.createTextOutput('Google Apps Script is running')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * ===== 핵심: POST 요청 처리 함수 (절대 수정하지 마세요!) =====
 * HTML 폼에서 전송된 문의를 받아서 Google Sheets에 저장합니다.
 */
function doPost(e) {
  // 로그 기록 시작
  Logger.log("=== 문의 수신 시작 ===");
  Logger.log("요청 시간: " + new Date().toString());
  
  try {
    // ===== 1. POST 데이터 파싱 (절대 수정하지 마세요!) =====
    const postData = e.postData.contents;
    Logger.log("받은 데이터: " + postData);
    
    const data = JSON.parse(postData);
    Logger.log("파싱된 데이터: " + JSON.stringify(data));
    
    // ===== 2. 데이터 유효성 검사 =====
    if (!data.name) {
      throw new Error("이름이 누락되었습니다.");
    }
    if (!data.email) {
      throw new Error("이메일이 누락되었습니다.");
    }
    // referrer와 paymentDate는 선택사항이므로 검사하지 않음
    
    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error("올바른 이메일 형식이 아닙니다.");
    }
    
    // ===== 3. Google Sheets에 기존 프로그램 사용 요청 저장 =====
    const result = saveToSheet(data);
    
    // ===== 4. 네이트온 팀룸 알림 전송 =====
    try {
      sendNateonNotification(data);
      Logger.log("=== 네이트온 알림 전송 성공 ===");
    } catch (notificationError) {
      Logger.log("=== 네이트온 알림 전송 실패 ===");
      Logger.log("알림 에러: " + notificationError.toString());
      // 알림 실패는 전체 프로세스를 중단하지 않음
    }
    
    // ===== 5. 성공 응답 반환 =====
    Logger.log("=== 기존 프로그램 사용 요청 저장 성공 ===");
    return createResponse({
      success: true,
      message: "기존 프로그램 사용 요청이 성공적으로 저장되었습니다.",
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    // ===== 5. 에러 처리 및 응답 =====
    Logger.log("=== 에러 발생 ===");
    Logger.log("에러 내용: " + error.toString());
    
    return createResponse({
      success: false,
      message: "기존 프로그램 사용 요청 저장 중 오류가 발생했습니다: " + error.message
    });
  }
}

/**
 * ===== 네이트온 팀룸 알림 전송 함수 =====
 * 새로운 문의가 접수되면 네이트온 팀룸으로 알림을 전송합니다.
 */
function sendNateonNotification(data) {
  try {
    // 네이트온 팀룸 웹훅 URL
    const webhookUrl = 'https://teamroom.nate.com/api/webhook/d1265c70/x2KdjVCxSjVCzS9LSQzN3Vhc';
    
    // 현재 시간 포맷팅
    const now = new Date();
    const formattedTime = Utilities.formatDate(now, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
    
         // 알림 메시지 구성
     const message = {
       "text": `🎉 **새로운 기존 프로그램 사용 요청 수신!**
       
 📅 **접수 시간**: ${formattedTime}
 👤 **이름**: ${data.name}
 📧 **이메일**: ${data.email}
 📞 **연락처**: ${data.phone || '미입력'}
 👥 **추천인명**: ${data.referrer || '미입력'}
 💻 **사용할 프로그램명**: ${data.programName || '미입력'}
 🌐 **사용할 컴퓨터 IP주소**: ${data.ipAddress || '미입력'}
 📅 **매월결제일**: ${data.paymentDate || '미입력'}
       
 🔗 **관리**: Google Sheets에서 확인하세요!`,
      "attachments": [
        {
          "color": "#D4AF37",
          "fields": [
                         {
               "title": "요청자 정보",
               "value": `이름: ${data.name}\n이메일: ${data.email}\n연락처: ${data.phone || '미입력'}\n추천인: ${data.referrer || '미입력'}`,
               "short": true
             },
            {
              "title": "결제일",
              "value": data.paymentDate || '미입력',
              "short": true
            }
          ]
        }
      ]
    };
    
    // HTTP 요청 옵션
    const options = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify(message),
      'muteHttpExceptions': true
    };
    
    // 웹훅 전송
    const response = UrlFetchApp.fetch(webhookUrl, options);
    const responseCode = response.getResponseCode();
    
    Logger.log("네이트온 알림 응답 코드: " + responseCode);
    Logger.log("네이트온 알림 응답: " + response.getContentText());
    
    if (responseCode !== 200) {
      throw new Error("네이트온 알림 전송 실패. 응답 코드: " + responseCode);
    }
    
    return true;
    
  } catch (error) {
    Logger.log("네이트온 알림 전송 에러: " + error.toString());
    throw error;
  }
}

/**
 * ===== 문의를 Google Sheets에 저장하는 함수 =====
 * 시트 이름과 컬럼 구조를 여기서 수정할 수 있습니다.
 */
function saveToSheet(data) {
  try {
    // 활성 스프레드시트 가져오기
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // ===== 시트 이름 설정 =====
    const sheetName = '기존프로그램_사용요청';
    
    // 시트 가져오기 (없으면 생성)
    let sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
      
           // ===== 헤더 설정 =====
     const headers = ['타임스탬프', '이름', '이메일', '연락처', '추천인명', '사용할 프로그램명', '사용할 컴퓨터 IP주소', '매월결제일'];
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // 헤더 스타일링
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.getRange(1, 1, 1, headers.length).setBackground('#1a365d');
      sheet.getRange(1, 1, 1, headers.length).setFontColor('white');
      
      // 컬럼 너비 자동 조정
      sheet.autoResizeColumns(1, headers.length);
    }
    
         // ===== 데이터 행 구성 =====
     const rowData = [
       new Date(),           // A열: 타임스탬프
       data.name || '',      // B열: 이름
       data.email || '',     // C열: 이메일
       data.phone || '',     // D열: 연락처
       data.referrer || '',  // E열: 추천인명
       data.programName || '', // F열: 사용할 프로그램명
       data.ipAddress || '', // G열: 사용할 컴퓨터 IP주소
       data.paymentDate || '' // H열: 매월결제일
     ];
    
    sheet.appendRow(rowData);
    
    Logger.log("기존 프로그램 사용 요청 저장 완료: " + JSON.stringify(rowData));
    return true;
    
  } catch (error) {
    Logger.log("시트 저장 에러: " + error.toString());
    throw new Error("Google Sheets 저장 실패: " + error.message);
  }
}

/**
 * ===== 핵심: JSON 응답 생성 함수 (절대 수정하지 마세요!) =====
 * CORS 헤더를 설정하여 브라우저에서 접근할 수 있게 합니다.
 */
function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*')           // ← CORS 핵심!
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')  // ← CORS 핵심!
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');       // ← CORS 핵심!
}

/**
 * ===== 핵심: OPTIONS 요청 처리 (절대 수정하지 마세요!) =====
 * CORS preflight 요청을 처리합니다.
 */
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setHeader('Access-Control-Allow-Origin', '*')           // ← CORS 핵심!
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')  // ← CORS 핵심!
    .setHeader('Access-Control-Allow-Headers', 'Content-Type')        // ← CORS 핵심!
    .setHeader('Access-Control-Max-Age', '86400');                    // ← CORS 캐시!
}

/**
 * ===== 테스트용 함수 =====
 * 수동으로 문의 저장과 네이트온 알림을 테스트할 수 있습니다.
 */
 function testSaveInquiry() {
  const testData = {
    name: "테스트 사용자",
    email: "test@example.com",
    phone: "010-1234-5678",
    referrer: "테스트 추천인",
    programName: "테스트 프로그램",
    ipAddress: "192.168.1.100",
    paymentDate: "15일",
    timestamp: new Date().toISOString()
  };
  
  try {
    // 1. Google Sheets 저장 테스트
    const result = saveToSheet(testData);
    Logger.log("Google Sheets 저장 테스트 성공: " + result);
    
    // 2. 네이트온 알림 테스트
    const notificationResult = sendNateonNotification(testData);
    Logger.log("네이트온 알림 테스트 성공: " + notificationResult);
    
    return true;
  } catch (error) {
    Logger.log("테스트 실패: " + error.toString());
    return false;
  }
}

/**
 * ===== 네이트온 알림만 테스트하는 함수 =====
 * 네이트온 알림 기능만 별도로 테스트할 수 있습니다.
 */
 function testNateonNotification() {
  const testData = {
    name: "네이트온 테스트",
    email: "nateon@test.com",
    phone: "010-9876-5432",
    referrer: "테스트 추천인",
    programName: "테스트 프로그램",
    ipAddress: "192.168.1.200",
    paymentDate: "20일",
    timestamp: new Date().toISOString()
  };
  
  try {
    const result = sendNateonNotification(testData);
    Logger.log("네이트온 알림 테스트 성공: " + result);
    return result;
  } catch (error) {
    Logger.log("네이트온 알림 테스트 실패: " + error.toString());
    return false;
  }
}

/**
 * ===== 현재 시트 상태 확인 함수 =====
 * 시트가 제대로 생성되었는지 확인할 수 있습니다.
 */
function checkSheetStatus() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = '기존프로그램_사용요청';
    const sheet = spreadsheet.getSheetByName(sheetName);
    
    if (!sheet) {
      Logger.log("'" + sheetName + "' 시트가 존재하지 않습니다.");
      return false;
    }
    
    const lastRow = sheet.getLastRow();
    Logger.log("현재 기존 프로그램 사용 요청 수: " + (lastRow - 1)); // 헤더 제외
    
         if (lastRow > 0) {
       const headers = sheet.getRange('A1:H1').getValues()[0];
       Logger.log("헤더: " + headers.join(', '));
     }
    
    return true;
  } catch (error) {
    Logger.log("시트 상태 확인 실패: " + error.toString());
    return false;
  }
}

/**
 * ===== 배포 설정 확인 함수 =====
 * 현재 배포 상태를 확인할 수 있습니다.
 */
function checkDeployment() {
  Logger.log("=== 배포 설정 확인 ===");
  Logger.log("스크립트 ID: " + ScriptApp.getScriptId());
  Logger.log("현재 사용자: " + Session.getActiveUser().getEmail());
  Logger.log("스프레드시트 ID: " + SpreadsheetApp.getActiveSpreadsheet().getId());
  Logger.log("=====================");
}

/**
 * ===== 추가 기능 예시 =====
 */

/*
// 이메일 알림 기능
function sendEmailNotification(data) {
  const recipient = "yoonwhan0@naver.com";
  const subject = "새로운 포트폴리오 문의 수신";
  const body = `
    새로운 포트폴리오 문의가 수신되었습니다.
    
    이름: ${data.name}
    이메일: ${data.email}
    회사명: ${data.company}
    메시지: ${data.message}
    시간: ${new Date().toLocaleString()}
  `;
  
  MailApp.sendEmail(recipient, subject, body);
}

// 데이터 백업 기능
function backupData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('포트폴리오_문의');
  const data = sheet.getDataRange().getValues();
  
  // 백업 시트 생성
  const backupSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('백업_' + new Date().toISOString().split('T')[0]);
  backupSheet.getRange(1, 1, data.length, data[0].length).setValues(data);
}

// 데이터 정리 기능
function cleanupOldData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('포트폴리오_문의');
  const lastRow = sheet.getLastRow();
  
  // 90일 이상 된 데이터 삭제
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 90);
  
  for (let i = lastRow; i > 1; i--) {
    const dateValue = sheet.getRange(i, 1).getValue();
    if (dateValue < cutoffDate) {
      sheet.deleteRow(i);
    }
  }
}
*/ 