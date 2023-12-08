'use client';
import { useState } from 'react';
import { INikkeData, nikkeData, buttonType } from '../script/project';
import styles from './css/NikkeSelect.module.css';
import useAddNikkeWindow from '@/hooks/useAddNikkeWindow';
import NikkeButton from './NikkeButton';
import Image from 'next/image';

interface NikkeSelectProps {
  filteredData: Array<INikkeData>;
  onFilteredData: (data: Array<INikkeData>) => void;
}

const NikkeSelect = ({ filteredData, onFilteredData }: NikkeSelectProps) => {
  const [selectNikke, setSelectNikke] = useState<Array<INikkeData>>([]);
  const [isSelect, setIsSelect] = useState<Array<boolean>>([]);
  const [parentData, setParentData] = useState(filteredData);
  const addNikkeWindow = useAddNikkeWindow();

  const select = (value: any, index: any) => {
    // 如果数组中有这个元素则代表当前nikke是被选择的，所以要删除元素反之则添加元素
    if (!selectNikke.includes(value)) {
      setSelectNikke([...selectNikke, value]);
      //   setIsSelect([...isSelect.slice(0, index), true, ...isSelect.slice(index + 1)]);
      isSelect[index] = true;
    } else {
      setSelectNikke(selectNikke.filter((item) => item.img !== value.img));
      //  setIsSelect([...isSelect.slice(0, index), false, ...isSelect.slice(index + 1)]);
      isSelect[index] = false;
    }
    console.log('已选nikke：', selectNikke);
  };

  const filteredNikkes = nikkeData.nikkes.filter(
    (value) => !parentData.some((filterItem) => filterItem.img === value.img)
  );
  const addition = () => {
    selectNikke.forEach((value) => parentData?.push(value));

    setIsSelect([]);
    setSelectNikke([]);
    addNikkeWindow.close();
  };

  return (
    <>
      <div className={styles.nikkeGrid}>
        {filteredNikkes.map((value, index) => (
          <div
            className={`${styles.nikke} ${isSelect[index] ? styles.nikkeCheck : ''}`}
            onClick={() => {
              select(value, index);
            }}
            key={index}
          >
            <Image src={`/avatars/${value.img}.png`} alt="grid" width={60} height={60} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <NikkeButton
          type={buttonType.Success}
          content="添加新妮姬"
          onClick={addition}
          style={{ width: '170px', height: '50px', margin: '5px' }}
        />
      </div>
    </>
  );
};

export default NikkeSelect;
