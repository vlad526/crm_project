import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { GroupService } from './services/group--flat/group.service';
import { GroupCreateDto } from './models/group-create.dto';
import { GroupResDto } from './models/group-res.dto';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  create(@Body() dto: GroupCreateDto): Promise<GroupResDto> {
    return this.groupService.create(dto);
  }

  @Get()
  findAll(): Promise<GroupResDto[]> {
    return this.groupService.findAll();
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<GroupResDto | null> {
    return this.groupService.findOne(id);
  }
}
