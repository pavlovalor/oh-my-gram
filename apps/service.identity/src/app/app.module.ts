import { Module } from "@nestjs/common";
import { ApplicationController } from "./app.controller";
import { ApplicationService } from "./app.service";
import { EnvironmentModule } from "@omg/environment-module";
import { EnvironmentSchema } from "./app.env-schema";

@Module({
  imports: [
    EnvironmentModule.forRoot({
      schema: EnvironmentSchema,
      cache: true,
    }),
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
