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
} from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { Organization } from '../dtos/organization.dto';

@Controller('organizations')
@Swagger.ApiTags('Organizations')
export class OrganizationController {
  @Get()
  @Swagger.ApiOperation({
    summary: 'Retrieve the collection of Organization ressource.',
  })
  @Swagger.ApiOkResponse({ type: Organization, isArray: true })
  async getCollection(): Promise<Organization[]> {
    throw new Error('Not implemented');
  }

  @Get(':id')
  @Swagger.ApiOperation({ summary: 'Retrieve a Organization ressource.' })
  @Swagger.ApiOkResponse({ type: Organization })
  @Swagger.ApiNotFoundResponse({ description: 'Resource not found' })
  async getItem(@Param('id', ParseUUIDPipe) id: string): Promise<Organization> {
    throw new Error('Not implemented');
  }

  @Post()
  @Swagger.ApiOperation({ summary: 'Creates a Organization ressource.' })
  @Swagger.ApiCreatedResponse({ type: Organization })
  async create(@Body() body: Organization): Promise<void> {
    throw new Error('Not implemented');
  }

  @Patch(':id')
  @Swagger.ApiOperation({ summary: 'Updates a Organization ressource.' })
  @Swagger.ApiCreatedResponse({ type: Organization })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: Organization,
  ) {
    throw new Error('Not implemented');
  }

  @Delete(':id')
  @Swagger.ApiOperation({ summary: 'Deletes a Organization ressource.' })
  @Swagger.ApiOkResponse()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    throw new Error('Not implemented');
  }
}
