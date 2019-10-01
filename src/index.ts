// src/index.ts
import { Client } from 'discord.js';
import { postdatedRoles } from './Role';
import { loadState, addUser } from './State';
import { CronJob } from 'cron';

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

new CronJob(
  '0 3 * * *',
  async () => postdatedRoles(await loadState()),
  undefined,
  true,
  `America/Winnipeg`
);
