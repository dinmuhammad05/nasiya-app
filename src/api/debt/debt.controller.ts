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
import { DebtService } from './debt.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { AccessRoles } from '../../common/enum/roles.enum';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Roles } from 'src/common/decorator/roles.decorato';

@ApiTags('Debts')
@Controller('debts')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(AccessRoles.STORE)
  @Post()
  @ApiOperation({ summary: 'Create debt' })
  @ApiResponse({ status: 201, description: 'Debt created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() dto: CreateDebtDto) {
    return this.debtService.createDebt(dto);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  @ApiOperation({ summary: 'Get all debts' })
  @ApiResponse({ status: 200, description: 'All debts retrieved' })
  findAll() {
    return this.debtService.findAll();
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get debt by ID' })
  @ApiResponse({ status: 200, description: 'Debt found' })
  @ApiResponse({ status: 404, description: 'Debt not found' })
  findOne(@Param('id') id: string) {
    return this.debtService.findOneById(id);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  @Roles(AccessRoles.ADMIN)
  @ApiOperation({ summary: 'Update debt' })
  @ApiResponse({ status: 200, description: 'Debt updated successfully' })
  @ApiResponse({ status: 404, description: 'Debt not found' })
  update(@Param('id') id: string, @Body() dto: UpdateDebtDto) {
    return this.debtService.update(id, dto);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(AccessRoles.ADMIN)
  @ApiOperation({ summary: 'Delete debt' })
  @ApiResponse({ status: 200, description: 'Debt deleted successfully' })
  @ApiResponse({ status: 404, description: 'Debt not found' })
  remove(@Param('id') id: string) {
    return this.debtService.delete(id);
  }
}
