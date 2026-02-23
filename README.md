# Job Portal Backend

Backend API for a multi-role Job Portal with:
- Role-based auth (`SEEKER`, `COMPANY`, `ADMIN`)
- Job posting and approval workflow
- Job applications flow
- Social module (follow, posts, likes, comments, feed)
- Notification module with cron-based delivery processing
- Swagger API documentation

## Project Stack (with versions)

### Runtime
- Node.js (recommended `>=18`)
- npm (recommended `>=9`)
- TypeScript `^5.9.3`

### Core Backend
- Express `^5.2.1`
- Prisma Client `^6.15.0`
- Prisma CLI `^6.15.0`
- MongoDB (via Prisma `provider = "mongodb"`)
- JWT (`jsonwebtoken`) `^9.0.3`
- bcrypt `^6.0.0`
- Zod `^4.3.6`

### Security / Middleware / Uploads
- helmet `^8.1.0`
- cors `^2.8.6`
- express-rate-limit `^8.2.1`
- multer `^2.0.2`
- cloudinary `^2.9.0`

### API Docs
- swagger-ui-express `^5.0.1`

### Dev Tools
- ts-node-dev `^2.0.0`
- @types/node `^25.3.0`
- @types/express `^5.0.6`

## What This Project Does

- **Seeker**: register/login, manage profile, search jobs, apply for jobs, social activity.
- **Company**: register/login, manage company profile, post jobs, manage applications.
- **Admin**: seeded admin login, approve/reject jobs, block/unblock users, monitor users.
- **Social + Notifications**:
  - Follow notifications
  - New post fanout notifications to followers
  - Like/comment notifications to post owner
  - Notification queue processing by cron (`PENDING -> SENT/FAILED`)

## Environment Variables

Copy `.env.example` to `.env` and update values.

```env
DATABASE_URL="mongodb+srv://username:password@cluster0.gcih2.mongodb.net/dbname"
JWT_SECRET="supersecret"
JWT_EXPIRES_IN="7d"
PORT=3000

ADMIN_EMAIL="admin@jobportal.com"
ADMIN_PASSWORD="Admin@123"
ADMIN_FORCE_RESET_PASSWORD="false"
```

Optional notification worker tuning (defaults shown):

```env
NOTIFICATION_CRON_INTERVAL_MS=60000
NOTIFICATION_CRON_BATCH_SIZE=100
```

## How To Run

1. Install dependencies
```bash
npm install
```

2. Configure environment
```bash
cp .env.example .env
```
Then edit `.env`.

3. Push Prisma schema to MongoDB
```bash
npx prisma db push
```

4. Start dev server
```bash
npm run dev
```

Server URLs:
- API: `http://localhost:3000`
- Swagger Docs: `http://localhost:3000/api-docs`

## Admin Seeder

Admin seeding is integrated on startup.
- On server boot, `seedAdminUser()` ensures admin exists.
- Uses `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
- If `ADMIN_FORCE_RESET_PASSWORD=true`, admin password is re-hashed and updated.

Manual seed command:

```bash
npm run seed:admin
```

## API Route Groups

- `/api/auth`
- `/api/seeker`
- `/api/company`
- `/api/admin`
- `/api/social`
- `/api/notifications`

## Scripts

- `npm run dev` -> run app in development mode
- `npm run seed:admin` -> seed/update admin account

