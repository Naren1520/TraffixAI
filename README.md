# TraffixAI - Real-Time Traffic Analytics System

TraffixAI is a full-stack web application designed for real-time traffic monitoring, congestion analysis, and automated alerting. Built with Spring Boot and React, it features live websocket data streaming and custom algorithmic sorting for peak traffic analysis.

## Features
- **Real-Time Dashboard**: A luxury glassmorphic UI built with React, Tailwind CSS, and Recharts.
- **WebSocket Streaming**: Live updates broadcasted via STOMP/SockJS.
- **Automated Analytics**: Calculates peak hours, top congested roads, and classifies traffic intensity (Low, Medium, High).
- **Custom Algorithms**: Utilizes a stable Merge Sort implementation for processing complex traffic data arrays.
- **Live Alerts**: Automatically generates active threshold alerts for speeding or high stagnation points.
- **Clean Architecture**: Backend organized via strict Controller/Service/Repository layers with DTO mappers.

---

## Prerequisites

Before you begin, ensure you have the following installed:
- **Java 17** (or higher)
- **Apache Maven** (3.8+)
- **Node.js** (v18+)
- **npm** (comes with Node.js)

---

## How to Run the Project

### 1. Start the Backend (Spring Boot)

The backend provides the REST APIs and WebSocket server on `localhost:8080`.

1. Open a terminal and navigate to the root directory `TraffixAI/`.
2. Run the application using Maven:
   ```bash
   mvn spring-boot:run
   ```
   *(Note: If you do not have Maven installed globally, you can execute it from your IDE, or use the Maven wrapper `.\mvnw spring-boot:run` if configured).*
3. Verify the backend is running. You should see Tomcat started on port 8080.

### 2. Start the Frontend (React + Vite)

The frontend serves the user interface on `localhost:5173`.

1. Open a **new** terminal window.
2. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
3. Install the required Node dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your web browser and navigate to: [http://localhost:5173](http://localhost:5173)

---

## Usage

1. Open the dashboard in your browser.
2. Click **Start Simulation** in the top right corner.
3. The backend will begin generating mock traffic data for various road sectors, streaming it to the UI in real-time.
4. Watch the Area Chart update dynamically, while top roads, peak hours, and active alerts compute on-the-fly!

---

## Tech Stack
**Backend**: Java 17, Spring Boot 3, Spring Data JPA, H2 Database (In-Memory), Lombok, Spring WebSockets.  
**Frontend**: React 18, Vite, Tailwind CSS v4, Recharts, Axios, SockJS / STOMP.

- .\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run