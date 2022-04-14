import { SettingsIcon,SunIcon } from '@chakra-ui/icons';
import {
  Box,
  Heading,
  IconButton,
  Modal,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';

import Settings from '../settings';
import Global from '../global';
import styles from './Header.module.css';

function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const globalDisclosure =  useDisclosure();
  const isGlobalOpen=globalDisclosure.isOpen
  const onGlobalOpen=globalDisclosure.onOpen
  const onGlobalClose=globalDisclosure.onClose

  return (
    <Box className={styles.container} bg="headerBg">
      <img className={styles.img} src="yaade-icon.png" alt="yaade icon" />
      <Heading as="h1" size="md" ml="2">
        YAADE
      </Heading>
      <div className={styles.buttons}>
        <IconButton
          aria-label="settings-button"
          icon={<SunIcon />}
          onClick={onGlobalOpen}
          variant="ghost"
        ></IconButton>
      </div>
      <div className={styles.buttons}>
        <IconButton
          aria-label="settings-button"
          icon={<SettingsIcon />}
          onClick={onOpen}
          variant="ghost"
        ></IconButton>
      </div>
      <Modal isOpen={isGlobalOpen} onClose={onGlobalClose}>
        <ModalOverlay />
        <ModalContent width="" maxWidth="" borderRadius={20} padding={2}>
          <Global />
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent width="" maxWidth="" borderRadius={20} padding={2}>
          <Settings />
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Header;
