.PHONY: up down build rebuild logs clean ollama-only dev

up:
	docker-compose up -d

ollama-only:
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

pull-model:
	docker exec quiz-ollama ollama pull llama3.1:8b

start: rebuild

help:
	@echo "Available commands:"
	@echo "  make up         - Start containers"
	@echo "  make down       - Stop containers"
	@echo "  make build      - Build containers"
	@echo "  make rebuild    - Stop, rebuild from scratch, and start"
	@echo "  make start      - Same as rebuild"
	@echo "  make logs       - Show container logs"
	@echo "  make ollama-only - Start only Ollama service"
	@echo "  make dev        - Start Ollama and run development server via pnpm"
	@echo "  make pull-model - Download Llama 3.1 8B model (after ollama is running)"
	@echo "  make clean      - Stop containers and clean Docker system"
	@echo "  make help       - Show this help" 