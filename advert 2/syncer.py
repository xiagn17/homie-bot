import database
import apihandler
from loguru import logger
import json
import time
import config
from aiogram import Bot
from sys import stderr
import asyncio
import pprint
from aiogram.utils.markdown import hlink

logger.remove()
logger.add(stderr, format="<white>{time:HH:mm:ss}</white>"
                          " | <level>{level: <8}</level>"
                          " | <cyan>{line}</cyan>"
                          " - <white>{message}</white>")

db = database.DataBase(database.config, logger.debug)
ah = apihandler.ApiHandler(apihandler.config.url, apihandler.config.ex)

async def send_message(message):
    for user in config.notify_users:
        try:
            operator = Bot(config.api_bot)
            await operator.send_message(user, message)
        except Exception as err:
            pass
            #logger.debug(err)


def region_to_string(region):
    if region == 1:
        return 'Центр'
    elif region == 2:
        return 'Север'
    elif region == 3:
        return 'Юг'
    elif region == 4:
        return 'Запад'
    else:
        return 'Восток'


def object_to_string(object):
    if object == 1:
        return 'room'
    elif object == 2:
        return 'apartments'
    else:
        return 'bed'


def gender_to_string(gender):
    if gender == 1:
        return 'male'
    elif gender == 2:
        return 'female'
    else:
        return 'no_difference'


def sync():
    logger.debug("SYNCING")
    result = ah.get()
    status_code = result.status_code
    logger.debug(f"GOT RESPONSE FROM SERVER: {status_code}")
    if status_code == 200:
        logger.debug(f"STATUS CODE FINE")
        proto = '{"data":'+result.text+'}'

        # структура где хранятся все их записи
        api_records = json.loads(proto)['data']
        db_records = db.get_all()
        logger.debug(f"API RECORDS: {len(api_records)}")
        logger.debug(f"DB  RECORDS: {len(db_records)}")
        for db_record in db_records:
            if (db_record[15]!=0 and db_record[16]is None) or (db_record[15]!=len(db_record[16])):
                logger.debug('SKIPPED RECORD WHILE SYNCING BECAUSE OF IMGS')
                continue
            unique = True
            for api_record in api_records:
                if db_record[1] == api_record['comment']:
                    unique = False
                    break
            if unique:
                logger.debug("UNIQUE RECORD, POSTING TO API...")
                contacts = []
                contacts.append(db_record[3])
                contacts.append(db_record[8])
                contacts = [x for x in contacts if x is not None]
                contacts = [x for x in contacts if x != 'None']
                contacts = [x for x in contacts if x != '']
                contacts = list(map(str, contacts))
                contact = ' ; '.join(contacts)
                photos = db_record[16]
                if photos is None:
                    photos = []
                
                data = {
                    "name": f"* - {contact}",
                    "phoneNumber": contact,
                    "objectType": object_to_string(db_record[9]),
                    "price": str(db_record[2]),
                    "location": region_to_string(db_record[6]),
                    "address": db_record[5],
                    "photoIds": photos,
                    "comment": db_record[1],
                    "roomsNumber": str(db_record[10]),
                    "preferredGender": gender_to_string(db_record[4]),
                    "chatId": "1913600187"
                }
                # data_json = json.dumps(data)
                logger.debug(data)
                try:
                    r = ah.post(data)
                    logger.debug(r)
                    logger.debug(f'RESPONSE - {r.text}')
                    asyncio.run(send_message(f"Отправлен запрос на добавление новой записи\n{pprint.pformat(data, indent=4)}\n Ответ сервера: {r.text}"))
                except Exception as err:
                    logger.debug(f'RESPONSE - ERROR: {err}')
                pass
            else:
                logger.debug("NON UNIQUE RECORD")
    else:
         asyncio.run(send_message(f"Не удалось связаться с сервером, статус код: {status_code}"))
    logger.debug("SYNCED")

logger.debug("LAUNCHED SYNCER")
while (True):
    time.sleep(5*60)
    logger.debug("STARTED SYNC")
    try:
        sync()
    except Exception as err:
        logger.debug(err)
