import { convexAuth } from "@convex-dev/auth/server";
import Email from "@auth/core/providers/email";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Email({
      from: "noreply@localhost.dev",
    }),
  ],
});