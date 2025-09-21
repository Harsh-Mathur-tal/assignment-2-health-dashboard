# CI/CD Pipeline Health Dashboard

A comprehensive real-time monitoring and alerting system for CI/CD pipelines. Monitor pipeline health, visualize metrics, and get alerts when things go wrong.

## 🚀 Features

### Core Monitoring
- **Real-time Pipeline Monitoring** - Monitor CI/CD pipeline executions from GitHub Actions, Jenkins, and more
- **Live Metrics Dashboard** - Success rates, build times, failure analysis with auto-refresh
- **Historical Analytics** - Trend analysis with interactive charts and time-series data
- **Multi-Platform Support** - GitHub Actions, Jenkins, GitLab CI, Azure DevOps

### Smart Alerting
- **Intelligent Alerts** - Configurable rules for failures, performance degradation, success rate drops
- **Multi-Channel Notifications** - Discord, Teams, Slack, Email, SMS, and webhook integrations
- **Alert History** - Track and analyze alert patterns over time
- **Customizable Thresholds** - Set performance and reliability thresholds per pipeline

### User Experience
- **Real-time Updates** - WebSocket-powered live dashboard updates
- **Mobile Responsive** - Works seamlessly on desktop, tablet, and mobile
- **Rich Visualizations** - Interactive charts with Recharts and Material-UI
- **Intuitive Interface** - Clean, modern design following Material Design principles

## 🏗️ Architecture

### Technology Stack

#### Backend
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js with comprehensive middleware
- **Database**: PostgreSQL 15+ with TimescaleDB for time-series data
- **Caching**: Redis for sessions, caching, and real-time subscriptions
- **Real-time**: Socket.io for WebSocket connections
- **Security**: Secure HTTP headers and CORS protection

#### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Material-UI (MUI) v5 with custom theming
- **State Management**: Zustand with persistence
- **Data Fetching**: React Query for server state management
- **Charts**: Recharts for data visualization
- **Real-time**: Socket.io-client for live updates

#### DevOps & Deployment
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Docker Compose for local development
- **Reverse Proxy**: Nginx for production routing
- **Database**: TimescaleDB for time-series optimization

## 🚦 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd assignment-2-health-dashboard
```

### 2. Start with Docker (Recommended)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### 4. Direct Access
The application loads directly without requiring authentication. Simply navigate to http://localhost:3000 to access all features immediately.

## 🛠️ Development Setup

### Local Development
```bash
# Install dependencies
npm run setup

# Start backend
cd backend
npm run dev

# Start frontend (in new terminal)
cd frontend
npm run dev

# Start database services
docker-compose up postgres redis
```

### Available Scripts
```bash
# Root level
npm run dev              # Start both frontend and backend
npm run build            # Build both applications
npm run docker:build    # Build Docker images
npm run docker:up       # Start with Docker Compose

# Backend
npm run dev              # Start development server
npm run build            # Build TypeScript
npm run test             # Run tests
npm run lint             # ESLint check

# Frontend
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run test             # Run tests
```

## 🤖 How AI Tools Were Used

This project was developed using AI assistance (Cursor IDE with Claude Sonnet) with structured prompts and iterative development. Here's how AI tools contributed:

### Initial Planning & Architecture
- **AI Role**: Solution architect and technical consultant
- **Key Prompts**:
  - "Consider yourself as solution architect... help with the assignment"
  - "Design high-level architecture, API structure, DB schema, and UI layout"
  - "Create comprehensive requirement analysis document"

### Code Generation & Implementation
- **Systematic Development**: Used todo tracking for organized progress
- **Full-Stack Implementation**: Generated complete backend API and React frontend
- **Best Practices**: Applied security, performance, and scalability patterns
- **Docker Setup**: Created complete containerization and deployment configuration

### Development Methodology
- **Structured Approach**: Broke down complex requirements into manageable tasks
- **Iterative Development**: Built and tested components incrementally
- **Documentation First**: Created comprehensive docs before implementation

## 📚 Key Learning & Assumptions

### Key Learnings
1. **Real-time Architecture**: WebSocket implementation for live dashboard updates
2. **Time-series Data**: TimescaleDB for efficient metrics storage and querying
3. **Microservices Design**: Modular, scalable architecture ready for cloud deployment
4. **Security Implementation**: JWT authentication with refresh tokens
5. **CI/CD Integration**: Webhook patterns for different CI/CD platforms

### Assumptions Made
1. **User Access**: Users have admin access to CI/CD platforms for webhook setup
2. **Network Connectivity**: Reliable connectivity for webhook delivery
3. **Platform APIs**: CI/CD platforms provide stable webhook and REST APIs
4. **Scaling Requirements**: System handles 100+ pipelines with 1000+ daily runs
5. **Data Retention**: 6-month default retention for historical data

## 📄 Project Structure

```
assignment-2-health-dashboard/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, logging, error handling
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── utils/           # Helper functions
│   ├── Dockerfile
│   └── package.json
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── services/        # API clients
│   │   └── types/           # TypeScript types
│   ├── Dockerfile
│   └── package.json
├── database/                # Database initialization
│   └── init.sql
├── docker-compose.yml       # Development environment
├── requirement_analysis_document.md
├── tech_design_document.md
├── prompt_logs.md
└── README.md
```

## 📞 Support

For support or questions about this implementation, please refer to the documentation files or create an issue in the repository.

---

**Built with ❤️ using AI assistance (Cursor IDE + Claude Sonnet) and modern web technologies**