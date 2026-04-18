import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Organization } from "./Organization.entity";
import { User } from "./User.entity";

@Entity("organization_members")
export class OrganizationMember {
  @PrimaryGeneratedColumn({ name: "ormem_id" })
  id!: number;

  @Column({ name: "ormem_organization_id", type: "int" })
  organizationId!: number;

  @ManyToOne(() => Organization)
  @JoinColumn({ name: "ormem_organization_id" })
  organization!: Organization;

  @Column({ name: "ormem_user_id", type: "int" })
  userId?: number | null;

  @Column({ name: "ormem_user_email", type: "varchar", length: 150, nullable: false })
  userEmail!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "ormem_user_id" })
  user?: User | null;

  @Column({ name: "ormem_role", type: "int", default: 1 })
  role!: number;

  @Column({
    name: "ormem_is_invitation",
    type: "tinyint",
    width: 1,
    default: 0,
    transformer: {
      to: (value: boolean) => (value ? 1 : 0),
      from: (value: unknown) => {
        if (value == null) return false;
        if (Buffer.isBuffer(value)) return value[0] === 1;
        return Number(value) !== 0;
      },
    },
  })
  isInvitation!: boolean;
}
