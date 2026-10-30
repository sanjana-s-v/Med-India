# Med.India

Med.India is a frontend-only healthcare discovery and medical travel planning demo built with React, TypeScript, Vite, Tailwind CSS, React Router, and Lucide icons. The visual system uses a small amount of custom CSS alongside Tailwind utilities.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`, or preview one with `npm run preview`.

## Demo routes

- `/` — discovery homepage and search
- `/modern-medicine`, `/traditional-medicine`, `/doctors` — provider directories
- `/providers/:id` — provider profile and illustrative availability
- `/hospitals`, `/treatments` — facility and treatment discovery
- `/medical-tourism`, `/travel-services` — trip planning and optional estimates
- `/search` — combined provider, facility, and treatment search (filters are URL parameters)
- `/booking/:id` — multi-step demo appointment or programme request
- `/login`, `/register` — demo-only account entry
- `/dashboard` and `/dashboard/appointments`, `/dashboard/records`, `/dashboard/travel`, `/dashboard/profile` — patient demo space

## Demo boundaries

All people, facilities, availability, prices, and example records are fictional and illustrative. This app does not contact providers, reserve appointments, book travel, or provide medical advice. Authentication is not secure or server-backed; never enter a real password or sensitive health information. Only demo booking summaries and display preferences are stored in browser local storage. Health records are intentionally not collected or persisted. Currency conversions use static example rates, not live exchange rates.
