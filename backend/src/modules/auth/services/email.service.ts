import { Injectable, Logger } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import * as path from 'node:path';
import * as process from 'node:process';
import { EmailTypeToPayload } from '../../../types/email-type-to-payload';
import { emailConstants } from '../../../common/constants/email.constants';

@Injectable()
export class EmailService {
  private readonly transporter: Transporter;
  private readonly senderEmail: string;
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {
    this.senderEmail = this.configService.get<string>('SMTP_EMAIL') || '';
    const smptPassword = this.configService.get<string>('SMTP_PASSWORD') || '';

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.senderEmail,
        pass: smptPassword,
      },
    });

    const handleBarsConfig: hbs.NodemailerExpressHandlebarsOptions = {
      viewEngine: {
        extname: '.hbs',
        defaultLayout: 'main',
        layoutsDir: path.join(process.cwd(), 'src', 'templates', 'layouts'),
        partialsDir: path.join(process.cwd(), 'src', 'templates', 'partials'),
      },
      viewPath: path.join(process.cwd(), 'src', 'templates', 'views'),
      extName: '.hbs',
    };

    this.transporter.use('compile', hbs(handleBarsConfig));
  }

  public async sendEmail<T extends keyof EmailTypeToPayload>(
    emailType: T,
    recipientEmail: string,
    templateContext: EmailTypeToPayload[T],
  ): Promise<void> {
    try {
      const templateConfig = (
        emailConstants as Record<
          keyof EmailTypeToPayload,
          { subject: string; template: string }
        >
      )[emailType];

      const { subject, template } = templateConfig;

      const mailOptions = {
        from: `"No Reply <${this.senderEmail}>"`,
        to: recipientEmail,
        subject,
        template,
        context: {
          ...templateContext,
          frontUrl:
            this.configService.get<string>('APP_FRONT_URL') ||
            'http://localhost:5173',
        },
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `Email [${emailType}] successfully sent to [${recipientEmail}]`,
      );
    } catch (err) {
      this.logger.error(
        `Failed to send email [${emailType}]: email to [${recipientEmail}]`,
        err instanceof Error ? err.stack : err,
      );
      throw err;
    }
  }
}
