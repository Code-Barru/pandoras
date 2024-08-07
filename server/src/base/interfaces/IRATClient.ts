import { Socket } from "net";
import RATServer from "../classes/RATServer";
export default interface IRATClient {
    connected: boolean;
    ratServer: RATServer;
    socket: Socket;
    uuid: string;

    send(data: string): void;
    receive(): void;
    isConnected(): boolean;
}