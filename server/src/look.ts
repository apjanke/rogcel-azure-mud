import { Context } from "@azure/functions";
import { User, PublicUser } from "./user";

export function look(target: string, context: Context) {
  const profile: PublicUser = {
    id: "lazerwalker",
    realName: "Em Lazer-Walker",
    pronouns: "she/her or they/them",
    description:
      "She looks around bewildered, clearly not used to seeing the world in text form",
    askMeAbout: "Proc gen, tool-building, non-traditional interfaces!",
    twitterHandle: "lazerwalker",
    url: "https://lazerwalker.com",
  };

  context.res = {
    status: 200,
    body: { user: profile },
  };
}
