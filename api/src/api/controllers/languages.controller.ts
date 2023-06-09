/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseUUIDPipe,
  Logger,
} from '@nestjs/common';
import { Language } from '../dtos/language.dto';
import * as Swagger from '@nestjs/swagger';

@Controller('languages')
@Swagger.ApiTags('Languages')
export class LanguagesController {
  private readonly logger = new Logger(LanguagesController.name);

  @Get()
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of Language ressource.',
  })
  @Swagger.ApiOkResponse({ type: Language, isArray: true })
  async getCollection(): Promise<Language[]> {
    throw new Error('Not implemented');
  }

  @Get(':id')
  @Swagger.ApiOperation({ summary: 'Retrieve a Language ressource.' })
  @Swagger.ApiOkResponse({ type: Language })
  @Swagger.ApiNotFoundResponse({ description: 'Resource not found' })
  async getItem(@Param('id', ParseUUIDPipe) id: string): Promise<Language> {
    throw new Error('Not implemented');
  }

  @Post()
  @Swagger.ApiOperation({ summary: 'Creates a Language ressource.' })
  @Swagger.ApiCreatedResponse({ type: Language })
  @Swagger.ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() body: Language): Promise<void> {
    throw new Error('Not implemented');
  }

  @Patch(':id')
  @Swagger.ApiOperation({ summary: 'Updates a Language ressource.' })
  @Swagger.ApiCreatedResponse({ type: Language })
  @Swagger.ApiResponse({ status: 400, description: 'Invalid input' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() body: Language) {
    throw new Error('Not implemented');
  }

  @Delete(':id')
  @Swagger.ApiOperation({ summary: 'Removes a Language ressource.' })
  @Swagger.ApiOkResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    throw new Error('Not implemented');
  }
}
