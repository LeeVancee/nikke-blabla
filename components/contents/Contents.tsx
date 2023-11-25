'use client';
import styles from '@/app/page.module.css';
import ProjectCard from '../ProjectCard';
import { Project } from '@/script/project';
import { useState } from 'react';
import NikkeDialog from '../NikkeDialog';

interface ContentProps {
  filteredData?: Project[];
  currentProject?: number;
  onCurrentProject: (index: number) => void;
  back?: any;
}
const Contents = ({
  filteredData,
  currentProject,
  back,
  onCurrentProject,
}: ContentProps) => {
  const openDialog = (index: number) => {
    onCurrentProject(index); // 在点击时调用回调函数
  };
  return (
    <>
      <div className={styles.content}>
        <div className={styles.cardList}>
          {filteredData && filteredData.length > 0 ? (
            filteredData.map((value, index) => (
              <ProjectCard
                key={index}
                selectNikkes={value}
                onClick={() => openDialog(index)}
              ></ProjectCard>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Contents;
