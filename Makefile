.PHONY: up rebuild logs dev format pull rm ollama piston frontend piston-installer

model = qwen2.5:3b
# container names
frontend-name = quiz-frontend
piston-name = quiz-piston
piston-install-name = quiz-piston-installer
ollama-name = quiz-ollama

up:
	@echo "Stopping containers and rebuilding..."
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d
	$(MAKE) ensure-model
dev:
	@echo "Starting development server..."
	$(MAKE) ollama
	$(MAKE) piston
	$(MAKE) piston-installer
	docker-compose stop $(frontend-name) 2>/dev/null || true
	pnpm dev
devc:
	@echo "Clean rebuild and starting development server..."
	$(MAKE) rm
	$(MAKE) dev

format:
	@echo "Running ESLint fix and Prettier format..."
	pnpm run lint:fix
	pnpm run format
	@echo "Code formatting completed!"

rebuild:
	@echo "Rebuilding all containers..."
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d
	$(MAKE) ensure-model

logs:
	docker-compose logs -f

pull:
	@echo "Pulling qwen2.5:3b model..."
	docker exec $(ollama-name) ollama pull $(model)

rm:
	@echo "Removing all quiz containers, images and volumes..."
	-docker stop $(frontend-name) $(piston-install-name) $(ollama-name) $(piston-name) 2>/dev/null || true
	-docker rm $(frontend-name) $(piston-install-name) $(ollama-name) $(piston-name) 2>/dev/null || true
	-docker rmi $$(docker images --format "table {{.Repository}}:{{.Tag}}" | grep -E "($(frontend-name)|$(piston-install-name)|$(ollama-name)|$(piston-name))" | tr -d ' ') 2>/dev/null || true
	-docker volume rm $$(docker volume ls -q | grep -E "(quiz|frontend|piston|ollama)") 2>/dev/null || true
	@echo "Cleanup completed!"

# ollama and local ai models commands
ollama:
	@if ! docker ps --format "table {{.Names}}" | grep -q "^$(ollama-name)$$"; then \
		echo "Starting Ollama container..."; \
		docker-compose up -d ollama; \
	else \
		echo "Ollama container is already running."; \
	fi
	$(MAKE) ensure-model

wait-ollama:
	@echo "Waiting for Ollama to be ready..."
	@for i in $$(seq 1 30); do \
		if docker exec $(ollama-name) ollama list >/dev/null 2>&1; then \
			echo "Ollama is ready!"; \
			break; \
		fi; \
		if [ $$i -eq 30 ]; then \
			echo "Ollama failed to start after 30 attempts"; \
			exit 1; \
		fi; \
		echo "Waiting for Ollama... ($$i/30)"; \
		sleep 2; \
	done

check-model:
	@echo "Checking if model $(model) exists..."
	@if docker exec $(ollama-name) ollama list | grep -q "$(model)"; then \
		echo "Model $(model) is already available."; \
		exit 0; \
	else \
		echo "Model $(model) not found."; \
		exit 1; \
	fi

ensure-model: wait-ollama
	@echo "Ensuring model $(model) is available..."
	@if ! $(MAKE) check-model >/dev/null 2>&1; then \
		echo "Model $(model) not found, pulling..."; \
		$(MAKE) pull; \
		echo "Model $(model) installed successfully!"; \
	else \
		echo "Model $(model) is already available."; \
	fi

# frontend commands
frontend:
	@if ! docker ps --format "table {{.Names}}" | grep -q "^$(frontend-name)$$"; then \
		echo "Starting Frontend container..."; \
		docker-compose up -d frontend; \
	else \
		echo "Frontend container is already running."; \
	fi

# piston commands
piston:
	@if ! docker ps --format "table {{.Names}}" | grep -q "^$(piston-name)$$"; then \
		echo "Starting Piston container..."; \
		docker-compose up -d piston; \
	else \
		echo "Piston container is already running."; \
	fi

piston-installed-langs:
	curl http://localhost:2000/api/v2/packages

piston-installer:
	@if ! docker ps --format "table {{.Names}}" | grep -q "^$(piston-install-name)$$"; then \
		echo "Starting Piston installer container..."; \
		docker-compose up -d piston-installer; \
	else \
		echo "Piston installer container is already running."; \
	fi

