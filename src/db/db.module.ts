import { Global, Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

@Global()
@Module({
  providers: [
    {
      provide: 'DRIZZLE_DB',
      useFactory: async () => {
        const { DATABASE_URL } = process.env;

        if (!DATABASE_URL) {
          throw new Error(
            'DATABASE_URL is not defined in environment variables',
          );
        }

        const client = new Client({
          connectionString: DATABASE_URL,
        });
        await client.connect();
        console.log('Connected to the database');
        return drizzle(client);
      },
    },
  ],
  exports: ['DRIZZLE_DB'],
})
export class DatabaseModule {}
