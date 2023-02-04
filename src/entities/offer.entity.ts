import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Offer {
  @PrimaryColumn()
  id: number;

  @Column()
  cid: string;

  @Column()
  deadline: number;

  @Column()
  size: number;

  @Column()
  duration: number;

  @Column()
  filAmount: number;

  @Column()
  fileUrl: string;
}
