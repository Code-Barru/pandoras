import { Events } from "discord.js";
import IEvent from "../interfaces/IEvent";
import IEventOptions from "../interfaces/IEventOptions";
import CustomClient from "./CustomClient";

export default class Event implements IEvent{
    client: CustomClient;
    name: Events;
    description: string;
    once: boolean;

    constructor(client: any, options: IEventOptions){
        this.client = client;
        this.name = options.name;
        this.description = options.description;
        this.once = options.once;
    }

    Execute(...args: any): void {
        throw new Error("Method not implemented.");
    }
}