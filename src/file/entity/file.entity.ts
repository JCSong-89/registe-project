import { Core } from '../../common/core.entity';
import { Column, Entity } from 'typeorm';
import { Category } from '../enum/category.enum';

@Entity({ name: 'files' })
export class File extends Core {
  @Column({
    type: 'text',
  })
  url: string;

  @Column({
    type: 'text',
  })
  filename: string;

  @Column({
    type: 'text',
  })
  blobname: string;

  @Column({
    type: 'text',
  })
  type: string;

  @Column({
    type: 'enum',
    enum: Category,
    nullable: true,
  })
  category: Category;

  @Column({
    type: 'text',
    nullable: true,
  })
  fkId: string;
}
