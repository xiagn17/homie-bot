import unittest
import examples
from parsing import *


class TestTelegramParsing(unittest.TestCase):

    def test_first_advert(self):
        advert = AdvertParsing(examples.texts[0])
        advert.parse()
        self.assertTrue(advert.region == Region.CENTER)
        self.assertTrue(advert.prefered_gender == Gender.FEMALE)
        self.assertTrue(advert.object == Object.APARTMENTS)
        self.assertTrue(advert.room_amount == 1)
        self.assertTrue(advert.price == 38000)
        self.assertTrue(advert.phone_number == '+79680835929')

    def test_second_advert(self):
        advert = AdvertParsing(examples.texts[1])
        advert.parse()
        self.assertTrue(advert.skip == True)
        self.assertTrue(advert.is_rent == True)
        self.assertTrue(advert.region == Region.SOUTH)
        self.assertTrue(advert.price == 50000)

    def test_third_advert(self):
        advert = AdvertParsing(examples.texts[2])
        advert.parse()
        self.assertTrue(advert.region == Region.EAST)
        self.assertTrue(advert.prefered_gender == Gender.NO_DIFFERENCE)
        self.assertTrue(advert.object == Object.APARTMENTS)
        self.assertTrue(advert.room_amount == 2)
        self.assertTrue(advert.price == 50000)

    def test_fourth_advert(self):
        advert = AdvertParsing(examples.texts[3])
        advert.parse()
        # self.assertTrue(advert.region == Region.EAST)
        # между двумя регионами
        self.assertTrue(advert.prefered_gender == Gender.NO_DIFFERENCE)
        self.assertTrue(advert.object == Object.APARTMENTS)
        self.assertTrue(advert.room_amount == 2)
        self.assertTrue(advert.price == 26000)

    def test_fifth_advert(self):
        advert = AdvertParsing(examples.texts[4])
        advert.parse()
        self.assertTrue(advert.region == Region.CENTER)
        self.assertTrue(advert.is_hostel == True)
        self.assertTrue(advert.skip == True)
        self.assertTrue(advert.object == Object.BED)
        self.assertTrue(advert.room_amount == 0)
        self.assertTrue(advert.price == 11500)


if __name__ == '__main__':
    unittest.main()

print(f"skip: {self.skip}, isrent: {self.is_rent}, is_hostel: {self.is_hostel}, text: {self.text}, text_lower: {self.text_lower}, text_fixed: {self.text_fixed},\
            price: {self.price}, prefered_gender: {self.prefered_gender}, metro: {self.metro}, \
            address: {self.address}, link: {self.link}, phone_number: {self.phone_number}, object: {self.object}, room_amount: {self.room_amount}, \
                area: {self.area}, region : {self.region}, photo: {self.photos}")
