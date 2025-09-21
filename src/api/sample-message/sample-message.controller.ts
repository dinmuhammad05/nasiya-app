import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SampleMessageService } from './sample-message.service';
import { CreateSampleMessageDto } from './dto/create-sample-message.dto';
import { UpdateSampleMessageDto } from './dto/update-sample-message.dto';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorato';
import { AccessRoles } from 'src/common/enum/roles.enum';

@ApiTags('Sample Messages')
@Controller('sample-messages')
@UseGuards(RolesGuard)
export class SampleMessageController {
  constructor(private readonly sampleMessageService: SampleMessageService) {}

  @Post()
  @Roles(AccessRoles.SUPER_ADMIN, AccessRoles.ADMIN)
  @ApiOperation({ summary: 'Create new sample message' })
  @ApiResponse({
    status: 201,
    description: 'Sample message created successfully',
  })
  @ApiResponse({ status: 404, description: 'Store not found' })
  create(@Body() dto: CreateSampleMessageDto) {
    return this.sampleMessageService.create(dto);
  }

  @Get()
  @Roles(AccessRoles.SUPER_ADMIN, AccessRoles.ADMIN, AccessRoles.STORE)
  @ApiOperation({ summary: 'Get all sample messages' })
  @ApiResponse({ status: 200, description: 'List of sample messages' })
  findAll() {
    return this.sampleMessageService.findAll();
  }

  @Get(':id')
  @Roles(AccessRoles.SUPER_ADMIN, AccessRoles.ADMIN, AccessRoles.STORE)
  @ApiOperation({ summary: 'Get sample message by ID' })
  @ApiResponse({ status: 200, description: 'Sample message found' })
  @ApiResponse({ status: 404, description: 'Sample message not found' })
  findOne(@Param('id') id: string) {
    return this.sampleMessageService.findOneById(id);
  }

  @Patch(':id')
  @Roles(AccessRoles.SUPER_ADMIN, AccessRoles.ADMIN)
  @ApiOperation({ summary: 'Update sample message' })
  @ApiResponse({
    status: 200,
    description: 'Sample message updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Sample message not found / Store not found',
  })
  update(@Param('id') id: string, @Body() dto: UpdateSampleMessageDto) {
    return this.sampleMessageService.update(id, dto);
  }

  @Delete(':id')
  @Roles(AccessRoles.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete sample message' })
  @ApiResponse({
    status: 200,
    description: 'Sample message deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Sample message not found' })
  remove(@Param('id') id: string) {
    return this.sampleMessageService.delete(id);
  }
}
