невидимый текст
https://www.techniquehow.com/send-a-blank-message-on-whatsapp-messenger/

// service - доступ к меню/текстам/апи - делает вещь (и отправляет сообщение)

// handlers - как-то мониторит что юзер сделал, редактирует сообщение, делегирует сервису действие


// невидимый символ - &#8205;

#postgresql before installation
1. make directory of data - mkdir /var/pgData
2. docker run --name homie-postgres -e POSTGRES_PASSWORD=xiagn17homie -e POSTGRES_USER=xiagn17 -e POSTGRES_DB=homie_db -e PGDATA=/data/pgdata -v /var/pgData:/data/pgdata -p 15433:5432 -d --restart always postgres:13

##docker postgresql restore/dump
https://davejansen.com/how-to-dump-and-restore-a-postgresql-database-from-a-docker-container/
####example
dump - docker exec -i homie-postgres /bin/bash -c "PGPASSWORD=xiagn17homie pg_dump --username xiagn17 homie_db" > /var/dump-27.05.sql
restore - docker exec -i homie-postgres /bin/bash -c "PGPASSWORD=xiagn17homie psql --username xiagn17 homie_db" < /var/dump-27.05.sql

##docker copy data from volume
https://stackoverflow.com/questions/35406213/how-to-copy-data-from-docker-volume-to-host

####for example named - homie-bot_redis_data:
CID=$(docker run -d -v homie-bot_redis_data:/homie-bot_redis_data busybox true)

docker cp $CID:/homie-bot_redis_data ./

docker rm $CID

### boot redis from backup 
Просто в volume указываем путь к папке с бекапом на хосте - сразу оттуда подгрузит


### рестарт бэка компоузера
docker-compose -f docker-compose.prod.yml -f docker-compose.yml up -d --build backend

# how redeploy certificates
https://pentacent.medium.com/nginx-and-lets-encrypt-with-docker-in-less-than-5-minutes-b4b8a60d3a71
#### initial
change ./init-letsencrypt.sh - domains, data_path, email
chmod +x init-letsencrypt.sh
sudo ./init-letsencrypt.sh
#### after initial
docker-compose up (to start certbot renew/nginx update)
