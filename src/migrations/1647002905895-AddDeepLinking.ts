import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeepLinking1647002905895 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE telegram_users ADD COLUMN deep_link varchar null;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE telegram_users DROP COLUMN deep_link;
    `);
  }
}
