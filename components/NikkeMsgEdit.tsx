'use client';
import { useRef, useState } from 'react';
import styles from './css/NikkeMsgEdit.module.css';

import './css/NikkeMsgEdit.module.css';
import { CSSTransition } from 'react-transition-group';

interface editProps {
  currentIndex: number;
  deleted: (deleteIndex: number) => void;
  edit: (editIndex: number) => void;
  add: (insertIndex: number, isUpOrDown: number) => void;
}

const NikkeMsgEdit = ({ currentIndex, deleted, edit, add }: editProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const nodeRef = useRef(null);

  const openEdit = () => {
    setIsEdit(!isEdit);
  };

  const addEdit = (isUpOrDown: number) => {
    add(currentIndex, isUpOrDown);
  };

  return (
    <>
      <div className={styles.edit} onClick={openEdit}></div>
      <CSSTransition
        in={isEdit}
        timeout={300}
        nodeRef={nodeRef}
        classNames="bounce" // 使用你的 CSS 类名
        unmountOnExit
      >
        <div className={styles.editTab}>
          &#8593;
          <div className={styles.upadd} onClick={() => addEdit(0)}></div>
          <div className={styles.edittool} onClick={() => edit(currentIndex)}></div>
          <div className={styles.delete} onClick={() => deleted(currentIndex)}></div>
          <div className={styles.downadd} onClick={() => addEdit(1)}></div>
          &#8595;
        </div>
      </CSSTransition>
    </>
  );
};

export default NikkeMsgEdit;
