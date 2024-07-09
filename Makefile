# Executables (local)
DOCKER_COMP = docker compose

# Docker containers
NEST = $(DOCKER_COMP) exec api
CHAT = $(DOCKER_COMP) exec chat

SERVICE ?= $(shell bash -c 'read -p "Service: " service; echo $$service')

help: ## Outputs this help screen
	@grep -E '(^[a-zA-Z0-9\./_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'

## —— Docker ————————————————————————————————————————————————————————————————
build: ## Builds the Docker images
	@$(DOCKER_COMP) build --pull --no-cache

up: ## Start the docker hub in detached mode (no logs)
	@$(DOCKER_COMP) up --detach

start: build up ## Build and start the containers

down: ## Stop the docker hub
	@$(DOCKER_COMP) down --remove-orphans

reset: ## Stops the docker hub and deletes all its data including all images
	@$(DOCKER_COMP) down --remove-orphans --volumes --rmi all

logs: ## Show live logs
	@$(DOCKER_COMP) logs --tail=0 --follow

recreate: ## Recreate a service
	@$(DOCKER_COMP) up --detach --force-recreate --no-deps $(SERVICE)

## —— Api ————————————————————————————————————————————————————————————————
sh: ## Connect to the NEST container
	@$(NEST) sh

lint: ## Lint the code and fix issues
	@$(NEST) pnpm lint

migration: ## Create a migration from changes in schema and apply it to the database.
	@$(NEST) pnpm migrate

migration-chat: ## Create a migration from changes in schema and apply it to the database.
	@$(CHAT) pnpm migrate

seed: ## Seed the database with test data
	@$(NEST) pnpm seed

seed-random: ## Seed the database with test and random data
	@$(NEST) pnpm seed:random
