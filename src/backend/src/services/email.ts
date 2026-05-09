import nodemailer from 'nodemailer';

import { config } from '../config/env';

export interface EnquiryNotificationInput {
  ownerEmail: string;
  ownerName: string;
  propertyTitle: string;
  message: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string | null;
  flipperName: string;
}

export interface EmailDeliveryResult {
  mode: 'disabled' | 'json' | 'smtp';
  delivered: boolean;
  details: string | null;
}

export const sendEnquiryNotification = async (
  input: EnquiryNotificationInput,
): Promise<EmailDeliveryResult> => {
  if (config.email.mode === 'disabled') {
    return {
      mode: 'disabled',
      delivered: false,
      details: 'Email delivery is disabled by configuration.',
    };
  }

  const transporter =
    config.email.mode === 'json'
      ? nodemailer.createTransport({ jsonTransport: true })
      : nodemailer.createTransport({
          host: config.email.host,
          port: config.email.port,
          secure: config.email.secure,
          auth: {
            user: config.email.user,
            pass: config.email.password,
          },
        });

  const info = await transporter.sendMail({
    from: config.email.from,
    to: input.ownerEmail,
    subject: `New enquiry for ${input.propertyTitle}`,
    text: [
      `Hi ${input.ownerName},`,
      '',
      `${input.flipperName} has submitted a new enquiry for ${input.propertyTitle}.`,
      '',
      `Message: ${input.message}`,
      `Contact name: ${input.contactName}`,
      `Contact email: ${input.contactEmail}`,
      input.contactPhone ? `Contact phone: ${input.contactPhone}` : undefined,
    ]
      .filter(Boolean)
      .join('\n'),
  });

  if (config.email.mode === 'json') {
    return {
      mode: 'json',
      delivered: false,
      details: `Message captured locally with id ${info.messageId}; no email was delivered.`,
    };
  }

  return {
    mode: 'smtp',
    delivered: true,
    details: info.messageId,
  };
};
