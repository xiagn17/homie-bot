import config
from telethon import TelegramClient, events, sync
import time
from telethon.sync import TelegramClient, events
from telethon.sessions import StringSession
from telethon import functions, utils
from telethon.tl.types import Channel, User, PeerUser, PeerChannel

from sys import stderr
from loguru import logger

import asyncio

from parser import *
import database
import imagehosting

logger.remove()
logger.add(stderr, format="<white>{time:HH:mm:ss}</white>"
                          " | <level>{level: <8}</level>"
                          " | <cyan>{line}</cyan>"
                          " - <white>{message}</white>")

api_id = config.api_id
api_hash = config.api_hash
account_name = config.account_name
to_listen = config.to_listen

db = database.DataBase(database.config, logger.debug)

hosting = imagehosting.ImageHosting(imagehosting.config.API)

client = TelegramClient(account_name, api_id, api_hash)
client.start()


@client.on(events.NewMessage(chats=to_listen))
async def my_event_handler(event):
    # print(event)
    extra_contact = ''
    try:
        is_forward_from_user = type(event.fwd_from.from_id)==PeerUser
        
        if is_forward_from_user:
            await client.get_messages(await event.message.get_sender(), 5)
            extra_contact= await client.get_entity(event.fwd_from.from_id)
            if extra_contact.username != None:
                extra_contact="@"+extra_contact.username
    except:
        pass
    
    
    text = event.message.text
    media = event.media
    chat_id = event.chat.id
    message_id = event.id
    grouped_id = event.grouped_id

    media_flag = media is not None
    grouped_id_flag = grouped_id is not None

    print(media_flag, grouped_id_flag, grouped_id)

    logger.debug(f"NEW MESSAGE FROM {chat_id}_{message_id}:\n"+text)
    logger.debug(f"GROUPED ID {grouped_id}")

    # обработка текстовой части + текстовая часть в бд
    inserted_id = -1
    already_exists = False
    if text != '' and 'skip:' not in text:
        advert = AdvertParsing(text)
        advert.parse()
        # проверяем юзернеймы
        checked_usernames = []
        for username in advert.link:
            # if 'tg://user?id=' in username:
            #     id=username.replace('tg://user?id=','')
            #     id=int(id)
            #     data = await client.get_entity(PeerUser(id))
            try:
                # if 'tg://user?id=' in username:
                #     checked_usernames.append(username)
                #     continue
                if username.endswith('bot'):
                    continue
                if 'vk.com' in username:
                    checked_usernames.append(username)
                    continue
                data = await client.get_entity(username)
                logger.debug(data)
                is_user = isinstance(data,User)
                if is_user:
                    checked_usernames.append(username)
            except Exception as err:
                logger.debug(f'Error checking {username} because {err}')
        advert.link=' ; '.join(checked_usernames)

        logger.debug(f"skip: {advert.skip}, isrent: {advert.is_rent}, is_hostel: {advert.is_hostel},\
        price: {advert.price}, prefered_gender: {advert.prefered_gender}, metro: {advert.metro}, \
        address: {advert.address}, link: {advert.link}, phone_number: {advert.phone_number}, object: {advert.object}, room_amount: {advert.room_amount}, \
            area: {advert.area}, region : {advert.region}, photo: {advert.photos}")
        # если не хостел, не снятие
        if advert.skip != True:
            # если есть хотяб какое-то упоминание владельца для связи
            if advert.link != '' or advert.phone_number != '' or extra_contact!='':
                # print(advert.db_type_advert())
                conv_advert = advert.db_type_advert()
                if conv_advert[7]=='' and extra_contact!='':
                    conv_advert[7]=extra_contact
                    logger.debug("NO CONTACT FOUND IN POST, BUT FOUND AS AUTHOR")
                already_exists = db.check_in_database(conv_advert)
                # print(result)
                logger.debug("EXISTS IN DB ALREADY = "+str(already_exists))
                if not already_exists:
                    conv_advert.append(grouped_id)
                    conv_advert.append(0)
                    inserted_id = db.add_to_database(conv_advert)
                    logger.debug(f"ADDED TO DB AT INDEX {inserted_id}")
            else:
                logger.debug(f"NO CONTACTS FOUND")
        try:
            await client.send_message(PeerChannel(1634720161), f"skip: {advert.skip}\n isrent: {advert.is_rent}\n is_hostel: {advert.is_hostel}\n\
    price: {advert.price}\n prefered_gender: {advert.prefered_gender}\n metro: {advert.metro}\n \
    address: {advert.address}\n link: {advert.link}\n phone_number: {advert.phone_number}\n object: {advert.object}\n room_amount: {advert.room_amount}\n \
        area: {advert.area}\n region : {advert.region}\n photo: {advert.photos}")
        except Exception as e:
            logger.debug(e)
    async def image_process(insert_id,media,chat_id,message_id,grouped_id):
        download_res = ''
        link = ''
        if media is not None:
            logger.debug(
                f"{chat_id}_{message_id} HAS MEDIA TO DOWNLOAD")
            download_res = await client.download_media(
                media, f'./media/{chat_id}_{message_id}_{grouped_id}')
            if download_res != "":
                db.append_photo_local(insert_id, download_res)
            logger.debug(
                f"{chat_id}_{message_id} MEDIA DOWNLOAD SUCCESS {download_res}")
            db.add_photo_amount(insert_id)
            logger.debug(
                f"{download_res} UPLOADING TO HOSTING")
            try:
                link = await hosting.upload(download_res)
                logger.debug(
                   f"{download_res} UPLOAD TO HOSTING SUCCESS: {link}")
            except Exception as err:
                logger.debug(
                    f"{download_res} UPLOAD TO HOSTING FAILED: {err}")
                db.decrease_photo_amount(insert_id)
        if link != "":
            db.append_photo_hosting(insert_id, link)
        logger.debug(
            f"ADDED PICTURES {link} and {download_res} TO DB")
    # media_flag=False
    # media=None
    # try:
    # обработка медиа
    if grouped_id_flag == False and media_flag == False:
        # нет медиа, возможно оно выше в отдельном посте
        if inserted_id != -1:
            # интересуют вставленные в бд сообщения
            # только, которые прошли проверки
            result = await client.get_messages(chat_id,ids=[event.message.id-n for n in range(1,11)])
            #logger.debug(result)
            #grouped_id=None # выше вроде есть это уже, лишнее
            m_ids=[]
            for m in result:
                if m.text!="":
                    if m.grouped_id is not None and m.grouped_id==grouped_id:# найдено сообщение с текстом
                        # упс, это чужие картинки, отмена
                        m_ids=[]
                    break
                elif m.grouped_id is None and m.media is None:
                    break 
                    # или прошлое сообщение ничего не содержит из медиа
                elif m.grouped_id is None and m.media is not None:
                    m_ids.append(m)
                    break # в прошлом сообщении только одна картинка, больше нет
                elif m.grouped_id is not None and m.media is not None:
                    if grouped_id is None: # только начали собирать картинки
                        grouped_id=m.grouped_id
                    if grouped_id!=m.grouped_id: # мы встретили какой-то левый альбом
                        break
                    m_ids.append(m)
                else:
                    logger.debug("Impossible media case")
            logger.debug(f"BEFORE THIS POST {len(m_ids)} MEDIAS FOUND")
            if len(m_ids)!=0:
                await asyncio.gather(*[image_process(inserted_id,item.media,chat_id,item.id,grouped_id) for item in m_ids])
    elif grouped_id_flag == False and media_flag == True:
        if inserted_id != -1:
            await image_process(inserted_id,media,chat_id,message_id,grouped_id)
        pass  # картинка пришла вместе с сообщением но без альбома
    elif grouped_id_flag == True and media_flag == True:  # пришла одна из картинок
        await asyncio.sleep(3)
        ids = db.get_by_group_id(str(grouped_id))
        # print("LIST", list(ids))
        # for i in ids:
        #     print("HI", i)
        if len(ids) == 0:
            logger.debug(
                "ITS JUST ALBUM WITH NO TEXT / SKIPPED ADVERT")
        elif len(ids) == 1:
            advert_id = ids[0][0]
            await image_process(advert_id,media,chat_id,message_id,grouped_id)
        else:
            logger.debug("MULTIPLE SAME MESSAGES ERROR")
    else:  # grouped_id_flag == True and media_flag == False:
        logger.debug("IMPOSSIBLE CASE")  # невозможный случай
    # except Exception as err:
    #    logger.debug(f"MEDIA HANDLE ERROR: {err}")

logger.debug(f"LAUNCHED TELEGRAM")
# logger.debug(apihandler.config.url)
# logger.debug(apihandler.config.ex)
client.run_until_disconnected()
