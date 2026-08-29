# University App

A modern multi-university application portal where students can:

- Create one profile
- Upload documents (transcripts, ID, certificates, essays…)
- Apply to multiple universities
- Track application status in real time

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend / Auth / DB / Storage**: Supabase
- **Mobile** (coming later): Expo (React Native)

## Getting Started



Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
university-app/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/          # (next)
│   ├── universities/       # (next)
│   ├── apply/              # (next)
│   ├── layout.tsx
│   ├── page.tsx            # Landing page
│   └── globals.css
├── components/
├── lib/
│   └── supabase/
├── types/
├── supabase/
│   └── schema.sql          # Full database schema
└── ...
```

## Current Status

✅ Project foundation  
✅ Landing page  
✅ Login & Register pages  
✅ Complete database schema (multi-university)  
✅ Supabase client setup  

🔜 Dashboard  
🔜 Profile + Document upload  
🔜 Browse universities & programs  
🔜 Application form  
🔜 Mobile app (Expo)

## Next Steps

1. Push this code to your GitHub repo
2. Create a Supabase project and run the schema
3. Tell me when you’re ready and we’ll continue with the Dashboard + Profile + Application flow

---

Built for students everywhere and anywhere.
by  Sandile mati
