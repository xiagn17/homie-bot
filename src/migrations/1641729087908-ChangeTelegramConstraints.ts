import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTelegramConstraints1641729087908 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE telegram_users DROP CONSTRAINT telegram_users_username_bot_id_key;`);
    await queryRunner.query(`ALTER TABLE telegram_users ADD UNIQUE(username, bot_id, chat_id);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE telegram_users DROP CONSTRAINT telegram_users_username_bot_id_chat_id_key;`,
    );

    await queryRunner.query(`
            ALTER TABLE homie_db.public.telegram_users ADD UNIQUE(username, bot_id);
    `);
  }
}
