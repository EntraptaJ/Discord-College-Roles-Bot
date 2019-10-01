// src/index.ts
import { Client } from 'discord.js';
import { postdatedRoles } from './Role';
import { loadState, addUser } from './State';

export const client = new Client();
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

async function startBot(): Promise<void> {
  const appState = await loadState();

  console.log('Starting Discord Bot');
  client.on('guildMemberAdd', member => {
    console.log('New Member Added\nMember: ', member);
    addUser(member);
  });

  await client.login(DISCORD_TOKEN);
  console.log('Connected to Discord');
  if (appState) postdatedRoles(appState);
}

startBot();
