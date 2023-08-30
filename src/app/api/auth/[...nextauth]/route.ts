// import { authenticate } from "@/services/authService"
import NextAuth from 'next-auth'
import type { AuthOptions } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import axios from 'axios'
import https from 'https'

const agent = new https.Agent({
  rejectUnauthorized: false,
})

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        userName: { label: 'userName', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      //@ts-ignore
      async authorize(credentials, req) {
        console.log('credentials', credentials)
        if (typeof credentials !== 'undefined') {
          //   const res = await authenticate(credentials.email, credentials.password)
          let data = JSON.stringify({
            userName: credentials?.userName,
            password: credentials?.password,
          })

          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.BACKEND_URL}/Portallogin`,
            headers: {
              'Content-Type': 'application/json',
            },
            httpsAgent: agent,
            data: data,
          }
          let res = null
          try {
            const response = await axios.request(config)
            if (response?.data?.accessToken) {
              console.log('Access Token exists:', response?.data.accessToken)
              return response.data
            } else {
              console.log('Access Token is missing')
              return null
            }
          } catch (error) {
            console.log(error, 'credential error')
            return null
          }
        } else {
          return null
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    //@ts-ignore
    async session({ session, token, user }) {
      return { ...token, accessToken: token.accessToken }
    },
    async jwt({ token, user, account, profile }) {
      if (typeof user !== 'undefined') {
        // user has just signed in so the user object is populated
        return (user as unknown) as JWT
      }
      return token
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
