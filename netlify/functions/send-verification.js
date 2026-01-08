const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Разрешить CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Обработка preflight запроса
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };
  }

  try {
    const { email, code } = JSON.parse(event.body);

    if (!email || !code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Email and code required' })
      };
    }

    // Проверка украинских доменов
    const ukrainianDomains = [
      'ukr.net', 'i.ua', 'meta.ua', 'bigmir.net', 'online.ua',
      'gmail.ua', 'yandex.ua', 'mail.ua', 'inbox.ua'
    ];

    const domain = email.split('@')[1]?.toLowerCase();
    if (ukrainianDomains.includes(domain)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Ukrainian domains not supported' })
      };
    }

    // Настройка транспорта (используй свои данные SMTP)
    const transporter = nodemailer.createTransporter({
      service: 'gmail', // или другой сервис
      auth: {
        user: process.env.EMAIL_USER, // твой email
        pass: process.env.EMAIL_PASS  // пароль приложения
      }
    });

    // HTML шаблон письма
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; background: #0a0a0a; color: #ffffff; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 15px; padding: 40px; border: 1px solid rgba(199, 125, 255, 0.2); }
            .logo { text-align: center; margin-bottom: 30px; }
            .logo-text { font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #7209b7 0%, #c77dff 50%, #e0aaff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            .title { font-size: 28px; font-weight: bold; text-align: center; margin-bottom: 20px; color: #ffffff; }
            .code-container { background: rgba(199, 125, 255, 0.1); border: 2px solid #7209b7; border-radius: 10px; padding: 20px; text-align: center; margin: 30px 0; }
            .code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #c77dff; font-family: monospace; }
            .text { font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.8); text-align: center; margin: 20px 0; }
            .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(199, 125, 255, 0.2); color: rgba(255, 255, 255, 0.6); font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">
                <div class="logo-text">⚡ Cleverlose</div>
            </div>
            
            <h1 class="title">Подтверждение регистрации</h1>
            
            <p class="text">
                Добро пожаловать в Cleverlose! Для завершения регистрации введите код подтверждения:
            </p>
            
            <div class="code-container">
                <div class="code">\${code}</div>
            </div>
            
            <p class="text">
                Код действителен в течение 10 минут.<br>
                Если вы не регистрировались на Cleverlose, просто проигнорируйте это письмо.
            </p>
            
            <div class="footer">
                <p>© 2024 Cleverlose. Все права защищены.</p>
                <p>Премиум конфиги для CS2, Valorant и Apex Legends</p>
            </div>
        </div>
    </body>
    </html>`;

    // Отправка письма
    await transporter.sendMail({
      from: '"Cleverlose" <noreply@cleverlose.cc>',
      to: email,
      subject: 'Код подтверждения Cleverlose',
      html: htmlTemplate
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Verification code sent successfully' })
    };

  } catch (error) {
    console.error('Email error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: 'Failed to send email' })
    };
  }
};
