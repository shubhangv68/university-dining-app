# FoodForU

This project is a UMass Dining App alternative which supports ratings, reviews, and personalized recommendations. These features are not available in the current UMass Dining App, and they can help students figure out what to eat at the dining halls.

## Installation and configuration

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) and run it
2. Clone/download the repo
3. Run `docker compose up --build` from the root of the repo
4. Wait for demo data to be created
5. Navigate to http://localhost:3000 in your browser

![Screenshot](/docs/screenshot.png)

## How to run tests

1. Run `docker compose -f "docker-compose-test.yaml" up --build --abort-on-container-exit` for backend unit tests and integration
2. Move from root directory into 'frontend' and run `npx playwright test` to run frontend unit tests in a different terminal session

## Video demo

https://drive.google.com/file/d/1hO43oce-zxMZcwix5s1q4Ns-kMiiTP6s/view?usp=sharing
