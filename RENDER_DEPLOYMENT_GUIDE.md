# 🚀 Deploying Spring Boot Backend Server to Render using Docker

This guide will walk you through deploying your NerdsOnCall Spring Boot **backend server only** to Render using Docker, since Render doesn't natively support Java applications.

## 📋 Prerequisites

- ✅ Working Docker setup (already done)
- ✅ GitHub account
- ✅ Render account (free tier available)
- ✅ Supabase database (already configured)

## 🔧 Step 1: Prepare Your Repository

### 1.1 Create/Update `.gitignore`
Ensure your `.gitignore` includes:
```gitignore
# Compiled class files
*.class
target/
*.jar
*.war

# IDE files
.idea/
.vscode/
*.iml

# Environment files (IMPORTANT!)
.env
Server/.env

# OS files
.DS_Store
Thumbs.db

# Docker
.dockerignore
```

### 1.2 Dockerfile Location
Your Dockerfile is located in the `Server/` directory (server-only deployment):
- ✅ `Server/Dockerfile` - Optimized for backend deployment
- ✅ `Server/.dockerignore` - Excludes unnecessary files

### 1.3 Repository Structure
For server-only deployment, your structure should be:
```
NerdsOnCall/
├── Server/
│   ├── Dockerfile          # ✅ Backend deployment
│   ├── .dockerignore       # ✅ Build optimization
│   ├── pom.xml
│   ├── src/
│   └── .env
└── Client/                 # ❌ Not deployed to Render
```
```dockerignore
.git
.gitignore
README.md
Dockerfile
.dockerignore
node_modules
npm-debug.log
.env
Server/.env
```

## 🏗️ Step 2: Build and Test Locally

### 2.1 Build the JAR file
```bash
cd Server
mvn clean package -DskipTests
```

### 2.2 Build Docker image
```bash
# From Server directory (backend only)
cd Server
docker build -t nerds-on-call-backend .
```

### 2.3 Test locally
```bash
# From Server directory
docker run -d -p 8080:8080 --env-file .env nerds-on-call-backend
```

## 📤 Step 3: Push to GitHub

### 3.1 Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit for Render deployment"
```

### 3.2 Create GitHub Repository
1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name it `nerds-on-call-backend` or similar
4. Don't initialize with README (you already have files)
5. Click "Create repository"

### 3.3 Push Server Directory to GitHub
```bash
# Initialize git in Server directory
cd Server
git init
git add .
git commit -m "Initial backend deployment"
git remote add origin https://github.com/YOUR_USERNAME/nerds-on-call-backend.git
git branch -M main
git push -u origin main
```

## 🌐 Step 4: Deploy to Render

### 4.1 Create Render Account
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub account
3. Authorize Render to access your repositories

### 4.2 Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select your `nerds-on-call-backend` repository

### 4.3 Configure Service Settings
Fill in the following settings:

**Basic Settings:**
- **Name**: `nerds-on-call-backend`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Runtime**: `Docker`

**Build Settings:**
- **Build Command**: Leave empty (Docker handles this)
- **Start Command**: Leave empty (Docker handles this)

**Advanced Settings:**
- **Dockerfile Path**: `./Dockerfile` (in Server directory)
- **Docker Context Directory**: `.` (Server directory root)

### 4.4 Configure Environment Variables
In the "Environment" section, add all your environment variables from `Server/.env`:

```
DB_URL=jdbc:postgresql://aws-0-ap-south-1.pooler.supabase.com:6543/postgres?prepareThreshold=0&preparedStatementCacheQueries=0
DB_USERNAME=postgres.rxzovloonudulbdqjfcv
DB_PASSWORD=NerdsOnCall69
SPRING_DATASOURCE_URL=jdbc:postgresql://aws-0-ap-south-1.pooler.supabase.com:6543/postgres?prepareThreshold=0&preparedStatementCacheQueries=0
SPRING_DATASOURCE_DRIVER=org.postgresql.Driver
SPRING_DATASOURCE_USERNAME=postgres.rxzovloonudulbdqjfcv
SPRING_DATASOURCE_PASSWORD=NerdsOnCall69
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false
SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=86400000
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com,http://localhost:3000
SERVER_ADDRESS=0.0.0.0
SERVER_PORT=8080
```

**⚠️ Important Notes:**
- Don't include the `#` comments
- Replace `your-secret-key-here` with your actual JWT secret
- Update `CORS_ALLOWED_ORIGINS` with your actual frontend domain
- Render will automatically use port 8080

### 4.5 Deploy
1. Click "Create Web Service"
2. Render will automatically start building and deploying
3. Wait for the build to complete (5-10 minutes)

## 🔍 Step 5: Monitor Deployment

### 5.1 Check Build Logs
- Go to your service dashboard
- Click on "Logs" tab
- Monitor the build process

### 5.2 Common Build Issues and Solutions

**Issue: Build fails with "No such file or directory"**
```
Solution: Ensure your Dockerfile paths are correct relative to root
```

**Issue: Database connection fails**
```
Solution: Double-check environment variables, especially database URL format
```

