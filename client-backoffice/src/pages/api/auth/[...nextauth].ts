import { login } from "@/features/Users/hooks/useLoginQuery";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/auth/signin',
    },
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "example@gmail.com" },
                password: { label: "Contraseña", type: "password" }
            },
            authorize: async (credentials) => {
                try {
                    if (!credentials) {
                        return null;
                    }
                    const userResponse = await login(credentials.email, credentials.password);
                    const user = userResponse.data;
                    if (user) {
                        return user;
                    } else {
                        return null;
                    }
                }
                catch (error) {
                    console.log(error)
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        })
    ],
});
