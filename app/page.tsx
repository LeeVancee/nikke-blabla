'use client';
import Image from 'next/image';
import styles from './page.module.css';
import { useRef, useState } from 'react';
import { Project, IProjectData, NikkeDatabase, Database } from '@/script/project';
import Header from '@/components/header/Header';
import Text from '@/components/text/Text';
import Contents from '@/components/contents/Contents';
import NikkeWindowContent from '@/components/NikkeWindowContent';
import NikkeDialog from '@/components/NikkeDialog';
import saveAs from 'file-saver';
import BtnBox from '@/components/BtnBox';
import { addDataToDB, retrieveDataFromDB } from '@/data/useIndexedDB';

export default function Home() {
  const initialProject: IProjectData = { datas: [] };

  const [project, setProject] = useState(initialProject);
  const [currentTabId, setCurrentTabId] = useState(1);
  const [filteredData, setFilteredData] = useState<Project[]>();
  const [listNumber, setListNumber] = useState(0);
  const [currentProject, setCurrentProject] = useState(-1);
  const isInitialized = useRef(false);

  const selectTab = (index: number) => {
    setCurrentTabId(index);
    filterData(index);
  };

  const initializeData = async () => {
    try {
      const value = await retrieveDataFromDB(NikkeDatabase.nikkeProject, 1);
      if (value) {
        const parsedProject = JSON.parse(value.projects);
        setProject(parsedProject);
        filterData(currentTabId, parsedProject);
      }
      isInitialized.current = true;
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  };

  if (!isInitialized.current) {
    initializeData();
  }

  const filterData = (tabId: number, projectData: IProjectData = project) => {
    const newData = projectData.datas.filter((item) => item.type === tabId);
    setFilteredData(newData);
    setListNumber(newData.length);
  };

  const handleSuccess = (pro: any) => {
    const updatedProject = { ...project };
    updatedProject.datas = [...project.datas, pro];
    updateData(updatedProject);
    setProject(updatedProject);
  };

  const back = () => {
    setCurrentProject(-1);
  };

  // 保存对话函数

  const handleCurrentProject = (index: number) => {
    setCurrentProject(index);
  };

  const updateData = (pro: { datas: Project[] }) => {
    let str = JSON.stringify(pro);
    console.log('更新对象项目到indexDB中');
    let data: Database = { sequenceId: 1, projects: str };
    addDataToDB(NikkeDatabase.nikkeProject, data);
  };

  const deleteDialog = (index: number) => {
    const updatedDatas = [...project.datas];
    updatedDatas.splice(index, 1);
    const updatedProject = { ...project, datas: updatedDatas };
    updateData(updatedProject);
    setProject(updatedProject);
  };
  const dialogExport = (index: number) => {
    let currentData = project.datas[index];
    downloadJson(currentData, 'data.json');
  };

  const downloadJson = (data: any, filename: string) => {
    const jsonData = JSON.stringify(data);
    const blob = new Blob([jsonData], { type: 'application/json' });
    saveAs(blob, filename || 'data.json');
  };

  return (
    <>
      {filteredData && currentProject !== -1 && (
        <div style={{ height: '100%' }}>
          <NikkeDialog
            dialogData={filteredData[currentProject]}
            back={back}
            project={project}
            currentProject={currentProject}
          />
        </div>
      )}
      <BtnBox />
      <div className={styles.box}>
        <div className={`${styles.box} ${styles.back}`}>
          <Image
            src={`/background.png`}
            alt="background"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        <NikkeWindowContent handleSuccess={handleSuccess} />

        <Header currentTabId={currentTabId} selectTab={selectTab} />

        <Text listNumber={listNumber} />

        <Contents
          filteredData={filteredData}
          onCurrentProject={handleCurrentProject}
          deleteDialog={deleteDialog}
          dialogExport={dialogExport}
        />
      </div>
    </>
  );
}
