import CustomClient from '../classes/CustomClient';
import IRATClient from './IRATClient';
import { Server } from 'net';


export default interface ITCPServer {
    client: CustomClient;
    host: string;
    port: number;
    server: Server;
    started: boolean;
    ratClients: IRATClient[];

    start(): void;
    stop(): void;
}