import { ConflictException, Injectable } from '@nestjs/common';
import { GroupRepository } from '../../../../repository/services/group.repository';
import { GroupCreateDto } from '../../models/group-create.dto';
import { GroupResDto } from '../../models/group-res.dto';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  async create(dto: GroupCreateDto): Promise<GroupResDto> {
    const isNameTaken = await this.groupRepository.findOneBy({
      name: dto.name,
    });

    if (isNameTaken) {
      throw new ConflictException('Group name is already taken');
    }

    const newGroup = this.groupRepository.create(dto);
    return await this.groupRepository.save(newGroup);
  }

  async findAll(): Promise<GroupResDto[]> {
    return this.groupRepository.find({
      order: { name: 'ASC' },
    });
  }
}