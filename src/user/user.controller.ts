import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateEmployeeDetailsDto } from './dto/update-employee-details.dto';
import { UpdateHRAdminSitesDto } from './dto/update-hr-admin-sites.dto';

@Controller('user')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  async getAll(){
    return await this.userService.getAll();
  }


  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

    @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findUserWithRelations(id);
  }

  @Patch(':employeeId/employee')
  async updateEmployee (
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Body() updateEmployeeDetailsDto: UpdateEmployeeDetailsDto,
  ) {
    return await this.userService.updateEmployeeDetails(employeeId, updateEmployeeDetailsDto);
  }
  @Patch(':hrAdminId/sites')
  async updateHRAdminSites(
    @Param('hrAdminId', ParseIntPipe) hrAdminId: number,
    @Body() updateHRAdminSitesDto: UpdateHRAdminSitesDto["sitesManaged"],
  ) {
    return await this.userService.updateHRAdminSites(hrAdminId, updateHRAdminSitesDto);
  }
}

