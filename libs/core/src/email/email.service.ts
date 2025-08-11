import { EmailPayload } from './email.type';

export interface EmailService {
  // @TODO 실사용에서는 스팸, 수신거부 등의 이벤트가 오면 사용자 데이터에 업데이트해야한다.
  // @TODO 마케팅같은 메일에는 수신거부 링크를 무조건 넣어야한다.
  send(payload: EmailPayload): Promise<void>;
  sendBatch(payloads: EmailPayload[]): Promise<void>;
}
