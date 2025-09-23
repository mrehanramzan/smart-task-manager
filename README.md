# Project Setup Guide
This repository contains three main components:  
1. **Frontend**  
2. **Backend**  
3. **MCP Server**  
Follow the steps below to get the project up and running locally using Docker.

---

## Prerequisites

### Docker Network Setup
Before setting up any services, create a shared Docker network that all services will use to communicate:

```bash
docker network create shared_network
```

This network allows the backend, and MCP server to communicate with each other.

---

## 1. Frontend Setup
1. Navigate to the `frontend` folder:
```bash
cd frontend
```
2. Copy the environment file:
```bash
cp .env.example .env
```
3. Build the Docker containers:
```bash
docker compose build
```
4. Start the services:
```bash
docker compose up
```
The frontend will be available at: **http://localhost:5173**

---

## 2. Backend Setup
1. Navigate to the `backend` folder:
```bash
cd backend
```
2. Copy the environment file:
```bash
cp .env.example .env
```
3. Build the Docker containers:
```bash
docker compose build
```
4. Start the services:
```bash
docker compose up
```
The backend API will be available at: **http://localhost:30013**

---

## 3. MCP Server Setup
1. Navigate to the `mcp-server` folder:
```bash
cd mcp-server
```
2. Copy the environment file:
```bash
cp .env.example .env
```
3. **Important:** Edit the `.env` file and add your Gemini API key:
```bash
GEMINI_API_KEY=your_actual_gemini_api_key_here
```
4. Build the Docker containers:
```bash
docker compose build
```
5. Start the services:
```bash
docker compose up
```
The MCP server will be available at: **http://localhost:8000**

---

## Service URLs
| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:30013 |
| MCP Server | http://localhost:8000 |

---

## Getting a Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key and add it to your `mcp-server/.env` file

---


## Troubleshooting
- Make sure Docker is installed and running
- **Ensure the shared Docker network is created** before starting any services
- Ensure all required ports (5173, 30013, 8000) are available
- Verify that the `GEMINI_API_KEY` is correctly set in the MCP server `.env` file
- Check service logs if any container fails to start
- If services can't communicate, verify they're all using the `shared_network`
