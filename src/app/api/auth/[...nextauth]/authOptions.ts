import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { userLogin, getMe } from "@/lib/api";
import { User } from "@/types/user";
 // Adjust the import path as necessary

const getAccessTokenExpiry = (accessToken: string) => {
  try {
    const [, payload] = accessToken.split(".")
    const decoded = JSON.parse(Buffer.from(payload, "base64").toString("utf-8"))
    return typeof decoded?.exp === "number" ? decoded.exp * 1000 : null
  } catch {
    return null
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { name, password } = credentials;
        const userRes = await userLogin(name, password);
        if (!userRes || !userRes.token) {
          return null;
        }
        const userProfile = await getMe(userRes.token);
        return {...userProfile, accessToken: userRes.token };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const userData = user as User
        token.id = userData.id;
        token.name = userData.name;
        token.email = userData.email;
        token.profilePicture = userData.profilePicture;
        token.chips = userData.chips;
        if (userData.accessToken) {
          token.accessToken = userData.accessToken;
          token.accessTokenExpires = getAccessTokenExpiry(userData.accessToken)
        }
      }

      if (typeof token.accessTokenExpires === "number" && Date.now() >= token.accessTokenExpires) {
        token.error = "AccessTokenExpired"
        delete token.accessToken
      }
      return token;
    },
    //เอา user จาก jwt มาใส่ใน session
    async session({ session, token }) {
      if (token.error === "AccessTokenExpired") {
        // Return session without user to indicate unauthenticated while keeping types compatible
        return { ...session, user: undefined };
      }
      session.user = {
          _id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          role: token.role as string,
          profilePicture: token.profilePicture as string, // Optional, if you have a profile picture
          chips: token.chips as number, // Assuming chips is a number, adjust type as necessary
      };
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
