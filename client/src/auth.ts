import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false,
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
        name: {},
        isSignUp: {},
      },
      async authorize(credentials) {
        const { email, password, name, isSignUp } = credentials as any;
        if (!email || !password) return null;

        if (isSignUp === 'true') {
          const exists = await pool.query(
            'SELECT id FROM users WHERE email = $1', [email]
          );
          if (exists.rows.length > 0) throw new Error('Email already exists');
          const hashed = await bcrypt.hash(password, 12);
          const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashed]
          );
          return result.rows[0];
        } else {
          const result = await pool.query(
            'SELECT * FROM users WHERE email = $1', [email]
          );
          if (result.rows.length === 0) throw new Error('No user found');
          const user = result.rows[0];
          if (!user.password) throw new Error('Use Google to sign in');
          const valid = await bcrypt.compare(password, user.password);
          if (!valid) throw new Error('Invalid password');
          return { id: user.id, name: user.name, email: user.email };
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        await pool.query(
          `INSERT INTO users (name, email, image)
           VALUES ($1, $2, $3)
           ON CONFLICT (email) DO UPDATE SET name = $1, image = $3`,
          [user.name, user.email, user.image]
        );
      }
      return true;
    },
  },
  pages: { signIn: '/auth/signin' },
  session: { strategy: 'jwt' },
});