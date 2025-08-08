import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// カスタムユーザー型の定義
interface CustomUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

// セッションの型を拡張
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "ユーザー名", type: "text" },
        password: { label: "パスワード", type: "password" }
      },
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // 環境変数から管理者アカウントを取得
        const adminUsername = process.env.ADMIN_USERNAME || "nnzzm";
        const adminPassword = process.env.ADMIN_PASSWORD || "nnzzm0863";

        if (
          credentials.username === adminUsername &&
          credentials.password === adminPassword
        ) {
          return {
            id: "1",
            name: "管理者",
            email: "nzm91264@gmail.com",
            role: "nnzzm",
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as CustomUser).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});

export { handler as GET, handler as POST };
