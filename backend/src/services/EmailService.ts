// =============================================================================
// src/services/EmailService.ts — Envio de E-mails Transacionais — Unicred
//
// Suporte a dois modos:
//   PRODUÇÃO  — usa SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS definidos no .env
//   DESENVOLVIMENTO — cria conta Ethereal automaticamente (nenhuma config necessária)
//
// A detecção é feita pela presença de SMTP_HOST no ambiente.
// =============================================================================

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// ---------------------------------------------------------------------------
// DTOs
// ---------------------------------------------------------------------------

interface NotificacaoTransacaoDTO {
  emailAluno: string;
  emailProfessor: string;
  nomeAluno: string;
  nomeProfessor: string;
  quantidade: number;
  motivo: string;
}

interface NotificacaoResgateDTO {
  emailAluno: string;
  nomeAluno: string;
  nomeVantagem: string;
  nomeEmpresa: string;
  codigoCupom: string;
  quantidade: number;
}

interface NotificacaoCupomValidadoDTO {
  emailAluno: string;
  nomeAluno: string;
  nomeVantagem: string;
  nomeEmpresa: string;
  codigoCupom: string;
}

// ---------------------------------------------------------------------------
// Serviço
// ---------------------------------------------------------------------------

class EmailService {
  private transporter: Transporter | null = null;

