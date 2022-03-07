import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameLandlordObjectArchivedAt1646598118807 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE landlord_objects RENAME COLUMN archived_at TO stopped_at;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE landlord_objects RENAME COLUMN stopped_at TO archived_at;
    `);
  }
}
