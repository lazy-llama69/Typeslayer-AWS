import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/*== Schema Definition =====================================================
The schema defines a `GameState` table to store game-related information.
The `owner` field ensures that only the authenticated user can access their
own game data. Additionally, fields such as `level` and `score` have been
added for future expansion.
=========================================================================*/
const schema = a.schema({
  GameState: a
    .model({
      userId: a.string(),          // Unique identifier for the user
      hasGame: a.boolean(),        // Indicates if the user has an existing game
      level: a.integer(),           // (Optional) Current level in the game
      score: a.integer(),           // (Optional) User's current score
    })
    .authorization((allow) => [
      allow.owner(),
    ]),
});
export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});