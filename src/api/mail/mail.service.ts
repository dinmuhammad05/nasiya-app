import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { config } from 'src/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.MAIL_HOST,
      port: config.MAIL_PORT,
      secure: false,
      auth: {
        user: config.MAIL_USER,
        pass: config.MAIL_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    try {
      await this.transporter.sendMail({
        from: `"Nasiya App" <${config.MAIL_USER}>`,
        to,
        subject,
        text,
        html,
      });

      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      console.error('Mail error:', error.message);
      throw new InternalServerErrorException('Error sending email');
    }
  }
}
