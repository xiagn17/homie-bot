import { MigrationInterface, QueryRunner } from 'typeorm';
import format from 'pg-format';
import { TaskDataSendMessageInterface } from '../modules/tasks/interfaces/TaskData.interface';
import { TaskTypeEnumInterface } from '../modules/tasks/interfaces/TaskTypeEnum.interface';
import { getReferralLink } from '../modules/bot/helpers/referralLink/getReferralLink';
import { EMOJI_SHARE } from '../modules/bot/constants/emoji';

interface TelegramUserInterface {
  chat_id: string;
}
const PUSH_MESSAGE: string =
  `🔥 <b>Важная новость!</b> Теперь получить контакты сразу можно абсолютно бесплатно. Для этого нужно лишь рассказать друзьям о Homie.\n` +
  `\n` +
  `🔑 Сколько контактов ты получишь?\n` +
  `1 контакт - за друга, который нажал /start\n` +
  `2 контакта - за друга, который заполнил анкету\n` +
  `3 контакта - за друга, который разместил объект на Homie\n` +
  `\n` +
  `🔑 Приведенный друг также получит 1 контакт!\n` +
  `\n` +
  `🔖 Поделиться Homie и получить контакты ты сможешь в любое время через:\n` +
  `/menu --> Прочее --> Поделиться Homie`;

export class AddReferralUsers1648581384364 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE telegram_users
            ADD COLUMN referral_user_id uuid REFERENCES telegram_users (telegram_user_id)
    `);

    const renterUsers: TelegramUserInterface[] = await queryRunner.query(`
        SELECT chat_id FROM telegram_users tu
            INNER JOIN renters r on tu.telegram_user_id = r.telegram_user_id
    `);
    const tasks: TaskDataSendMessageInterface[] = renterUsers.map(u => ({
      chatId: u.chat_id,
      message: PUSH_MESSAGE,
      markup: JSON.stringify({
        inline_keyboard: [
          [
            {
              url: `https://t.me/share/url?url=${getReferralLink(u.chat_id)}`,
              text: `${EMOJI_SHARE} Поделиться`,
            },
          ],
        ],
      }),
    }));
    if (!tasks.length) {
      return;
    }
    const scheduledFor = new Date();
    await queryRunner.query(
      format(
        `
          INSERT INTO tasks (type, data, scheduled_for) 
          VALUES %L
          ON CONFLICT DO NOTHING
        `,
        tasks.map(task => [TaskTypeEnumInterface.send_message, task, scheduledFor]),
      ),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE telegram_users DROP COLUMN referral_user_id
    `);
  }
}
