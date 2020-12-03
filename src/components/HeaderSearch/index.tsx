import React, { useState, useRef } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

export interface HeaderSearchProps {
  className?: string;
  placeholder?: string;
  defaultValue?: string;
  onSearch?: (value?: string) => void;
}
const HeaderSearch: React.FC<HeaderSearchProps> = (props) => {
  const { className, placeholder, defaultValue, onSearch } = props;
  const inputRef = useRef<Input | null>(null);
  const [value, setValue] = useState(defaultValue);
  const [searchMode, setSearchMode] = useState(false);
  const inputClass = classNames(styles.input, {
    [styles.show]: searchMode,
  });
  return (
    <div
      className={classNames(className, styles.headerSearch)}
      onClick={() => {
        setSearchMode(true);
        if (searchMode && inputRef.current) {
          inputRef.current.focus();
        }
      }}
    >
      <SearchOutlined key="Icon" style={{ cursor: 'pointer' }} />
      <div className={inputClass}>
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label={placeholder}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (onSearch) {
                onSearch(value);
              }
            }
          }}
          onBlur={() => setSearchMode(false)}
        />
      </div>
    </div>
  );
};
export default HeaderSearch;
