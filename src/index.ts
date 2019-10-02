// src/index.ts
import { CronJob } from 'cron';
import { client, connectDiscord } from './Discord';
import { postdatedRoles } from './Role';
import { addUser, loadState } from './State';
import { outputFile, readJSON } from 'fs-extra';

async function startBot(): Promise<void> {
  const appState = await loadState();

  console.log('Starting Discord Bot');
  client.on('guildMemberAdd', async member => {
    console.log('New Member Added\nMember: ', member);
    await outputFile('state.json', addUser(member, await loadState()));
  });

  await connectDiscord();
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
