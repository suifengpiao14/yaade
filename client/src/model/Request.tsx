import KVRow from "./KVRow"

export interface RequestData{
  name: string;
  uri: string;
  method: string;
  params: KVRow[];
  headers:KVRow[];
  variables:KVRow[];
  body:string;
  preRequest:string;
  server:string;

}
interface Request {
  id: number;
  collectionId: number;
  type: string;
  version: string;
  data: RequestData;
}

export default Request;
