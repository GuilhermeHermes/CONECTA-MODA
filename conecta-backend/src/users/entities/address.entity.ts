import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Address {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column()
  bairro: string;

  @Column()
  cep: string;

  @Column()
  street: string;

  @Column()
  number: string;

  @Column({ nullable: true })
  complement?: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column({ default: 'Brasil' })
  country: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.address)
  @JoinColumn({ name: 'userId' })
  user: User;
} 