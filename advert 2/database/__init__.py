from sqlalchemy import create_engine
from sqlalchemy import text, select
from sqlalchemy import Table, Column, Integer, String, MetaData, ARRAY, Boolean
from . import config
from difflib import SequenceMatcher

def similar(a, b):
    return SequenceMatcher(None, a, b).ratio()

class DataBase:
    def __init__(self, config, logger):
        self.logger = logger
        self.meta = MetaData()

        self.adverts = Table(
            'advert_telegram',  self.meta,
            Column('id', Integer, primary_key=True),
            Column('comment', String()),
            Column('price', Integer()),
            Column('phone', String()),
            Column('prefered_gender', Integer()),
            Column('metro_station', String()),
            Column('region', Integer()),
            Column('address', String()),
            Column('link', String()),
            Column('object_type', Integer()),
            Column('room_amount', Integer()),
            Column('area', Integer()),
            Column('group_id', String()),
            Column('photos_local', ARRAY(String())),
            Column('already_sent', Boolean()),
            Column('photos_total', Integer()),
            Column('photos_hosting', ARRAY(String())),
        )

        self.engine = create_engine(
            f'postgresql+psycopg2://{config.user}:{config.password}@{config.host}:{config.port}',
            pool_pre_ping=True,
            connect_args={
                "keepalives": 1,
                "keepalives_idle": 30,
                "keepalives_interval": 10,
                "keepalives_count": 5,
                'connect_timeout': 10
            }
        )

        self.meta.create_all(self.engine)

    def with_connection(func):
        def wrapper(self, *args, **kwargs):
            conn = self.engine.connect()
            try:
                result = func(self, *args, connection=conn, **kwargs)
            except Exception as err:
                # print(err)
                self.logger(str(err))
                raise
            else:
                # conn.commit()
                pass
            finally:
                conn.close()
            return result

        return wrapper

    @staticmethod
    def compare_advert_and_db(advert, advert_db,logger): # true = equals, false not
        advert_len = len(advert)
        if similar(advert[0],advert_db[1])>0.75:
            return True
        for i in range(2,11):
            if advert[i] != advert_db[i+1]:
                return False
        return True

    # поиск записи по group_id
    @with_connection
    def get_by_group_id(self, group_id, *args, **kwargs):
        conn = kwargs.pop("connection")
        get_query = self.adverts.select().where(self.adverts.c.group_id == group_id)
        result = conn.execute(get_query)
        a = []
        for r in result:
            a.append(r)
        return a

    @with_connection
    def get_all(self, *args, **kwargs):
        conn = kwargs.pop("connection")
        get_query = self.adverts.select()
        result = conn.execute(get_query)
        a = []
        for r in result:
            a.append(r)
        return a
    
    # локальные имена
    @with_connection
    def add_photo_amount(self, advert_id, *args, **kwargs):
        conn = kwargs.pop("connection")
        append_query = self.adverts.update().values(
            photos_total=self.adverts.c.photos_total+1
        ).where(self.adverts.c.id == advert_id)
        result = conn.execute(append_query)
    
    # локальные имена
    @with_connection
    def decrease_photo_amount(self, advert_id, *args, **kwargs):
        conn = kwargs.pop("connection")
        append_query = self.adverts.update().values(
            photos_total=self.adverts.c.photos_total-1
        ).where(self.adverts.c.id == advert_id)
        result = conn.execute(append_query)

    # локальные имена
    @with_connection
    def append_photo_local(self, advert_id, link, *args, **kwargs):
        conn = kwargs.pop("connection")
        append_query = self.adverts.update().values(
            photos_local=text(
                f'array_append({self.adverts.c.photos_local.name}, :llink)')
        ).where(self.adverts.c.id == advert_id)
        result = conn.execute(append_query, {'llink': link})

    # ссылки на хостинг
    @with_connection
    def append_photo_hosting(self, advert_id, link, *args, **kwargs):
        conn = kwargs.pop("connection")
        append_query = self.adverts.update().values(
            photos_hosting=text(
                f'array_append({self.adverts.c.photos_hosting.name}, :llink)')
        ).where(self.adverts.c.id == advert_id)
        result = conn.execute(append_query, {'llink': link})

    @ with_connection
    def check_in_database(self, new_advert, *args, **kwargs):
        conn = kwargs.pop("connection")
        search_query = self.adverts.select()
        result = conn.execute(search_query)
        for advert_db in result:
            advert_db = ['' if v is None else v for v in advert_db]
            if DataBase.compare_advert_and_db(new_advert, advert_db,self.logger):
                return True
        return False

    @ with_connection
    def add_to_database(self, new_advert, *args, **kwargs):
        conn = kwargs.pop("connection")
        add_query = self.adverts.insert().values(
            comment=new_advert[0],
            price=new_advert[1],
            phone=new_advert[2],
            prefered_gender=new_advert[3],
            metro_station=new_advert[4],
            region=new_advert[5],
            address=new_advert[6],
            link=new_advert[7],
            object_type=new_advert[8],
            room_amount=new_advert[9],
            area=new_advert[10],
            group_id=new_advert[11],
            photos_total=new_advert[12]
        )
        result = conn.execute(add_query)
        #[new_id] = result.fetchone()
        return result.inserted_primary_key[0]


# db = DataBase(config, print)

# db.append_photo_local(1, 'test222')
# db.append_photo_hosting(1, 'testlink')
