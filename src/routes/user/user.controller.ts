import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  signup(@Body(new ValidationPipe()) dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }

  login() {
    return 'login';
  }

  me() {
    return 'me';
  }

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }
}
