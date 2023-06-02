import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1685699222434 implements MigrationInterface {
  name = 'Migrations1685699222434';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, CONSTRAINT "UQ_5b49bd22c967ce2829ca8f17720" UNIQUE ("email"), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "profiles"`);
  }
}
