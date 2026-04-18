import { getDataSource } from "@/src/lib/db/connection";
import { User } from "@/src/lib/entities/User.entity";
import { Repository } from "typeorm";
import { SearchUser } from "../dtos/Users.dto";

export class UserRepository {
  private static async getRepo(): Promise<Repository<User>> {
    const dataSource = await getDataSource();
    return dataSource.getRepository("User");
  }

  static async findOneBy(
    searchParams: SearchUser,
    select?: (keyof User)[],
  ): Promise<User | null> {
    const repo = await this.getRepo();
    return repo.findOne({
      where: { ...searchParams },
      select: select || [
        "id",
        "email",
        "name",
        "passwordHash",
        "isVerified",
        "userType",
        "verificationCode",
        "signupHash",
      ],
    });
  }

  static async findBy(
    searchParams: SearchUser,
    select?: (keyof User)[],
  ): Promise<User[] | null> {
    const repo = await this.getRepo();
    return repo.find({
      where: { ...searchParams },
      select: select || [
        "id",
        "email",
        "name",
        "passwordHash",
        "isVerified",
        "userType",
        "verificationCode",
        "signupHash",
      ],
    });
  }

  static async createUser(data: Partial<User>): Promise<User> {
    const repo = await this.getRepo();
    const user = repo.create(data);
    return repo.save(user);
  }

  static async updateUser(id: number, data: Partial<User>): Promise<User> {
    const repo = await this.getRepo();
    const user = await this.findOneBy({ id });
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = await repo.save({ ...user, ...data });
    return updatedUser;
  }
}
