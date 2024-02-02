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
import { openDB } from '@/data/useIndexedDB';
import saveAs from 'file-saver';
const initialProject: IProjectData = { datas: [] };

export default function Home() {
  const createProject = useCreateProject();
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
  const [currentTime, setCurrentTime] = useState('');

  const selectTab = useCallback(
    (index: number) => {
      setCurrentTabId(index);
      const newData = project.datas.filter((item) => item.type === index);
      setFilteredData(newData);
      setListNumber(newData.length);
    },
    [project.datas]
  );

  useEffect(() => {
    function updateTime() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      setCurrentTime(`${formatTime(hours)}:${formatTime(minutes)}`);
    }

    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // 在 selectTab 更新后再执行相关操作

    selectTab(1);
  }, [selectTab]);

  function formatTime(time: any) {
    return time < 10 ? `0${time}` : time;
  }

  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectType(e.target.value);
  }, []);

  const buttonStyle = { width: '150px', height: '45px', margin: '5px' };

  function select(value: any, index: any) {
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
  }

  const dbPromise: Promise<IDBDatabase> = openDB('nikkeDatabase') as Promise<IDBDatabase>;

  const initProject = useCallback(() => {
    retrieveDataFromDB(dbPromise, NikkeDatabase.nikkeProject, NikkeDatabase.nikkeData).then((value) => {
      if (value) {
        const parsedProject = JSON.parse(value.projects);
        console.log('已经有数据了！', parsedProject);
        setProject(parsedProject);
      } else {
        console.log('没有数据，数据写入中……');
        addDataToDB(dbPromise, NikkeDatabase.nikkeProject, { sequenceId: 1, projects: project });
      }
    });
  }, []); // 移除 project 作为依赖项

  useEffect(() => {
    initProject();
  }, [initProject]);

  const checkData = () => proName !== '' && author !== '' && selectNikke.length !== 0;

  const success = () => {
    if (checkData()) {
      var msgData: ChatMessageData = {
        list: [],
      };
      const pro: Project = new Project(proName, proDesc, author, parseInt(selectType), msgData);
      pro.projectNikkes = selectNikke;
      const updatedProject = { ...project };
      updatedProject.datas = [...project.datas, pro];

      handleSaveMsg(pro);
      updateData(updatedProject);
      setProject(updatedProject);
      // 清空其他状态
      setIsSelect([]);
      setSelectNikke([]);
      selectTab(pro.type.valueOf());
      setProName('默认对话');
      setProType(ProjectType.Nikke);
      setProDesc('这是一个简单的小故事');
      setAuthor('');
      createProject.close();
    } else {
      toast.error('对话名称和作者以及对话妮姬不能小于1不能为空！');
    }
  };
  const cancel = () => {
    setIsSelect([]);
    setSelectNikke([]);
    createProject.close();
    setProName('默认对话');
    setProType(ProjectType.Nikke);
    setProDesc('这是一个简单的小故事');
    setAuthor('');
  };

  const back = () => {
    setCurrentProject(-1);
  };

  // 保存对话函数

  const handleSaveMsg = (pro: Project) => {
    const updatedProject = { ...project };
    updatedProject.datas[currentProject] = pro;
    let data: Database = { sequenceId: 1, projects: JSON.stringify(updatedProject) };
    addDataToDB(dbPromise, NikkeDatabase.nikkeProject, data);
    setProject(updatedProject);
  };

  const handleCurrentProject = (index: number) => {
    setCurrentProject(index);
  };

  function updateData(pro: { datas: Project[] }) {
    let str = JSON.stringify(pro);
    console.log('更新对象项目到indexDB中');
    let data: Database = { sequenceId: 1, projects: str };
    addDataToDB(dbPromise, NikkeDatabase.nikkeProject, data);
  }

  const deleteDialog = (index: number) => {
    const updatedDatas = [...project.datas];
    updatedDatas.splice(index, 1);
    const updatedProject = { ...project, datas: updatedDatas };
    updateData(updatedProject);
    // setFilteredData(updatedDatas);
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
          <NikkeDialog
            dialogData={filteredData[currentProject]}
            back={back}
            saveMsg={handleSaveMsg}
            currentTime={currentTime}
          />
        </div>
      )}
      <div className={styles.btnbox} style={{ height: '100%' }}>
        <NikkeButton type={buttonType.Cancel} content="导出对话" style={buttonStyle} />
        <NikkeButton type={buttonType.Success} content="创建对话" onClick={createProject.open} style={buttonStyle} />
      </div>
      <div className={styles.box}>
        <div className={`${styles.box} ${styles.back}`}>
          <Image src={`/background.png`} alt="background" fill style={{ objectFit: 'cover' }} priority />
        </div>
        {createProject.isOpen && (
          <NikkeWindow
            title="Nikke blabla"
            confirm={true}
            buttonSuccess="创建"
            buttonCancel="取消"
            success={success}
            cancel={cancel}
          >
            <NikkeWindowContent
              proName={proName}
              setProName={setProName}
              proDesc={proDesc}
              setProDesc={setProDesc}
              author={author}
              setAuthor={setAuthor}
              selectType={selectType}
              handleTypeChange={handleTypeChange}
              isSelect={isSelect}
              select={select}
            />
          </NikkeWindow>
        )}

        <Header currentTabId={currentTabId} selectTab={selectTab} currentTime={currentTime} />

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
