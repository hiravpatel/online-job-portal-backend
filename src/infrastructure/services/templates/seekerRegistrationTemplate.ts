export const seekerRegistrationTemplate = (firstName: string, loginUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to Job Portal</title>
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; color: #8b5cf6; text-decoration: none; }
    .content { color: #374151; font-size: 16px; line-height: 1.6; }
    .btn-container { text-align: center; margin: 30px 0; }
    .btn { background-color: #8b5cf6; color: #ffffff !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block; transition: background-color 0.2s; }
    .btn:hover { background-color: #7c3aed; }
    .footer { text-align: center; margin-top: 40px; font-size: 14px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="logo">Job Portal</span>
    </div>
    <div class="content">
      <p>Hello ${firstName},</p>
      <p>Welcome to Job Portal! Your Job Seeker account has been successfully created.</p>
      <p>We are thrilled to help you find your next big opportunity. Log in to update your profile, browse job listings, and submit applications today.</p>
      
      <div class="btn-container">
        <a href="${loginUrl}" class="btn">Log In and Get Started</a>
      </div>
      
      <p>Let's find your dream job!<br>The Job Portal Team</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Job Portal. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
