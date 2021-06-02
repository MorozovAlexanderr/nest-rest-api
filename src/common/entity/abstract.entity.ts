import { AbstractDto } from '../dto/abstract.dto';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UtilsService } from '../providers/utils.service';
import { Exclude } from 'class-transformer';

export abstract class AbstractEntity<T extends AbstractDto = AbstractDto> {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;

  @Exclude()
  abstract dtoClass: new (entity: AbstractEntity, options?: any) => T;

  toDto(options?: any): T {
    return UtilsService.toDto(this.dtoClass, this, options);
  }
}
