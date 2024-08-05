import { Socket } from "net";
export default interface IRATClient {
    connected: boolean;
    socket: Socket;
    uuid: string;

    send(data: string): void;
    receive(): void;
    isConnected(): boolean;
}