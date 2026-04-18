import { getDataSource } from "@/src/lib/db/connection";
import { OrganizationMember } from "@/src/lib/entities/OrganizationMember.entity";
import { Repository } from "typeorm";
import { CreateOrganizationMemberDTO } from "../dtos/OrganizationMembers.dto";

export class OrganizationMemberRepository {
  private static async getRepo(): Promise<Repository<OrganizationMember>> {
    const dataSource = await getDataSource();
    return dataSource.getRepository("OrganizationMember");
  }

  static async findOneBy(
    searchParams: { id?: number; organizationId?: number; userId?: number },
    relations: ("organization" | "user")[] = [],
  ): Promise<OrganizationMember | null> {
    const repo = await this.getRepo();
    return repo.findOne({
      where: { ...searchParams },
      relations,
    });
  }

  static async findByOrganization(
    organizationId: number,
  ): Promise<OrganizationMember[]> {
    const repo = await this.getRepo();
    return repo.find({
      where: { organizationId },
      relations: {
        user: true,
      },
    });
  }

  static async findByUser(userId: number): Promise<OrganizationMember[]> {
    const repo = await this.getRepo();
    return repo.find({
      where: { userId },
      relations: ["organization"],
    });
  }

  static async findBy(
    userId?: number,
    organizationId?: number,
  ): Promise<OrganizationMember[]> {
    const repo = await this.getRepo();
    return repo.find({
      where: { userId, organizationId },
    });
  }

  static async createMember(
    data: CreateOrganizationMemberDTO,
  ): Promise<OrganizationMember> {
    const repo = await this.getRepo();
    const member = repo.create(data);
    return repo.save(member);
  }

  static async removeMember(id: number): Promise<void> {
    const repo = await this.getRepo();
    await repo.delete(id);
  }
}
