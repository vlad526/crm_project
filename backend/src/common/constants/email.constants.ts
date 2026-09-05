import { EmailTypeEnum } from '../../database/entities/enums/email-type.enum';

interface IEmailInfo {
  subject: string;
  template: string;
}

export const emailConstants: Record<EmailTypeEnum, IEmailInfo> = {
  [EmailTypeEnum.VERIFY_EMAIL]: {
    subject: 'Confirm your email address',
    template: 'verify-email',
  },
  [EmailTypeEnum.ACTIVATE_ACCOUNT]: {
    subject: 'Account Activation Required',
    template: 'activate-account',
  },
  [EmailTypeEnum.WELCOME]: {
    subject: 'Welcome to our platform!',
    template: 'welcome',
  },
  [EmailTypeEnum.FORGOT_PASSWORD]: {
    subject: 'Password Reset Request',
    template: 'forgot-password',
  },
};
