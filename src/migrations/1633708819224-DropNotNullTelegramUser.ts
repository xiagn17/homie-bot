import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropNotNullTelegramUser1633708819224 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE telegram_users ALTER COLUMN username DROP NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE telegram_users ALTER COLUMN username SET NOT NULL;
    `);
  }
}
