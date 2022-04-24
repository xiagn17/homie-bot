import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReviews1650829813396 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE reviews (
                review_id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
                reason varchar NULL,
                stars int NULL,
                telegram_user_id uuid NOT NULL REFERENCES telegram_users (telegram_user_id),
                UNIQUE (telegram_user_id)
            )
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE reviews`);
  }
}
