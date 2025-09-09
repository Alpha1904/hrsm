import {
  Body,
  Controller,
  Delete,
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

  // Get all users
  @Get('all')
  async getAll() {
    return await this.userService.getAll();
  }

  // Get all managers with comprehensive data
  @Get('managers')
  async getAllManagers() {
    return await this.userService.getAllManagers();
  }

  // Get all HrAdmin
  @Get('hradmins')
  async getAllHrAdmins() {
    return await this.userService.getAllHrAdmins();
  }
  // Get all employees with comprehensive data
  @Get('employees')
  async getAllEmployees() {
    return await this.userService.getAllEmployees();
  }

  //Get manager by manager ID with comprehensive data
  @Get('manager/:managerId')
  async getManagerById(@Param('managerId', ParseIntPipe) managerId: number) {
    return await this.userService.getManagerById(managerId);
  }

  // get hrAdmin by Id
  @Get('hradmin/:hrAdminId')
  async getHrAdminById(@Param('hrAdminId', ParseIntPipe) hrAdminId: number) {
    return await this.userService.getHrAdminById(hrAdminId);
  }
  // Create a new user

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }
  // Get user by ID with relations
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.findUserWithRelations(id);
  }
  // Get employee by ID with comprehensive data
  @Get('employee/:employeeId')
  async getEmployeeById(@Param('employeeId', ParseIntPipe) employeeId: number) {
    return await this.userService.getEmployeeById(employeeId);
  }

  // Update employee details
  @Patch('employee/:employeeId')
  async updateEmployee(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Body() updateEmployeeDetailsDto: UpdateEmployeeDetailsDto,
  ) {
    return await this.userService.updateEmployeeDetails(
      employeeId,
      updateEmployeeDetailsDto,
    );
  }
  // Update HR Admin managed sites
  @Patch('sites/:hrAdminId')
  async updateHRAdminSites(
    @Param('hrAdminId', ParseIntPipe) hrAdminId: number,
    @Body() updateHRAdminSitesDto: UpdateHRAdminSitesDto,
  ) {
    return await this.userService.updateHRAdminSites(
      hrAdminId,
      updateHRAdminSitesDto.sitesManaged,
    );
  }
  // Delete user by ID
  @Delete('delete/:userId')
  async deleteUser(@Param('userId', ParseIntPipe) userId: number) {
    return await this.userService.deleteUser(userId);
  }
}
