# AI Quiz Master - Docker Setup

## 🚀 Quick Start with Local AI

### Prerequisites
- Docker & Docker Compose
- 8GB+ RAM (for qwen2.5:3b model)
- 4GB+ free disk space

### Setup

1. **Clone the repository**
```bash
git clone <your-repo>
cd AI_QUIZ_MASTER
```

2. **Start services**
```bash
docker-compose up -d
```

3. **Wait for model download**
The first startup will download qwen2.5:3b (~2GB). Monitor progress:
```bash
docker-compose logs -f ollama
```

4. **Access the application**
- Frontend: http://localhost:3000
- Ollama API: http://localhost:11434

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
docker exec -it quiz-ollama ollama pull qwen2.5:3b
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
| `VITE_OLLAMA_URL` | Ollama service URL | http://localhost:11434 |

### Resource Usage

- **CPU:** 2-4 cores recommended
- **RAM:** 8GB minimum, 16GB recommended  
- **Disk:** ~5GB for model and containers
- **Network:** Only for initial model download

### Production Notes

For production deployment:
- Use reverse proxy (nginx/apache)
- Configure proper firewall rules
- Consider using docker swarm or kubernetes for scaling
- Monitor resource usage and adjust limits accordingly 