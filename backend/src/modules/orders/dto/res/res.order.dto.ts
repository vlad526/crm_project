import { ApiProperty } from '@nestjs/swagger';
import { CoursesEnum } from '../../../../database/entities/enums/courses.enum';
import { FormatsEnum } from '../../../../database/entities/enums/formats.enum';
import { TypesEnum } from '../../../../database/entities/enums/types.enum';
import { StatusesEnum } from '../../../../database/entities/enums/statuses.enum';

export class ResponseOrderDto {
  @ApiProperty({ example: '1' })
  id!: string;

  @ApiProperty({ example: 'Vlad' })
  name?: string;

  @ApiProperty({ example: 'Popov' })
  surname?: string;

  @ApiProperty({ example: 'vlad@gmail.com' })
  email?: string;

  @ApiProperty({ example: '+380 67747474' })
  phone?: string;

  @ApiProperty({ example: 20 })
  age?: number;

  @ApiProperty({ example: 'FC' })
  course?: CoursesEnum;

  @ApiProperty({ example: 'Online' })
  course_format?: FormatsEnum;

  @ApiProperty({ example: 'VIP' })
  course_type?: TypesEnum;

  @ApiProperty({ example: 1000 })
  sum?: number;

  @ApiProperty({ example: 1000 })
  alreadyPaid?: number;

  @ApiProperty({ example: 'facebook', nullable: true })
  utm?: string;

  @ApiProperty({ example: 'Call after 6PM', nullable: true })
  msg?: string;

  @ApiProperty({ example: 'NEW', nullable: true })
  status?: StatusesEnum;

  @ApiProperty({ example: '2026-03-01T12:00:00.000Z', nullable: true })
  created_at?: Date | string | null;

  @ApiProperty({
    type: () => Object,
    example: { id: 1, name: 'march-2025' },
    nullable: true,
  })
  group?: { id: number; name: string };

  @ApiProperty({
    type: () => Object,
    example: { id: 123, name: 'Vlad', surname: 'Popov' },
    nullable: true,
  })
  manager?: { id: number; name?: string; surname?: string };
}