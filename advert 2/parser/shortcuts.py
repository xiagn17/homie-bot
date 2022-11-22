single_room = ['однушк', 'однокомн', 'одно комн','#1кк']
double_room = ['двушк', 'двухкомн', 'двух комн', '2-х к', '2х к', '2 х к', '2к к', '2-к к','2 к к','2-я','2я','2ая','2-шк','2шк','2комн','2комн','2-комн','2х-к','2х -']
triple_room = ['трешк', 'трёшк', 'трехкомн', 'трёхкомн',
               'трех комн', 'трёх комн', '3-х к', '3х к', '3 х к', '3к к', '3-к к','3 к к','3-я','3я','3ая','3-шк','3шк','3комн','3 комн','3-комн','3х-к','3х -','квартира 3к']
quadruple_room = ['четырешк', 'четырёшк',
                  'четырех', 'четырёх', '4х к', '4-х к', '4 х к', '4-к к', '4 к к','4-я','4я','4ая','4-шк','4шк','4комн','4 комн','4-комн','4х-к','4х -']

# regex shortcut
only_room = [r'((сда.{1,6}|освоб.{1,8})( [#,а-яА-ЯёЁ0-9*-]+){0,7} [#]?комнат[уа]|комнат[уа].{1,6}( сда))']
only_apart = [r'((сда.{1,6})([ ]*(\([ а-яА-ЯёЁ0-9*\.-]+\)|[а-яА-ЯёЁ0-9*-]+| )){0,7} квартир[уа]|(сда.{1,6})( [а-яА-ЯёЁ0-9*-]+){0,4} студи|студи[аяу].{1,6}( сда)|квартир[уа].{1,6}( сда))',
r'((сда.{1,6})([ ]*(\([ а-яА-ЯёЁ0-9*\.-]+\)|[а-яА-ЯёЁ0-9*-]+| )){0,7} апарт|(сда.{1,6})( [а-яА-ЯёЁ0-9*-]+){0,4} студи|студи[аяу].{1,6}( сда)|апарт.{1,6}( сда))',
r'((сда.{1,6})([ ]*(\([ а-яА-ЯёЁ0-9*\.-]+\)|[а-яА-ЯёЁ0-9*-]+)){0,7} евродв|(сда.{1,6})( [а-яА-ЯёЁ0-9*-]+){0,4} студи|студи[аяу].{1,6}( сда)|евродв.{1,6}( сда))',
r'((сда.{1,6})([ ]*(\([ а-яА-ЯёЁ0-9*\.-]+\)|[а-яА-ЯёЁ0-9*-]+| )){0,7} (студи|однуш|двуш|треш|трёш|апарт|квартир)|(студи|однуш|двуш|треш|трёш|апарт|квартир).{1,6}( сда))']
maybe_room = ['комнат']

spb = ['спб','санкт','петербург']

# ((сда.{1,6}) кварт|кварт.{3,8}( сда))
# 

advert = ['канал','подписка']

apar = ['кварт']
rom=['комнат']

hostel = ['хостел']

kvart = ['квартир']

house = [r'домик',r'коттедж',r'беседк',r'барбекю']#,r'[^a-zA-Z0-9_а-яА-ЯёЁ]дом[^a-zA-Z0-9_а-яА-ЯёЁ]'

sosed = ['соседа','соседку','совместн']
#(ищем кварт|ищу ком|ищу ква|ищу отель|ищу студию|хочу снять|сниму|бюджет|интересны вар|интересуют вар|рассм.{1,6}( [а-яА-ЯёЁ0-9*-]+){0,3} вариант|снимем|снимет|ищ.{0,2}((?<!сосед)(?<!сосед.)(?<!сосед..)(?<!человек.)(?<!человек) [а-яА-ЯёЁ0-9*()-]+){0,7} комнат)
rent = [r'(ищем кварт|ищу ком|ищу ква|ищу отель|ищу студию|хочу снять|сниму|бюджет|интересны вар|интересуют вар|рассм[а-яА-Я ]{1,6}( [а-яА-ЯёЁ0-9*-]+){0,3} вариант|снимем|снимет|ищ[а-яА-Я ]{0,2}((?<!сосед)(?<!сосед.)(?<!сосед..)(?<!человек.)(?<!человек) [а-яА-ЯёЁ0-9*()-]+){0,2} комнат)',
r'(((поис|ищ[уе][^т]).{0,6})([ ]*(\([ а-яА-ЯёЁ0-9*\.-]+\)|[а-яА-ЯёЁ0-9*-]+| )){0,1} (жиль[^ц]|квартир|однуш)|(жиль[^ц]|квартир|однуш){1,6} (поис|ищ[уе]))']

female = ['соседк', 'девуш', 'женщин', 'девоч']
female_sosed=[r'[^а-яА-Я]соседк.{0,2}[^а-яА-Я]',
r'(((поис|ищ[уе]).{0,6})([ ]*(\([ а-яА-ЯёЁ0-9*\.-]+\)|[а-яА-ЯёЁ0-9*-]+| )){0,1} (соседк)|(соседк).{1,6} (поис|ищ[уе]))']
male = ['мужчин', 'парен', 'парня', 'молодой', 'молодого','парне','мужск']
male_sosed=[r'[^а-яА-Я]сосед[а]?[^а-яА-Я]']

family=[r'(семей.{0,3}( [а-яА-Я]){0,2} пар|с.{0,2}пар)']

shorttimed=[r'(посуточ|по-суточ|по суточ)']
