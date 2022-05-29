import { Provider } from 'react';

import Collection from '../model/Collection';
import { host } from './util';
export async function apiCollection(): Promise<Collection[]> {
  //const url = `${host}/api/collection`;
const url =`http://127.0.0.1:8003/docapi/api/v1/example/getCollection`
  const response = await fetch(url,{
    method:'POST',
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({"serviceId":"c95drsnbuivbkcmmehug"}),
  });
  const collections = await response.json() as Collection[];
  collections.map((collection)=>{
    return collection?.requests.map(request=>{
        request.collectionId = collection.id
    })
  })


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
