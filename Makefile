.PHONY: up down build rebuild logs clean dev format pull run-model
model = qwen2.5:3b

up:
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d
piston:
	docker-compose down piston
	docker-compose build --no-cache piston
	docker-compose up -d piston
dev:
	@echo "Starting Ollama and development server..."
	docker-compose up -d ollama
	docker-compose up -d piston
	docker-compose up -d piston-installer
	pnpm dev
devb:
	@echo "Starting Ollama and development server..."
	docker-compose up -d ollama --build
	docker-compose up -d piston --build
	docker-compose up -d piston-installer --build
	pnpm dev
get-av-langs:
	curl http://localhost:2000/api/v2/packages

format:
	@echo "Running ESLint fix and Prettier format..."
	pnpm run lint:fix
	pnpm run format
	@echo "Code formatting completed!"

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

pull:
	@echo "Pulling qwen2.5:3b model..."
	docker exec quiz-ollama ollama pull $(model)

run-model:
	@echo "Running model: $(model)"
	docker exec -it quiz-ollama ollama run $(model)
