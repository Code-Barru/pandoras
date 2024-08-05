import { ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";
import Command from "../base/classes/Command";
import CustomClient from "../base/classes/CustomClient";
import Category from "../base/enums/Category";


export default class Screenshot extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "screenshot",
            description: "Screenshot.",
            category: Category.Utilities,
            dm_permissions: false,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            cooldown: 3,
            options: []
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply({
            content: "```diff\n+ Screenshot\n```"
        });
    }
}