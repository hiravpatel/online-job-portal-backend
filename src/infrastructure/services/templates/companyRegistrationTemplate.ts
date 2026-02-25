export const companyRegistrationTemplate = (companyName: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Company Registration Received</title>
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #f59e0b; text-decoration: none; }
    .content { color: #374151; font-size: 16px; line-height: 1.6; }
    .footer { text-align: center; margin-top: 40px; font-size: 14px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="logo">Job Portal</span>
    </div>
    <div class="content">
      <p>Hello ${companyName},</p>
      <p>Thank you for registering your company on the Job Portal!</p>
      <p>Your registration has been successfully received and is currently <strong>awaiting admin approval</strong>. We manually review all new company profiles to ensure a safe ecosystem for our seekers.</p>
      <p>We will send you another email as soon as your account is approved and ready to post jobs.</p>
      
      <p>Welcome aboard!<br>The Job Portal Team</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Job Portal. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
