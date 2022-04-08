import { DeleteIcon, StarIcon } from '@chakra-ui/icons';
import { IconButton, Select, useColorMode, useToast } from '@chakra-ui/react';
import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';
import beautify from 'beautify';
import React from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { errorToast } from '../../utils';
import styles from './JSEditor.module.css';
type JSEditorProps = {
  content: string;
  setContent: any;
};

function JSEditor({ content, setContent }: JSEditorProps) {
  const { colorMode } = useColorMode();
  const setContentDebounced = useDebouncedCallback((c) => setContent(c), 100);
  const toast = useToast();

  function handleBeautifyClick() {
    try {
      const beautifiedScript = beautify(content, { format: 'js' });
      setContent(beautifiedScript);
    } catch (e) {
      errorToast('Could not format script.', toast);
    }
  }

  return (
    <>
      <div className={styles.menu}>
        <div className={styles.iconBar}>
          <IconButton
            aria-label="beautify-content"
            isRound
            variant="ghost"
            size="xs"
            onClick={handleBeautifyClick}
            icon={<StarIcon />}
          />
          <IconButton
            aria-label="delete-content"
            isRound
            variant="ghost"
            size="xs"
            disabled={content.length === 0}
            onClick={() => setContent('')}
            icon={<DeleteIcon />}
          />
        </div>
      </div>
      <div className={styles.container}>
        <CodeMirror
          onChange={(value) => {
            setContentDebounced(value);
          }}
          extensions={[javascript()]}
          theme={colorMode}
          value={content}
          style={{ height: '100%' }}
        />
      </div>
    </>
  );
}

export default React.memo(JSEditor);
