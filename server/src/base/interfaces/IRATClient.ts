import { Socket } from "net";
import RATServer from "../classes/RATServer";
import TcpPacket from "../classes/TcpPacket";
export default interface IRATClient {
    connected: boolean;
    ratServer: RATServer;
    socket: Socket;
    uuid: string;

    send(data: TcpPacket): void;
    receive(): void;
    isConnected(): boolean;
}