import { MigrationInterface, QueryRunner } from 'typeorm';
import format from 'pg-format';

const MONEY_RANGES_DATA = ['15000-20000', '20000-25000', '25000-30000', '30000-40000'];
const SUBWAY_STATIONS_DATA = [
  'Сокольническая',
  'Замоскворецкая',
  'Арбатско-покровская',
  'Филёвская',
  'Кольцевая',
  'Калужско-Рижская',
  'Таганско-Краснопресненская',
  'Калининская',
  'Серпуховская',
  'Люблинская',
  'Каховская',
  'Бутовская',
];
const INTERESTS_DATA = [
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
const LOCATIONS_DATA = [
  'Внутри садового кольца',
  'Внутри ТТК',
  'Внутри МКАД, близко к метро',
  'Внутри МКАД, неважно сколько до метро',
  'Не имеет значения',
];

export class Initializing1629241839172 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE gender_type AS ENUM (
        'male',
        'female'
      );
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS directory_money_ranges (
        money_range_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        range varchar NOT NULL
      );
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS directory_subway_stations (
        subway_station_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        station varchar NOT NULL
      );
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS directory_interests (
        interest_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        interest varchar NOT NULL
      );
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS directory_locations (
        location_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        area varchar NOT NULL
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

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS renters (
        renter_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        name varchar NOT NULL,
        gender gender_type NOT NULL,
        birthdayYear smallint NOT NULL,
        phone_number varchar(40) NOT NULL,
        planned_arrival date NOT NULL,
        university varchar NULL,
        preferences text NULL,
        zodiac_sign varchar NULL,
        socials varchar NOT NULL,
        telegram varchar NOT NULL,
        request_id varchar NULL,
        utm_source varchar NULL,
        sent_time timestamptz NOT NULL
      );
    `);
    await queryRunner.query(`
      CREATE TABLE renters_j_directory_money_ranges (
        renter_id uuid NOT NULL
          REFERENCES renters (renter_id),
        money_range_id uuid NOT NULL
          REFERENCES directory_money_ranges (money_range_id),
        UNIQUE(renter_id, money_range_id)
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
    await queryRunner.query(`
      CREATE TABLE renters_j_directory_locations (
        renter_id uuid NOT NULL
          REFERENCES renters (renter_id),
        location_id uuid NOT NULL
          REFERENCES directory_locations (location_id),
        UNIQUE(renter_id, location_id)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS renters_j_directory_locations`);
    await queryRunner.query(`DROP TABLE IF EXISTS renters_j_directory_interests`);
    await queryRunner.query(`DROP TABLE IF EXISTS renters_j_directory_subway_stations`);
    await queryRunner.query(`DROP TABLE IF EXISTS renters_j_directory_money_ranges`);
    await queryRunner.query(`DROP TABLE IF EXISTS renters`);
    await queryRunner.query(`DROP TABLE IF EXISTS directory_locations`);
    await queryRunner.query(`DROP TABLE IF EXISTS directory_interests`);
    await queryRunner.query(`DROP TABLE IF EXISTS directory_subway_stations`);
    await queryRunner.query(`DROP TABLE IF EXISTS directory_money_ranges`);
    await queryRunner.query(`DROP TYPE gender_type`);
  }
}
