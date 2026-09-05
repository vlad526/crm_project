import { EmailTypeEnum } from '../database/entities/enums/email-type.enum';

export type EmailTypeToPayload = {
  [EmailTypeEnum.VERIFY_EMAIL]: { name: string; verifyLink: string };
  [EmailTypeEnum.ACTIVATE_ACCOUNT]: { name: string; link: string };
  [EmailTypeEnum.FORGOT_PASSWORD]: { name: string; link: string };
  [EmailTypeEnum.WELCOME]: { name: string };
};
