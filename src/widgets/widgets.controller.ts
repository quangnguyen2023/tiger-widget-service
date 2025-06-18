import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { widgetsTable } from 'src/db/schema';
import { WidgetsService } from 'src/widgets/widgets.service';

type Widget = typeof widgetsTable.$inferInsert;

@Controller('widgets')
export class WidgetsController {
  constructor(private readonly widgetService: WidgetsService) {}

  @Get()
  async findAll() {
    try {
      return await this.widgetService.findAll();
    } catch (error) {
      this.handleError(error, 'Failed to retrieve widgets');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const widget = await this.widgetService.findOne(id);
      if (!widget) {
        throw new NotFoundException(`Widget with ID ${id} not found`);
      }
      return widget;
    } catch (error) {
      this.handleError(error, 'Failed to retrieve widget');
    }
  }

  @Post()
  async create(@Body() createWidgetDto: Widget) {
    try {
      if (!createWidgetDto) {
        throw new BadRequestException('Invalid widget data');
      }
      return await this.widgetService.create(createWidgetDto);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateWidgetDto: Widget) {
    try {
      const updatedWidget = await this.widgetService.update(
        id,
        updateWidgetDto,
      );
      if (!updatedWidget) {
        throw new NotFoundException(`Widget with ID ${id} not found`);
      }
      return updatedWidget;
    } catch (error) {
      this.handleError(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const deleted = await this.widgetService.remove(id);
      if (!deleted) {
        throw new NotFoundException(`Widget with ID ${id} not found`);
      }
      return deleted;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any, defaultMessage?: string) {
    if (
      error instanceof NotFoundException ||
      error instanceof BadRequestException ||
      error instanceof ConflictException
    ) {
      throw error;
    }
    throw new InternalServerErrorException(
      defaultMessage || error.message || 'An unexpected error occurred',
    );
  }
}
