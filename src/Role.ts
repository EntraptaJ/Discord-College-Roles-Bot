// src/Role.ts
import { State, updateUser, UserState, saveState } from './State';
import { isPast, parseISO } from 'date-fns';

export enum ROLE {
  FIRST = '628386864352460836',
  SECOND = '628386928831627274',
  GRADUATED = '628393889035845653'
}

export async function postdatedRoles(state: State): Promise<void> {
  let users: UserState[] = [];

  for (let user of state.users) {
    if (isPast(parseISO(user.updateDate))) user = await updateUser(user);

    users.push(user);
  }

  state.users = users;
  await saveState(state);
}
