import {MigrationInterface, QueryRunner} from "typeorm";

export class PostRefactoringTIMESTAMP implements MigrationInterface {
    
    async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`
      CREATE TABLE public."user"
      (
          id integer NOT NULL DEFAULT nextval('user_id_seq'::regclass),
          "firstName" character varying COLLATE pg_catalog."default" NOT NULL,
          "lastName" character varying COLLATE pg_catalog."default" NOT NULL,
          email character varying COLLATE pg_catalog."default" NOT NULL,
          username character varying COLLATE pg_catalog."default" NOT NULL,
          "passwordHash" character varying COLLATE pg_catalog."default" NOT NULL,
          CONSTRAINT user_pkey PRIMARY KEY (id)
      );`);
    }

    async down(queryRunner: QueryRunner): Promise<any> { 
      await queryRunner.query(`DROP TABLE public."user";`);
    }

    
}