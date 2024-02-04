'use client';
import { useRef, useState } from 'react';
import styles from './css/NikkeMsgEdit.module.css';

import Animate from '@/components/animate';
import { AnimatePresence } from 'framer-motion';

interface editProps {
  currentIndex: number;
  deleted: (deleteIndex: number) => void;
  edit: (editIndex: number) => void;
  add: (insertIndex: number, isUpOrDown: number) => void;
}

const NikkeMsgEdit = ({ currentIndex, deleted, edit, add }: editProps) => {
  const [isEdit, setIsEdit] = useState(false);

  const openEdit = () => {
    setIsEdit(!isEdit);
  };

  const addEdit = (isUpOrDown: number) => {
    add(currentIndex, isUpOrDown);
  };

  return (
    <>
      <div className={styles.edit} onClick={openEdit}></div>
      <AnimatePresence>
        {isEdit && (
          <Animate>
            <div className={styles.editTab}>
              &#8593;
              <div className={styles.upadd} onClick={() => addEdit(0)}></div>
              <div className={styles.edittool} onClick={() => edit(currentIndex)}></div>
              <div className={styles.delete} onClick={() => deleted(currentIndex)}></div>
              <div className={styles.downadd} onClick={() => addEdit(1)}></div>
              &#8595;
            </div>
          </Animate>
        )}
      </AnimatePresence>
    </>
  );
};

export default NikkeMsgEdit;
