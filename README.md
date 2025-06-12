# AI Quiz Master

An intelligent quiz generation application powered by local AI models. Generate and take interactive quizzes on any topic in multiple languages using the qwen2.5:3b model running locally via Ollama.

![AI Quiz Master](https://img.shields.io/badge/AI-Quiz%20Master-blue)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)

## ✨ Features

- **🤖 Local AI Generation**: Uses qwen2.5:3b model running locally via Ollama - no external API dependencies
- **🌍 Multi-language Support**: Generate quizzes in 19 languages including English, Russian, Spanish, French, German, and more
- **📚 Any Topic**: Create quizzes on any subject - from history to science, technology to arts
- **🎯 Interactive Experience**: Clean, responsive UI with immediate feedback and explanations
- **🔒 Privacy First**: All data processing happens locally - no data sent to external services
- **⚡ Fast Performance**: Optimized for quick quiz generation and smooth user experience
- **🐳 Docker Ready**: One-command setup with Docker Compose

## 🛠️ Technology Stack

- **Frontend**: React 18+ with TypeScript
- **Styling**: SCSS with modular architecture
- **AI Model**: qwen2.5:3b via Ollama
- **Build Tool**: Vite
- **Package Manager**: pnpm
- **Containerization**: Docker & Docker Compose
- **Linting**: ESLint + Prettier

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** (recommended)
- **4GB+ RAM** (for qwen2.5:3b model)
- **3GB+ free disk space**

### Option 1: Docker Setup (Recommended)

1. **Clone the repository**
```bash
git clone https://github.com/IliyaBrook/AI_QUIZ_MASTER.git
cd AI_QUIZ_MASTER
```

2. **Start all services**
```bash
make dev
# or manually:
docker-compose up -d ollama
pnpm dev
```

3. **Wait for model download**
The first startup will download qwen2.5:3b (~2GB). Monitor progress:
```bash
docker-compose logs -f ollama
```

4. **Access the application**
- **Frontend**: http://localhost:3000
- **Ollama API**: http://localhost:11434

### Option 2: Manual Setup

1. **Install Ollama**
```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows - download from ollama.ai
```

2. **Pull the model**
```bash
ollama pull qwen2.5:3b
```

3. **Start Ollama server**
```bash
ollama serve
```

4. **Install dependencies and start frontend**
```bash
pnpm install
pnpm dev
```

## 📋 Available Commands

### Development
```bash
make dev          # Start Ollama + development server
make up           # Start all Docker services
make down         # Stop all services
make logs         # View container logs
```

### Model Management
```bash
make pull-model   # Download qwen2.5:3b model
make run-model    # Interactive chat with model
make optimize     # Test GPU optimization
```

### Maintenance
```bash
make clean        # Stop containers and clean system
make rebuild      # Full rebuild and restart
make gpu-check    # Check GPU availability
```

## 🎮 How to Use

1. **Enter a Topic**: Type any subject you want to create a quiz about
2. **Select Language**: Choose from 19 supported languages
3. **Generate Quiz**: Click "Generate Quiz" and wait for AI processing
4. **Take the Quiz**: Answer questions with immediate feedback
5. **View Results**: See your score and review explanations

### Supported Languages

- **European**: English, Russian, Spanish, French, German, Italian, Portuguese, Dutch, Polish, Swedish, Danish, Norwegian, Finnish
- **Asian**: Japanese, Korean, Chinese, Hindi
- **Middle Eastern**: Arabic, Turkish

## 🐳 Docker Configuration

### Services

- **ollama**: AI model server (qwen2.5:3b)
- **quiz-app**: React frontend application

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_OLLAMA_URL` | Ollama service URL | `http://localhost:11434` |

### Resource Requirements

- **CPU**: 2 cores minimum (any modern processor)
- **RAM**: 4GB minimum, 6GB recommended
- **Disk**: ~3GB for model and containers
- **GPU**: Not required (CPU-only operation)

## 🐛 Troubleshooting

### Model Issues

**Model not downloading:**
```bash
docker exec -it quiz-ollama ollama pull qwen2.5:3b
```

**Check model status:**
```bash
docker exec quiz-ollama ollama list
```

### API Issues

**Check Ollama health:**
```bash
curl http://localhost:11434/api/health
```

**View Ollama logs:**
```bash
docker-compose logs -f ollama
```

### Reset Everything

```bash
make clean
docker-compose up -d
```

## 🚀 Production Deployment

1. **Use reverse proxy** (nginx/apache) for HTTPS
2. **Configure firewall rules** to secure ports
3. **Set resource limits** in docker-compose.yml
4. **Monitor system resources** and adjust accordingly
5. **Consider scaling** with Docker Swarm or Kubernetes

### Production Environment Variables

```bash
VITE_OLLAMA_URL=http://your-ollama-server:11434
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow existing code style (ESLint + Prettier)
- Write tests for new features
- Update documentation as needed
- Use SCSS for styling (no CSS files)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ollama** for providing easy local AI model deployment
- **Qwen Team** for the excellent qwen2.5:3b model
- **React Community** for the amazing ecosystem
- **Docker** for containerization simplicity

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing GitHub issues
3. Create a new issue with detailed information

---

**Made with ❤️ for the AI community** 