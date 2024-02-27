'use client';
import Image from 'next/image';
import styles from './page.module.css';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Project,
  ProjectType,
  buttonType,
  IProjectData,
  nikkeData,
  INikkeData,
  ChatMessageData,
  NikkeDatabase,
  Database,
  addDataToDB,
  retrieveDataFromDB,
} from '@/script/project';
import NikkeButton from '@/components/NikkeButton';
import useCreateProject from '@/hooks/useCreateProject';
import NikkeWindow from '@/components/NikkeWindow';
import Header from '@/components/header/Header';
import Text from '@/components/text/Text';
import Contents from '@/components/contents/Contents';
import NikkeWindowContent from '@/components/NikkeWindowContent';
import NikkeDialog from '@/components/NikkeDialog';
import toast from 'react-hot-toast';
//import { openDB } from '@/data/useIndexedDB';
import saveAs from 'file-saver';
import BtnBox from '@/components/BtnBox';
const initialProject: IProjectData = { datas: [] };

export default function Home() {
  const [selectType, setSelectType] = useState('1');
  const [project, setProject] = useState(initialProject);
  const [currentTabId, setCurrentTabId] = useState(1);
  const [filteredData, setFilteredData] = useState<Project[]>();
  const [listNumber, setListNumber] = useState(0);
  const [selectNikke, setSelectNikke] = useState<Array<INikkeData>>([]);
  const [isSelect, setIsSelect] = useState<Array<boolean>>([]);
  const [currentProject, setCurrentProject] = useState(-1);
  const [proName, setProName] = useState('');
  const [proType, setProType] = useState(ProjectType.Nikke);
  const [proDesc, setProDesc] = useState('这是一个简单的小故事');
  const [author, setAuthor] = useState('');

  const selectTab = useCallback((index: number) => {
    setCurrentTabId(index);
  }, []);

  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectType(e.target.value);
  }, []);

  /* function select(value: any, index: any) {
    let selected = [...selectNikke];
    const isSelected = [...isSelect];
    if (isSelect.length > 0 && isSelect.some((isSelected) => isSelected)) {
      // 多选时将 proName 设置为 '空'
      setProName('');
    } else {
      setProName(value.name);
    }

    if (!selected.some((item) => item.img === value.img)) {
      selected.push(value);
      isSelected[index] = true;
    } else {
      selected = selected.filter((item) => item.img !== value.img);
      isSelected[index] = false;
    }

    // 更新状态
    setSelectNikke(selected);
    setIsSelect(isSelected);
    console.log('已选nikke：', selectNikke);
  } */

  useEffect(() => {
    const initDatabase = async () => {
      try {
        const value = await retrieveDataFromDB(NikkeDatabase.nikkeProject, NikkeDatabase.nikkeData);
        if (value) {
          const parsedProject = JSON.parse(value.projects);
          console.log('已经有数据了！', parsedProject);
          setProject(parsedProject);
        }
      } catch (error) {
        console.error('Error during initialization:', error);
      }
    };

    initDatabase();
  }, []);

  useEffect(() => {
    const newData = project.datas.filter((item) => item.type === currentTabId);
    setFilteredData(newData);
    setListNumber(newData.length);
  }, [project, currentTabId]);

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

  const handleSaveMsg = (pro: Project) => {
    const updatedProject = { ...project };
    updatedProject.datas[currentProject] = pro;
    let data: Database = { sequenceId: 1, projects: JSON.stringify(updatedProject) };
    addDataToDB(NikkeDatabase.nikkeProject, data);
  };

  const handleCurrentProject = (index: number) => {
    setCurrentProject(index);
  };

  function updateData(pro: { datas: Project[] }) {
    let str = JSON.stringify(pro);
    console.log('更新对象项目到indexDB中');
    let data: Database = { sequenceId: 1, projects: str };
    addDataToDB(NikkeDatabase.nikkeProject, data);
  }

  const deleteDialog = (index: number) => {
    const updatedDatas = [...project.datas];
    updatedDatas.splice(index, 1);
    const updatedProject = { ...project, datas: updatedDatas };
    updateData(updatedProject);
    setProject(updatedProject);
  };
  function dialogExport(index: number) {
    let currentData = project.datas[index];
    downloadJson(currentData, 'data.json');
  }

  function downloadJson(data: any, filename: string) {
    const jsonData = JSON.stringify(data);
    const blob = new Blob([jsonData], { type: 'application/json' });
    saveAs(blob, filename || 'data.json');
  }
  function jump(url: string) {
    location.href = url;
  }

  return (
    <>
      {filteredData && currentProject !== -1 && (
        <div style={{ height: '100%' }}>
          <NikkeDialog dialogData={filteredData[currentProject]} back={back} saveMsg={handleSaveMsg} />
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

        <NikkeWindowContent handleSuccess={handleSuccess} selectType={selectType} handleTypeChange={handleTypeChange} />

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

/* export default function Home() {
  console.log('渲染');

  return (
    <>
      <BtnBox />
    </>
  );
} */
