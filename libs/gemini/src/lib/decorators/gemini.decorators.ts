import { Inject } from "@nestjs/common";
import { GeminiTokens } from "../gemini.tokens";


export const InjectGemini = (): ReturnType<typeof Inject> => Inject(GeminiTokens.GeminiService);