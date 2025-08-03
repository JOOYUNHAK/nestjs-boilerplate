export interface EmailPayload {
  to: string[]; // 수신자 이메일
  subject: string; // 이메일 제목
  from?: string; // 발신자 이메일
  html: string; // HTML 형식의 이메일 본문
}
