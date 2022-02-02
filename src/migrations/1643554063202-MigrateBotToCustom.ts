import { MigrationInterface, QueryRunner } from 'typeorm';
import format from 'pg-format';
import { LandlordObjectDetailsInterface } from '../modules/api/landlord-objects/interfaces/landlord-object-details.interface';
import { LandlordObjectRoomBedInfoInterface } from '../modules/api/landlord-objects/interfaces/landlord-object-room-bed-info.interface';

interface FullRenterDb {
  renter_id: string;
  name: string;
  gender: string;
  birthday_year: number;
  phone_number: string;
  planned_arrival: Date;
  money_range_id: string;
  location_id: string;
  university: string;
  preferences: string;
  zodiac_sign: string;
  socials: string;
  live_with_another_gender: string;
  telegram_user_id: string;
  with_animals: boolean;
  able_contacts: number;
  area: string;
  range: string;
}

interface FullLandlordObjectDb {
  landlord_object_id: string;
  number: number;
  name: string;
  phone_number: string;
  location_id: string;
  area: string;
  address: string;
  average_age: number;
  preferred_gender: string;
  show_couples: boolean;
  show_with_animals: boolean;
  start_arrival_date: Date;
  price: string;
  comment: string;
  telegram_user_id: string;
  created_at: Date;
  updated_at: Date;
  archived_at: Date;
  is_approved: boolean;
}

export interface FullInterestDb {
  interest_id: string;
  interest: string;
  renter_id: string;
}

