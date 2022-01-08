import { MigrationInterface, QueryRunner } from 'typeorm';

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
            number serial NOT NULL UNIQUE,
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
            updated_at timestamptz NULL,
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
            external_photo_id varchar NOT NULL,
            landlord_object_id uuid NOT NULL REFERENCES landlord_objects (landlord_object_id),
            UNIQUE(external_photo_id)
        );
    `);

    await queryRunner.query(`
        CREATE TABLE landlord_object_renter_matches (
            match_id uuid PRIMARY KEY default uuid_generate_v4(),
            renter_id uuid NOT NULL REFERENCES renters (renter_id),
            landlord_object_id uuid NOT NULL REFERENCES landlord_objects (landlord_object_id),
            renter_status match_status NOT NULL,
            landlord_status match_status NULL DEFAULT NULL,
            updated_at timestamptz NULL,
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
