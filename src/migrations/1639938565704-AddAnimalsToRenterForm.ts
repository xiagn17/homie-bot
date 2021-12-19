import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAnimalsToRenterForm1639938565704 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE renters ADD COLUMN with_animals boolean NOT NULL DEFAULT FALSE;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE renters DROP COLUMN with_animals;`);
  }
}
