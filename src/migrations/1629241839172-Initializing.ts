import { MigrationInterface, QueryRunner } from 'typeorm';
import format from 'pg-format';

const MONEY_RANGES_DATA = ['15000-20000', '20000-25000', '25000-30000', '30000-40000'];
export const SUBWAY_STATIONS_DATA = [
  'Любая',
  'Красная',
  'Зеленая',
  'Синяя',
  'Голубая',
  'Кольцевая',
  'Оранжевая',
  'Фиолетовая',
  'Желтая',
  'Серая',
  'Салатовая',
  'Бирюзовая',
  'Серо-голубая',
];
export const INTERESTS_DATA = [
  'Бары и клубы',
  'Спорт, йога',
  'Литература, живопись',
  'Кинематограф',
  'Музыка',
  'Техно вечеринки, фестивали',
  'Политика, финансы',
  'Мода',
  'Кулинария',
];
const LOCATIONS_DATA = ['Центр (любая ветка)', 'Север', 'Юг', 'Запад', 'Восток', 'Не имеет значения'];

export class Initializing1629241839172 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`
      CREATE TYPE gender_type AS ENUM (
        'male',
        'female'
      );
    `);
    await queryRunner.query(`
      CREATE TYPE with_another_type AS ENUM (
        'yes',
        'not'
      );
    `);

    await queryRunner.query(`
      CREATE TYPE match_status AS ENUM (
        'resolved',
        'rejected',
        'processing'
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS directory_money_ranges (
        money_range_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        range varchar NOT NULL,
        UNIQUE(range)
      );
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS directory_subway_stations (
        subway_station_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        station varchar NOT NULL,
        UNIQUE(station)
      );
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS directory_interests (
        interest_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        interest varchar NOT NULL,
        UNIQUE(interest)
      );
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS directory_locations (
        location_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        area varchar NOT NULL,
        UNIQUE(area)
      );
    `);
    await queryRunner.query(
      format(
        `
          INSERT INTO directory_money_ranges (range)
          VALUES %L
          ON CONFLICT DO NOTHING
        `,
        MONEY_RANGES_DATA.map(range => [range]),
      ),
    );
    await queryRunner.query(
      format(
        `
          INSERT INTO directory_subway_stations (station)
          VALUES %L
          ON CONFLICT DO NOTHING
        `,
        SUBWAY_STATIONS_DATA.map(station => [station]),
      ),
    );
    await queryRunner.query(
      format(
        `
          INSERT INTO directory_interests (interest)
          VALUES %L
          ON CONFLICT DO NOTHING
        `,
        INTERESTS_DATA.map(interest => [interest]),
      ),
    );
    await queryRunner.query(
      format(
        `
          INSERT INTO directory_locations (area)
          VALUES %L
          ON CONFLICT DO NOTHING
        `,
        LOCATIONS_DATA.map(area => [area]),
      ),
    );

    await this.createTelegramTable(queryRunner);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS renters (
        renter_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        name varchar NOT NULL,
        gender gender_type NOT NULL,
        birthday_year smallint NOT NULL,
        phone_number varchar(40) NOT NULL,
        planned_arrival date NOT NULL,
        money_range_id uuid NOT NULL REFERENCES directory_money_ranges (money_range_id),
        location_id uuid NOT NULL REFERENCES directory_locations (location_id),
        university varchar NULL,
        preferences text NULL,
        zodiac_sign varchar NULL,
        socials varchar NOT NULL,
        live_with_another_gender with_another_type NOT NULL,
        telegram_user_id uuid NOT NULL REFERENCES telegram_users (telegram_user_id),
        created_at timestamptz NOT NULL DEFAULT now(),
        archived_at timestamptz NULL,
        UNIQUE(telegram_user_id)
      );
    `);
    await queryRunner.query(`
      CREATE TABLE renters_j_directory_subway_stations (
        renter_id uuid NOT NULL
          REFERENCES renters (renter_id),
        subway_station_id uuid NOT NULL
          REFERENCES directory_subway_stations (subway_station_id),
        UNIQUE(renter_id, subway_station_id)
      );
    `);
    await queryRunner.query(`
      CREATE TABLE renters_j_directory_interests (
        renter_id uuid NOT NULL
          REFERENCES renters (renter_id),
        interest_id uuid NOT NULL
          REFERENCES directory_interests (interest_id),
        UNIQUE(renter_id, interest_id)
      );
    `);

    await this.createMatchedRenters(queryRunner);
    await this.createMatchesInfoTable(queryRunner);
  }

  public async createMatchedRenters(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE renter_matches (
        renter_match_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        first_id uuid NOT NULL REFERENCES renters (renter_id),
        second_id uuid NOT NULL REFERENCES renters (renter_id),
        status match_status NOT NULL,
        UNIQUE(first_id, second_id)
      );
    `);
  }

  public async createTelegramTable(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS telegram_users (
        telegram_user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        username varchar NOT NULL,
        chat_id varchar NOT NULL,
        UNIQUE(username),
        UNIQUE(chat_id)
      );
    `);
  }

  public async createMatchesInfoTable(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS matches_info (
        matches_info_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        renter_id uuid NOT NULL REFERENCES renters (renter_id),
        able_matches smallint NOT NULL DEFAULT 0,
        in_search boolean NOT NULL DEFAULT FALSE,
        UNIQUE(renter_id)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS matches_info`);
    await queryRunner.query(`DROP TABLE IF EXISTS renter_matches`);
    await queryRunner.query(`DROP TABLE IF EXISTS renters_j_directory_interests`);
    await queryRunner.query(`DROP TABLE IF EXISTS renters_j_directory_subway_stations`);
    await queryRunner.query(`DROP TABLE IF EXISTS renters`);
    await queryRunner.query(`DROP TABLE IF EXISTS telegram_users`);
    await queryRunner.query(`DROP TABLE IF EXISTS directory_locations`);
    await queryRunner.query(`DROP TABLE IF EXISTS directory_interests`);
    await queryRunner.query(`DROP TABLE IF EXISTS directory_subway_stations`);
    await queryRunner.query(`DROP TABLE IF EXISTS directory_money_ranges`);
    await queryRunner.query(`DROP TYPE match_status`);
    await queryRunner.query(`DROP TYPE with_another_type`);
    await queryRunner.query(`DROP TYPE gender_type`);
  }
}
