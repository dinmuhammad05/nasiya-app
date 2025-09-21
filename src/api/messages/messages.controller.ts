import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
  Get,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorator/roles.decorato';
import { AccessRoles } from 'src/common/enum/roles.enum';
import { IResponse } from 'src/common/interface/response.interface';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageService } from './messages.service';

@ApiTags('Messages')
@ApiBearerAuth()
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @Roles(AccessRoles.ADMIN, AccessRoles.STORE)
  @ApiOperation({ summary: 'Create new Message' })
  @ApiResponse({ status: 201, description: 'Message created successfully' })
  create(@Body() dto: CreateMessageDto): Promise<IResponse> {
    return this.messageService.create(dto);
  }

  @Patch(':id')
  @Roles(AccessRoles.ADMIN, AccessRoles.STORE)
  @ApiOperation({ summary: 'Update Message by id' })
  @ApiResponse({ status: 200, description: 'Message updated successfully' })
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() dto: UpdateMessageDto,
  ): Promise<IResponse> {
    return this.messageService.update(id, dto);
  }

  @Get(':id')
  @Roles(AccessRoles.ADMIN, AccessRoles.STORE)
  @ApiOperation({ summary: 'Get Message by id' })
  @ApiResponse({ status: 200, description: 'Message retrieved successfully' })
  findOne(@Param('id', ParseIntPipe) id: string): Promise<IResponse> {
    return this.messageService.findOneById(id);
  }

  @Delete(':id')
  @Roles(AccessRoles.ADMIN, AccessRoles.STORE)
  @ApiOperation({ summary: 'Delete Message by id' })
  @ApiResponse({ status: 200, description: 'Message deleted successfully' })
  remove(@Param('id', ParseIntPipe) id: string): Promise<IResponse> {
    return this.messageService.delete(id);
  }
}
