'use client';
import { buttonType } from '@/script/project';
import styles from '@/app/page.module.css';
import NikkeButton from './NikkeButton';
import useCreateProject from '@/hooks/useCreateProject';

const buttonStyle = { width: '150px', height: '45px', margin: '5px' };
const BtnBox = () => {
  const createProject = useCreateProject();
  return (
    <div className={styles.btnbox} style={{ height: '100%' }}>
      <NikkeButton type={buttonType.Cancel} content="导出对话" style={buttonStyle} />
      <NikkeButton type={buttonType.Success} content="创建对话" onClick={createProject.open} style={buttonStyle} />
    </div>
  );
};

export default BtnBox;
