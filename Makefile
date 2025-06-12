.PHONY: up down build rebuild logs clean ai dev pull-model optimize gpu-check run-model piston piston-logs piston-runtimes code-dev
model = qwen2.5:3b

up:
	docker-compose up -d

ai:
	docker-compose up -d ollama

piston:
	docker-compose up -d piston

code-dev:
	@echo "Starting Ollama and development server..."
	docker-compose up -d ollama
	pnpm dev

dev:
	@echo "Starting Ollama and development server..."
	docker-compose up -d ollama
	docker-compose up -d piston
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
	@echo "Pulling qwen2.5:3b model..."
	docker exec quiz-ollama ollama pull $(model)

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

piston-logs:
	@echo "Showing Piston logs..."
	docker logs -f quiz-piston

piston-runtimes:
	@echo "Available Piston runtimes:"
	curl -s http://localhost:2000/api/v2/runtimes | jq .

# Install languages in local Piston Docker container using CLI
piston-install-languages:
	@echo "Installing programming languages in Piston container..."
	@echo "Cleaning any existing temporary directory..."
	@rm -rf ./temp-piston
	@echo "Cloning Piston repository with CLI..."
	@git clone https://github.com/engineer-man/piston.git ./temp-piston
	@echo "Trying to install CLI dependencies (may fail on Windows)..."
	@cd ./temp-piston/cli && (npm.cmd install || npm install || echo "npm install failed, trying without dependencies...")
	@echo "Installing JavaScript/Node.js..."
	@cd ./temp-piston && (node cli/index.js -u http://localhost:2000 ppman install node || echo "Node.js install failed")
	@echo "Installing TypeScript..."
	@cd ./temp-piston && (node cli/index.js -u http://localhost:2000 ppman install typescript || echo "TypeScript install failed")
	@echo "Installing Python..."
	@cd ./temp-piston && (node cli/index.js -u http://localhost:2000 ppman install python || echo "Python install failed")
	@echo "Installing Java..."
	@cd ./temp-piston && (node cli/index.js -u http://localhost:2000 ppman install java || echo "Java install failed")
	@echo "Installing C++..."
	@cd ./temp-piston && (node cli/index.js -u http://localhost:2000 ppman install c++ || echo "C++ install failed")
	@echo "Installing C#..."
	@cd ./temp-piston && (node cli/index.js -u http://localhost:2000 ppman install csharp || echo "C# install failed")
	@echo "Installing Go..."
	@cd ./temp-piston && (node cli/index.js -u http://localhost:2000 ppman install go || echo "Go install failed")
	@echo "Installing Rust..."
	@cd ./temp-piston && (node cli/index.js -u http://localhost:2000 ppman install rust || echo "Rust install failed")
	@echo "Installing PHP..."
	@cd ./temp-piston && (node cli/index.js -u http://localhost:2000 ppman install php || echo "PHP install failed")
	@echo "Installing Ruby..."
	@cd ./temp-piston && (node cli/index.js -u http://localhost:2000 ppman install ruby || echo "Ruby install failed")
	@echo "Language installation process completed!"
	@echo "Cleaning up temporary files..."
	@rm -rf ./temp-piston

piston-setup: piston piston-install-languages
	@echo "Piston is ready with programming languages!"

help:
	@echo "Available commands:"
	@echo "  make up              - Start all containers"
	@echo "  make down            - Stop all containers"
	@echo "  make build           - Build containers"
	@echo "  make rebuild         - Stop, rebuild from scratch, and start"
	@echo "  make start           - Same as rebuild"
	@echo "  make logs            - Show container logs"
	@echo "  make ai              - Start only Ollama service"
	@echo "  make piston          - Start only Piston service"
	@echo "  make dev             - Start Ollama and run development server via pnpm"
	@echo "  make code-dev        - Start Ollama, Piston and run development server"
	@echo "  make pull-model      - Download qwen2.5:3b model"
	@echo "  make run-model       - Run qwen2.5:3b model"
	@echo "  make optimize        - Test GPU optimization with qwen2.5:3b model"
	@echo "  make gpu-check       - Check if GPU is available in Docker"
	@echo "  make piston-logs     - Show Piston container logs"
	@echo "  make piston-runtimes - Show available Piston runtimes"
	@echo "  make piston-install-languages - Install programming languages in Piston"
	@echo "  make piston-setup    - Start Piston and install all languages"
	@echo "  make clean           - Stop containers and clean Docker system"
	@echo "  make help            - Show this help" 