  private async getTransporter(): Promise<Transporter> {
    if (this.transporter) return this.transporter;

    if (process.env.SMTP_HOST) {
      // ── Modo Produção (Gmail) ──────────────────────────────────────────────
      const port = parseInt(process.env.SMTP_PORT ?? '587', 10);
      this.transporter = nodemailer.createTransport({
        host:   process.env.SMTP_HOST,
        port,
        secure: port === 465,
        auth: {
          user: process.env.SMTP_USER ?? '',
          pass: process.env.SMTP_PASS ?? '',
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      console.log(`[EmailService] ✅ Usando SMTP real: ${process.env.SMTP_HOST}:${port}`);
      console.log(`[EmailService] 📧 Remetente: ${process.env.SMTP_USER}`);
    } else {
      // ── Modo Desenvolvimento (Ethereal) ────────────────────────────────────
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host:   'smtp.ethereal.email',
        port:   587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
      console.log('[EmailService] ⚠️  Usando Ethereal (modo dev). Conta:', testAccount.user);
      console.log('[EmailService] Para usar Gmail, defina SMTP_HOST, SMTP_PORT, SMTP_USER e SMTP_PASS no .env');
    }

    try {
      await this.transporter.verify();
      console.log('[EmailService] ✅ Conexão SMTP verificada com sucesso.');
    } catch (err) {
      console.warn('[EmailService] ⚠️  Aviso: não foi possível verificar a conexão SMTP.', err);
    }

    return this.transporter;
  }

  private get from(): string {
    return process.env.EMAIL_FROM ?? '"Unicred" <noreply@unicred.edu.br>';
  }

  private logPreview(info: nodemailer.SentMessageInfo, tipo: string): void {
    const url = nodemailer.getTestMessageUrl(info);
    if (url) {
      console.log(`[EmailService] ${tipo} → Preview Ethereal: ${url}`);
    } else {
      console.log(`[EmailService] ✅ ${tipo} → E-mail enviado com sucesso! ID: ${info.messageId}`);
    }
  }

  // ---------------------------------------------------------------------------
  // Templates HTML
  // ---------------------------------------------------------------------------

  private templateRecebimentoAluno(nomeAluno: string, nomeProfessor: string, quantidade: number, motivo: string): string {
    return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #f1f5f9; }
</style>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.12);">
      <tr><td style="background:linear-gradient(135deg,#1a56db 0%,#1e3a8a 100%);padding:40px;text-align:center;">
        <div style="width:72px;height:72px;background:rgba(255,255,255,0.2);border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:36px;line-height:72px;">🪙</div>
        <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">Você recebeu créditos!</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Sistema Unicred de Moedas Estudantis</p>
      </td></tr>
      <tr><td style="padding:40px;">
        <p style="margin:0 0 20px;color:#1e293b;font-size:16px;font-weight:600;">Olá, ${nomeAluno}! 🎉</p>
        <p style="margin:0 0 28px;color:#475569;font-size:14px;line-height:1.7;">
          O professor <strong style="color:#1e293b;">${nomeProfessor}</strong> reconheceu seu mérito e transferiu créditos para a sua conta Unicred.
        </p>
        <div style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border:1px solid #bfdbfe;border-radius:12px;padding:28px;text-align:center;margin-bottom:28px;">
          <p style="margin:0;color:#1e40af;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Créditos Recebidos</p>
          <p style="margin:8px 0 4px;color:#1d4ed8;font-size:52px;font-weight:800;line-height:1;">+${quantidade}</p>
          <p style="margin:0;color:#3b82f6;font-size:13px;">moedas estudantis</p>
        </div>
        <div style="background:#f8fafc;border-left:4px solid #1a56db;border-radius:4px;padding:16px 20px;margin-bottom:28px;">
          <p style="margin:0 0 6px;color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Motivo do reconhecimento</p>
          <p style="margin:0;color:#1e293b;font-size:14px;line-height:1.6;font-style:italic;">"${motivo}"</p>
        </div>
        <p style="margin:0;color:#94a3b8;font-size:13px;text-align:center;">Acesse o Unicred para ver seu saldo e resgatar vantagens exclusivas! 🎁</p>
      </td></tr>
      <tr><td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
        <p style="margin:0;color:#94a3b8;font-size:12px;">🪙 <strong>Unicred</strong> — Sistema de Créditos Estudantis</p>
        <p style="margin:4px 0 0;color:#cbd5e1;font-size:11px;">Este é um e-mail automático, não responda.</p>
      </td></tr>
    </table>
  </td></tr>
</table></body></html>`;
  }

  private templateConfirmacaoProfessor(nomeProfessor: string, nomeAluno: string, quantidade: number, motivo: string): string {
    return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.12);">
      <tr><td style="background:linear-gradient(135deg,#059669 0%,#047857 100%);padding:40px;text-align:center;">
        <div style="width:72px;height:72px;background:rgba(255,255,255,0.2);border-radius:50%;margin:0 auto 16px;line-height:72px;text-align:center;font-size:36px;">✅</div>
        <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;">Transferência confirmada!</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Sistema Unicred de Moedas Estudantis</p>
      </td></tr>
      <tr><td style="padding:40px;">
        <p style="margin:0 0 20px;color:#1e293b;font-size:16px;font-weight:600;">Olá, Prof. ${nomeProfessor}!</p>
        <p style="margin:0 0 28px;color:#475569;font-size:14px;line-height:1.7;">
          Sua transferência de créditos para o aluno <strong style="color:#1e293b;">${nomeAluno}</strong> foi registrada com sucesso.
        </p>
        <div style="background:linear-gradient(135deg,#ecfdf5,#d1fae5);border:1px solid #a7f3d0;border-radius:12px;padding:28px;text-align:center;margin-bottom:28px;">
          <p style="margin:0;color:#065f46;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Créditos Enviados</p>
          <p style="margin:8px 0 4px;color:#047857;font-size:52px;font-weight:800;line-height:1;">${quantidade}</p>
          <p style="margin:0;color:#10b981;font-size:13px;">para ${nomeAluno}</p>
        </div>
        <div style="background:#f8fafc;border-left:4px solid #059669;border-radius:4px;padding:16px 20px;margin-bottom:28px;">
          <p style="margin:0 0 6px;color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Motivo registrado</p>
          <p style="margin:0;color:#1e293b;font-size:14px;line-height:1.6;font-style:italic;">"${motivo}"</p>
        </div>
        <p style="margin:0;color:#94a3b8;font-size:13px;text-align:center;">O saldo do aluno já foi atualizado. Acompanhe seu extrato pelo Unicred.</p>
      </td></tr>
      <tr><td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
        <p style="margin:0;color:#94a3b8;font-size:12px;">🪙 <strong>Unicred</strong> — Sistema de Créditos Estudantis</p>
        <p style="margin:4px 0 0;color:#cbd5e1;font-size:11px;">Este é um e-mail automático, não responda.</p>
      </td></tr>
    </table>
  </td></tr>
</table></body></html>`;
  }

  private templateConfirmacaoResgate(nomeAluno: string, nomeVantagem: string, nomeEmpresa: string, codigoCupom: string, quantidade: number): string {
    return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.12);">
      <tr><td style="background:linear-gradient(135deg,#7c3aed 0%,#6d28d9 100%);padding:40px;text-align:center;">
        <div style="width:72px;height:72px;background:rgba(255,255,255,0.2);border-radius:50%;margin:0 auto 16px;line-height:72px;text-align:center;font-size:36px;">🎁</div>
        <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;">Resgate confirmado!</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Sistema Unicred de Moedas Estudantis</p>
      </td></tr>
      <tr><td style="padding:40px;">
        <p style="margin:0 0 20px;color:#1e293b;font-size:16px;font-weight:600;">Olá, ${nomeAluno}!</p>
        <p style="margin:0 0 28px;color:#475569;font-size:14px;line-height:1.7;">
          Seu resgate de <strong style="color:#1e293b;">${nomeVantagem}</strong> na empresa <strong style="color:#1e293b;">${nomeEmpresa}</strong> foi realizado com sucesso!
        </p>
        <div style="background:linear-gradient(135deg,#faf5ff,#ede9fe);border:2px dashed #a78bfa;border-radius:12px;padding:28px;text-align:center;margin-bottom:28px;">
          <p style="margin:0 0 12px;color:#5b21b6;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">🎟️ Seu Código de Cupom</p>
          <p style="margin:0 0 8px;color:#4c1d95;font-size:36px;font-weight:800;letter-spacing:6px;font-family:'Courier New',monospace;">${codigoCupom}</p>
          <p style="margin:0;color:#7c3aed;font-size:12px;">Apresente este código ao estabelecimento</p>
        </div>
        <div style="background:#f8fafc;border-left:4px solid #7c3aed;border-radius:4px;padding:16px 20px;margin-bottom:28px;">
          <p style="margin:0 0 4px;color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Créditos utilizados</p>
          <p style="margin:0;color:#1e293b;font-size:24px;font-weight:700;">-${quantidade} moedas</p>
        </div>
        <p style="margin:0;color:#94a3b8;font-size:13px;text-align:center;">Apresente o código ao estabelecimento para concluir o resgate. 🎊</p>
      </td></tr>
      <tr><td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
        <p style="margin:0;color:#94a3b8;font-size:12px;">🪙 <strong>Unicred</strong> — Sistema de Créditos Estudantis</p>
        <p style="margin:4px 0 0;color:#cbd5e1;font-size:11px;">Este é um e-mail automático, não responda.</p>
      </td></tr>
    </table>
  </td></tr>
</table></body></html>`;
  }

  private templateCupomValidado(nomeAluno: string, nomeVantagem: string, nomeEmpresa: string, codigoCupom: string): string {
    return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
  <tr><td align="center">
    <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,.12);">
      <tr><td style="background:linear-gradient(135deg,#0891b2 0%,#0e7490 100%);padding:40px;text-align:center;">
        <div style="width:72px;height:72px;background:rgba(255,255,255,0.2);border-radius:50%;margin:0 auto 16px;line-height:72px;text-align:center;font-size:36px;">🏆</div>
        <h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;">Vantagem concluída!</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Sistema Unicred de Moedas Estudantis</p>
      </td></tr>
      <tr><td style="padding:40px;">
        <p style="margin:0 0 20px;color:#1e293b;font-size:16px;font-weight:600;">Parabéns, ${nomeAluno}! 🎉</p>
        <p style="margin:0 0 28px;color:#475569;font-size:14px;line-height:1.7;">
          A empresa <strong style="color:#1e293b;">${nomeEmpresa}</strong> confirmou a entrega da vantagem <strong style="color:#1e293b;">${nomeVantagem}</strong>. Seu cupom foi validado com sucesso!
        </p>
        <div style="background:linear-gradient(135deg,#ecfeff,#cffafe);border:1px solid #a5f3fc;border-radius:12px;padding:28px;text-align:center;margin-bottom:28px;">
          <p style="margin:0 0 12px;color:#155e75;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Cupom Validado ✅</p>
          <p style="margin:0 0 8px;color:#0e7490;font-size:28px;font-weight:800;letter-spacing:4px;font-family:'Courier New',monospace;">${codigoCupom}</p>
          <p style="margin:8px 0 0;font-size:24px;">✅</p>
        </div>
        <p style="margin:0;color:#94a3b8;font-size:13px;text-align:center;">Obrigado por usar o Unicred! Continue acumulando créditos para novas vantagens. 🌟</p>
      </td></tr>
      <tr><td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0;">
        <p style="margin:0;color:#94a3b8;font-size:12px;">🪙 <strong>Unicred</strong> — Sistema de Créditos Estudantis</p>
        <p style="margin:4px 0 0;color:#cbd5e1;font-size:11px;">Este é um e-mail automático, não responda.</p>
      </td></tr>
    </table>
  </td></tr>
</table></body></html>`;
  }

  // ---------------------------------------------------------------------------
  // Métodos públicos
  // ---------------------------------------------------------------------------

  async enviarNotificacaoTransacao(dados: NotificacaoTransacaoDTO): Promise<void> {
    const transporter = await this.getTransporter();

    const [infoAluno, infoProfessor] = await Promise.all([
      transporter.sendMail({
        from:    this.from,
        to:      dados.emailAluno,
        subject: `🪙 Você recebeu ${dados.quantidade} créditos de ${dados.nomeProfessor}!`,
        html:    this.templateRecebimentoAluno(dados.nomeAluno, dados.nomeProfessor, dados.quantidade, dados.motivo),
      }),
      transporter.sendMail({
        from:    this.from,
        to:      dados.emailProfessor,
        subject: `✅ Transferência de ${dados.quantidade} créditos para ${dados.nomeAluno} confirmada`,
        html:    this.templateConfirmacaoProfessor(dados.nomeProfessor, dados.nomeAluno, dados.quantidade, dados.motivo),
      }),
    ]);

    this.logPreview(infoAluno,     'E-mail ALUNO');
    this.logPreview(infoProfessor, 'E-mail PROFESSOR');
  }

  async enviarNotificacaoResgate(dados: NotificacaoResgateDTO): Promise<void> {
    const transporter = await this.getTransporter();
    const info = await transporter.sendMail({
      from:    this.from,
      to:      dados.emailAluno,
      subject: `🎁 Resgate confirmado: ${dados.nomeVantagem} — Cupom ${dados.codigoCupom}`,
      html:    this.templateConfirmacaoResgate(dados.nomeAluno, dados.nomeVantagem, dados.nomeEmpresa, dados.codigoCupom, dados.quantidade),
    });
    this.logPreview(info, 'E-mail RESGATE');
  }

  async enviarNotificacaoCupomValidado(dados: NotificacaoCupomValidadoDTO): Promise<void> {
    const transporter = await this.getTransporter();
    const info = await transporter.sendMail({
      from:    this.from,
      to:      dados.emailAluno,
      subject: `🏆 Cupom validado: ${dados.nomeVantagem} em ${dados.nomeEmpresa}`,
      html:    this.templateCupomValidado(dados.nomeAluno, dados.nomeVantagem, dados.nomeEmpresa, dados.codigoCupom),
    });
    this.logPreview(info, 'E-mail CUPOM VALIDADO');
  }
}

export default new EmailService();
