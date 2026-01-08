# 🎌 Nihongo - Japanese Learning Platform

A full-stack Japanese language learning application with gamification features, blockchain integration, and AI chatbot support.

## 📁 Project Structure

```
nihongo/
├── nihongo/          # Backend (Spring Boot)
├── nihongofe/        # Frontend (Next.js)
├── nihongocontract/  # Smart Contracts (Solidity)
├── web3-backend/     # Web3 Backend
└── wiki-api/         # Wiki API Service
```

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 14 (React 18)
- **Styling:** TailwindCSS
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Authentication:** JWT (HttpOnly Cookies)
- **Blockchain:** ethers.js
- **UI Components:** Radix UI
- **Image Upload:** Cloudinary
- **AI Chatbot:** Google Gemini API

### Backend
- **Framework:** Spring Boot 3.x
- **Language:** Java 21
- **Build Tool:** Maven
- **Database:** PostgreSQL
- **ORM:** Spring Data JPA (Hibernate)
- **Security:** Spring Security + JWT
- **Email:** Spring Mail (Gmail SMTP)

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Java 21
- Maven 3.8+
- PostgreSQL 14+

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd nihongo
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Generate JWT Secret:**
   ```bash
   # Linux/Mac
   bash ../generate-jwt-secret.sh
   
   # Windows
   ..\generate-jwt-secret.bat
   ```

4. **Install dependencies and build:**
   ```bash
   mvn clean install -DskipTests
   ```

5. **Run the application:**
   ```bash
   mvn spring-boot:run
   ```

Backend will be available at: `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd nihongofe
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

Frontend will be available at: `http://localhost:3000`

## 📚 Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide for production
- **[CODE_OPTIMIZATION_SUMMARY.md](CODE_OPTIMIZATION_SUMMARY.md)** - Code improvements and best practices
- **Backend .env.example** - Environment variables reference
- **Frontend .env.example** - Frontend configuration reference

## 🔐 Environment Variables

### Backend (`nihongo/.env`)
```properties
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/nihongo_db
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your_password

# Email (Gmail)
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

# CORS
FRONTEND_ORIGIN=http://localhost:3000

# JWT Secret (generate using scripts)
JWT_SECRET=your_base64_secret_here
```

### Frontend (`nihongofe/.env.local`)
```env
# Backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Gemini AI (Optional)
GEMINI_API_KEY=your_gemini_key
```

## 🎯 Features

- ✅ User Authentication (JWT-based)
- ✅ Japanese Learning Modules (Hiragana, Katakana, Kanji)
- ✅ Gamification (XP, Streaks, Leaderboard)
- ✅ AI Chatbot (Google Gemini)
- ✅ Blockchain Integration (Web3)
- ✅ Image Upload (Cloudinary)
- ✅ Email Notifications
- ✅ Responsive Design
- ✅ Dark Mode Support

## 🔧 Development

### Backend Development
```bash
cd nihongo
mvn spring-boot:run
```

### Frontend Development
```bash
cd nihongofe
npm run dev
```

### Code Quality
```bash
# Frontend linting
cd nihongofe
npm run lint

# Backend tests (when available)
cd nihongo
mvn test
```

## 📦 Deployment

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for detailed deployment instructions for:
- Backend: Render
- Frontend: Vercel/Netlify
- Database: Render PostgreSQL / Neon

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is for educational purposes.

## 👥 Authors

- Dong Hoang & Team

## 🐛 Known Issues & Fixes

See **[CODE_OPTIMIZATION_SUMMARY.md](CODE_OPTIMIZATION_SUMMARY.md)** for:
- Recent bug fixes
- Performance optimizations
- Security improvements

## 📞 Support

For issues and questions:
1. Check documentation files
2. Review CODE_OPTIMIZATION_SUMMARY.md for common issues
3. Create an issue in the repository

---

**Happy Learning Japanese! 🎌📚**
