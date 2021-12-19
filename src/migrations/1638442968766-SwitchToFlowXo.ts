import { MigrationInterface, QueryRunner } from 'typeorm';

const LOCAL_DEFAULT_HOMIE_BOT_ID = '6172ff570a35cf00b00144ad';
export class SwitchToFlowXo1638442968766 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE telegram_users ADD COLUMN bot_id varchar NOT NULL default '${LOCAL_DEFAULT_HOMIE_BOT_ID}';`,
    );
    await queryRunner.query(
      `ALTER TABLE telegram_users DROP CONSTRAINT telegram_users_chat_id_key, DROP CONSTRAINT telegram_users_username_key;`,
    );
    await queryRunner.query(
      `ALTER TABLE telegram_users ADD UNIQUE(bot_id, chat_id), ADD UNIQUE(username, bot_id);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE telegram_users DROP CONSTRAINT telegram_users_bot_id_chat_id_key;`);
    await queryRunner.query(`ALTER TABLE telegram_users DROP CONSTRAINT telegram_users_username_bot_id_key;`);
    await queryRunner.query(`ALTER TABLE telegram_users ADD UNIQUE(username), ADD UNIQUE(chat_id);`);
    await queryRunner.query(`ALTER TABLE telegram_users DROP COLUMN bot_id;`);
  }
}
