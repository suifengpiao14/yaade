import { Box, Input, Select, useDisclosure, useToast, Radio, RadioGroup } from '@chakra-ui/react';
import { IconButton, Tab, TabList, TabPanel, TabPanels, Tabs,Stack } from '@chakra-ui/react';
import cryptoJsObj from 'crypto-js';
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useContext,
  useRef,
  useState,
  useEffect,
} from 'react';
import { VscSave } from 'react-icons/vsc';

import { CollectionsContext, CurrentRequestContext, UserContext,GlobalContext } from '../../context';
import { parseRequest } from '../../context/CurrentRequestContext';
import CurrentRequest from '../../model/CurrentRequest';
import KVRow from '../../model/KVRow';
import Request from '../../model/Request';
import Global from '../../model/Global';
import ModelResponse from '../../model/Response';
import { apiRequestUpdate } from '../../service/request';
import {
  appendHttpIfNoProtocol,
  errorToast,
  formatResponse,
  successToast,
} from '../../utils';
import { useKeyPress } from '../../utils/useKeyPress';
import BasicModal from '../basicModal';
import BodyEditor from '../bodyEditor';
import JSEditor from '../jsEditor';
import KVEditor from '../kvEditor';
import UriBar from '../uriBar';
import styles from './RequestPanel.module.css';
//import Base64Obj from "../../utils/base64"

type NewReqFormState = {
  collectionId: number;
  name: string;
};

const defaultParam = {
  key: '',
  value: '',
};

function runPreRequest(code:string, options:any) {
  //var Base64 = BASE64.encoder;
  var CryptoJS = cryptoJsObj;
  try {
    if (code) {
      eval(code);
    }
  } catch (err) {
    console.log('Before Error:' + err);
  }
}

function shouldAppendNewRow(params: Array<KVRow>): boolean {
  if (params.length === 0) return true;
  const { key, value } = params[params.length - 1];
  return key !== '' || value !== '';
}

function getParamsFromUri(uri: string): Array<KVRow> {
  try {
    const paramString = uri.split('?')[1];
    const params = paramString.split('&').map((kv) => {
      const [k, ...v] = kv.split('=');
      return {
        key: k,
        value: v.join('='),
      };
    });
    if (shouldAppendNewRow(params)) {
      params.push(defaultParam);
    }
    return params;
  } catch (e) {
    return [defaultParam];
  }
}



