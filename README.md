# Pitchbox Test Day

There are a lot of useful info in `./docs`.

- [Basic information](docs/Information.md) about the app you are building with screenshots.
- [Tasks](docs/Tasks.md) we what you to do.
- A ready-to-use [Postman Collection](docs/Email%20Verification%20Api.postman_collection.json).

## Installation

1. Copy `.env.example` > `.env`
2. Run `docker compose run --rm npm install`
3. Fill `PROSPECT_API_KEY`, `PROSPECT_BASE_URL` with given values.
4. Change ports in `.env`, if some of them are already taken.
5. Run `docker-compose up -d`

## Workspaces

This module uses workspaces to share modules between backend and frontend. 

- [Workspaces Docs](https://docs.npmjs.com/cli/v10/using-npm/workspaces)

You have to add `--workspace <dir>` to every `npm` command.

```shell
npm i mysql2 --workspace packages/backend-nest
npm i sequelize --workspace packages/backend-express
npm i @mui/material @emotion/react @emotion/styled --workspace packages/frontend-react
```

## Shell Helper

There is a `dev.sh` file that will help you to run command inside docker.

```shell
./dev up     # Up docker stack
./dev down   # Down docker stack
./dev logs   # Check out app logs
./dev i      # Install any package with npm inside docker container 
./dev npm    # Run any npm command inside docker container
```

## Use Express Skeleton

Edit `.env` and change `COMPOSE_PROFILES` variable.

```dotenv
# before
COMPOSE_PROFILES=infra,backend-nest,frontend

# what you want
COMPOSE_PROFILES=infra,backend-express,frontend
```


## Use Local Node

Edit `.env` and change `COMPOSE_PROFILES` variable.

```dotenv
# before
COMPOSE_PROFILES=infra,backend-nest,frontend

# what you want
COMPOSE_PROFILES=infra
```

This will tell docker to only run MySQL and Redis.
