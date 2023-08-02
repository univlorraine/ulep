import { Server } from './server';

async function bootstrap(): Promise<void> {
  const server = new Server();
  await server.run(3000);
}

(async (): Promise<void> => {
  await bootstrap();
})();
