import { ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";
import Command from "../base/classes/Command";
import CustomClient from "../base/classes/CustomClient";
import Category from "../base/enums/Category";


export default class Ping extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "ping",
            description: "Retournes le ping du bot.",
            category: Category.Utilities,
            dm_permissions: false,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            cooldown: 3,
            options: []
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const message = await interaction.deferReply({
            fetchReply: true
        });
        const newMessage = `**API Latency**: ${this.client.ws.ping}\n**Client Ping**: ${message.createdTimestamp - interaction.createdTimestamp}`;
        await interaction.editReply({
            content: newMessage
        });
    }
}