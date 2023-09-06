#!/bin/bash

root="$(pwd)"
port_backend=8000
port_client=3000
# Evaluo el comando entrante
case "$1" in

     install)
        echo "Instalando dependencias del backend..."
        cd $root/backend
        npm i
        echo "Instalando dependencias del client..."
        cd $root/client
        ;;

    update)
        echo "Actualizando repositorio a ultima version, rama: $(git rev-parse --abbrev-ref HEAD)" 
        git pull origin $(git rev-parse --abbrev-ref HEAD)
        ;;

    reset)
        cd $root/backend
        npm run migrate:undo
        npm run migrate:up
        npm run seeders:up
        ;;
    
    start)
        echo "Levantando backend en puerto: $port_backend..."
        cd $root/backend
        npm run build
        forever start dist/src/main.js
        echo "Levantando client en puerto: $port_client..."
        cd $root/client
        npm run build
        forever start -c "npm start" ./
        ;;

    status)
        forever list
        ;;
    
    stop)
        echo "Bajando backend..."
        echo "Bajando client..."
        forever stopall
        ;;

    restart)
        bash ./mic.sh stop
        bash ./mic.sh start
        ;;

esac
