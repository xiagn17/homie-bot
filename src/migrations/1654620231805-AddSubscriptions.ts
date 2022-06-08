import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSubscriptions1654620231805 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE renter_settings
            ADD COLUMN subscription_trial_started timestamptz NULL,
            ADD COLUMN subscription_trial_ends timestamptz NULL,
            ADD COLUMN subscription_started timestamptz NULL,
            ADD COLUMN subscription_ends timestamptz NULL,
            DROP COLUMN able_contacts,
            DROP COLUMN private_helper
    `);
    await queryRunner.query(`
        ALTER TABLE landlord_object_renter_matches DROP COLUMN paid; 
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
