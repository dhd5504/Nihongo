# Nihongo Monorepo

Frontend (Next.js/React + Tailwind + Zustand) lives in `nihongofe`.  
Backend (Spring Boot / Java 21) lives in `nihongo`.

## Tech Stack
- Frontend: Next.js 14, React 18, TailwindCSS, Zustand, Axios, ethers, Radix UI.
- Backend: Spring Boot, Java 21, Maven, Spring Security/JPA.
- Infra: Cloudinary (avatar upload), Gemini API (chatbot).

## Prerequisites
- Node.js 20+ and npm
- Java 21 and Maven

## Frontend Setup (`nihongofe`)
1. Install deps:
   ```bash
   cd nihongofe
   npm install
   ```
2. Configure environment:
   - Copy `.env.example` to `.env.local` and fill/override values.
3. Run dev:
   ```bash
   npm run dev
   ```
4. Build:
   ```bash
   npm run build && npm run start
   ```

## Backend Setup (`nihongo`)
1. Install deps and build (skip tests):
   ```bash
   cd nihongo
   ./mvnw -DskipTests package
   ```
2. Configure `src/main/resources/application.properties` for DB/ports/auth as needed.
3. Run:
   ```bash
   ./mvnw spring-boot:run
   ```

## Environment (Frontend)
See `nihongofe/.env.example`:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `GEMINI_API_KEY`

Defaults exist in code for quick start; override in `.env.local` for production.***
