import { Inject } from "@nestjs/common";
import { UnsplashTokens } from "../unsplash.tokens";

export const InjectUnsplash = (): ReturnType<typeof Inject> => Inject(UnsplashTokens.UnsplashService);