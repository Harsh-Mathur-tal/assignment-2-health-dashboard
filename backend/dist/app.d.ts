import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
declare class App {
    app: express.Application;
    server: http.Server;
    io: Server;
    constructor();
    private initializeMiddlewares;
    private initializeRoutes;
    private initializeSocketIO;
    private initializeErrorHandling;
    initialize(): Promise<void>;
    listen(port: number): void;
}
export default App;
//# sourceMappingURL=app.d.ts.map