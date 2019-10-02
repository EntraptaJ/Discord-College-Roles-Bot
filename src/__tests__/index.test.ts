// __tests__/index.ts
import { GuildMember } from 'discord.js';
import { remove } from 'fs-extra';
import 'isomorphic-unfetch';
import { client, connectDiscord } from '../Discord';
import { postdatedRoles, ROLE } from '../Role';
import { addUser, loadState, State } from '../State';

const TEST_USER = process.env.TEST_USER;
const TEST_GUILD = process.env.TEST_GUILD;

describe('Auto College Roles', () => {
  describe('index.ts', () => {
    let user: GuildMember;

    beforeAll(async () => connectDiscord());

    beforeEach(async () => {
      await remove('state.json');
      console.log(TEST_GUILD);
      client.syncGuilds();
      user = await client.guilds.get(TEST_GUILD).fetchMember(TEST_USER);
      await user.removeRoles([...user.roles.array()]);
    });

    test('Should Set First Year', async () => {
      await addUser(user, await loadState());

      expect(user.roles.keyArray()).toContain(ROLE.FIRST);
      expect(user.roles.keyArray()).not.toContain(ROLE.SECOND);
      expect(user.roles.keyArray()).not.toContain(ROLE.GRADUATED);
    });

    test('Should set Test User to second year', async () => {
      await addUser(user, await loadState());

      // @ts-ignore
      await postdatedRoles((await import('./firstYear.json')) as State);

      user = await client.guilds.get(TEST_GUILD).fetchMember(TEST_USER);

      expect(user.roles.keyArray()).toContain(ROLE.SECOND);
      expect(user.roles.keyArray()).not.toContain(ROLE.FIRST);
      expect(user.roles.keyArray()).not.toContain(ROLE.GRADUATED);
    });

    test('Should set Test User to  year', async () => {
      await addUser(user, await loadState());

      // @ts-ignore
      await postdatedRoles((await import('./firstYear.json')) as State);

      // @ts-ignore
      await postdatedRoles((await import('./secondYear.json')) as State);

      user = await client.guilds.get(TEST_GUILD).fetchMember(TEST_USER);

      expect(user.roles.keyArray()).toContain(ROLE.GRADUATED);
      expect(user.roles.keyArray()).not.toContain(ROLE.FIRST);
      expect(user.roles.keyArray()).not.toContain(ROLE.SECOND);
    });
  });
});
