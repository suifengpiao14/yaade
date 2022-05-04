import {RequestData} from "./Request"
interface CurrentRequest {
  id: number;
  collectionId: number;
  type: string;
  version: string;
  data: RequestData;
  changed: boolean;
  isLoading: boolean;
}

export default CurrentRequest;
