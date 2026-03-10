import { injectable } from 'tsyringe';
import { prisma } from '../prisma';

@injectable()
export class ServerRepository {

  public async upsertServer(name: string, status: string) {
  const server = await prisma.server.findUnique({ where: { name } });

  if (server) {
    const data: { status: string; statusChange?: Date } = { status };
    if (server.status !== status) {
      data.statusChange = new Date();
    }

    return prisma.server.update({
      where: { name },
      data,
    });
  } else {
    return prisma.server.create({
      data: { name, status, statusChange: new Date() },
    });
  }
}

  public async getServer(name: string) {
    const server = await prisma.server.findUnique({
      where: { name },
    });
    return server;
  }
}
