import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WidgetsModule } from './widgets/widgets.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    WidgetsModule,
    ConfigModule.forRoot({ isGlobal: true }), // Load environment variables globally
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
