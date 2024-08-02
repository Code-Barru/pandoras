export default interface IConfig {
    token: string;
    discordClientId: string;
    guildId: string;
    rcon: {
        host: string;
        port: number;
        password: string;
    };
}