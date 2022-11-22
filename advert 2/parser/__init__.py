from enum import Enum
from operator import truediv
from typing import List
import re
from . import metro
from . import shortcuts
import io

class Region(Enum):
    CENTER = 1
    NORTH = 2
    SOUTH = 3
    WEST = 4
    EAST = 5


class Object(Enum):
    ROOM = 1
    APARTMENTS = 2
    BED = 3


class Gender(Enum):
    MALE = 1
    FEMALE = 2
    NO_DIFFERENCE = 3


class Metro(Enum):
    bruh = 0


class AdvertParsing():
    def __init__(self, text):
        self.skip: bool = False
        self.is_rent: bool = False
        self.is_hostel: bool = False
        self.text: str = text
        self.text_lower: str = text.lower()
        self.text_fixed: str = ""  # без контактов
        self.price: int = 0
        # parse_gender()
        self.prefered_gender: Gender = None
        self.metro: str = ""  # надо таблицу сокращений к фулл неймам
        self.address: str = ""
        self.link: List[str] = ""
        self.phone_number: str = ""
        self.object: Object = None
        # parse_object()
        self.room_amount: int = 0
        self.area: int = 0
        # parse_region()
        self.region: Region = None
        self.photos: List[int] = []
        self.extras = {}

    # возвращает данные в нужном для бд сравнения формате
    def db_type_advert(self):
        return [self.text_fixed, self.price, self.phone_number, int(self.prefered_gender.value), self.metro, int(self.region.value), self.address, self.link, int(self.object.value), self.room_amount, self.area]

    def parse_region(self):
        found = False
        regions = []
        stations = []
        for station, info in metro.stations.items():
            if station in self.text_lower:
                found = True
                regions.append(int(info[0]))
                stations.append(info[1])
        if found:
            self.region = Region(regions[0])
            self.metro = ';'.join(stations)
        else:
            self.region = Region.CENTER
            self.metro = ''

    def parse_gender(self):
        mention_female = False
        mention_male = False
        mention_msosed=False
        mention_fsosed=False

        for regex in shortcuts.family:
            result = re.findall(regex,self.text_lower)
            if len(result)!=0:
                self.prefered_gender=Gender.NO_DIFFERENCE
                return

        for shortcut in shortcuts.male:
            if shortcut in self.text_lower:
                mention_male = True
                break

        for shortcut in shortcuts.female:
            if shortcut in self.text_lower:
                mention_female = True
                break
        
        for regex in shortcuts.male_sosed:
            result = re.findall(regex,self.text_lower)
            if len(result)!=0:
                mention_msosed=True
        
        for regex in shortcuts.female_sosed:
            result = re.findall(regex,self.text_lower)
            if len(result)!=0:
                mention_fsosed=True
        
        if mention_fsosed and mention_msosed:
            self.prefered_gender = Gender.NO_DIFFERENCE
            return

        if mention_female and not mention_male:
            self.prefered_gender = Gender.FEMALE
        else:
            self.prefered_gender = Gender.NO_DIFFERENCE

    def house(self):
        for regex in shortcuts.house:
            result = re.findall(regex,self.text_lower)
            if len(result)>1:
                self.skip=True
                return True
        return False
    
    def advanced_object_check(self):
        # try:
        #     beginning = self.text_lower[:50]
        #     if 'комнат' in beginning:
        #         return Object.ROOM
        #     if 'квартир' in beginning or 'студ' in beginning:
        #         return Object.APARTMENTS
        # except Exception  as err:
        #     return None
        try:
            text=self.text_lower
            types=[r'квартир',r'двушк',r'евродву',r'трёшк',r'трешк',r'апарт',r'комнат[^н]']
            c=[]
            for word in types:
                c.append(re.finditer(word,text))
            best_index=-1
            best_result=9999
            for index,result in enumerate(c):
                result=list(result)
                if len(result)!=0:
                    if best_result>result[0].start(0):
                        best_index=index
                        best_result=result[0].start(0)
            if best_index==-1:
                return None
            elif best_index in [0,1,2,3,4,5]:
                return Object.APARTMENTS
            else:
                return Object.ROOM
        except Exception  as err:
            return None
        return None
        # try:
        #     beginning = self.text_lower[:140]
        #     if 'комнат' in beginning:
        #         return Object.ROOM
        #     if 'квартир' in beginning or 'студ' in beginning  or 'апартам' in beginning:
        #         return Object.APARTMENTS
        # except Exception  as err:
        #     return None
        # return None
    
    def maybe_room(self):
        for shortcut in shortcuts.maybe_room:
            if shortcut in self.text_lower:
                return True
        return False

    def only_room(self):
        for regex in shortcuts.male_sosed:
            result = re.findall(regex,self.text_lower)
            if len(result)!=0:
                return True
        
        for regex in shortcuts.female_sosed:
            result = re.findall(regex,self.text_lower)
            if len(result)!=0:
                return True

        for shortcut in shortcuts.sosed:
            if shortcut in self.text_lower:
                for shortcut2 in shortcuts.kvart:
                    if shortcut2 in self.text_lower:
                        return True
        
        for regex in shortcuts.only_room:
            result = re.findall(regex,self.text_lower)
            if len(result)!=0:
                return True
        return False
    
    def only_apart(self):
        for regex in shortcuts.only_apart:
            result = re.findall(regex,self.text_lower)
            if len(result)!=0:
                return True
        return False

    def get_room_amount(self):
        for shortcut in shortcuts.quadruple_room:
            if shortcut in self.text_lower:
                return 4
        
        for shortcut in shortcuts.triple_room:
            if shortcut in self.text_lower:
                return 3
        
        for shortcut in shortcuts.double_room:
            if shortcut in self.text_lower:
                return 2
        

        for shortcut in shortcuts.single_room:
            if shortcut in self.text_lower:
                self.extras['single_room']=True
                return 1

        return 1

    def get_area(self):
        return 0


    def hostel(self):
        for shortcut in shortcuts.hostel:
            if shortcut in self.text_lower:
                return True
        return False

    def parse_price(self):
        mentioned_prices = []
        regex_thousand = r'(?<!залог)(?<!залог.)(?<!залог..)(?<=\D)([\d]+[ ,\d]*[\d]?)[ ]?(т\.р\.|т р|тр|тыс|K[^а-яА-ЯёЁ\d]|К[^а-яА-ЯёЁ\d]|к[^а-яА-ЯёЁ\d]|т\+|т |т)'
        regex_full = r'(?<!залог)(?<!залог.)(?<!залог..)(?<=\D)(?<!\.)([\d]{1,3}[’]?[.]?[,]?[ ]?[\d]{2,3})(?=$| |\.|:|-|,|₽|\/|[\D])'#r'(?<!залог)(?<!залог.)(?<!залог..)(?<=\D)([\d]{1,3}[.]?[,]?[ \d]{2,6}[\d])(?=$| |\.|:|-|,|₽|\/|)'
        price_thousand = re.findall(regex_thousand, self.text_fixed)
        price_full = re.findall(regex_full, self.text_fixed)
        for price in price_thousand:
            p = int(price[0].replace(' ', '').replace(',', '').replace('.', '').replace('’', ''))*1000
            if p>1000000:
                p/=1000
            p=int(p)
            mentioned_prices.append(p)

        for price in price_full:
            p = int(price.replace(' ', '').replace(',', '').replace('.', '').replace('’', ''))
            mentioned_prices.append(p)

        new_prices = []
        for price in mentioned_prices:
            if '100500' in str(price):
                continue
            new_prices.append(price)
        mentioned_prices=new_prices

        if len(mentioned_prices) > 0:
            self.price = max(mentioned_prices)
        else:
            self.price=0
            # regex_simple=r'[\d]+'
            # price_simple = re.findall(regex_simple, self.text_fixed)
            # for price in price_simple:
            #     p = int(price)*1000
            #     mentioned_prices.append(p)
            # if len(mentioned_prices) > 0:
            #     self.price = max(mentioned_prices)
            
        if self.price <= 1000:
            self.skip=True

    def parse_object(self):
        only_room = self.only_room()
        only_apart = self.only_apart() 
        #maybe_room = self.maybe_room()
        hostel = self.hostel()
        room_amount = self.get_room_amount()
        single_room = self.extras.get('single_room',None)
        if hostel:
            self.room_amount = 0
            self.object = Object.BED
            self.skip = True
            self.is_hostel = True
        else:
            self.room_amount = room_amount
            if only_room:
                self.object = Object.ROOM
            elif single_room is not None:
                self.object = Object.APARTMENTS
            elif only_apart:
                self.object = Object.APARTMENTS
            else:
                result = self.advanced_object_check()
                if result != None:
                    self.object = result
                elif room_amount==1:
                    self.object= Object.APARTMENTS
                else:
                    self.object = Object.ROOM

                
            # elif maybe_room:
            #     self.object = Object.ROOM
            # else:
            #     self.object = Object.APARTMENTS
            # if room_amount > 1:
            #     self.room_amount = room_amount
            #     self.object = Object.APARTMENTS
            # else:
            #     if only_room and room_amount == 0:
            #         self.object = Object.ROOM
            #     else:
            #         self.object = Object.APARTMENTS
            #     self.room_amount = 1

        self.area = self.get_area()

    def parse_remove_contacts(self):
        regex_link=r'(http:\/\/|ftp:\/\/|https:\/\/)?(t\.me\/|vk\.com\/)([a-zA-Z0-9_.]+)'
        regex_weird_id = r'tg:\/\/user\?id=[\d]+'
        regex_link_shit = r'(http:\/\/|ftp:\/\/|https:\/\/)?([a-zA-Z0-9_-]*[a-zA-Z]+[a-zA-Z0-9_-]*(?:(?:\.[a-zA-Z0-9_-]+)+))([a-zA-Z0-9_.,@?^=%&:\/~+#-]*[a-zA-Z0-9_@?^=%&\/~+#-])'
        regex_mention = r'\B@(?=\w{5,32}\b)[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*'
        regex_phone = r'([+]?[789][-)(\d ]{8,20})'
        regex_mention_no_tag = r'(?=[a-zA-Z]\w{4,32}\b)[a-zA-Z0-9]+(?:_[a-zA-Z0-9]+)*'

        self.text_fixed = self.text

        links = re.findall(regex_link, self.text_fixed)
        self.text_fixed = re.sub(regex_link, '', self.text_fixed)

        weird_ids = re.findall(regex_weird_id, self.text_fixed)
        self.text_fixed = re.sub(regex_weird_id, '', self.text_fixed)

        shit_links = re.findall(regex_link_shit, self.text_fixed)
        self.text_fixed = re.sub(regex_link_shit, '', self.text_fixed)

        mentions = re.findall(regex_mention, self.text_fixed)
        self.text_fixed = re.sub(regex_mention, '', self.text_fixed)

        mentions_no_tag = re.findall(regex_mention_no_tag, self.text_fixed)
        self.text_fixed = re.sub(regex_mention_no_tag, '', self.text_fixed)

        phones = re.findall(regex_phone, self.text_fixed)

        self.text_fixed = re.sub(regex_phone, '', self.text_fixed)

        fixed_links = []

        for id in weird_ids:
            fixed_links.append(id)

        for mention in mentions:
            fixed_links.append(mention)
        
        for mention in mentions_no_tag:
            if len(mention)>4:
                if 'whats' not in mention.lower():
                    fixed_links.append("@"+mention)

        for link in links:
            link = ''.join(link)
            fixed_links.append(link)

        if len(fixed_links) != 0:
            self.link = fixed_links#' ; '.join(fixed_links)
        
        phone_all = []
        for phone in phones:
            phone = phone.replace(
                '-', '').replace('(', '').replace(')', '').replace('+', '').replace(' ', '') 
            phone_all.append(phone)

        if len(phone_all) != 0:
            self.phone_number = ','.join(phone_all)  # ','.join(phones)

    def parse_rent(self):
        for regex in shortcuts.rent:
            result = re.findall(regex,self.text_lower)
            if len(result)!=0:
                self.is_rent = True
                self.skip = True
                return
    
    def parse_other_city(self):
        for shortcut in shortcuts.spb:
            if shortcut in self.text_lower:
                self.skip = True
                return
    
    def parse_advert(self):
        for shortcut in shortcuts.advert:
            if shortcut in self.text_lower:
                self.skip = True
                return
    
    def parse_shorttimed(self):
        for regex in shortcuts.shorttimed:
            result = re.findall(regex,self.text_lower)
            if len(result)!=0:
                self.skip = True
                return
    
    def refix_rent_sosed(self):
        for regex in shortcuts.male_sosed:
            result = re.findall(regex,self.text_lower)
            if len(result)!=0:
                if self.is_rent==True:
                    self.is_rent=False
                    self.skip=False
        
        for regex in shortcuts.female_sosed:
            result = re.findall(regex,self.text_lower)
            if len(result)!=0:
                if self.is_rent==True:
                    self.is_rent=False
                    self.skip=False

    def parse(self):
        #self.parse_advert()
        self.parse_other_city()
        self.parse_shorttimed()
        self.parse_rent()  # чекнуть если это запрос на снятие
        self.parse_object()
        self.parse_region()
        self.parse_gender()
        self.parse_remove_contacts()
        self.parse_price()
        self.house()
        self.refix_rent_sosed()
        # print(f"skip: {self.skip}, isrent: {self.is_rent}, is_hostel: {self.is_hostel},\
        #     price: {self.price}, prefered_gender: {self.prefered_gender}, metro: {self.metro}, \
        #     address: {self.address}, link: {self.link}, phone_number: {self.phone_number}, object: {self.object}, room_amount: {self.room_amount}, \
        #         area: {self.area}, region : {self.region}, photo: {self.photos}")
