import { ChatInputCommandInteraction} from "discord.js";
import CustomClient from "../base/classes/CustomClient";
import SubCommand from "../base/classes/SubCommand";


export default class InfostealerDiscord extends SubCommand {
    constructor(client: CustomClient) {
        super(client, {
            name: "infostealer.discord"
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply({
            content: "```diff\n- Info Steals Discord token\n```"
        });
    }
}