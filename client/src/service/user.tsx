

import User from '../model/User';

const host ="http://localhost:8082"

export async function apiLogin(username:string,password:string):Promise<User> {
    const url= `${host}/api/login`
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
          throw new Error("api login http status:"+response.status);
      }
      const usr = await response.json() as User;
      return usr 
}

export async function apiGetUser():Promise<User> {
    const url= `${host}/api/user`
    const response = await fetch(url);
    if (response.status !== 200) {
        throw new Error();
    }
    const user = (await response.json()) as User;
    return user 
}