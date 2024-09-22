import { MigrationInterface, QueryRunner } from "typeorm";

export class A1727034569848 implements MigrationInterface {
    name = 'A1727034569848'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order_products" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "price" integer NOT NULL, "quantity" integer NOT NULL, "productId" integer, "order_id" integer, CONSTRAINT "PK_3e59f094c2dc3310d585216a813" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "images" ("id" SERIAL NOT NULL, "cloudinary_image_id" character varying(140) NOT NULL, "image_url" character varying(200) NOT NULL DEFAULT '/example.png', "productId" integer, CONSTRAINT "PK_1fe148074c6a1a91b63cb9ee3c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" character varying(80) NOT NULL, "category" "public"."products_category_enum" NOT NULL, "regular_price" integer NOT NULL DEFAULT '50', "discount" integer NOT NULL DEFAULT '10', "price" integer NOT NULL, "inventory" integer NOT NULL DEFAULT '10', "subcategory" "public"."products_subcategory_enum" NOT NULL, "description" character varying(2000) NOT NULL, "body" character varying(40), "neck" character varying(40), "bridge_pickup" character varying(40), "middle_pickup" character varying(40), "neck_pickup" character varying(40), "frets_number" integer, "left_handed" boolean, "strings_number" integer, "pickups" "public"."products_pickups_enum", "tremolo" boolean, "pickups_active" boolean, "pickups_type" "public"."products_pickups_type_enum", "speakers" character varying, "power" integer, "weight" real, "foot_switch_connection" boolean, "channels" integer, "memory_slots" integer, "headphone_output" boolean, "effects_processor" boolean, "recording_output" boolean, "reverb" boolean, "line_input" integer, "pickup_strings_number" integer, "active" boolean, "output" "public"."products_output_enum", "kappe" boolean, "wiring" integer, "pickup" "public"."products_pickup_enum", "aux_port" boolean, "usb_port" boolean, "effects" boolean, "amp_modeling" boolean, "drum_computer" boolean, "is_featured" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4c9fb58de893725258746385e16" UNIQUE ("name"), CONSTRAINT "CHK_819681d4b05acb7e7f6b26ad09" CHECK ("discount" >= 0 AND "discount" <= 99), CONSTRAINT "CHK_cea6a50a614aced573a256ac4f" CHECK ("regular_price" >= 1 AND "regular_price" <= 100000000), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4c9fb58de893725258746385e1" ON "products" ("name") `);
        await queryRunner.query(`CREATE TABLE "reviews" ("id" SERIAL NOT NULL, "comment" character varying(1000) NOT NULL, "rating" integer NOT NULL, "is_reported" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "product_id" integer, "user_id" integer, CONSTRAINT "CHK_69102a4b1cf23cd923a159b3b3" CHECK ("rating" > 0 AND "rating" <= 5 ), CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying(50) NOT NULL, "password" character varying(100) NOT NULL, "first_name" character varying(40), "last_name" character varying(40), "post_code" character varying(10), "address" character varying(40), "city" character varying(40), "country" "public"."users_country_enum", "phone_number" character varying(20), "role" "public"."users_role_enum" NOT NULL DEFAULT 'admin', "refreshToken" character varying, "forgotPasswordToken" character varying, "forgotPasswordTokenExpirationDate" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "total" integer NOT NULL, "status" "public"."orders_status_enum" NOT NULL DEFAULT 'waiting for payment', "client_secret" character varying(140), "payment_intent_id" character varying(140), "delivery_method" character varying(40) NOT NULL, "delivery_cost" integer NOT NULL, "email" character varying(50) NOT NULL, "first_name" character varying(40) NOT NULL, "last_name" character varying(40) NOT NULL, "post_code" character varying(10) NOT NULL, "address" character varying(40) NOT NULL, "city" character varying(40) NOT NULL, "country" "public"."orders_country_enum" NOT NULL DEFAULT 'Poland', "phone_number" character varying(40) NOT NULL, "user_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "delivery_methods" ("id" SERIAL NOT NULL, "supplier" character varying(40) NOT NULL, "cost" integer NOT NULL, "time" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b132b8e27b47f534a392329add8" UNIQUE ("supplier"), CONSTRAINT "PK_760e4da6c00c0555428cb4d0617" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "order_products" ADD CONSTRAINT "FK_27ca18f2453639a1cafb7404ece" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_products" ADD CONSTRAINT "FK_f258ce2f670b34b38630914cf9e" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "images" ADD CONSTRAINT "FK_7af50639264735c79e918af6089" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_9482e9567d8dcc2bc615981ef44" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_728447781a30bc3fcfe5c2f1cdf" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_728447781a30bc3fcfe5c2f1cdf"`);
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_9482e9567d8dcc2bc615981ef44"`);
        await queryRunner.query(`ALTER TABLE "images" DROP CONSTRAINT "FK_7af50639264735c79e918af6089"`);
        await queryRunner.query(`ALTER TABLE "order_products" DROP CONSTRAINT "FK_f258ce2f670b34b38630914cf9e"`);
        await queryRunner.query(`ALTER TABLE "order_products" DROP CONSTRAINT "FK_27ca18f2453639a1cafb7404ece"`);
        await queryRunner.query(`DROP TABLE "delivery_methods"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4c9fb58de893725258746385e1"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "images"`);
        await queryRunner.query(`DROP TABLE "order_products"`);
    }

}
