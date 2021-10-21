import { MigrationInterface, QueryRunner } from 'typeorm';
import format from 'pg-format';

export class AddAnalyticsTable1634492912265 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE telegram_users
            ADD COLUMN created_at timestamptz NOT NULL DEFAULT now(),
            ADD COLUMN archived_at timestamptz NULL;
    `);
    await queryRunner.query(`
        UPDATE telegram_users AS tu SET
        created_at = r.created_at,
        archived_at = r.archived_at
        FROM (SELECT telegram_user_id, created_at, archived_at from renters)
        as r(telegram_user_id, created_at, archived_at)
        WHERE r.telegram_user_id = tu.telegram_user_id
    `);
    await queryRunner.query(`
        ALTER TABLE renters
            DROP COLUMN created_at,
            DROP COLUMN archived_at;
    `);

    await this.addAnalyticsTable(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await this.dropAnalyticsTable(queryRunner);

    await queryRunner.query(`
        ALTER TABLE renters
            ADD COLUMN created_at timestamptz NOT NULL DEFAULT now(),
            ADD COLUMN archived_at timestamptz NULL;
    `);
    await queryRunner.query(`
        UPDATE renters AS r SET
        created_at = tu.created_at,
        archived_at = tu.archived_at
        FROM (SELECT telegram_user_id, created_at, archived_at from telegram_users)
        as tu(telegram_user_id, created_at, archived_at)
        WHERE r.telegram_user_id = tu.telegram_user_id
    `);
    await queryRunner.query(`
        ALTER TABLE telegram_users
            DROP COLUMN created_at,
            DROP COLUMN archived_at;
    `);
  }

  private async addAnalyticsTable(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS business_analytics (
            business_analytics_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            telegram_user_id uuid NOT NULL REFERENCES telegram_users (telegram_user_id),
            entered boolean NOT NULL DEFAULT TRUE,
            start_fill_renter_info boolean NOT NULL DEFAULT FALSE,
            end_fill_renter_info boolean NOT NULL DEFAULT FALSE,
            next_step_renter_info boolean NOT NULL DEFAULT FALSE,
            created_match boolean NOT NULL DEFAULT FALSE,
            showed_room_info boolean NOT NULL DEFAULT FALSE,
            connected_by_room boolean NOT NULL DEFAULT FALSE,
            success_match boolean NOT NULL DEFAULT FALSE,
            pay_match boolean NOT NULL DEFAULT FALSE,
            pay_room_info boolean NOT NULL DEFAULT FALSE,
            UNIQUE(telegram_user_id)
        );
    `);

    const telegramUserIds = (
      await queryRunner.query(`
        SELECT telegram_user_id from telegram_users;
      `)
    ).map((telegramUser: { telegram_user_id: string }) => telegramUser.telegram_user_id);

    if (!telegramUserIds.lenth) {
      return;
    }

    await queryRunner.query(
      format(
        `
          INSERT INTO business_analytics (telegram_user_id)
          VALUES %L
          ON CONFLICT DO NOTHING
        `,
        telegramUserIds.map((telegram_user_id: string) => [telegram_user_id]),
      ),
    );
  }

  private async dropAnalyticsTable(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE IF EXISTS business_analytics;
    `);
  }
}
