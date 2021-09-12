import { Core } from '../../common/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { Announcement } from '../../announcement/entity/announcement.entity';

@Entity({ name: 'accounts' })
export class Account extends Core {
  @Column({
    unique: true,
  })
  email: string;

  @Column({
    type: 'text',
  })
  password: string;

  @Column({
    type: 'text',
  })
  telephone: string;

  @Column({
    type: 'longtext',
    nullable: true,
  })
  specialPoint: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  staffLevel: string;

  @Column({
    type: 'text',
  })
  name: string;

  @Column({
    type: 'text',
  })
  group: string;

  @Column({ nullable: true })
  lastLoginDate: Date;

  @Column({ nullable: true })
  lastLoginIP: string;

  @Column({default: false})
  cert: boolean

  @OneToMany(
    () => Announcement,
    announcement => {
      announcement.account;
    },
  )
  announcement: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (e) {
        throw new InternalServerErrorException({
          status: 500,
          message: '비밀번호 해쉬화에 실패하였습니다.',
        });
      }
    }
  }
}
