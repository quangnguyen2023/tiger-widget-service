import { IsDate, IsOptional, IsString } from 'class-validator';

export class OAuthProfileDto {
  @IsString()
  provider: string; // 'google', 'twitter', ...

  @IsString()
  providerAccountId: string; // id từ provider

  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  accessToken?: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;

  @IsString()
  @IsOptional()
  tokenType?: string;

  @IsString()
  @IsOptional()
  scope?: string;

  @IsDate()
  @IsOptional()
  expiresAt?: Date;
}
