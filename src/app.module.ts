import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WidgetsModule } from './widgets/widgets.module';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    WidgetsModule,
    ConfigModule.forRoot({ isGlobal: true }), // Load environment variables globally
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
