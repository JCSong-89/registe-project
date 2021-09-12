import { Core } from '../../common/core.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'registeProjects' })
export class RegisteProject extends Core {
  @Column({
    type: 'text',
  })
  email: string;

  @Column({
    type: 'text',
  })
  CEOName: string;

  @Column({
    type: 'text',
  })
  telephone: string;

  @Column({
    type: 'text',
  })
  company: string;
}
