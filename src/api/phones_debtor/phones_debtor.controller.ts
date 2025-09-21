import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PhonesDebtorService } from './phones_debtor.service';
import { CreatePhonesDebtorDto } from './dto/create-phones_debtor.dto';
import { UpdatePhonesDebtorDto } from './dto/update-phones_debtor.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('PhonesDebtor')
@Controller('phones-debtor')
export class PhonesDebtorController {
  constructor(private readonly phonesDebtorService: PhonesDebtorService) {}

  @Post()
  @ApiOperation({ summary: 'Add a phone number to a debtor' })
  create(@Body() createDto: CreatePhonesDebtorDto) {
    return this.phonesDebtorService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all phone numbers of debtors' })
  findAll() {
    return this.phonesDebtorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a phone record by ID' })
  findOne(@Param('id') id: string) {
    return this.phonesDebtorService.findOneById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a phone record by ID' })
  update(@Param('id') id: string, @Body() updateDto: UpdatePhonesDebtorDto) {
    return this.phonesDebtorService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a phone record by ID' })
  remove(@Param('id') id: string) {
    return this.phonesDebtorService.remove(id);
  }
}
