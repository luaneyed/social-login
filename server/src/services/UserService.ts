import { prisma } from '../utils/prisma';
import { AuthProvider, User } from '.prisma/client';

export class UserService {
  static getUsersPublic(): Promise<Array<Omit<User, 'id' | 'auth_id'>>> {
    return prisma.user.findMany({ select: { email: true, name: true, auth_provider: true, created_at: true } });
  }

  static getUsers(): Promise<User[]> {
    return prisma.user.findMany();
  }

  static getUser(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  static authUser(auth_provider: AuthProvider, auth_id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { auth: { auth_provider, auth_id } } });
  }

  static upsertUser(email: string, name: string, auth_provider: AuthProvider, auth_id: string ): Promise<User> {
    return prisma.user.upsert({
      where: { auth: { auth_provider, auth_id } },
      update: { email, name },
      create: { email, name, auth_provider, auth_id },
    });
  }

  static async deleteUser(id: number): Promise<void> {
    await prisma.user.delete({ where: { id }, select: null });
  }
}
