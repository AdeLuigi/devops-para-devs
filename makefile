build:
	docker build -t tasks-api .
run:
	docker run -p 3001:3001 tasks-api
stop:
	docker stop $(docker ps -q --filter ancestor=tasks-api)
test:
	cd app && yarn install --frozen-lockfile && yarn test
up:
	docker compose up --build
down:
	docker compose down
setup:
	yarn install