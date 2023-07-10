import { Server } from './server';

async function bootstrap(): Promise<void> {
  const server = new Server(3000);
  await server.run();
}

(async (): Promise<void> => {
  await bootstrap();
})();
