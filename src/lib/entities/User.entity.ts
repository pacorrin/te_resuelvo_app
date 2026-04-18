import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true, type: "varchar", length: 20 })
  phone!: string;

  @Column({ nullable: true })
  name!: string;

  @Column({ select: false })
  passwordHash!: string;

  @Column({ type: "smallint" })
  userType!: number;

  @Column({ type: "varchar", length: 6 })
  verificationCode?: string | null;

  @Column({ type: "varchar", length: 255 })
  signupHash?: string | null;

  @Column({ default: false })
  isVerified!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
