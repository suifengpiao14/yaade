import 'allotment/dist/style.css';

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Allotment } from 'allotment';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useEventListener } from 'usehooks-ts';

import Header from '../../components/header';
import RequestPanel from '../../components/requestPanel';
import ResponsePanel from '../../components/responsePanel';
import Sidebar from '../../components/sidebar';
import { CurrentRequestContext, UserContext } from '../../context';
import { CollectionsContext } from '../../context/CollectionsContext';
import CurrentRequest from '../../model/CurrentRequest';
import Request from '../../model/Request';
import { apiCollection } from '../../service/collection';
import { apiRequestUpdate } from '../../service/request';
import { errorToast, parseResponseEvent } from '../../utils';
import styles from './Dashboard.module.css';

function Dashboard() {
  const { setCollections, writeRequestToCollections } = useContext(CollectionsContext);
  const { currentRequest, setCurrentRequest, saveRequest } =
    useContext(CurrentRequestContext);
  const { user } = useContext(UserContext);
  const toast = useToast();

  const getCollections = useCallback(async () => {
    try {
      const collections = await apiCollection();
      setCollections(collections);
    } catch (e) {
      errorToast('Could not retrieve collections', toast);
    }
  }, [toast, setCollections]);

  useEffect(() => {
    getCollections();
  }, [getCollections]);

  return (
    <div className={styles.parent}>
      <header>
        <Header />
      </header>
      <div className={styles.allotment}>
        <Allotment defaultSizes={[50, 200]} snap>
          <div className={styles.sidebar}>
            <Sidebar />
          </div>
          <div className={styles.main}>
            <Allotment vertical defaultSizes={[200, 100]} snap>
              <div className={styles.requestPanel}>
                <RequestPanel  />
              </div>
              <div className={styles.responsePanel}>
                <ResponsePanel />
              </div>
            </Allotment>
          </div>
        </Allotment>
      </div>
      
    </div>
  );
}

export default Dashboard;
