# AI Quiz Master - Docker Setup

## 🚀 Quick Start with Local AI

### Prerequisites
- Docker & Docker Compose
- 8GB+ RAM (for Llama 3.1 8B model)
- 10GB+ free disk space

### Setup

1. **Clone the repository**
```bash
git clone <your-repo>
cd AI_QUIZ_MASTER
```

2. **Create environment file**
```bash
cp .env.example .env
# Edit .env and add your Gemini API key (optional for local model)
```

3. **Start services**
```bash
docker-compose up -d
```

4. **Wait for model download**
The first startup will download Llama 3.1 8B (~4.7GB). Monitor progress:
```bash
docker-compose logs -f ollama
```

5. **Access the application**
- Frontend: http://localhost:3000
- Ollama API: http://localhost:11434

### Model Selection

In the application interface, you can choose between:
- **Local AI (Llama 3.1 8B)** - Runs locally, no API limits
- **Google Gemini** - Cloud-based, requires API key

### Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild after code changes
docker-compose up --build

# Check Ollama model status
docker exec quiz-ollama ollama list
```

### Troubleshooting

**Model not downloading:**
```bash
docker exec -it quiz-ollama ollama pull llama3.1:8b
```

**Reset everything:**
```bash
docker-compose down -v
docker-compose up -d
```

**Check API health:**
```bash
curl http://localhost:11434/api/health
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key | - |
| `VITE_OLLAMA_URL` | Ollama service URL | http://localhost:11434 |

### Resource Usage

- **CPU:** 2-4 cores recommended
- **RAM:** 8GB minimum, 16GB recommended  
- **Disk:** ~10GB for model and containers
- **Network:** Only for initial model download

### Production Notes

For production deployment:
1. Use external storage for Ollama data
2. Set up proper SSL/TLS
3. Configure firewall rules
4. Monitor resource usage 