**Issue: Port binding issues**
```
Solution: Ensure SERVER_ADDRESS=0.0.0.0 and SERVER_PORT=8080
```

## ✅ Step 6: Verify Deployment

### 6.1 Test Your Application
Once deployed, Render will provide a URL like:
```
https://nerds-on-call-app.onrender.com
```

### 6.2 Test Endpoints
```bash
# Health check
curl https://your-app.onrender.com/

# API endpoints
curl https://your-app.onrender.com/api/health
```

## 🔄 Step 7: Continuous Deployment

### 7.1 Auto-Deploy Setup
Render automatically deploys when you push to the connected branch:

```bash
# Make changes
git add .
git commit -m "Update application"
git push origin main
# Render will automatically redeploy
```

### 7.2 Manual Deploy
You can also trigger manual deploys from the Render dashboard.

## 🛠️ Troubleshooting

### Common Issues:

1. **Build Timeout**
   - Increase build timeout in Render settings
   - Optimize Dockerfile for faster builds

2. **Memory Issues**
   - Upgrade to paid plan for more memory
   - Optimize JVM memory settings

3. **Database Connection**
   - Verify Supabase allows connections from Render IPs
   - Check environment variables

4. **CORS Issues**
   - Update `CORS_ALLOWED_ORIGINS` with your Render URL
   - Include both HTTP and HTTPS versions

## 💰 Pricing Considerations

**Free Tier Limitations:**
- Service spins down after 15 minutes of inactivity
- 750 hours/month limit
- Slower cold starts

**Paid Tier Benefits:**
- Always-on service
- Faster performance
- More memory and CPU

## 🎯 Next Steps

1. **Custom Domain**: Configure custom domain in Render settings
2. **SSL Certificate**: Render provides free SSL certificates
3. **Monitoring**: Set up health checks and alerts
4. **Scaling**: Configure auto-scaling based on traffic

## 📞 Support

If you encounter issues:
1. Check Render documentation
2. Review build logs carefully
3. Test locally first
4. Contact Render support for platform-specific issues

## 🔐 Step 8: Security Best Practices

### 8.1 Environment Variables Security
- Never commit `.env` files to Git
- Use Render's environment variable management
- Rotate secrets regularly

### 8.2 Database Security
- Use connection pooling (already configured)
- Enable SSL for database connections
- Restrict database access to necessary IPs only

### 8.3 Application Security
- Keep dependencies updated
- Use HTTPS only in production
- Implement proper authentication and authorization

## 📊 Step 9: Monitoring and Logging

### 9.1 Application Logs
```bash
# View logs in Render dashboard
# Or use Render CLI
render logs -s your-service-name
```

### 9.2 Health Checks
Add a health check endpoint to your Spring Boot app:
```java
@RestController
public class HealthController {
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }
}
```

### 9.3 Configure Health Check in Render
- **Health Check Path**: `/health`
- **Health Check Interval**: 30 seconds

## 🚀 Step 10: Performance Optimization

### 10.1 Docker Image Optimization
Create a multi-stage Dockerfile for smaller images:
```dockerfile
# Build stage
FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app
COPY Server/pom.xml .
RUN mvn dependency:go-offline
COPY Server/src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/backend-1.0.0.jar app.jar
COPY Server/src/main/resources/static /app/static
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 10.2 JVM Optimization
Add JVM options for better performance:
```dockerfile
ENTRYPOINT ["java", "-Xmx512m", "-Xms256m", "-jar", "app.jar"]
```

### 10.3 Database Connection Optimization
Already configured in your `.env`:
- Connection pooling with HikariCP
- Optimized for Supabase transaction pooler

## 📱 Step 11: Frontend Integration

### 11.1 Update Frontend Configuration
Update your frontend to point to the Render URL:
```javascript
const API_BASE_URL = 'https://your-app.onrender.com';
```

### 11.2 CORS Configuration
Ensure your Spring Boot app allows your frontend domain:
```java
@CrossOrigin(origins = {"https://your-frontend.netlify.app", "https://your-frontend.vercel.app"})
```

## 🔄 Step 12: CI/CD Pipeline (Optional)

### 12.1 GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Render
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Trigger Render Deploy
        run: |
          curl -X POST "https://api.render.com/deploy/srv-YOUR_SERVICE_ID?key=YOUR_DEPLOY_KEY"
```

## 📋 Quick Reference Commands

### Local Development (Server Only)
```bash
# Navigate to Server directory
cd Server

# Build JAR
mvn clean package -DskipTests

# Build Docker image
docker build -t nerds-on-call-backend .

# Run locally
docker run -d -p 8080:8080 --env-file .env nerds-on-call-backend

# View logs
docker logs <container-id>
```

### Git Commands (Server Directory)
```bash
# From Server directory
git add .
git commit -m "Deploy backend to Render"
git push origin main
```

### Render CLI (Optional)
```bash
# Install Render CLI
npm install -g @render/cli

# Login
render auth login

# View services
render services list

# View logs
render logs -s your-service-name
```

---

**🎉 Congratulations! Your Spring Boot application is now deployed on Render using Docker!**

Your application will be available at: `https://your-app-name.onrender.com`
