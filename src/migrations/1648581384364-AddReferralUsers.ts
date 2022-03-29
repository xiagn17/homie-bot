import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReferralUsers1648581384364 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE telegram_users
            ADD COLUMN referral_user_id uuid REFERENCES telegram_users (telegram_user_id)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE telegram_users DROP COLUMN referral_user_id
    `);
  }
}
