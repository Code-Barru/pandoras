import { ChatInputCommandInteraction, CacheType, AutocompleteInteraction } from "discord.js";
import Category from "../enums/Category";
import ICommand from "../interfaces/ICommand";
import CustomClient from "./CustomClient";
import ICommandOptions from "../interfaces/ICommandOptions";

export default class Command implements ICommand {
    client: CustomClient;
    name: string;
    description: string;
    category: Category;
    options: object;
    dm_permissions: boolean;
    default_member_permissions: BigInt;
    cooldown: number;

    constructor(client: CustomClient, options: ICommandOptions) {
        this.client = client;
        this.name = options.name;
        this.description = options.description;
        this.category = options.category;
        this.options = options.options;
        this.dm_permissions = options.dm_permissions;
        this.default_member_permissions = options.default_member_permissions;
        this.cooldown = options.cooldown;
    }

    Execute(interaction: ChatInputCommandInteraction<CacheType>): void {
        throw new Error("Method not implemented.");
    }
    AutoComplete(interaction: AutocompleteInteraction<CacheType>): void {
        throw new Error("Method not implemented.");
    }

}