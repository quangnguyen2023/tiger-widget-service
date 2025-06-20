import { Global, Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

@Global()
@Module({
  providers: [
    {
      provide: 'DRIZZLE_DB',
      useFactory: async () => {
        const connectionString = process.env.DATABASE_URL;

        if (!connectionString) {
          throw new Error(
            'DATABASE_URL is not defined in environment variables',
          );
        }

        const client = new Client({ connectionString });
        await client.connect();
        console.log('Connected to the database');
        return drizzle(client);
      },
    },
  ],
  exports: ['DRIZZLE_DB'],
})
export class DatabaseModule {}
