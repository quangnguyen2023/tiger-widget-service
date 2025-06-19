import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { widgetsTable } from 'src/db/schema';
import { CreateWidgetDto, UpdateWidgetDto } from 'src/widgets/dto/widgets.dto';

@Injectable()
export class WidgetsService {
  constructor(
    @Inject('DRIZZLE_DB') private readonly db: ReturnType<typeof drizzle>,
  ) {}

  async findAll() {
    console.log('🚀 ~ db:', this.db);

    try {
      if (!this.db) {
        throw new Error('Database connection is not initialized');
      }

      const widgets = await this.db.select().from(widgetsTable);
      console.log('🚀 ~ widgets:', widgets);

      if (!Array.isArray(widgets)) {
        throw new Error('Invalid response from database');
      }
      return widgets;
    } catch (error) {
      throw new Error(`Failed to fetch widgets: ${error.message}`);
    }
  }

  async findOne(id: string) {
    try {
      const results = await this.db
        .select()
        .from(widgetsTable)
        .where(eq(widgetsTable.id, id));

      if (!results[0]) {
        throw new NotFoundException(`Widget with ID "${id}" not found`);
      }
      return results[0];
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new Error(`Failed to fetch widget: ${error.message}`);
    }
  }

  async create(createWidgetDto: CreateWidgetDto) {
    // Check if a widget already exists
    const existing = await this.db
      .select()
      .from(widgetsTable)
      .where(eq(widgetsTable.id, createWidgetDto.id));

    if (existing.length > 0) {
      throw new ConflictException('A widget with this id already exists');
    }

    try {
      const [result] = await this.db
        .insert(widgetsTable)
        .values(createWidgetDto)
        .returning();
      return result;
    } catch (error) {
      throw new Error(`Failed to create widget: ${error.message}`);
    }
  }

  async update(id: string, updateWidgetDto: UpdateWidgetDto) {
    try {
      const [result] = await this.db
        .update(widgetsTable)
        .set(updateWidgetDto)
        .where(eq(widgetsTable.id, id))
        .returning();
      if (!result) {
        throw new NotFoundException(`Widget with ID "${id}" not found`);
      }
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new Error(`Failed to update widget: ${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      const [result] = await this.db
        .delete(widgetsTable)
        .where(eq(widgetsTable.id, id))
        .returning();
      if (!result) {
        throw new NotFoundException(`Widget with ID "${id}" not found`);
      }
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new Error(`Failed to delete widget: ${error.message}`);
    }
  }
}
