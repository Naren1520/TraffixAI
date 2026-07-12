# TraffixAI

A production-grade full-stack real-time traffic analytics platform. TraffixAI provides live congestion monitoring, incident intelligence, AI-powered route planning, and per-user session management — built for scale and deployable to the cloud.

---

## Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?style=flat&logo=reactrouter&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-3-22B5BF?style=flat&logo=chartdotjs&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1-5A29E4?style=flat&logo=axios&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide_React-icons-F56565?style=flat&logo=lucide&logoColor=white)
![Google OAuth](https://img.shields.io/badge/Google_OAuth-@react--oauth/google-4285F4?style=flat&logo=google&logoColor=white)

### Backend

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=flat&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=flat&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6-6DB33F?style=flat&logo=springsecurity&logoColor=white)
![Spring WebSocket](https://img.shields.io/badge/WebSocket-STOMP/SockJS-6DB33F?style=flat&logo=spring&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-3.9-C71A36?style=flat&logo=apachemaven&logoColor=white)
![Lombok](https://img.shields.io/badge/Lombok-annotation_processor-BC4521?style=flat)

### Database

![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-user_data-47A248?style=flat&logo=mongodb&logoColor=white)

### Auth & Security

![JWT](https://img.shields.io/badge/JWT-JJWT_0.12-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![Google](https://img.shields.io/badge/Google_Sign--In-OAuth2-4285F4?style=flat&logo=google&logoColor=white)

### APIs & Services

![TomTom](https://img.shields.io/badge/TomTom-Traffic_%26_Incidents-DF1B12?style=flat&logo=tomtom&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-AI_Synopsis-8E75B2?style=flat&logo=google&logoColor=white)
![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-Nominatim_Geocoding-7EBC6F?style=flat&logo=openstreetmap&logoColor=white)

### Deployment

![Netlify](https://img.shields.io/badge/Frontend-Netlify-00C7B7?style=flat&logo=netlify&logoColor=white)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat&logo=render&logoColor=white)

---

## Features

- Real-time traffic dashboard with live charts, congestion zones, and alerts
- AI-powered route analysis with delay estimates and Gemini synopsis
- TomTom incident feed with severity classification and map overlay
- Google Sign-In with per-user data isolation in MongoDB
- Default city preference saved per account
- Recent city search history per user (last 10 searches)
- AOP-based rate limiting — 60 req/min global, 20 req/min on auth endpoints
- MongoDB TTL index — traffic data auto-expires after 24 hours
- WebSocket real-time push via STOMP over SockJS
- Fully responsive UI — mobile, tablet, and desktop

---

## Folder Structure

```
TraffixAI/
|
|- frontend/                        React + Vite frontend
|   |- public/
|   |   |- logo1.png
|   |   `- favicon.svg
|   |- src/
|   |   |- App.jsx                  Root layout, phase-based routing
|   |   |- main.jsx
|   |   |- index.css
|   |   |- api.js                   API/WS base URL helpers
|   |   |- components/
|   |   |   |- DefaultLocationModal.jsx
|   |   |   |- Header.jsx
|   |   |   |- Loader.jsx
|   |   |   |- LoginModal.jsx
|   |   |   |- RouteDetails.jsx
|   |   |   |- RouteMap.jsx
|   |   |   |- RouteSearch.jsx
|   |   |   |- Sidebar.jsx
|   |   |   |- TomTomMap.jsx
|   |   |   `- UserMenu.jsx
|   |   |- context/
|   |   |   |- AuthContext.jsx      Google auth, JWT, user state
|   |   |   `- CityContext.jsx      Global city/coordinates state
|   |   `- pages/
|   |       |- Dashboard.jsx
|   |       |- Help.jsx
|   |       |- IncidentCenter.jsx
|   |       |- RouteAnalyzer.jsx
|   |       `- Settings.jsx
|   |- package.json
|   |- vite.config.js
|   `- index.html
|
|- src/
|   `- main/
|       |- java/com/traffic/analytics/
|       |   |- TrafficAnalyticsApplication.java
|       |   |- config/
|       |   |   |- CorsConfig.java
|       |   |   |- RestTemplateConfig.java
|       |   |   |- SecurityConfig.java
|       |   |   `- WebSocketConfig.java
|       |   |- controller/
|       |   |   |- AuthController.java
|       |   |   |- LiveTrafficController.java
|       |   |   |- RouteController.java
|       |   |   |- TrafficDataController.java
|       |   |   `- UserController.java
|       |   |- dto/
|       |   |   |- RoadTrafficSummaryDto.java
|       |   |   |- RouteAnalysisDto.java
|       |   |   |- RouteRequestDto.java
|       |   |   |- RouteResponseDto.java
|       |   |   |- TrafficAlertDto.java
|       |   |   `- TrafficDataDto.java
|       |   |- mapper/
|       |   |   `- TrafficMapper.java
|       |   |- model/
|       |   |   |- TrafficData.java     MongoDB doc, 24h TTL
|       |   |   `- User.java            MongoDB doc, per-user data
|       |   |- ratelimit/
|       |   |   |- RateLimit.java       Custom annotation
|       |   |   `- RateLimitAspect.java AOP token bucket
|       |   |- repository/
|       |   |   |- TrafficDataRepository.java
|       |   |   `- UserRepository.java
|       |   |- security/
|       |   |   |- GoogleTokenVerifier.java
|       |   |   |- JwtAuthFilter.java
|       |   |   `- JwtUtil.java
|       |   `- service/
|       |       |- GeminiAiService.java
|       |       |- RealTimeTrafficMonitorService.java
|       |       |- RouteService.java
|       |       |- TrafficAlertService.java
|       |       |- TrafficAnalysisService.java
|       |       |- TrafficClassificationService.java
|       |       |- TrafficDataService.java
|       |       |- TrafficSortingService.java
|       |       `- UserService.java
|       `- resources/
|           |- application.properties
|           `- application-local.properties  (git-ignored)
|
|- pom.xml
|- Dockerfile
|- render.yaml
`- .gitignore
```

---

## Architecture

```
Browser
  |
  |-- React (Netlify)
  |     |-- Google OAuth popup  -->  Google
  |     |-- REST calls          -->  Spring Boot (Render)
  |     `-- WebSocket (STOMP)   -->  Spring Boot (Render)
  |
Spring Boot (Render)
  |-- Spring Security + JWT filter
  |-- AOP Rate Limiter (per IP)
  |-- MongoDB Atlas
  |     |-- users         (accounts, default city, search history)
  |     `-- traffic_data  (TTL 24h, per-user tagged)
  |-- TomTom API          (traffic flow + incidents)
  |-- Gemini AI           (route synopsis)
  `-- OpenStreetMap       (road discovery via Overpass API)
```

---

## Environment Variables

### Render (Backend)

| Variable          | Description                              |
|-------------------|------------------------------------------|
| `MONGODB_URI`     | MongoDB Atlas connection string          |
| `GOOGLE_CLIENT_ID`| Google OAuth2 client ID                  |
| `JWT_SECRET`      | Long random string for signing JWTs      |
| `TOMTOM_API_KEY`  | TomTom developer API key                 |
| `GEMINI_API_KEY`  | Google Gemini API key                    |
| `ALLOWED_ORIGINS` | Comma-separated allowed frontend origins |
| `PORT`            | Server port (Render sets this)           |

### Netlify (Frontend)

| Variable              | Description                        |
|-----------------------|------------------------------------|
| `VITE_TOMTOM_API_KEY` | TomTom API key                     |
| `VITE_API_BASE_URL`   | Backend base URL                   |
| `VITE_WS_BASE_URL`    | Backend WebSocket base URL         |

### Local Development

Create `src/main/resources/application-local.properties` (git-ignored):

```properties
tomtom.api.key=YOUR_TOMTOM_KEY
spring.data.mongodb.uri=mongodb+srv://user:pass@cluster.mongodb.net/traffixai?appName=TraffixAi
google.client.id=YOUR_GOOGLE_CLIENT_ID
jwt.secret=any-local-secret-string
rate.limit.requests-per-minute=60
```

Create `frontend/.env` (git-ignored):

```env
VITE_TOMTOM_API_KEY=YOUR_TOMTOM_KEY
```

---

## Running Locally

### Backend

```powershell
.\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
```

Runs at `http://localhost:8080`. The Vite dev server proxies `/api` and `/ws-traffic` to it automatically.

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Opens at `http://localhost:5173`.

### Kill port 8080 if occupied

```powershell
Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess |
  ForEach-Object { Stop-Process -Id $_ -Force }
```

---

## Google Cloud Console Setup

Go to **APIs & Services > Credentials > OAuth 2.0 Client ID** and add:

**Authorized JavaScript origins**
```
http://localhost:5173
http://localhost:5174
https://your-netlify-site.netlify.app
```

**Authorized redirect URIs**
```
http://localhost:5173
http://localhost:5174
https://your-netlify-site.netlify.app
```

---

## Production Build

### Frontend

```bash
cd frontend
npm run build
```

### Backend

```powershell
.\apache-maven-3.9.6\bin\mvn.cmd clean package
```

---

## API Reference

### Auth

| Method | Endpoint           | Auth     | Description                         |
|--------|--------------------|----------|-------------------------------------|
| POST   | /api/auth/google   | Public   | Verify Google token, return JWT     |

### User

| Method | Endpoint                    | Auth     | Description                         |
|--------|-----------------------------|----------|-------------------------------------|
| GET    | /api/user/profile           | JWT      | Get user profile                    |
| PUT    | /api/user/default-location  | JWT      | Save/update default city            |
| GET    | /api/user/searches          | JWT      | Get recent city searches            |
| POST   | /api/user/searches          | JWT      | Save a city search                  |

### Traffic

| Method | Endpoint                   | Auth     | Description                         |
|--------|----------------------------|----------|-------------------------------------|
| GET    | /api/traffic/all           | Optional | All traffic data (user-scoped)      |
| GET    | /api/traffic/top-roads     | Optional | Top 5 busiest roads                 |
| GET    | /api/traffic/least-roads   | Optional | Top 5 free-flow roads               |
| GET    | /api/traffic/peak-hours    | Optional | Peak congestion hour                |
| GET    | /api/traffic/alerts        | Optional | High-load alerts                    |
| POST   | /api/traffic/add           | Optional | Add a traffic data point            |

### Live Monitor

| Method | Endpoint           | Auth     | Description                         |
|--------|--------------------|----------|-------------------------------------|
| POST   | /api/live/start    | Optional | Start TomTom data polling           |
| POST   | /api/live/stop     | Optional | Stop polling                        |
| POST   | /api/live/location | Optional | Change monitored city               |

### Route

| Method | Endpoint           | Auth     | Description                         |
|--------|--------------------|----------|-------------------------------------|
| POST   | /api/route/analyze | Optional | AI route analysis                   |

---

## Support

- Email: narensonu1520@gmail.com
- Phone: 8296833381
