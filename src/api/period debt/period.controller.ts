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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AccessRoles } from '../../common/enum/roles.enum';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Roles } from 'src/common/decorator/roles.decorato';
import { PeriodDebtService } from './period.service';
import { CreatePeriodDebtDto } from './dto/create-period.dto';
import { UpdatePeriodDebtDto } from './dto/update-period.dto';

@ApiTags('PeriodDebts')
@Controller('periodDebts')
@UseGuards(RolesGuard)
export class PeriodDebtController {
  constructor(private readonly periodService: PeriodDebtService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  @Roles(AccessRoles.STORE)
  @ApiOperation({ summary: 'Create period debt' })
  @ApiResponse({ status: 201, description: 'Period debt created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() dto: CreatePeriodDebtDto) {
    return this.periodService.create(dto);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  @ApiOperation({ summary: 'Get all period debts' })
  @ApiResponse({ status: 200, description: 'All period debts retrieved' })
  findAll() {
    return this.periodService.findAll();
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get period debt by ID' })
  @ApiResponse({ status: 200, description: 'Period debt found' })
  @ApiResponse({ status: 404, description: 'Period debt not found' })
  findOne(@Param('id') id: string) {
    return this.periodService.findOneById(id);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  @Roles(AccessRoles.STORE)
  @ApiOperation({ summary: 'Update period debt' })
  @ApiResponse({ status: 200, description: 'Period debt updated successfully' })
  @ApiResponse({ status: 404, description: 'Period debt not found' })
  update(@Param('id') id: string, @Body() dto: UpdatePeriodDebtDto) {
    return this.periodService.update(id, dto);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(AccessRoles.STORE)
  @ApiOperation({ summary: 'Delete period debt' })
  @ApiResponse({ status: 200, description: 'Period debt deleted successfully' })
  @ApiResponse({ status: 404, description: 'Period debt not found' })
  remove(@Param('id') id: string) {
    return this.periodService.delete(id);
  }
}