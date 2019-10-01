// src/Role.ts
import { State, updateUser, UserState, saveState } from './State';
import { isPast, parseISO } from 'date-fns';

export enum ROLE {
  FIRST = process.env.FIRST_YEAR! as any,
  SECOND = process.env.SECOND_YEAR! as any,
  GRADUATED = process.env.GRADUATED! as any
}

export async function postdatedRoles(state: State): Promise<State> {
  let users: UserState[] = [];

  for (let user of state.users) {
    if (isPast(parseISO(user.updateDate))) user = await updateUser(user);

    users.push(user);
  }

  state.users = users;
  return state;
}
