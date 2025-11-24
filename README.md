# In-House Software Catalog System

A modern, internal Software Catalog System to facilitate the discovery, sharing, and reuse of in-house software assets among employees.

> **🚀 다른 PC에서 복원하기**: [빠른 복원 가이드](.docs/QUICK_RESTORE.md) 참고

## Features

### ✅ Completed (Phase 1 & 2)
- **Authentication & User Management**: NextAuth.js with role-based access (Employee, Owner, Admin)
- **Catalog Management**: Asset registration, modification, and versioning
- **File Upload**: Support for images and attachments
- **Approval Workflow**: Admin dashboard for asset approval/rejection
- **Catalog Discovery**: Search, filter, and browse published assets
- **Usage Request Flow**: Track asset usage and requests
- **Reviews & Ratings**: User feedback system
- **UI/UX Polish**: ServiceNow-inspired professional design

### 📋 Planned (Phase 3-4)
- Analytics Dashboard
- AI-powered QnA system
- Recommendation engine
- Notification system

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + Shadcn/UI
- **Database**: SQLite (via Prisma ORM)
- **Authentication**: NextAuth.js
- **Icons**: Lucide React

## Getting Started

### Quick Setup

```bash
# Clone the repository
git clone https://github.com/hodolhodol/newcatalog.git
cd newcatalog

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env and add your NEXTAUTH_SECRET

# Initialize database
npx prisma generate
npx prisma db push

# Seed test data (optional)
npx tsx scripts/seed.ts

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Detailed Setup

For detailed setup instructions, see [.docs/RESTORE.md](.docs/RESTORE.md)

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

Generate `NEXTAUTH_SECRET`:
```bash
# PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## Default Test Users

After running the seed script:

- **Admin**: admin@company.com
- **Owner**: owner@company.com
- **Employee**: employee@company.com

*Note: Password authentication is currently bypassed for development*

## Project Structure

```
newcatalog/
├── .docs/                    # 📚 Project documentation
│   ├── task.md              # Task tracking
│   ├── implementation_plan.md # Technical plan
│   ├── walkthrough.md       # Verification results
│   ├── RESTORE.md          # Detailed restoration guide
│   ├── QUICK_RESTORE.md    # Quick restoration guide
│   └── conversation_backup/ # AI conversation history
├── prisma/
│   └── schema.prisma        # Database schema
├── public/uploads/          # User-uploaded files
├── scripts/                 # Utility scripts
├── src/
│   ├── app/                 # Next.js app router
│   ├── components/          # React components
│   ├── lib/                # Utilities
│   └── types/              # TypeScript types
└── package.json
```

## Documentation

- [Task Tracking](.docs/task.md) - Current project status
- [Implementation Plan](.docs/implementation_plan.md) - Technical specifications
- [Walkthrough](.docs/walkthrough.md) - Verification and testing
- [Restoration Guide](.docs/RESTORE.md) - Setup on new PC
- [Conversation Backup](.docs/conversation_backup/README.md) - AI conversation history

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Run linter
npm run lint

# Open Prisma Studio
npx prisma studio
```

## Restoring on Another PC

### One-Line Prompt

In Gemini Code Assist, use:

```
다른 PC에서 antigravity를 이용해서 작업한 것을 github의 hodolhodol/newcatalog에 보관했어. 이 PC에 복원해줘.
```

See [.docs/QUICK_RESTORE.md](.docs/QUICK_RESTORE.md) for details.

## Contributing

This is an internal project. For questions or issues, contact the development team.

## License

Internal use only.

---

**Repository**: https://github.com/hodolhodol/newcatalog  
**Last Updated**: 2025-11-24  
**Status**: Phase 1 & 2 Complete
