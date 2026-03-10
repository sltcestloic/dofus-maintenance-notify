import { container } from 'tsyringe';
import { API_URL, DISCORD_USER_ID, TRACKED_SERVERS } from '../constants';
import { ServerRepository } from '../repositories/server.repository';

const serverRepository = container.resolve(ServerRepository);

export async function run() {
  const request = await fetch(API_URL);
  const data = await request.json();

  data.forEach(async (server: any) => {
    if (TRACKED_SERVERS.includes(server.names.fr)) {
      const existingServer = await serverRepository.getServer(server.names.fr);
      if (existingServer && existingServer.status !== server.status) {
        console.log(`Status changed for ${server.names.fr}: ${existingServer.status} -> ${server.status}`);
        if (server.status === 'Up') {
          const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: `<@${DISCORD_USER_ID}> Le serveur **${server.names.fr}** est de nouveau en ligne !`,
            })
        });
        }
      }
    }
    await serverRepository.upsertServer(server.names.fr, server.status);
  });
}