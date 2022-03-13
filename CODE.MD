невидимый текст
https://www.techniquehow.com/send-a-blank-message-on-whatsapp-messenger/

// service - доступ к меню/текстам/апи - делает вещь (и отправляет сообщение)

// handlers - как-то мониторит что юзер сделал, редактирует сообщение, делегирует сервису действие


// невидимый символ - &#8205;

##docker postgresql restore/dump
https://davejansen.com/how-to-dump-and-restore-a-postgresql-database-from-a-docker-container/

##docker copy data from volume
https://stackoverflow.com/questions/35406213/how-to-copy-data-from-docker-volume-to-host

####for example named - homie-bot_redis_data:
CID=$(docker run -d -v homie-bot_redis_data:/homie-bot_redis_data busybox true)

docker cp $CID:/homie-bot_redis_data ./

docker rm $CID

### boot redis from backup 
Просто в volume указываем путь к папке с бекапом на хосте - сразу оттуда подгрузит
