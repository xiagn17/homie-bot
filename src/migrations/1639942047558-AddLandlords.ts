import { MigrationInterface, QueryRunner } from 'typeorm';

/*
 * 1. Лендлорд(TELEGRAM_USER) может выставить несколько обьектов! (landlord_objects)
 * 2. Лендлорд может удалить (archive_at: Date.now()) обьект
 * 3. Если у Лендлорда нет активного обьявления - предлагать заполнить "анкету" в меню, иначе -
 *    указать последнюю активную анкету и спросиьт изменить или создать новую
 * 4. в "моя анкета" высвечивается вся инфа + "изменить"/"удалить"
 * 5. Поставить дефолтное время на удаление обьявления - 2 дней. Сделать кнопку "обновить" в анкете лендлорда -
 *    тогда он продлится еще на столько же. От "админов" по дефолту через 2 дней удаляется без продления
 * 5.1 Присылать сообщение за день до истечения с кнопкой "продлить еще"/"удалить"
 * 5.2 на /stop и Report And Block архивировать лендлорда и его обьявление не показывать
 * 6. После создания обьекта(после модерации) - начать метчинг по рентерам, которые ищут комнаты
 * 7. У Renter переименовать search в search_sosed и добавить search_room boolean
 * 8. Сделать таблицу landlord_object_renter_matches (renter_id, landlord_object_id, status)
 * 9. При удалении landlord_object также удалять все matches (???)
 * 10. Модуль lanlord-objects на создание/удаление/ердактирование + в renter-matches делать логику по метчам
 * 11. Возможно переименовать renter-matches модуль или все таки добавить отдельный для метча обьявлений
 * 12. Сделать модерацию - поле "approve" в landlord_objects. От админов это будет по дефолту true
 * 13. Если админ отменяет обьявление - удаляем из базы и присылаем ответ лендлорду о том что не аппрувнулось
 * */

// miro - https://miro.com/app/board/o9J_l0RxRvQ=/
export class AddLandlords1639942047558 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE preferred_gender_type AS ENUM (
        'male',
        'female',
        'no_difference'
      );
    `);
    await queryRunner.query(`
        CREATE TABLE landlord_objects (
            landlord_object_id uuid PRIMARY KEY default uuid_generate_v4(),
            name varchar NOT NULL,
            phone_number varchar(40) NOT NULL,
            location_id uuid NOT NULL REFERENCES directory_locations (location_id),
            address varchar NOT NULL,
            average_age smallint NOT NULL,
            preferred_gender preferred_gender_type NOT NULL ,
            show_couples boolean NOT NULL,
            show_with_animals boolean NOT NULL,
            start_arrival_date date NOT NULL,
            price varchar NOT NULL,
            comment text NOT NULL,
            telegram_user_id uuid NOT NULL REFERENCES telegram_users (telegram_user_id),
            created_at timestamptz NOT NULL DEFAULT now(),
            updated_at timestamptz NOT NULL DEFAULT now(),
            archived_at timestamptz NULL,
            is_approved boolean NOT NULL DEFAULT FALSE
        );
    `);
    await queryRunner.query(`
        CREATE TABLE landlord_objects_j_directory_subway_stations (
            landlord_object_id uuid NOT NULL
                REFERENCES landlord_objects (landlord_object_id),
            subway_station_id uuid NOT NULL
                REFERENCES directory_subway_stations (subway_station_id),
            UNIQUE(landlord_object_id, subway_station_id)
      );
    `);
    await queryRunner.query(`
        CREATE TABLE landlord_object_photos (
            photo_id uuid PRIMARY KEY default uuid_generate_v4(),
            photo_url varchar NOT NULL,
            landlord_object_id uuid NOT NULL REFERENCES landlord_objects (landlord_object_id),
            UNIQUE(photo_url)
        );
    `);

    await queryRunner.query(`
        CREATE TABLE landlord_object_renter_matches (
            match_id uuid PRIMARY KEY default uuid_generate_v4(),
            renter_id uuid NOT NULL REFERENCES renters (renter_id),
            landlord_object_id uuid NOT NULL REFERENCES landlord_objects (landlord_object_id),
            renter_status match_status NOT NULL,
            landlord_status match_status NOT NULL,
            UNIQUE (landlord_object_id, renter_id)
        );
    `);

    await queryRunner.query(`ALTER TABLE matches_info RENAME COLUMN in_search TO in_search_mate`);
    await queryRunner.query(
      `ALTER TABLE matches_info ADD COLUMN in_search_room boolean NOT NULL DEFAULT FALSE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE matches_info DROP COLUMN in_search_room;`);
    await queryRunner.query(`ALTER TABLE matches_info RENAME COLUMN in_search_mate TO in_search;`);

    await queryRunner.query(`DROP TABLE IF EXISTS landlord_object_renter_matches`);
    await queryRunner.query(`DROP TABLE IF EXISTS landlord_object_photos`);
    await queryRunner.query(`DROP TABLE IF EXISTS landlord_objects_j_directory_subway_stations`);
    await queryRunner.query(`DROP TABLE IF EXISTS landlord_objects`);
    await queryRunner.query(`DROP TYPE preferred_gender_type`);
  }
}
