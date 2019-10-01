// src/Discord.ts
import { Client } from 'discord.js';

export const client = new Client();
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

export async function connectDiscord(): Promise<string> {
  return client.login(DISCORD_TOKEN);
}
