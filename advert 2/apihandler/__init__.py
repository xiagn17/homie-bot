from . import config
import httpx
import requests


class ApiHandler:
    def __init__(self, url, ex):
        self.link = url+ex

    def get(self):
        with httpx.Client() as client:
            r = client.get(self.link)
            return r

    def post(self, data):
        return requests.post(self.link, data=data)
        # with httpx.Client() as client:
        #     r = client.post(
        #         self.link,
        #         data=data
        #     )
        #     return r


# apihandler = ApiHandler(config.url, config.ex)
# data = {
#     "name": "Тестовое имя2 - 88005553532",
#     "phoneNumber": "88005553532",
#     "objectType": "apartments",
#     "price": "12344",
#     "location": "Центр",
#     "address": "тестовый адрес2",
#     "photoIds": ["emptylink2", "emptylink3"],
#     "comment": "тестовый комментарий2",
#     "roomsNumber": "3",
#     "preferredGender": "no_difference",
#     "chatId": "1913600187"
# }
# apihandler.post(data)
