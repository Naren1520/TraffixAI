# TraffixAI - Real-Time Traffic Analytics System

TraffixAI is a production-grade full-stack traffic analytics platform for real-time congestion monitoring, incident reporting, and route planning. The project uses Spring Boot for the backend and React + Vite for the frontend.

## Overview
- Real-time traffic analytics with an intelligent dashboard.
- City-aware route recommendations and incident visualization.
- Live websocket-driven updates using STOMP/SockJS.
- Clean layered backend architecture and modular frontend design.

## Features
- **Real-Time Dashboard**: Traffic metrics, congestion scores, and alerts presented in a polished UI.
- **Route Analyzer**: Origin/destination route planning with traffic-aware analysis.
- **Incident Center**: Live incident feed with TomTom incident integration.
- **Shared City State**: Consistent city context across dashboard, routing, and incident views.
- **Modern UI**: React components styled with Tailwind CSS and enhanced with lucide-react icons.

## Folder Structure
```text
TraffixAI/
├── .gitignore
├── .github/
├── .qodo/
├── .vscode/
├── apache-maven-3.9.6/          # Bundled Maven distribution
├── Dockerfile
├── README.md
├── render.yaml
├── pom.xml
├── maven.zip
├── frontend/
│   ├── .env
│   ├── .env.example
│   ├── dist/
│   ├── eslint.config.js
│   ├── index.html
│   ├── node_modules/
│   ├── package-lock.json
│   ├── package.json
│   ├── public/
│   │   ├── favicon.svg
│   │   ├── icons.svg
│   │   ├── logo.png
│   │   └── logo1.png
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── RouteDetails.jsx
│   │   │   ├── RouteMap.jsx
│   │   │   ├── RouteSearch.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── TomTomMap.jsx
│   │   ├── context/
│   │   │   └── CityContext.jsx
│   │   └── pages/
│   │       ├── Dashboard.jsx
│   │       ├── Help.jsx
│   │       ├── IncidentCenter.jsx
│   │       └── RouteAnalyzer.jsx
│   └── vite.config.js
├── src/
│   └── main/
│       └── java/
│           └── com/
│               └── traffic/
│                   └── analytics/
│                       ├── TrafficAnalyticsApplication.java
│                       ├── config/
│                       │   ├── CorsConfig.java
│                       │   │   ├── RestTemplateConfig.java
│                       │   │   └── WebSocketConfig.java
│                       ├── controller/
│                       │   ├── LiveTrafficController.java
│                       │   ├── RouteController.java
│                       │   └── TrafficDataController.java
│                       ├── dto/
│                       │   ├── RoadTrafficSummaryDto.java
│                       │   ├── RouteAnalysisDto.java
│                       │   ├── RouteRequestDto.java
│                       │   ├── RouteResponseDto.java
│                       │   ├── TrafficAlertDto.java
│                       │   └── TrafficDataDto.java
│                       ├── mapper/
│                       │   └── TrafficMapper.java
│                       ├── model/
│                       │   └── TrafficData.java
│                       ├── repository/
│                       │   └── TrafficDataRepository.java
│                       └── service/
│                           ├── GeminiAiService.java
│                           ├── RealTimeTrafficMonitorService.java
│                           ├── RouteService.java
│                           ├── TrafficAlertService.java
│                           ├── TrafficAnalysisService.java
│                           ├── TrafficClassificationService.java
│                           ├── TrafficDataService.java
│                           └── TrafficSortingService.java
├── target/                      # Maven build output
└── README.md                    # Project documentation
```

## Technology Stack
- **Backend**: Java 17, Spring Boot, Spring Data JPA, H2 Database, Spring WebSockets, Lombok
- **Frontend**: React, Vite, Tailwind CSS, Recharts, Axios, React Router, lucide-react
- **Real-Time**: STOMP over SockJS, WebSocket push updates
- **Mapping**: TomTom traffic and incident APIs

## Prerequisites
- Java 17 or newer
- Node.js 18 or newer
- npm
- Maven 3.8+ (local distribution available in `apache-maven-3.9.6`)

## Running the Application
### Start the Backend
```powershell
cd "c:\Users\Naren S J\Downloads\TraffixAI"
.\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
```
The backend will be available at `http://localhost:8080`.

### Start the Frontend
```powershell
cd "c:\Users\Naren S J\Downloads\TraffixAI\frontend"
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

## Workflow
1. Open the Dashboard and select a city.
2. Monitor live traffic analytics and alerts.
3. Use Route Analyzer to plan routes.
4. Review live incidents in the Incident Center.
5. Visit the Help page for user guidance.

## Production Build
### Frontend
```bash
cd frontend
npm run build
```
### Backend
```powershell
cd "c:\Users\Naren S J\Downloads\TraffixAI"
.\apache-maven-3.9.6\bin\mvn.cmd clean package
```

## Troubleshooting
- If port `8080` is occupied, stop the process:
```powershell
Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess |
  ForEach-Object { Stop-Process -Id $_ -Force }
```
- If the frontend fails to start, rerun `npm install` inside `frontend`.

## Support
- Phone: **8296833381**
- Email: **narensonu1520@gmail.com**

## Notes
- The frontend uses React Router between Dashboard, Route Analyzer, Incident Center, and Help.
- Backend architecture is modular with controllers, services, repositories, and DTO mapping.





-------------------------------------------------------------------------------------------------
- .\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run

- Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force } ; Write-Host "Done"
