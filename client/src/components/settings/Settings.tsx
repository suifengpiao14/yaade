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
} from '@chakra-ui/react';
import { useContext, useState } from 'react';

import { UserContext} from '../../context';
import {visitor} from "../../context/UserContext"
import {apiLoginout,apiChangeSetting,apiChangePassword} from '../../service/user';
import { cn, errorToast, successToast } from '../../utils';
import styles from './Settings.module.css';

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

function Settings() {
  const [state, setState] = useState<SettingsState>(defaultState);
  const { user, setUser } = useContext(UserContext);
  const { colorMode, setColorMode } = useColorMode();
  const toast = useToast();

  async function handleChangePasswordClick() {
    try {
      apiChangePassword(state.currentPassword,state.newPassword)
      setState(defaultState);
      setUser(visitor);
      successToast('Password changed.', toast);
    } catch (e) {
      setState(defaultState);
      errorToast('Password could not be changed.', toast);
    }
  }



  async function handleSettingChanged(key: string, value: number | boolean | string) {
    try {
      apiChangeSetting(key,value)
      setUser({
        ...user!,
        data: {
          ...user.data,
          settings: {
            ...user.data.settings,
            [key]: value,
          },
        },
      });
      successToast('Settings saved.', toast);
    } catch (e) {
      errorToast('Setting could not be changed.', toast);
    }
  }


  async function handleLogoutClick() {
    try {
      apiLoginout()
      setUser(visitor);
    } catch (e) {
      errorToast('Failed to logout', toast);
    }
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
              General
            </Tab>
            <Tab sx={sx} _selected={selected} tabIndex={-1}>
              Behavior
            </Tab>
            <Tab sx={sx} _selected={selected}>
              Account
            </Tab>
            <Tab sx={sx} _selected={selected}>
              About
            </Tab>
          </TabList>
        </div>

        <TabPanels tabIndex={-1}>
          <TabPanel tabIndex={-1}>
            <SettingsTab name="General">
              <Heading as="h4" size="md" mb="2">
                Theme ({colorMode})
              </Heading>
              <Stack direction="row" alignItems="center">
                <IconButton
                  aria-label="add-collection-button"
                  icon={<SunIcon />}
                  onClick={() => setColorMode('light')}
                  variant="ghost"
                  color={colorMode === 'light' ? 'green' : 'gray'}
                />
                <IconButton
                  aria-label="add-collection-button"
                  icon={<MoonIcon />}
                  onClick={() => setColorMode('dark')}
                  variant="ghost"
                  colorScheme={colorMode === 'dark' ? 'green' : 'gray'}
                />
              </Stack>
            </SettingsTab>
          </TabPanel>
          <TabPanel>
            <SettingsTab name="Behavior">
              <Heading as="h4" size="md" mb="4" mt="4">
                Auto Save Requests
              </Heading>
              <HStack mb="2">
                <Text w="200px">Save after successful send</Text>
                <Switch
                  colorScheme="green"
                  size="md"
                  onChange={(e) => handleSettingChanged('saveOnSend', e.target.checked)}
                  isChecked={user?.data.settings.saveOnSend}
                >
                  {user?.data.settings.saveOnSend ? 'ON' : 'OFF'}
                </Switch>
              </HStack>
              <HStack>
                <Text w="200px">Save on close</Text>
                <Switch
                  colorScheme="green"
                  size="md"
                  onChange={(e) => handleSettingChanged('saveOnClose', e.target.checked)}
                  isChecked={user?.data.settings.saveOnClose}
                >
                  {user?.data.settings.saveOnClose ? 'ON' : 'OFF'}
                </Switch>
              </HStack>
            </SettingsTab>
          </TabPanel>
          <TabPanel>
            <SettingsTab name="Account">
              <Heading as="h4" size="md" mb="4">
                User
              </Heading>
              <Stack direction="row" alignItems="center" mb="4">
                <p>Logged in as</p>
                <span style={{ fontWeight: 700 }}>{user?.username}</span>
                <Button
                  colorScheme="red"
                  variant="outline"
                  size="sm"
                  borderRadius={20}
                  onClick={handleLogoutClick}
                >
                  Logout
                </Button>
              </Stack>
              <Heading as="h4" size="md" mb="4">
                Password
              </Heading>
              <form>
                <input
                  className={cn(styles, 'input', [colorMode])}
                  id="current-password-input"
                  type="password"
                  placeholder="Current Password..."
                  value={state.currentPassword}
                  onChange={(e) =>
                    setState({ ...state, currentPassword: e.target.value })
                  }
                />
                <input
                  className={cn(styles, 'input', [colorMode])}
                  id="new-password-input"
                  type="password"
                  placeholder="New Password..."
                  value={state.newPassword}
                  onChange={(e) => setState({ ...state, newPassword: e.target.value })}
                />
                <input
                  className={cn(styles, 'input', [colorMode])}
                  id="repeat-password-input"
                  type="password"
                  placeholder="Repeat Password..."
                  value={state.repeatPassword}
                  onChange={(e) => setState({ ...state, repeatPassword: e.target.value })}
                />
                <Button
                  mt="4"
                  borderRadius={20}
                  colorScheme="green"
                  disabled={
                    !state.currentPassword ||
                    !state.newPassword ||
                    !(state.repeatPassword === state.newPassword)
                  }
                  onClick={handleChangePasswordClick}
                >
                  Change password
                </Button>
              </form>
            </SettingsTab>
          </TabPanel>
          <TabPanel>
            <SettingsTab name="About">
              From Munich with ❤️
              <br />
              <br />
              Created by Jonathan Rösner at EsperoTech.
            </SettingsTab>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

export default Settings;
