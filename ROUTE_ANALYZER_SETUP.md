# 🚀 Route Analyzer Feature - Complete Setup Guide

## Overview
The Route Analyzer is a sophisticated feature that allows users to analyze routes between two locations with:
- **🚦 Real-time traffic congestion data** along the route
- **⏱️ Estimated travel delays** based on current traffic conditions
- **🔴 Heavy traffic zone identification** to avoid congested areas
- **🟢 Multiple route alternatives** with detailed comparison
- **🤖 AI-powered recommendations** using Google Gemini 2.5 Flash API

---

## 📁 Project Structure

### Backend (Java Spring Boot)

```
src/main/java/com/traffic/analytics/
├── controller/
│   └── RouteController.java          # REST endpoints for route analysis
├── service/
│   ├── RouteService.java             # Business logic for route analysis
│   └── GeminiAiService.java          # Gemini API integration
├── dto/
│   ├── RouteRequestDto.java          # Request payload
│   ├── RouteAnalysisDto.java         # Individual route data
│   └── RouteResponseDto.java         # Complete response payload
├── config/
│   └── RestTemplateConfig.java       # HTTP client configuration
└── TrafficAnalyticsApplication.java

src/main/resources/
└── application.properties            # Gemini API key configuration
```

### Frontend (React + Vite)

```
frontend/src/
├── pages/
│   ├── Dashboard.jsx                 # Main traffic dashboard
│   └── RouteAnalyzer.jsx             # Route analysis page
├── components/
│   ├── Header.jsx                    # Navigation header with Route Analyzer link
│   ├── RouteSearch.jsx               # Start/end point selection form
│   ├── RouteDetails.jsx              # Route list and comparison
│   ├── RouteMap.jsx                  # TomTom map visualization
│   └── TomTomMap.jsx                 # Base map component
└── App.jsx                           # React Router setup
```

---

## 🔧 Installation & Setup

### Prerequisites
- Java 17+
- Node.js 18+
- Maven 3.9.6+
- Gemini API Key (free tier available)

### 1. Backend Setup

#### Step 1: Get Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com)
2. Click "Get API Key" → "Create API Key"
3. Copy your API key

#### Step 2: Configure Environment Variable
Add your Gemini API key to your environment:

**Windows (PowerShell):**
```powershell
$env:GEMINI_API_KEY = "your-api-key-here"
```

**macOS/Linux (Bash):**
```bash
export GEMINI_API_KEY="your-api-key-here"
```

Or edit `application.properties`:
```properties
gemini.api.key=your-api-key-here
```

#### Step 3: Build Backend
```bash
cd /path/to/TraffixAI
mvn clean install
```

#### Step 4: Run Backend
```bash
mvn spring-boot:run
```

Backend runs on: `http://localhost:8080`

### 2. Frontend Setup

#### Step 1: Install Dependencies
```bash
cd frontend
npm install
# This installs react-router-dom along with other packages
```

#### Step 2: Set Environment Variables
Create `.env.local` in the frontend folder:
```
VITE_TOMTOM_API_KEY=your-tomtom-api-key
```

#### Step 3: Start Development Server
```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 🎯 API Endpoints

### Route Analysis
**Endpoint:** `POST /api/route/analyze`

**Request:**
```json
{
  "startLocation": "MG Road, Mangalore",
  "endLocation": "Hampankatta, Mangalore",
  "startLat": 12.8711,
  "startLon": 74.8427,
  "endLat": 12.8745,
  "endLon": 74.8504,
  "city": "Mangalore"
}
```

**Response:**
```json
{
  "startLocation": "MG Road, Mangalore",
  "endLocation": "Hampankatta, Mangalore",
  "routes": [
    {
      "routeId": "route_direct_1234567890",
      "routeName": "Direct Route",
      "distance": 5.2,
      "estimatedTime": 45.0,
      "estimatedDelay": 15.0,
      "congestionLevel": "MEDIUM",
      "heavyTrafficZones": ["Balmatta", "Falnir Road"],
      "routeScore": 70.0,
      "isOptimal": false,
      "recommendation": "...",
      "alternativeRoutes": ["Route A", "Route B"]
    }
  ],
  "bestRoute": { ... },
  "aiRecommendation": "High congestion expected on this route... Consider leaving earlier or using alternative routes...",
  "timestamp": 1715034600000
}
```

---

## 🤖 Gemini AI Integration

### How It Works
1. **Prompt Generation:** RouteService sends traffic data to GeminiAiService
2. **API Call:** Service constructs a request to Google's Gemini API
3. **Response Parsing:** AI recommendations are extracted and returned
4. **Fallback Logic:** If API fails, intelligent default recommendations are generated

### Gemini API Configuration

**Base Model:** `gemini-2.5-flash`

**Generation Settings:**
- Temperature: 0.7 (balanced creativity)
- TopP: 0.95 (diversity)
- TopK: 40 (variety)
- Max Tokens: 500

### Gemini Prompt Template
```
You are a traffic navigation expert. Provide a brief, actionable recommendation for a driver.
Route: From [START] to [END]
Heavy traffic zones on this route: [ZONES]
Overall congestion: [PERCENTAGE]%
Estimated delay: [DELAY] minutes

