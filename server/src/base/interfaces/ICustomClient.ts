import { Collection } from "discord.js";
import { PrismaClient } from "@prisma/client";
import Command from "../classes/Command";
import IConfig from "./IConfig";
import SubCommand from "../classes/SubCommand";
import TCPServer from "../classes/RATServer";

export default interface ICustomClient {
    commands: Collection<string, Command>;
    config: IConfig;
    cooldowns: Collection<string, Collection<string, number>>;
    database: PrismaClient;
    ratServer: TCPServer;
    subCommands: Collection<string, SubCommand>;

    Init(): void;
    LoadHandlers(): void;
}