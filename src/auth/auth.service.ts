import {
  Inject,
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { and, eq } from 'drizzle-orm';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { accountsTable, usersTable } from 'src/db/schema';
import * as bcrypt from 'bcrypt';
import { SignInDto } from 'src/auth/dto/sign-in.dto';
import { OAuthProfileDto } from 'src/auth/dto/oauth-profile.dto';
import { numberToTimestamp } from 'utils';

@Injectable()
export class AuthService {
  constructor(
    @Inject('DRIZZLE_DB') private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async handleOAuth(profile: OAuthProfileDto) {
    // Tìm account theo profileAccountId trong accountsTable
    const [account] = await this.db
      .select()
      .from(accountsTable)
      .where(
        and(
          eq(accountsTable.provider, profile.provider),
          eq(accountsTable.providerAccountId, profile.providerAccountId),
        ),
      );

    // Nếu tồn tại account -> trả về user info trong bảng users
    if (account) {
      const [user] = await this.db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, account.userId as string));
      return user;
    }

    // Nếu không, tiếp tục Tìm user theo profile.email trong usersTable
    let [user] = await this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, profile.email));

    // Nếu không có user, tạo mới user theo info từ profile
    if (!user) {
      const [newUser] = await this.db
        .insert(usersTable)
        .values({
          email: profile.email,
          name: profile.name,
          avatar: profile.avatar,
          emailVerified: true,
        })
        .returning();
      user = newUser;
    }

    // Tạo account mới liên kết user với provider
    await this.db.insert(accountsTable).values({
      userId: user.id,
      provider: profile.provider,
      providerAccountId: profile.providerAccountId,
      accessToken: profile.accessToken,
      refreshToken: profile.refreshToken,
      tokenType: profile.tokenType,
      scope: profile.scope,
      expiresAt: profile.expiresAt
        ? (numberToTimestamp(profile.expiresAt) as Date)
        : null,
    });

    return user;
  }

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
