import Category from "../enums/Category";

export default interface ICommandOptions {
    name: string;
    description: string;
    category: Category;
    options: object;
    dm_permissions: boolean;
    default_member_permissions: BigInt;
    cooldown: number;
}