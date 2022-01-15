import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTasksTable1642104490878 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE tasks (
            task_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            type varchar,
            data jsonb,
            scheduled_for timestamptz NOT NULL,
            completed_at timestamptz DEFAULT NULL ,
            created_at timestamptz NOT NULL DEFAULT now()
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE tasks`);
  }
}
