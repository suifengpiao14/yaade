import User from '../model/User';
import { host } from './util';

export async function apiLogin(username: string, password: string): Promise<User> {
  const url = `${host}/api/login`;
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors', // no-cors, *cors, same-origin
    credentials: 'include', // include, *same-origin, omit
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
  if (response.status !== 200) {
    throw new Error('api login http status:' + response.status);
  }
  const usr = (await response.json()) as User;
  return usr;
}

export async function apiGetUser(): Promise<User> {
  const url = `${host}/api/user`;
  const response = await fetch(url);
  if (response.status !== 200) {
    throw new Error();
  }
  const user = (await response.json()) as User;
  return user;
}
export async function apiLoginout(): Promise<void> {
  const url = `${host}/api/logout`;
  const response = await fetch(url,{
    method:"POST"
  });
  if (response.status !== 200) {
    throw new Error();
  }
  return ;
}
export async function apiChangeSetting(key: string,value:number | boolean | string): Promise<void> {
  const url = `${host}/api/user/changeSetting`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      key,
      value
    }),
  });
  if (response.status !== 200) throw new Error();
  return
}

export async function apiChangePassword(currentPassword: string,newPassword:string): Promise<void> {
  const url = `${host}/api/user/changePassword`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      currentPassword,
      newPassword
    }),
  });
  if (response.status !== 200) throw new Error();
  return
}


