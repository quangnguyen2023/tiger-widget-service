import { Module } from '@nestjs/common';
import { WidgetsController } from './widgets.controller';
import { WidgetsService } from './widgets.service';
import { DatabaseModule } from 'src/db/db.module';

@Module({
  imports: [DatabaseModule],
  controllers: [WidgetsController],
  providers: [WidgetsService],
})
export class WidgetsModule {}
