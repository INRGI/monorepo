import { FactoryProvider } from "@nestjs/common";
import { UnsplashTokens } from "../unsplash.tokens";
import { UnsplashOptions } from "../interfaces";
import { UnsplashService } from "../services/unsplash.service";

export const serviceProviders: FactoryProvider[] = [
    {
      provide: UnsplashTokens.UnsplashService,
      useFactory: (options: UnsplashOptions) => {
        return new UnsplashService(options);
      },
      inject: [UnsplashTokens.UnsplashModuleOptions],
    },
  ];