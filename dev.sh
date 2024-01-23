#!/bin/bash
set -e

help () {
  echo "Usage ./dev.sh [command]"
  echo ""
  echo "Commands:"
  echo "  npm        Runs npm inside docker container."
  echo "  i          Runs npm install inside docker container."
  echo "  up         Starts and demonises everything you need."
  echo "  down       Stops and removes everything you started."
  echo "  logs       Show app logs."
}

case $1 in

  npm)
    docker compose run --rm "$@"
  ;;

  i)
    docker compose run --rm npm "$@"
  ;;

  up)
    docker compose up -d
  ;;

  down)
    docker compose down -t 5
  ;;

  logs)
     docker compose logs app
  ;;

  "")
    help
  ;;

  *)
    echo "[ERROR] Command '$1' is not supported."
    help
    exit 1
  ;;

esac

exit 0

