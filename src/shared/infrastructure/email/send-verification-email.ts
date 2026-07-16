import { EMAIL_FROM, resend } from '@/shared/infrastructure/email/resend-client'

export interface SendVerificationEmailParams {
  to: string
  userName: string
  verificationUrl: string
}

export async function sendVerificationEmail({
  to,
  userName,
  verificationUrl,
}: SendVerificationEmailParams): Promise<void> {
  await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: 'Verifica tu cuenta de NovaERP',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <p style="font-size: 18px; font-weight: 600; color: #12172b;">
          NOVA<span style="color: #0f6e5d;">ERP</span>
        </p>
        <p>Hola ${userName},</p>
        <p>Confirma que este correo es tuyo para poder usar tu cuenta:</p>
        <p style="margin: 24px 0;">
          <a
            href="${verificationUrl}"
            style="background: #0f6e5d; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none;"
          >
            Verificar mi correo
          </a>
        </p>
        <p style="color: #61646d; font-size: 13px;">
          Si no creaste esta cuenta, puedes ignorar este correo.
        </p>
      </div>
    `,
  })
}
