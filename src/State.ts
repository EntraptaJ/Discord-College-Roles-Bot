// src/State.ts
import { ROLE } from './Role';
import { outputJSON, readJSON, pathExists } from 'fs-extra';
import { GuildMember } from 'discord.js';
import { addYears } from 'date-fns';
import { client } from './Discord';

export interface UserState {
  role: ROLE;
  userId: string;
  updateDate: string | undefined;
  guildId: string;
}

export interface State {
  users: UserState[];
}

const STATE_PATH =
  process.env.NODE_ENV === 'production'
    ? `${process.env.DATA_PATH}/state.json`
    : 'state.json';

export async function saveState(state: State): Promise<void> {
  return outputJSON(STATE_PATH, state);
}

export async function loadState(): Promise<State | undefined> {
  if (!(await pathExists(STATE_PATH))) return undefined;
  else return readJSON(STATE_PATH);
}

export async function addUser(
  discordUser: GuildMember,
  state: State
): Promise<State> {
  let user: UserState;

  if (state) {
    user = state.users.find(({ userId }) => userId === discordUser.id);

    if (!user) {
      await discordUser.addRole((ROLE.FIRST as unknown) as string);

      user = {
        userId: discordUser.id,
        updateDate: addYears(new Date(), 1).toISOString(),
        role: ROLE.FIRST,
        guildId: discordUser.guild.id
      };
    }
  } else {
    await discordUser.addRole((ROLE.FIRST as unknown) as string);

    user = {
      userId: discordUser.id,
      updateDate: addYears(new Date(), 1).toISOString(),
      role: ROLE.FIRST,
      guildId: discordUser.guild.id
    };

    state = { users: [user] };
  }

  return state;
}

export async function updateUser(userState: UserState): Promise<UserState> {
  client.syncGuilds();

  const user = await client.guilds
    .get(userState.guildId)
    .fetchMember(userState.userId);

  if (userState.role === ROLE.FIRST) {
    await Promise.all([
      user.removeRole((ROLE.FIRST as unknown) as string),
      user.addRole((ROLE.SECOND as unknown) as string)
    ]);

    userState = {
      ...userState,
      role: ROLE.SECOND,
      updateDate: addYears(new Date(), 1).toISOString()
    };
  } else if (userState.role === ROLE.SECOND) {
    await Promise.all([
      user.removeRole((ROLE.SECOND as unknown) as string),
      user.addRole((ROLE.GRADUATED as unknown) as string)
    ]);

    userState = { ...userState, role: ROLE.GRADUATED, updateDate: undefined };
  }
  return userState;
}
