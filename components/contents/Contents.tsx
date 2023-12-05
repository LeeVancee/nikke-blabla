'use client';
import styles from '@/app/page.module.css';
import ProjectCard from '../ProjectCard';
import { Project } from '@/script/project';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useState } from 'react';
import NikkeDialog from '../NikkeDialog';
import saveAs from 'file-saver';

interface ContentProps {
  filteredData?: Project[];
  projects?: Project[];
  onCurrentProject: (index: number) => void;
  back?: any;
  deleteDialog: (index: number) => void;
  dialogExport: (index: number) => void;
}
const Contents = ({ filteredData, onCurrentProject, deleteDialog, dialogExport }: ContentProps) => {
  const openDialog = (index: number) => {
    onCurrentProject(index); // 在点击时调用回调函数
  };

  return (
    <>
      <div className={styles.content}>
        <div className={styles.cardList}>
          {filteredData &&
            filteredData.map((value, index) => (
              <ProjectCard key={index} selectNikkes={value} onClick={() => openDialog(index)}>
                <div
                  className={styles.dialogDelete}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDialog(index);
                  }}
                ></div>
                <div
                  className={styles.dialogExport}
                  onClick={(e) => {
                    e.stopPropagation();
                    dialogExport(index);
                  }}
                ></div>
              </ProjectCard>
            ))}
        </div>
      </div>
    </>
  );
};

export default Contents;
