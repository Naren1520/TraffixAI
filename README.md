# TraffixAI

**Real-Time Traffic Analytics & Intelligent Route Optimization Platform**

A production-grade full-stack platform for live congestion monitoring, incident intelligence, AI-powered route planning, and per-user session management. Built to demonstrate engineering depth across the full stack — from real-time data pipelines and WebSocket broadcast to secure multi-user auth and persistent cloud storage.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Netlify-00C7B7?style=flat&logo=netlify&logoColor=white)](https://traffix-aiv1.netlify.app)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat&logo=render&logoColor=white)](https://traffixai-fucw.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat)](./LICENSE)

---

## Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?style=flat&logo=reactrouter&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-3-22B5BF?style=flat&logo=chartdotjs&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1-5A29E4?style=flat&logo=axios&logoColor=white)
![Lucide](https://img.shields.io/badge/Lucide_React-icons-F56565?style=flat)
![Google OAuth](https://img.shields.io/badge/Google_OAuth-@react--oauth/google-4285F4?style=flat&logo=google&logoColor=white)

### Backend

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=flat&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=flat&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6-6DB33F?style=flat&logo=springsecurity&logoColor=white)
![Spring WebSocket](https://img.shields.io/badge/WebSocket-STOMP/SockJS-6DB33F?style=flat&logo=spring&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-3.9-C71A36?style=flat&logo=apachemaven&logoColor=white)
![Lombok](https://img.shields.io/badge/Lombok-annotation_processor-BC4521?style=flat)

### Database & Auth

![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-JJWT_0.12-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![Google](https://img.shields.io/badge/Google_Sign--In-OAuth2-4285F4?style=flat&logo=google&logoColor=white)

### APIs & Services

![TomTom](https://img.shields.io/badge/TomTom-Traffic_%26_Incidents-DF1B12?style=flat&logo=tomtom&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-AI_Synopsis-8E75B2?style=flat&logo=google&logoColor=white)
![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-Nominatim-7EBC6F?style=flat&logo=openstreetmap&logoColor=white)

---

## Features

- Real-time traffic dashboard — live charts, congestion zones, peak hour analysis, priority alerts
- AI-powered route analysis with delay estimates and Gemini AI synopsis
- TomTom incident feed with severity classification and live map overlay
- Google Sign-In with per-user data isolation in MongoDB
- Default city preference saved per account, loaded on every session
- Recent city search history per user, surfaced as autocomplete suggestions
- AOP-based per-IP rate limiting — 60 req/min global, 20 req/min on auth
- MongoDB TTL index — traffic data auto-expires after 24 hours
- WebSocket real-time push via STOMP over SockJS
- Skeleton loading screens for every page
- Fully responsive UI — mobile, tablet, and desktop

---

## Folder Structure

```
TraffixAI/
|
|- frontend/
|   |- public/
|   |   |- logo1.png
|   |   `- favicon.svg
|   |- src/
|   |   |- App.jsx
|   |   |- main.jsx
|   |   |- index.css
|   |   |- api.js
|   |   |
|   |   |- components/
|   |   |   |- common/
|   |   |   |   |- Loader.jsx
|   |   |   |   `- Skeleton.jsx
|   |   |   |- layout/
|   |   |   |   |- Header.jsx
|   |   |   |   |- Sidebar.jsx
|   |   |   |   `- UserMenu.jsx
|   |   |   |- map/
|   |   |   |   |- TomTomMap.jsx
|   |   |   |   `- RouteMap.jsx
|   |   |   |- modals/
|   |   |   |   |- LoginModal.jsx
|   |   |   |   `- DefaultLocationModal.jsx
|   |   |   `- route/
|   |   |       |- RouteSearch.jsx
|   |   |       `- RouteDetails.jsx
|   |   |
|   |   |- context/
|   |   |   |- AuthContext.jsx
|   |   |   `- CityContext.jsx
|   |   |
|   |   `- pages/
|   |       |- Dashboard/
|   |       |   |- index.jsx
|   |       |   `- DashboardSkeleton.jsx
|   |       |- IncidentCenter/
|   |       |   |- index.jsx
|   |       |   `- IncidentCenterSkeleton.jsx
|   |       |- RouteAnalyzer/
|   |       |   |- index.jsx
|   |       |   `- RouteAnalyzerSkeleton.jsx
|   |       |- Settings/
|   |       |   |- index.jsx
|   |       |   `- SettingsSkeleton.jsx
|   |       `- Help/
|   |           `- index.jsx
|   |
|   |- index.html
|   |- package.json
|   |- vite.config.js
|   `- .env                       (git-ignored, see .env.example)
|
|- src/
|   `- main/
|       |- java/com/traffic/analytics/
|       |   |- TrafficAnalyticsApplication.java
|       |   |
|       |   |- config/
|       |   |   |- CorsConfig.java
|       |   |   |- RestTemplateConfig.java
|       |   |   |- SecurityConfig.java
|       |   |   `- WebSocketConfig.java
|       |   |
|       |   |- controller/
|       |   |   |- AuthController.java
|       |   |   |- LiveTrafficController.java
|       |   |   |- RouteController.java
|       |   |   |- TrafficDataController.java
|       |   |   `- UserController.java
|       |   |
|       |   |- dto/
|       |   |   |- RoadTrafficSummaryDto.java
|       |   |   |- RouteAnalysisDto.java
|       |   |   |- RouteRequestDto.java
|       |   |   |- RouteResponseDto.java
|       |   |   |- TrafficAlertDto.java
|       |   |   `- TrafficDataDto.java
|       |   |
|       |   |- mapper/
|       |   |   `- TrafficMapper.java
|       |   |
|       |   |- model/
|       |   |   |- TrafficData.java
|       |   |   `- User.java
|       |   |
|       |   |- ratelimit/
|       |   |   |- RateLimit.java
|       |   |   `- RateLimitAspect.java
|       |   |
|       |   |- repository/
|       |   |   |- TrafficDataRepository.java
|       |   |   `- UserRepository.java
|       |   |
|       |   |- security/
|       |   |   |- GoogleTokenVerifier.java
|       |   |   |- JwtAuthFilter.java
|       |   |   `- JwtUtil.java
|       |   |
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
|       |
|       `- resources/
|           |- application.properties
|           `- application-local.properties   (git-ignored)
|
|- pom.xml
|- Dockerfile
|- render.yaml
|- LICENSE
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
  |-- AOP Rate Limiter (per IP, sliding window)
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

| Variable           | Description                                    |
|--------------------|------------------------------------------------|
| `MONGODB_URI`      | MongoDB Atlas connection string                |
| `GOOGLE_CLIENT_ID` | Google OAuth2 client ID                        |
| `JWT_SECRET`       | Long random string for signing JWTs            |
| `TOMTOM_API_KEY`   | TomTom developer API key                       |
| `GEMINI_API_KEY`   | Google Gemini API key                          |
| `ALLOWED_ORIGINS`  | Comma-separated allowed frontend origins       |
| `PORT`             | Server port (Render injects this automatically)|

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
spring.data.mongodb.auto-index-creation=true
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

Runs at `http://localhost:8080`. The Vite dev proxy forwards `/api` and `/ws-traffic` automatically.

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

Go to **APIs & Services > Credentials > OAuth 2.0 Client ID** and configure:

**Authorized JavaScript origins**
```
http://localhost:5173
http://localhost:5174
https://traffix-aiv1.netlify.app
```

**Authorized redirect URIs**
```
http://localhost:5173
http://localhost:5174
https://traffix-aiv1.netlify.app
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

| Method | Endpoint         | Auth   | Description                     |
|--------|------------------|--------|---------------------------------|
| POST   | /api/auth/google | Public | Verify Google token, return JWT |

### User

| Method | Endpoint                   | Auth | Description                  |
|--------|----------------------------|------|------------------------------|
| GET    | /api/user/profile          | JWT  | Get user profile             |
| PUT    | /api/user/default-location | JWT  | Save or update default city  |
| GET    | /api/user/searches         | JWT  | Get recent city searches     |
| POST   | /api/user/searches         | JWT  | Save a city search           |

### Traffic

| Method | Endpoint                 | Auth     | Description                     |
|--------|--------------------------|----------|---------------------------------|
| GET    | /api/traffic/all         | Optional | All traffic data (user-scoped)  |
| GET    | /api/traffic/top-roads   | Optional | Top 5 busiest roads             |
| GET    | /api/traffic/least-roads | Optional | Top 5 free-flow roads           |
| GET    | /api/traffic/peak-hours  | Optional | Peak congestion hour            |
| GET    | /api/traffic/alerts      | Optional | High-load alerts                |
| POST   | /api/traffic/add         | Optional | Add a traffic data point        |

### Live Monitor

| Method | Endpoint           | Auth     | Description                   |
|--------|--------------------|----------|-------------------------------|
| POST   | /api/live/start    | Optional | Start TomTom data polling     |
| POST   | /api/live/stop     | Optional | Stop polling                  |
| POST   | /api/live/location | Optional | Change monitored city         |

### Route

| Method | Endpoint           | Auth     | Description          |
|--------|--------------------|----------|----------------------|
| POST   | /api/route/analyze | Optional | AI route analysis    |

---

## Contributing

TraffixAI is open for contributions. Whether you want to fix a bug, improve the UI, add a feature, or improve the engineering quality — all pull requests are welcome.

### How to Contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes with clear messages
4. Push to your fork and open a pull request against `main`
5. Describe what you changed and why in the PR description

### Ideas for Contribution

- Traffic heatmap overlay using TomTom flow tiles
- Predictive congestion alerts using trend detection
- Historical traffic comparison (today vs. yesterday)
- Export traffic report as CSV or PDF
- Shareable city dashboard via URL (`/dashboard/bangalore`)
- Push notifications for critical alerts
- Unit and integration test coverage
- Docker Compose setup for local full-stack development
- Performance improvements (code splitting, lazy loading)

### Code Style

- Backend: follow standard Spring Boot layered architecture — controllers call services, services call repositories. No business logic in controllers.
- Frontend: component per file, co-locate skeleton with its page, use context only for global shared state.
- Commits: use plain English imperative style — "Add skeleton for Dashboard", not "added skeletons"

---



## License

This project is licensed under the GNU General Public License v3.0 (GPL-3.0).See [LICENSE](./LICENSE) for the full text.

You are welcome to use, study, modify, and contribute to this project under the terms of the GPL-3.0 license. Any distributed modified versions must also remain licensed under GPL-3.0 and retain the original copyright notices.
---

## Author

**Naren SJ**

- Email: narensonu1520@gmail.com
- Phone: 8296833381
- LinkedIn: [linkedin.com/in/naren-sj](https://linkedin.com/in/naren-sj)

Built as a showcase of full-stack engineering across real-time systems, cloud deployment, multi-user auth, and production-quality UI patterns. Contributions and feedback are genuinely welcome.
