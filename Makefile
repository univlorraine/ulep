# Executables (local)
DOCKER_COMP = docker compose

# Docker containers
NEST_CONT = $(DOCKER_COMP) exec api

# Executables
PNPM = $(NEST_CONT) pnpm

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

## —— Api ————————————————————————————————————————————————————————————————
sh: ## Connect to the NEST container
	@$(NEST_CONT) sh

lint: ## Lint the code
	@$(NEST_CONT) pnpm run lint

lint-fix: ## Lint the code and fix issues
	@$(NEST_CONT) pnpm run lint:fix

migration-generate: ## Generates a new migration file with sql needs to be executed to update schema.
	@$(NEST_CONT) npx typeorm migration:generate -d dist/adapters/persistence/configuration.js src/database/migrations/$(name)

migration-run: ## Runs all pending migrations.
	@$(NEST_CONT) npx typeorm migration:run -d dist/adapters/persistence/configuration.js

migration-revert: ## Reverts last executed migration.
	@$(NEST_CONT) npx typeorm migration:revert -d dist/adapters/persistence/configuration.js

schema-drop: ## Drops all tables in the database.
	@$(NEST_CONT) npx typeorm schema:drop -d dist/adapters/persistence/configuration.js

db-purge: ## Drops all tables in the database and runs all migrations.
	make schema-drop && make migration-run