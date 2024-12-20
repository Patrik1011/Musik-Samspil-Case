import { ConfigService } from "@nestjs/config";

export const getTestCredentials = (configService: ConfigService) => ({
  email: configService.get<string>("TEST_USER_EMAIL"),
  password: configService.get<string>("TEST_USER_PASSWORD"),
  first_name: configService.get<string>("TEST_USER_FIRST_NAME"),
  last_name: configService.get<string>("TEST_USER_LAST_NAME"),
  phone_number: configService.get<string>("TEST_USER_PHONE"),
  instrument: configService.get<string>("TEST_USER_INSTRUMENT"),
});
