# Schulte Table Game (Next.js) 🎮

Modern Schulte Table built with Next.js, TailwindCSS, ShadCN-style UI (Radix + CVA), and GSAP animations.

## Tech Stack
- **Next.js** (App Router)
- **TailwindCSS** + `tailwindcss-animate`
- **ShadCN-style UI** (Radix UI primitives, CVA, clsx, tailwind-merge)
- **GSAP** for animations
- **TypeScript**

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the dev server:
   ```bash
   npm run dev
   ```
3. Open http://localhost:3000

Build and start:
```bash
npm run build
npm start
```

## Features
- **Difficulty**: 3×3 → 7×7 with progressive increase
- **Scoring**: +10 correct, −5 wrong
- **Timer & Best Times** per grid size (localStorage)
- **Settings Modal** (top-right button):
  - Hide numbers after clicking
  - Dark/Light mode
  - Restart (R) and Quit (Q)
- **Keyboard Shortcuts**:
  - R: Restart (during play)
  - Q: Quit (during play)
  - Space/Escape: Back to menu

## Project Structure
```
windsurf-project/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── GameBoard.tsx
│   ├── GameCell.tsx
│   ├── GameControls.tsx
│   ├── GameModals.tsx
│   ├── GameStats.tsx
│   ├── Instructions.tsx
│   ├── SettingsModal.tsx
│   └── ui/
│       ├── button.tsx
│       ├── dialog.tsx
│       └── switch.tsx
├── hooks/
│   ├── useGameState.ts
│   ├── useKeyboardShortcuts.ts
│   └── useTimer.ts
├── lib/
│   └── utils.ts
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── next.config.js
└── package.json
```

## Notes
- Dark mode defaults to enabled; toggle in Settings.
- Legacy files (`index.html`, `styles.css`, `game.js`) have been removed in favor of the Next.js app.
