import 'reflect-metadata';
import dotenv from 'dotenv';
import { CHECK_INTERVAL } from './constants';

dotenv.config();

export async function startup() {
  var tasks = [
    import('./tasks/update-statuses.task'),
  ];
  for (const taskPromise of tasks) {
    const taskModule = await taskPromise;
    await taskModule.run();
    setInterval(async () => {
      await taskModule.run();
    }, CHECK_INTERVAL);
  }
  console.log('✔️  Task started successfully, monitoring server statuses...');
}

startup().catch((err) => {
  console.error("Error during startup:", err);
  process.exit(1);
});