export class MigrateBotToCustom1643554063202 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE renter_infos (
            renter_info_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            name varchar NOT NULL,
            birthday_year smallint NOT NULL,
            phone_number varchar(40) NOT NULL,
            zodiac_sign varchar,
            socials varchar NOT NULL,
            lifestyle jsonb NOT NULL,
            profession varchar NOT NULL,
            about text NOT NULL,
            renter_id uuid NOT NULL REFERENCES renters (renter_id),
            UNIQUE(renter_id)
        );
    `);

    await queryRunner.query(`
        CREATE TYPE object_type as ENUM (
            'room',
            'apartments',
            'bed'
        );
    `);
    await queryRunner.query(`
        CREATE TYPE location_type as ENUM (
            'Центр',
            'Север',
            'Юг',
            'Запад',
            'Восток'
        );
    `);
    await queryRunner.query(`
        CREATE TABLE renter_filters (
            renter_filter_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            object_type object_type[],
            price_range_start integer,
            price_range_end integer,
            locations location_type[],
            renter_id uuid NOT NULL REFERENCES renters (renter_id),
            UNIQUE (renter_id)
        );
    `);
    await queryRunner.query(`
        CREATE TABLE renter_settings (
            renter_settings_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            in_search boolean DEFAULT true,
            able_contacts smallint NOT NULL DEFAULT 0,
            renter_id uuid NOT NULL REFERENCES renters (renter_id),
            UNIQUE (renter_id)
        );
    `);
    const renters: FullRenterDb[] = await queryRunner.query(`
        SELECT * FROM renters
        LEFT JOIN directory_locations dl on renters.location_id = dl.location_id
        LEFT JOIN directory_money_ranges dmr on renters.money_range_id = dmr.money_range_id
    `);

    const queringRenters = renters.map(async r => {
      const interests: FullInterestDb[] = await queryRunner.query(`
          SELECT * FROM directory_interests
              LEFT JOIN renters_j_directory_interests rjdi on directory_interests.interest_id = rjdi.interest_id
              WHERE rjdi.renter_id = '${r.renter_id}'
      `);
      const about = r.preferences + `\nИнтересы: ${interests.map(i => i.interest).join(', ')}`;
      const profession = r.university;
      const lifestyle = {};
      const socials = r.socials;
      const zodiacSign = r.zodiac_sign;
      const phoneNumber = r.phone_number;
      const birthdayYear = r.birthday_year;
      const name = r.name;
      const renterId = r.renter_id;
      const renterInfo = {
        name: name,
        birthdayYear: birthdayYear,
        phoneNumber: phoneNumber,
        zodiacSign: zodiacSign,
        socials: socials,
        lifestyle: lifestyle,
        profession: profession,
        about: about,
        renterId: renterId,
      };

      const locations =
        r.area === 'Не имеет значения' ? ['Центр', 'Север', 'Юг', 'Запад', 'Восток'] : [r.area];
      const renterFilters = {
        objectType: ['room', 'apartments', 'bed'],
        moneyRange: r.range,
        locations: r.area === 'Центр (любая ветка)' ? ['Центр'] : locations,
        renterId: r.renter_id,
      };
      const renterSettings = {
        inSearch: true,
        ableContacts: r.able_contacts,
        renterId: r.renter_id,
      };
      return {
        renterInfo: renterInfo,
        renterFilters: renterFilters,
        renterSettings: renterSettings,
      };
    });

    const data = await Promise.all(queringRenters);
    await queryRunner.query(
      format(
        `
        INSERT INTO renter_infos (name, birthday_year, phone_number, zodiac_sign, socials, lifestyle, profession, about, renter_id)
        VALUES %L
        ON CONFLICT DO NOTHING
      `,
        data.map(({ renterInfo }) => [
          renterInfo.name,
          renterInfo.birthdayYear,
          renterInfo.phoneNumber,
          renterInfo.zodiacSign,
          renterInfo.socials,
          renterInfo.lifestyle,
          renterInfo.profession,
          renterInfo.about,
          renterInfo.renterId,
        ]),
      ),
    );
    await queryRunner.query(
      format(
        `
        INSERT INTO renter_settings (in_search, able_contacts, renter_id)
        VALUES %L
        ON CONFLICT DO NOTHING
      `,
        data.map(({ renterSettings }) => [
          renterSettings.inSearch,
          renterSettings.ableContacts,
          renterSettings.renterId,
        ]),
      ),
    );

    await queryRunner.query(
      format(
        `
        INSERT INTO renter_filters (object_type, price_range_start, price_range_end, locations, renter_id)
        VALUES %L
        ON CONFLICT DO NOTHING
      `,
        data.map(({ renterFilters }) => [
          `{${renterFilters.objectType.join(', ')}}`,
          Number(renterFilters.moneyRange.split('-')[0]),
          Number(renterFilters.moneyRange.split('-')[1]),
          `{${renterFilters.locations.join(', ')}}`,
          renterFilters.renterId,
        ]),
      ),
    );
    const landlordObjects: FullLandlordObjectDb[] = await queryRunner.query(`
        SELECT * FROM landlord_objects
        INNER JOIN directory_locations dl on landlord_objects.location_id = dl.location_id;
    `);

    await queryRunner.query(`
        ALTER TABLE landlord_objects
            ADD COLUMN object_type object_type NOT NULL DEFAULT 'room',
            DROP COLUMN location_id,
            ADD COLUMN location location_type NOT NULL DEFAULT 'Центр',
            DROP COLUMN average_age,
            DROP COLUMN show_couples,
            DROP COLUMN show_with_animals,
            ADD COLUMN rooms_number varchar(30) NOT NULL DEFAULT '-',
            ADD COLUMN details jsonb NOT NULL DEFAULT '{}'::jsonb,
            ADD COLUMN apartments_info jsonb,
            ADD COLUMN room_bed_info jsonb
    `);

    const objectUpdate = landlordObjects.map(o => {
      const id = o.landlord_object_id;
      const objectType = 'room';
      const location = o.area === 'Не имеет значения' || 'Центр (любая ветка)' ? 'Центр' : o.area;
      const roomsNumber = '-';
      const details: LandlordObjectDetailsInterface = {
        couples: o.show_couples,
        animals: o.show_with_animals,
        kids: false,
        fridge: false,
        washer: false,
        dishWasher: false,
        conditioner: false,
        internet: false,
      };
      const roomBedInfo: LandlordObjectRoomBedInfoInterface = {
        averageAge: o.average_age,
        livingPeopleNumber: '-',
      };
      return {
        id,
        objectType,
        location: location,
        roomsNumber,
        details,
        roomBedInfo,
      };
    });
    await queryRunner.query(
      format(
        `
        UPDATE landlord_objects
        SET object_type = t.object_type::object_type,
            location = t.location::location_type,
            rooms_number = t.rooms_number,
            details = t.details,
            room_bed_info = t.room_bed_info
        FROM (
            VALUES %L
        ) as t (object_type, location, rooms_number, details, room_bed_info)
      `,
        objectUpdate.map(upd => [
          upd.objectType,
          upd.location,
          upd.roomsNumber,
          upd.details,
          upd.roomBedInfo,
        ]),
      ),
    );

    await queryRunner.query(`
        ALTER TABLE landlord_objects
            ALTER COLUMN object_type DROP DEFAULT,
            ALTER COLUMN location DROP DEFAULT,
            ALTER COLUMN rooms_number DROP DEFAULT,
            ALTER COLUMN details DROP DEFAULT
    `);

    await this.dropOldTables(queryRunner);
  }

  async dropOldTables(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE renters
            DROP COLUMN name,
            DROP COLUMN birthday_year,
            DROP COLUMN phone_number,
            DROP COLUMN planned_arrival,
            DROP COLUMN money_range_id,
            DROP COLUMN location_id,
            DROP COLUMN university,
            DROP COLUMN preferences,
            DROP COLUMN zodiac_sign,
            DROP COLUMN socials,
            DROP COLUMN live_with_another_gender,
            DROP COLUMN with_animals,
            DROP COLUMN able_contacts
    `);
    await queryRunner.query(`
        DROP TABLE directory_money_ranges;
    `);
    await queryRunner.query(`
        DROP TABLE directory_locations
    `);
    await queryRunner.query(`
        DROP TABLE renters_j_directory_interests;
    `);
    await queryRunner.query(`
        DROP TABLE directory_interests;
    `);
    await queryRunner.query(`
        DROP TABLE renters_j_directory_subway_stations;
    `);
    await queryRunner.query(`
        DROP TABLE landlord_objects_j_directory_subway_stations;
    `);
    await queryRunner.query(`
        DROP TABLE directory_subway_stations
    `);

    await queryRunner.query(`
        DROP TABLE renter_matches;
    `);
    await queryRunner.query(`
        DROP TABLE matches_info;
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
