import './handsontable.full.min.css';

import { DeleteIcon, StarIcon } from '@chakra-ui/icons';
import { IconButton, Select, useColorMode, useToast } from '@chakra-ui/react';
import { javascript } from '@codemirror/lang-javascript';
import { HotTable } from '@handsontable/react';
import CodeMirror from '@uiw/react-codemirror';
import beautify from 'beautify';
import Handsontable from 'handsontable';
import { registerLanguageDictionary, zhCN } from 'handsontable/i18n';
import React from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { errorToast } from '../../utils';
type TableEditorProps = {
  content: string;
  setContent: any;
};
registerLanguageDictionary(zhCN);
const requiredAutocompleteOptions = ['true', 'false'];
const simpleBaseSettigs = {
  colHeaders: false,
  rowHeaders: false,
  licenseKey: 'non-commercial-and-evaluation',
  stretchH: 'all',
  language: zhCN.languageCode,
  persistentState: true,
};
const baseSettings = {
  ...simpleBaseSettigs,
  manualColumnMove: true,
  manualRowMove: true,
  contextMenu: [
    'row_above',
    'row_below',
    'remove_row',
    'cut',
    'copy',
    'hidden_columns_hide',
    'hidden_columns_show',
    'hidden_rows_hide',
    'hidden_rows_show',
  ],
  hiddenColumns: {
    copyPasteEnabled: true,
    indicators: true,
  },
  hiddenRows: {
    copyPasteEnabled: true,
    indicators: true,
  },
  minSpareRows: 2,
  colHeaders: true,
  rowHeaders: true,
  // nestedRows: true,
  // persistentStateSave:function(key:string,value:any){
  //   console.log(key);
  //   console.log(value)
  //   debugger;
  // }
};
const actionRenderer = function (instance, td, row, col, prop, value, cellProperties) {
  const args = [...arguments];
  Handsontable.dom.empty(td);
  const a = document.createElement('a');
  a.href = 'javascript:void(0)';
  a.innerText = '更多';
  a.onclick = async function () {
    // return await handClickMore(...args);
  };
  td.appendChild(a);
};

const bodySettings = {
  ...baseSettings,
  hiddenColumns: {
    columns: [0, 1],
    indicators: false,
  },
  columns: [
    {
      data: 'id',
    },
    {
      data: 'fullName',
      type: 'autocomplete',
    },
    { data: 'type' },
    {
      data: 'required',
      type: 'dropdown',
      source: requiredAutocompleteOptions,
    },
    {
      data: 'title',
      type: 'autocomplete',
    },
    { data: 'position' },
    { data: 'default' },
    { data: 'enum' },
    { data: 'enumNames' },
    { data: 'enumTitles' },
    { data: 'example' },
    { data: 'description' },
    { data: 'more', renderer: actionRenderer, readOnly: true },
  ],
  colHeaders: [
    'ID',
    '名称',
    '类型',
    '必选',
    '标题',
    '位置',
    '默认值',
    '枚举值',
    '枚举名称',
    '枚举标题',
    '案例',
    '备注',
    '操作',
  ],
};

function TableEditor({ content, setContent }: TableEditorProps) {
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
      <HotTable id="request-body" data={schemaArr || []} {...bodySettings} />
    </>
  );
}

export default React.memo(TableEditor);
