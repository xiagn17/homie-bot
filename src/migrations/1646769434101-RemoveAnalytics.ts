import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveAnalytics1646769434101 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE business_analytics`);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {}
}
