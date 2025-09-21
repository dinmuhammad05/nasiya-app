import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AccessRoles } from '../../common/enum/roles.enum';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Payment } from 'src/core/entity/payment.entity';
import { Roles } from 'src/common/decorator/roles.decorato';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(RolesGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  @Roles(AccessRoles.STORE)
  @ApiOperation({ summary: 'Create payment' })
  @ApiCreatedResponse({
    type: Payment,
    description: 'Payment created successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentService.create(dto);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  @ApiOkResponse({
    type: [Payment],
    description: 'All payments retrieved successfully',
  })
  findAll() {
    return this.paymentService.findAll();
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiOkResponse({ type: Payment, description: 'Payment found' })
  @ApiNotFoundResponse({ description: 'Payment not found' })
  findOne(@Param('id') id: string) {
    return this.paymentService.findOneById(id);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  @Roles(AccessRoles.STORE)
  @ApiOperation({ summary: 'Update payment' })
  @ApiOkResponse({ type: Payment, description: 'Payment updated successfully' })
  @ApiNotFoundResponse({ description: 'Payment not found' })
  update(@Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    return this.paymentService.update(id, dto);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(AccessRoles.STORE)
  @ApiOperation({ summary: 'Delete payment' })
  @ApiOkResponse({ description: 'Payment deleted successfully' })
  @ApiNotFoundResponse({ description: 'Payment not found' })
  remove(@Param('id') id: string) {
    return this.paymentService.delete(id);
  }
}
