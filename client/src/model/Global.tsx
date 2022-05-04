import KVRow from "./KVRow";

interface GlobalData {
  variables: Array<KVRow>;
  proxy:string;
  servers:KVRow[];
}
interface Global {
  collectionId: number;
  type: string;
  version: string;
  data: GlobalData;
  changed: boolean;
  isLoading: boolean;
}

export default Global;
