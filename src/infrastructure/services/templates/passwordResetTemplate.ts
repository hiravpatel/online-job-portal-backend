export const passwordResetTemplate = (resetLink: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Password Reset</title>
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #3b82f6; text-decoration: none; }
    .content { color: #374151; font-size: 16px; line-height: 1.6; }
    .btn-container { text-align: center; margin: 30px 0; }
    .btn { background-color: #3b82f6; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block; transition: background-color 0.2s; }
    .btn:hover { background-color: #2563eb; }
    .footer { text-align: center; margin-top: 40px; font-size: 14px; color: #9ca3af; }
    .disclaimer { font-size: 12px; margin-top: 20px; color: #d1d5db; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="logo">Job Portal</span>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>We received a request to reset your password. This link will expire in exactly 10 minutes.</p>
      <p>To reset your password, click the button below:</p>
      
      <div class="btn-container">
        <a href="${resetLink}" class="btn">Reset Password</a>
      </div>
      
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
      <p>Thanks,<br>The Job Portal Team</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Job Portal. All rights reserved.</p>
      <p class="disclaimer">If the button doesn't work, copy and paste this link into your browser:<br>${resetLink}</p>
    </div>
  </div>
</body>
</html>
`;
