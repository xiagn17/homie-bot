from . import config
from imgbbpy import AsyncClient
import asyncio
import time

class ImageHosting:
    last_upload_time = 0
    once_a = 2 #seconds
    max_attempts=5

    def __init__(self, API):
        self.api_token = API

    async def upload(self, filename, attempt=1):
        if ImageHosting.max_attempts<attempt:
            raise Exception('Exceeded max attempts to upload')
        if (time.time() - ImageHosting.last_upload_time)>ImageHosting.once_a:
            try:
                client = AsyncClient(self.api_token)
                image = await client.upload(file=filename,expiration=7776000)
                link=image.url
                await client.close()
                return link
            except Exception as e:
                await asyncio.sleep(ImageHosting.once_a)
                return await self.upload(filename,attempt+1)
        else:
            await asyncio.sleep(ImageHosting.once_a)
            return await self.upload(filename,attempt+1)

    def delete(self, filename):
        pass

