import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPayments1642901809333 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TYPE payment_status_type AS ENUM (
            'waiting_for_capture',
            'pending',
            'succeeded',
            'canceled'
        );
    `);

    await queryRunner.query(`
        CREATE TABLE payments (
            payment_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            status payment_status_type NOT NULL,
            item varchar NOT NULL,
            order_id uuid NOT NULL,
            telegram_user_id uuid NOT NULL REFERENCES telegram_users (telegram_user_id),
            UNIQUE (order_id)
        )
    `);
    await queryRunner.query(`
        CREATE INDEX idx_payment_order_id ON payments USING btree (order_id);
    `);

    await queryRunner.query(`
        ALTER TABLE renters ADD COLUMN able_contacts smallint NOT NULL DEFAULT 0;    
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE renters DROP COLUMN able_contacts`);
    await queryRunner.query(`DROP TABLE payments`);
    await queryRunner.query(`DROP TYPE payment_status_type`);
  }
}
