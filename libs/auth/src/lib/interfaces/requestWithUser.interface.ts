import { User } from "libs/users/src/lib/shemas/user.schema";

export interface RequestWithUser extends Request {
    user: User & { email: string };
  }