import { Provider } from 'react';

import Collection from '../model/Collection';
import { host } from './util';
export async function apiCollection(): Promise<Collection[]> {
  const url = `${host}/api/collection`;
  const response = await fetch(url);
  const collections = await response.json();
  return collections;
}
export async function apiImportOpenApi(basePath: string, data: any): Promise<Response> {
  const url = `${host}/api/collection/importOpenApi?basePath=${basePath}`;
  const response = await fetch(url, {
    method: 'POST',
    body: data,
  });
  const collections = await response.json();
  return collections;
}
