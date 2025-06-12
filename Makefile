.PHONY: up down build rebuild logs clean ai dev pull-models optimize gpu-check run-model
model = qwen2.5:3b # options: llama3.2:3b, qwen2.5:3b, phi3:mini

up:
	docker-compose up -d

ai:
	docker-compose up -d ollama

dev:
	@echo "Starting Ollama and development server..."
	docker-compose up -d ollama
	pnpm dev

down:
	docker-compose down

build:
	docker-compose build

rebuild:
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

logs:
	docker-compose logs -f

clean:
	docker-compose down
	docker system prune -f
	docker volume prune -f

pull-models:
	@echo "Pulling models..."
	docker exec quiz-ollama ollama pull $(model)
	docker exec quiz-ollama ollama pull llama3.2:3b # q2
	docker exec quiz-ollama ollama pull qwen2.5:3b  # q1
	docker exec quiz-ollama ollama pull phi3:mini # q3

optimize:
	@echo "Optimizing Ollama for Using GPU..."
	docker exec quiz-ollama ollama run $(model) "Test GPU setup" --verbose

gpu-check:
	@echo "Checking GPU availability..."
	docker run --rm --gpus all nvidia/cuda:12.0-base-ubuntu20.04 nvidia-smi

start: rebuild

run-model:
	@echo "Running model: $(model)"
	docker exec -it quiz-ollama ollama run $(model)

help:
	@echo "Available commands:"
	@echo "  make up         - Start containers"
	@echo "  make down       - Stop containers"
	@echo "  make build      - Build containers"
	@echo "  make rebuild    - Stop, rebuild from scratch, and start"
	@echo "  make start      - Same as rebuild"
	@echo "  make logs       - Show container logs"
	@echo "  make ai         - Start only Ollama service"
	@echo "  make dev        - Start Ollama and run development server via pnpm"
	@echo "  make pull-models - Download models optimized for Using GPU"
	@echo "  make run-model  - Run selected model (use model=name to override)"
	@echo "  make optimize   - Test GPU optimization with selected model"
	@echo "  make gpu-check  - Check if GPU is available in Docker"
	@echo "  make clean      - Stop containers and clean Docker system"
	@echo "  make help       - Show this help" 