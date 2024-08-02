import { AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import CustomClient from "../classes/CustomClient";
import Category from "../enums/Category";

export default interface ICommand {
    client: CustomClient;
    name: string;
    description: string;
    category: Category;
    options: object;
    dm_permissions: boolean;
    default_member_permissions: BigInt;
    cooldown: number;

    Execute(interaction: ChatInputCommandInteraction): void;
    AutoComplete(interaction: AutocompleteInteraction): void;
}