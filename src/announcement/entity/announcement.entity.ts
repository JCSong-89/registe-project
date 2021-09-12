import { Account } from '../../account/entity/account.entity';
import { Core } from '../../common/core.entity';
import { Column, Entity, Index, ManyToOne } from 'typeorm';

@Entity({ name: 'announcements' })
export class Announcement extends Core {
  @Column({
    default: false,
  })
  top: boolean;

  @Column({
    type: 'text',
  })
  title: string;

  @Column({
    type: 'longtext',
  })
  content: string;

  @Column({ generated: 'increment' })
  @Index({ unique: true })
  idx: number;

  @ManyToOne(
    () => Account,
    account => {
      account.announcement;
    },
  )
  account: Account;
}
