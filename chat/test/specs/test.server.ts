import { INestApplication } from '@nestjs/common';
import { Server } from 'src/server';

export class TestServer extends Server {
    constructor(private app: INestApplication) {
        super();
    }

    static create(app: INestApplication) {
        return new TestServer(app);
    }

    async run(): Promise<INestApplication> {
        super.addGlobalPipes(this.app);
        super.addGlobalInterceptors(this.app);
        await super.buildWebSocketAdapter(this.app);

        await this.app.init();

        return this.app;
    }

    getHttpServer(): any {
        return this.app.getHttpServer();
    }

    getService(service: string): any {
        return this.app.get(service);
    }

    async teardown(): Promise<void> {
        await this.app.close();
    }
}
