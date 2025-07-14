import {
  Inject,
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { usersTable } from 'src/db/schema';
import * as bcrypt from 'bcrypt';
import { SignInDto } from 'src/auth/dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DRIZZLE_DB') private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async signIn({ email, password }: SignInDto) {
    const [user] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    // So sánh password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async signUp({ name, email, password }: SignUpDto) {
    const existing = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existing.length > 0) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await this.db
      .insert(usersTable)
      .values({ name, email, password: hashedPassword })
      .returning();

    return { message: 'Registration successful', user: user.email };
  }
}
