from facebook_scraper import get_posts, set_proxy
import fb_config
import pprint
from sys import stderr
from loguru import logger
import config
import httpx
import aiofiles
import asyncio
import asyncio
from datetime import datetime
from datetime import timedelta
from parser import *
import database
import imagehosting
import time
from dateutil.relativedelta import relativedelta

import warnings
warnings.filterwarnings("ignore")

db = database.DataBase(database.config, logger.debug)
hosting = imagehosting.ImageHosting(imagehosting.config.API)
logger.remove()
logger.add(stderr, format="<white>{time:HH:mm:ss}</white>"
                          " | <level>{level: <8}</level>"
                          " | <cyan>{line}</cyan>"
                          " - <white>{message}</white>")

async def download_image(url,name,proxy):
    async with httpx.AsyncClient(proxies=proxy) as client:
        r = await client.get(url)
        f = await aiofiles.open(name, mode='wb')
        await f.write(r.read())
        await f.close()

async def image_process(insert_id,media,chat_id,message_id,grouped_id):
        filename = ''
        link = ''
        if media is not None:
            logger.debug(
                f"{chat_id}_{message_id} HAS MEDIA TO DOWNLOAD")
            filename=f'./media/{chat_id}_{message_id}_{grouped_id}'
            await download_image(media,filename,fb_config.proxy)
            logger.debug(
                f"{chat_id}_{message_id} MEDIA DOWNLOAD SUCCESS {filename}")
            db.add_photo_amount(insert_id)
            logger.debug(
                f"{filename} UPLOADING TO HOSTING")
            try:
                link = await hosting.upload(filename)
                logger.debug(
                    f"{filename} UPLOAD TO HOSTING SUCCESS: {link}")
            except Error as err:
                logger.debug(
                    f"{filename} UPLOAD TO HOSTING FAILED: {err}")
        if link != "":
            db.append_photo_hosting(insert_id, link)
        if filename != "":
            db.append_photo_local(insert_id, filename)
        logger.debug(
            f"ADDED PICTURES {link} and {filename} TO DB")


def facebook_parse(group=703160323059161, proxy=fb_config.proxy, cookies=fb_config.cookie_filename):
    set_proxy(proxy)
    for post in get_posts(group,pages=5,cookies=cookies):
        CurrentDate = datetime.now() - relativedelta(minutes=15)
        #CurrentDate = datetime.strptime(CurrentDate, "%d/%m/%Y %H:%M")
        PostDate=''
        try:
            PostDate = post['time']
        except:
            logger.debug("No date in facebook post")
            continue
        #PostDate = datetime.strptime(PostDate, "%d/%m/%Y %H:%M")
        logger.debug(str(CurrentDate)+"|"+str(PostDate))
        if CurrentDate > PostDate:
            logger.debug("Old facebook post")
            continue
        text=post['text']
        images=post['images']
        post_id=post['post_id']
        grouped_id=post_id
        if text != '':
            advert = AdvertParsing(text)
            advert.parse()
            logger.debug(text)
            logger.debug(f"skip: {advert.skip}, isrent: {advert.is_rent}, is_hostel: {advert.is_hostel},\
            price: {advert.price}, prefered_gender: {advert.prefered_gender}, metro: {advert.metro}, \
            address: {advert.address}, link: {advert.link}, phone_number: {advert.phone_number}, object: {advert.object}, room_amount: {advert.room_amount}, \
                area: {advert.area}, region : {advert.region}, photo: {advert.photos}")
            if advert.skip != True:
                # если есть хотяб какое-то упоминание владельца для связи
                if advert.link != [] and advert.link != '' or advert.phone_number != '' :
                    # print(advert.db_type_advert())
                    if isinstance(advert.link, list):
                        advert.link=' ; '.join(advert.link)
                    else:
                        advert.link=''
                    # advert.link=advert.link.replace("@",)
                    conv_advert = advert.db_type_advert()
                    already_exists = db.check_in_database(conv_advert)
                    # print(result)
                    logger.debug("EXISTS IN DB ALREADY = "+str(already_exists))
                    if not already_exists:
                        conv_advert.append(grouped_id)
                        conv_advert.append(0)
                        inserted_id = db.add_to_database(conv_advert)
                        logger.debug(f"ADDED TO DB AT INDEX {inserted_id}")
                        logger.debug(f"STARTING DEALING WITH IMAGES")
                        if images is not None and len(images)>0:
                            async def process_images():
                                tasks=[]
                                n=0
                                for image in images:
                                    tasks.append(image_process(inserted_id,image,'703160323059161',post_id,post_id))
                                    n+=1
                                await asyncio.gather(*tasks)
                            asyncio.run(process_images())
                            logger.debug(f"FINISHED DEALING WITH IMAGES")
                            
                else:
                    logger.debug(f"NO CONTACTS FOUND")

logger.debug("LAUNCHED FACEBOOK")
while (True):
    time.sleep(3600)
    logger.debug("STARTED FACEBOOK")
    facebook_parse()


# for post in get_posts(group=703160323059161,cookies="facebook.com_cookies.txt"):
#     pprint.pprint(post)
#     break

# import config
# import httpx
# import aiofiles
# import asyncio
# url = 'https://towardsthecloud.com/wp-content/uploads/vscode-extension-indent-rainbow-1024x353.webp'
# name = "file.webp"
# async def download_image(url,name,proxy):
#     async with httpx.AsyncClient(proxies=proxy) as client:
#         r = await client.get(url)
#         f = await aiofiles.open(name, mode='wb')
#         await f.write(r.read())
#         await f.close()
# asyncio.run(download_image(url,name))
