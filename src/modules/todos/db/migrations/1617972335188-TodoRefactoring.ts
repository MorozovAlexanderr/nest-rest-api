import { MigrationInterface, QueryRunner } from 'typeorm';

export class TodoRefactoring1617972335188 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE todo CHANGE title name varchar(255)');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE todo CHANGE name title varchar(255)'); // reverts things made in "up" method
  }
}
