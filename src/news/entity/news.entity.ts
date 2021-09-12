import { Core } from '../../common/core.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity({ name: 'news' })
export class News extends Core {
  @Column({
    default: false,
  })
  top: boolean;

  @Column({
    type: 'text',
  })
  media: string;

  @Column({
    type: 'text',
  })
  title: string;

  @Column({
    type: 'text',
  })
  url: string;

  @Column()
  reportDate: Date;

  @Column({
    type: 'longtext',
    nullable: true,
  })
  content: string;

  @Column({ generated: 'increment' })
  @Index({ unique: true })
  idx: number;
}
