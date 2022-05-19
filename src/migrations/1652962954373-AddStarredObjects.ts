import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStarredObjects1652962954373 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE landlord_objects ADD COLUMN starred boolean NOT NULL DEFAULT false
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE landlord_objects DROP COLUMN starred`);
  }
}
