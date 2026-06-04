# JetCalc — Climb/Descent Gradient Calculator

Climb and descent gradient conversions for business jet pilots.

## What it does

Three calculators, all solving the same formula cluster from different starting points:

1. **% → ft/min** — Enter departure gradient % + groundspeed → get ft/nm and required ft/min climb rate
2. **ft/min → %** — Enter your actual climb rate + groundspeed → get the gradient you're achieving
3. **ft/nm → conversions** — Enter obstacle clearance requirement in ft/nm → get % and ft/min

Each calculator includes a "Show the math" toggle that reveals the step-by-step formula work — designed for pilots who need to understand the math for oral exams, not just the answer.

## Deploy to Vercel (2 minutes)

1. Push this folder to a GitHub repo
2. Go to vercel.com → New Project → import the repo
3. Vercel auto-detects Vite. No env vars needed.
4. Deploy.

## Run locally

```bash
npm install
npm run dev
```

## What's next (if validated)

- Approach glidepath angle → ft/min at speed
- Obstacle clearance / departure performance
- Crosswind component calculator
- Stabilized approach checker
- Checkride oral exam flashcard mode
