import Request from '../model/Request';
import { host } from './util';

export async function apiRequest(): Promise<Request> {
  const url = `${host}/api/request/list`;
  const response = await fetch(url);
  if (response.status !== 200) throw new Error();
  const req = (await response.json()) as Request;
  return req;
}

export async function apiRequestAdd(request: Request): Promise<Request> {
  const url = `${host}/api/request/add`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  if (response.status !== 200) {
    throw new Error();
  }
  const req = (await response.json()) as Request;
  return req;
}
export async function apiRequestUpdate(request: Request): Promise<Response> {
  const url = `${host}/api/request/update`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  if (response.status !== 200) {
    throw new Error();
  }
  return response;
}