function RequestPanel() {
  const { collections, writeRequestToCollections } = useContext(CollectionsContext);
  const { user } = useContext(UserContext);
  const {
    currentRequest,
    changeCurrentRequest,
    saveRequest,
    saveNewRequest,
    setCurrentRequest,
  } = useContext(CurrentRequestContext);
  const [newReqForm, setNewReqForm] = useState<NewReqFormState>({
    collectionId: -1,
    name: '',
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef(null);
  const toast = useToast();

  useKeyPress(handleSaveRequestClick, 's', true);

  if (collections.length > 0 && newReqForm.collectionId === -1) {
    setNewReqForm({ ...newReqForm, collectionId: collections[0].id });
  }

  function onCloseClear() {
    setNewReqForm({
      collectionId: -1,
      name: '',
    });
    onClose();
  }

  const setUri = (uri: string) => {
    changeCurrentRequest({
      ...currentRequest,
      data: {
        ...currentRequest.data,
        uri,
      },
    });
  };

  const params = getParamsFromUri(currentRequest.data.uri);

  const headers =
    currentRequest.data.headers && currentRequest.data.headers.length !== 0
      ? currentRequest.data.headers
      : [{ key: '', value: '' }];

  const setMethod = (method: string) => {
    changeCurrentRequest({
      ...currentRequest,
      data: {
        ...currentRequest.data,
        method,
      },
    });
  };
  const { global } = useContext(GlobalContext);
  

  function setUriFromParams(params: Array<KVRow>) {
    try {
      let uri = currentRequest.data.uri;
      if (!currentRequest.data.uri.includes('?')) {
        uri += '?';
      }
      const base = uri.split('?')[0];
      let searchParams = '';
      for (let i = 0; i < params.length; i++) {
        if (params[i].key === '' && params[i].value === '') {
          continue;
        }
        if (i !== 0) searchParams += '&';
        searchParams += `${params[i].key}=${params[i].value}`;
      }
      if (searchParams === '') {
        setUri(base);
      } else {
        setUri(`${base}?${searchParams}`);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const setHeaders = (headers: Array<KVRow>) => {
    changeCurrentRequest({
      ...currentRequest,
      data: {
        ...currentRequest.data,
        headers,
      },
    });
  };

  const setBody = (body: string) => {
    changeCurrentRequest({
      ...currentRequest,
      data: {
        ...currentRequest.data,
        body,
      },
    });
  };
  const setPreRequest = (preRequest: string) => {
    changeCurrentRequest({
      ...currentRequest,
      data: {
        ...currentRequest.data,
        preRequest,
      },
    });
  };

  const variables = currentRequest.data?.variables || [{ key: '', value: '' }];

  const setVariables = (variables: KVRow[]) => {
    changeCurrentRequest({
      ...currentRequest,
      data: {
        ...currentRequest.data,
        variables,
      },
    });
  };

  const setServer=(server: string)=>{
    changeCurrentRequest({
      ...currentRequest,
      data:{
        ...currentRequest.data,
        server: server
      }
    })
  }


  async function handleSaveNewRequestClick() {
    try {
      const body = {
        collectionId: newReqForm.collectionId,
        type: 'REST',
        data: { ...currentRequest.data, name: newReqForm.name },
      };

      const newRequest = await saveNewRequest(body);

      writeRequestToCollections(newRequest);
      changeCurrentRequest(parseRequest(newRequest));

      onCloseClear();
      successToast('A new request was created.', toast);
    } catch (e) {
      errorToast('The request could be not created', toast);
    }
  }

  async function handleSaveRequestClick() {
    try {
      if (currentRequest.id === -1 && currentRequest.collectionId === -1) {
        onOpen();
        return;
      } else {
        await saveRequest();
        const savedCurrentRequest = {
          ...currentRequest,
          changed: false,
        };
        writeRequestToCollections(savedCurrentRequest);
        setCurrentRequest(savedCurrentRequest);
        successToast('The request was successfully saved.', toast);
      }
    } catch (e) {
      console.log(e);
      errorToast('The request could not be saved.', toast);
    }
  }

  async function handleSendButtonClick() {
    if (currentRequest.isLoading) {
      setCurrentRequest({ ...currentRequest, isLoading: false });
      return;
    }
    let url = appendHttpIfNoProtocol(currentRequest.data.uri);

    const headers: Record<string, string> = {};
    currentRequest.data.headers.forEach(({ key, value }: KVRow) => {
      if (key === '') return;
      headers[key] = value;
    });

    interface requestOptions{
      headers:Record<string,string>;
      method:string;
      body:string;
      params:Array<KVRow>;
    }

    const options: requestOptions = { headers, method: currentRequest.data.method,body:"",params:[] };
    if (currentRequest.data.body) {
      options.body = currentRequest.data.body;
    }
    if (currentRequest.data.params.length > 0) {
      options.params =  currentRequest.data.params;
    }

    const code = currentRequest.data.preRequest;

    setCurrentRequest({ ...currentRequest, isLoading: true });
    runPreRequest(code, options);
   
    const proxy=global.data.proxy
    if (proxy) {
     const  realProxyUrl = new URL(url)
     const proxyUrl = new URL(proxy)
      realProxyUrl.host = proxyUrl.host
      realProxyUrl.hostname = proxyUrl.hostname
      if (proxyUrl.protocol){
        realProxyUrl.protocol = proxyUrl.protocol
      }

     options.headers["X-REAL-URL"]=url
     url = realProxyUrl.toString()
    }
    if (currentRequest.data.server ){
      options.headers["X-REAL-PROXY"]=currentRequest.data.server
    }
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: options.headers,
        body: JSON.stringify(options.body),
      });
      const body = await res.text();
      const modelResponse = httpResponse2Response(body, res); // 返回数据后，触发状态更新
      handleResponse(modelResponse, '');
    } catch (err: any) {
      const res: ModelResponse = {
        status: 500,
        body: '',
        headers: [],
        time: 1,
        size: 0,
      };
      handleResponse(res, err.message);
    }
  }

  function httpResponse2Response(body: string, httpResponse: Response): ModelResponse {
    const headers = [...httpResponse.headers].map((el) => ({
      key: el[0],
      value: el[1],
    }));

    const res: ModelResponse = {
      status: httpResponse.status,
      body,
      headers,
      time: 1,
      size: 0,
    };
    return res;
  }

  const handleResponse = async (response: ModelResponse, err: string) => {
    if (err) {
      setCurrentRequest((request: CurrentRequest) => ({
        ...request,
        isLoading: false,
      }));
      errorToast(err, toast);
      return;
    }

    const modelResponse = formatResponse(response);

    const newRequest = {
      ...currentRequest,
      data: {
        ...currentRequest.data,
        response: modelResponse,
      },
      isLoading: false,
    };

    if (currentRequest.id !== -1 && user?.data.settings.saveOnSend) {
      try {
        const response = await apiRequestUpdate(newRequest);
        if (response.status !== 200) {
          throw new Error();
        }
      } catch (e) {
        errorToast('Could not retrieve collections', e);
      }

      const savedRequest = { ...newRequest, changed: false };
      writeRequestToCollections(savedRequest);
      setCurrentRequest(savedRequest);
    } else {
      setCurrentRequest(newRequest);
    }
  };

  return (
    <Box className={styles.box} bg="panelBg" h="100%">
      <div style={{ display: 'flex' }}>
      <RadioGroup  onChange={setServer} marginBottom={3}>
      <Stack spacing={4} direction='row'>
        <GlobalContext.Consumer>
          {(globalContext)=>{
            const servers = globalContext.global.data.servers
            return servers.filter(kv=>kv.key!=="").map((kv)=>{
              return <Radio value={kv.value}>{kv.key}</Radio>
            })
          }}
        </GlobalContext.Consumer>
        
      </Stack>
    </RadioGroup>  
    </div>
    <div style={{ display: 'flex' }}>     
        <UriBar
          uri={currentRequest.data.uri}
          setUri={setUri}
          method={currentRequest.data.method}
          setMethod={setMethod}
          handleSendButtonClick={handleSendButtonClick}
          isLoading={currentRequest.isLoading}
        />
        <IconButton
          aria-label="save-request-button"
          icon={<VscSave />}
          variant="ghost"
          size="sm"
          ml="2"
          onClick={handleSaveRequestClick}
          disabled={!currentRequest.changed}
        />
      </div>

      <Tabs
        colorScheme="green"
        mt="1"
        display="flex"
        flexDirection="column"
        maxHeight="100%"
        h="100%"
        mb="4"
      >
        <TabList>
          <Tab>Parameters</Tab>
          <Tab>Headers</Tab>
          <Tab>Body</Tab>
          <Tab>Pre-request</Tab>
          <Tab>Variables</Tab>
        </TabList>
        <TabPanels overflowY="auto" sx={{ scrollbarGutter: 'stable' }} h="100%">
          <TabPanel>
            <KVEditor name="params" kvs={params} setKvs={setUriFromParams} />
          </TabPanel>
          <TabPanel>
            <KVEditor name="headers" kvs={headers} setKvs={setHeaders} />
          </TabPanel>
          <TabPanel h="100%">
            <BodyEditor content={currentRequest.data.body} setContent={setBody} />
          </TabPanel>
          <TabPanel h="100%">
            <JSEditor
              content={currentRequest.data.preRequest}
              setContent={setPreRequest}
            />
          </TabPanel>
          <TabPanel h="100%">
            <KVEditor name="variables" kvs={variables} setKvs={setVariables} />
          </TabPanel>
        </TabPanels>
      </Tabs>
      <BasicModal
        isOpen={isOpen}
        onClose={onCloseClear}
        initialRef={initialRef}
        heading="Save a new request"
        onClick={handleSaveNewRequestClick}
        isButtonDisabled={newReqForm.name === '' || newReqForm.collectionId === -1}
        buttonText="Save"
        buttonColor="green"
      >
        <Input
          placeholder="Name"
          w="100%"
          borderRadius={20}
          colorScheme="green"
          value={newReqForm.name}
          onChange={(e) => setNewReqForm({ ...newReqForm, name: e.target.value })}
          ref={initialRef}
          mb="4"
        />
        <Select
          borderRadius={20}
          value={newReqForm.collectionId}
          onChange={(e) =>
            setNewReqForm({ ...newReqForm, collectionId: Number(e.target.value) })
          }
        >
          {collections.map((collection) => (
            <option key={`collection-dropdown-${collection.id}`} value={collection.id}>
              {collection.data.name}
            </option>
          ))}
        </Select>
      </BasicModal>
    </Box>
  );
}

export default RequestPanel;
