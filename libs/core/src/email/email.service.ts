import { EmailPayload } from './email.type';

export interface EmailService {
  send(payload: EmailPayload): Promise<void>;
}
