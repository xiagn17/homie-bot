import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeletionObjects1647104941030 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE landlord_objects ADD COLUMN deleted_at timestamptz NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE landlord_objects DROP COLUMN deleted_at;
    `);
  }
}
