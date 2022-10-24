import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangePhoneNumberContact1665066336308 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE landlord_objects ALTER COLUMN phone_number TYPE varchar`);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
