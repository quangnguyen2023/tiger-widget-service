import { PartialType } from '@nestjs/mapped-types';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateWidgetDto {
  @IsString()
  id: string;

  @IsString()
  owner: string;

  @IsString()
  type: string;

  @IsObject()
  customValues: Record<string, any>;

  @IsString()
  @IsOptional()
  name: string;
}

export class UpdateWidgetDto extends PartialType(CreateWidgetDto) {}
