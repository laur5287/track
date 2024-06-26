import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
import { redirect } from "next/navigation";
// import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter"

// const credentialsConfig = CredentialsProvider({
//   name: "Credentials",
//   credentials: {
//     username: {
//       label: "User Name",
//     },
//     password: {
//       label: "Password",
//       type: "password",
//     },
//   },
//   async authorize(credentials) {
//     if (credentials.username === "sk" && credentials.password === "123")
//       return {
//         name: "Vahid",
//       };
//     else return null;
//   },
// });

export const authConfig = {
 adapter: PrismaAdapter(prisma),
 secret:'019f21cd217855d2230d085898ee1aaf9f9a474896c29a461b180e8a70a0e858',
  providers: [Google,
    // credentialsConfig
   ],
   events: {
    signIn: async ({ user, account, profile }) => {
     // console.log('User signed in:', user);
     // console.log('Account:', account);
     // console.log('Profile:', profile);
  
    }
  
   },
  callbacks: {
authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const paths = ["/", "/track"]
      const isProtected = paths.some((path) => nextUrl.pathname.startsWith(path))

      if (isProtected && !isLoggedIn) {
        const redirectUrl = new URL("api/auth/signin", nextUrl.origin)
        redirectUrl.searchParams.append("callbackUrl", nextUrl.href)
        return Response.redirect(redirectUrl)
      }
      
      return true
    },
    
    
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);