import { Collection, Events, REST, Routes, ActivityType } from "discord.js";
import CustomClient from "../../base/classes/CustomClient";
import Event from "../../base/classes/Event";
import Command from "../../base/classes/Command";

export default class Ready extends Event {
    constructor(client: CustomClient) {
        super(client, {
            name: Events.ClientReady,
            description: "Ready event",
            once: true
        });
    }

    async Execute() {
        console.log(`Logged in as ${this.client.user?.tag}.`);
        const commands = this.GetJson(this.client.commands);
        const rest = new REST().setToken(this.client.token!);
        const setCommands: any = await rest.put(Routes.applicationGuildCommands(this.client.config.discordClientId, this.client.config.guildId), {
            body: commands
        });
        console.log(`Successfully set ${setCommands.length} commands.`);
    }

    private GetJson(commands: Collection<string, Command>) {
        const data: object[] = [];
        commands.forEach((command) => {
            data.push({
                name: command.name,
                description: command.description,
                options: command.options,
                default_member_permissions: command.default_member_permissions.toString(),
                dm_permissions: command.dm_permissions,
            });
        });
        return data;
    }
}