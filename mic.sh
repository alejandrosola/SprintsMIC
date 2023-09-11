#!/bin/bash

root="$(pwd)"
port_backend=8000
port_client=3000
port_client_backoffice=3001
# Evaluo el comando entrante
case "$1" in

     install)
        echo "Instalando dependencias del backend..."
        cd $root/backend
        npm i
        
        echo "Instalando dependencias del client..."
        cd $root/clientgit
        npm i

        echo "Instalando dependencias del client backoffice..."
        cd $root/client-backoffice
        npm i
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

        echo "Levantando Client en puerto: $port_client..."
        cd $root/client
        npm run build
        forever start -c "npm start" ./

        echo "Levantando Client Backoffice en puerto: $port_client_backoffice..."
        cd $root/client-backoffice
        npm run build
        forever start -c "npm start" ./
        ;;

    status)
        forever list
        ;;
    
    stop)
        echo "Bajando backend..."
        echo "Bajando client..."
        echo "Bajando client backoffice..."
        forever stopall
        ;;

    restart)
        bash ./mic.sh stop
        bash ./mic.sh start
        ;;

esac
