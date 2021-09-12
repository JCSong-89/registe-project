import { Core } from '../../common/core.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'galleries' })
export class Gallery extends Core {
  @Column({
    default: false,
  })
  top: boolean;

  @Column({
    type: 'text',
  })
  title: string;

  @Column({
    type: 'text',
  })
  content: string;

  @Column()
  startedAt: Date;

  @Column()
  finishedAt: Date;
}
