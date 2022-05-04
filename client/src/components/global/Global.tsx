import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
  Button,
  Checkbox,
  Divider,
  Heading,
  HStack,
  IconButton,
  ModalCloseButton,
  Stack,
  Switch,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorMode,
  useToast,
  VStack,
  Input,
} from '@chakra-ui/react';
import { useContext, useState } from 'react';
import KVEditor from '../kvEditor';
import { UserContext } from '../../context';
import { cn, errorToast, successToast } from '../../utils';
import styles from './Global.module.css';
import KVRow from '../../model/KVRow';
import {GlobalContext } from '../../context';

type SettingsTabProps = {
  name: string;
  children: any;
};

function SettingsTab({ name, children }: SettingsTabProps) {
  return (
    <div className={styles.settingsTabContainer}>
      <div style={{ display: 'flex' }}>
        <Heading mb="4">{name}</Heading>
        <ModalCloseButton ml="auto" size="md" />
      </div>
      <Divider mb="4" />
      {children}
    </div>
  );
}

type SettingsState = {
  currentPassword: string;
  newPassword: string;
  repeatPassword: string;
  backupfile: any;
  acknowledge: boolean;
};

const defaultState: SettingsState = {
  currentPassword: '',
  newPassword: '',
  repeatPassword: '',
  backupfile: undefined,
  acknowledge: false,
};

const sx = {
  borderRadius: '0 20px 20px 0',
  borderWidth: '0px',
  justifyContent: 'start',
  paddingLeft: '2rem',
  boxSizing: 'border-box',
};

function Global() {
  const [state, setState] = useState<SettingsState>(defaultState);
  const { user, setUser } = useContext(UserContext);
  const { colorMode, setColorMode } = useColorMode();
  const toast = useToast();
  const {
    global,
    changeGlobal,
    saveGlobal,
    setGlobal,
  } = useContext(GlobalContext);


  const onChangeProxy = ( e: any) => {
    const proxy = e.target.value;
    setGlobal({
      ...global,
      data:{
        ...global.data,
        proxy
      }
    });
  };

  
  function getVariables():KVRow[]{
    return global.data.variables
  }

  const proxy= global.data.proxy ||""

  function setVariables(variables:KVRow[]){
    changeGlobal({
      ...global,
      data:{
        ...global.data,
        variables
      }
      
    });
  }
  function getServers():KVRow[]{
    return global.data.servers
  }

  function setServers(servers:KVRow[]){
    changeGlobal({
      ...global,
      data:{
        ...global.data,
        servers
      }
    });
  }

  const selected = {
    bg: colorMode === 'light' ? 'gray.200' : 'gray.800',
    borderLeft: '4px solid var(--chakra-colors-green-500)',
    boxSizing: 'border-box',
  };

  return (
    <div className={styles.container}>
      <Tabs colorScheme="green" orientation="vertical" size="lg" tabIndex={-1}>
        <div className={styles.tabListWrapper}>
          <TabList className={styles.tabs} sx={{ borderLeft: '0px' }} tabIndex={-1}>
            <Tab sx={sx} _selected={selected} tabIndex={-1}>
              Variable
            </Tab>
            <Tab sx={sx} _selected={selected} >
              Proxy
            </Tab>
            <Tab sx={sx} _selected={selected}>
              Servers
            </Tab>
          </TabList>
        </div>

        <TabPanels tabIndex={-1}>
          <TabPanel tabIndex={-1}>
          <SettingsTab name="variables">
          <Heading as="h4" size="md" mb="4" mt="4">
          variables
              </Heading>
              <HStack mb="2">
              <KVEditor name="variables" kvs={getVariables()}  setKvs={setVariables}/>
              </HStack>
            </SettingsTab>
          </TabPanel>
          <TabPanel>
            <SettingsTab name="Proxy">
              <Heading as="h4" size="md" mb="4" mt="4">
                Proxy
              </Heading>
              <HStack mb="2">
              <Input variant='outline' placeholder='Proxy' value={proxy} onChange={onChangeProxy} />
              </HStack>
            </SettingsTab>
          </TabPanel>
          <TabPanel>
          <SettingsTab name="servers">
          <Heading as="h4" size="md" mb="4" mt="4">
             Servers
          </Heading>
              <HStack mb="2">
              <KVEditor name="servers" kvs={getServers()}  setKvs={setServers}/>
              </HStack>
            </SettingsTab>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

export default Global;
