import { ChatInputCommandInteraction} from "discord.js";
import CustomClient from "../base/classes/CustomClient";
import SubCommand from "../base/classes/SubCommand";


export default class InfostealerWebBrowser extends SubCommand {
    constructor(client: CustomClient) {
        super(client, {
            name: "infostealer.web-browser"
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply({
            content: "```diff\n- Info steals Web Browser\n```"
        });
    }
}