Provide a brief recommendation (2-3 sentences) including:
1. Whether to take this route
2. Best time to travel
3. Alternative suggestion if applicable
Keep response practical and concise.
```

---

## 🗺️ Route Analysis Features

### 1. Route Generation
The system generates 3 alternative routes:
- **Direct Route:** Fastest path with current traffic
- **Scenic Route:** Local roads with minimal congestion
- **Bypass Route:** Longer but potentially faster

### 2. Traffic Analysis
Each route is analyzed for:
- **Distance:** Calculated using Haversine formula
- **Estimated Time:** Based on route distance and traffic
- **Estimated Delay:** Additional time due to congestion
- **Congestion Level:** LOW/MEDIUM/HIGH classification
- **Heavy Traffic Zones:** Specific areas to watch
- **Route Score:** 0-100, higher is better

### 3. Route Scoring Algorithm
```
Score = 100 - (delay × 2)
- Zero delay → 100 points (excellent)
- 20+ minutes delay → 60 points or lower (poor)
```

### 4. AI Recommendations
Gemini provides intelligent advice considering:
- Current congestion levels
- Peak traffic times
- Alternative route suggestions
- Optimal travel windows

---

## 🎨 UI Components

### RouteAnalyzer.jsx
Main page component that:
- Manages route analysis state
- Displays results and AI recommendations
- Shows selected route on map
- Handles error and loading states

### RouteSearch.jsx
Search component featuring:
- Start/end location input fields
- OpenStreetMap Nominatim geocoding
- Location suggestions dropdown
- Analysis button

### RouteDetails.jsx
Route comparison component showing:
- Multiple route options
- Distance, time, delay metrics
- Route scoring with visual progress bars
- Heavy traffic zones indicator

### RouteMap.jsx
Map visualization using:
- TomTom Web SDK
- Live traffic overlay
- Start point (green marker)
- End point (red marker)
- Route boundaries

---

## 📊 Data Flow

```
User Input
    ↓
RouteSearch (geocoding)
    ↓
RouteAnalyzer (state management)
    ↓
POST /api/route/analyze
    ↓
RouteService (route generation)
    ↓
GeminiAiService (AI recommendations)
    ↓
RouteResponseDto
    ↓
RouteAnalyzer (display results)
    ↓
RouteMap + RouteDetails (visualization)
```

---

## 🐛 Troubleshooting

### Gemini API Key Issues
```
ERROR: gemini.api.key is empty
```
**Solution:** Ensure environment variable `GEMINI_API_KEY` is set before starting the backend.

### Route Not Found
```
ERROR: Failed to analyze route
```
**Solution:** 
- Verify locations are valid
- Check internet connection
- Ensure TomTom API key is configured

### Map Not Loading
**Solution:**
- Verify `VITE_TOMTOM_API_KEY` in frontend `.env.local`
- Check browser console for errors
- Ensure API key has map permissions

---

## 🚀 Performance Tips

1. **Caching:** Implement route result caching for repeated queries
2. **Batch Requests:** Combine multiple route analyses
3. **Async Loading:** Use lazy loading for map tiles
4. **Database Optimization:** Index traffic data by road ID and timestamp

---

## 📝 Future Enhancements

- [ ] Real-time traffic updates via WebSocket
- [ ] Historical traffic pattern analysis
- [ ] Multi-stop route optimization
- [ ] Predictive traffic simulation
- [ ] Route export (PDF, directions)
- [ ] Saved favorite routes
- [ ] Integration with calendar for predictive routing

---

## 📜 Dependencies

### Backend
- Spring Boot 3.2.5
- Spring Data JPA
- Lombok
- RestTemplate (HTTP client)

### Frontend
- React 19.2.5
- React Router DOM 6.20.0
- Axios (HTTP client)
- TomTom Maps SDK 6.25.0
- Recharts 3.8.1
- Lucide Icons 1.14.0

---

## 🔐 Security Notes

1. **API Keys:** Never commit API keys to version control
2. **CORS:** Backend configured with `@CrossOrigin(origins = "*")`
3. **Input Validation:** All route requests validated
4. **Rate Limiting:** Consider implementing rate limiting for production

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Gemini API documentation
3. Verify all environment variables are set
4. Check browser console for frontend errors

---

**Happy Routing! 🗺️🚗**
