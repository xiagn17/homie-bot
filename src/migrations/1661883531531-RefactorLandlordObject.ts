import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefactorLandlordObject1661883531531 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE landlord_objects
                DROP COLUMN apartments_info,
                DROP COLUMN room_bed_info,
                DROP COLUMN place_on_sites,
                DROP COLUMN details,
                DROP COLUMN start_arrival_date
      `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
