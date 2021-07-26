install: install-deps

start:
	npx nodemon bin/app.js & npm run serve

start-backend:
	npx nodemon bin/app.js

start-frontend:
	npm run serve

build:
	npm run build
