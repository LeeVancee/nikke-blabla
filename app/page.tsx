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

  function formatTime(time: any) {
    return time < 10 ? `0${time}` : time;
  }

  const selectTab = useCallback(
    (index: number) => {
      setCurrentTabId(index);
      // 过滤数据
      const newData = project.datas.filter((item) => item.type === index);
      setFilteredData(newData);
      setListNumber(newData.length);
    },
    [project.datas]
  );

  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectType(e.target.value);
  }, []);

  const buttonStyle = { width: '150px', height: '45px', margin: '5px' };

  function select(value: any, index: any) {
    setProName((prevProName) => {
      if (isSelect.length > 0 && isSelect.some((isSelected) => isSelected)) {
        // 多选时将 proName 设置为 '空'
        return '';
      } else {
        return value.name;
      }
    });

    setSelectNikke((prevSelectNikke) => {
      if (!prevSelectNikke.some((item) => item.img === value.img)) {
        return [...prevSelectNikke, value];
      } else {
        return prevSelectNikke.filter((item) => item.img !== value.img);
      }
    });

    setIsSelect((prevIsSelect) => {
      const updatedIsSelect = [...prevIsSelect];
      updatedIsSelect[index] = !prevIsSelect[index];
      return updatedIsSelect;
    });
  }

  useEffect(() => {
    // 从本地存储中获取项目数据
    const storedProjects = localStorage.getItem('projects');

    if (storedProjects === null) {
      // 如果本地存储中没有项目数据，则将初始数据存储到本地存储中
      localStorage.setItem('projects', JSON.stringify(initialProject));
    } else {
      // 如果本地存储中有项目数据，则使用它来更新项目状态
      setProject(JSON.parse(storedProjects));
    }
  }, []);

  useEffect(() => {
    // 过滤数据
    const newData = project.datas.filter((item) => item.type === currentTabId);
    setFilteredData(newData);
    setListNumber(newData.length);
  }, [currentTabId, project.datas]);

  const checkData = () => proName !== '' && author !== '' && selectNikke.length !== 0;

  const success = () => {
    if (checkData()) {
      var msgData: ChatMessageData = {
        list: [],
      };
      const pro: Project = new Project(proName, proDesc, author, parseInt(selectType), msgData);
      console.log(proDesc);

      selectNikke.forEach((item) => pro.projectNikkes.push(item));
      console.log(pro);

      // 使用 setProject 更新状态
      setProject((prevProject) => {
        const updatedProject = {
          ...prevProject,
          datas: [...prevProject.datas, pro],
        };

        // 更新完数据后，再打印
        console.log('new Pro', updatedProject);

        // 更新 localStorage
        localStorage.setItem('projects', JSON.stringify(updatedProject));

        return updatedProject;
      });

      // 清空其他状态
      setIsSelect([]);
      setSelectNikke([]);
      console.log('更新对象项目到localStorage中');
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
    project.datas[currentProject] = pro;
    localStorage.setItem('projects', JSON.stringify(project));

    console.log('保存成功');
  };

  const handleCurrentProject = (index: number) => {
    setCurrentProject(index);
  };

  return (
    <>
      {filteredData && currentProject !== -1 && (
        <NikkeDialog
          dialogData={filteredData[currentProject]}
          back={back}
          saveMsg={handleSaveMsg}
          currentTime={currentTime}
        />
      )}
      <div className={styles.btnbox} style={{ height: '100%' }}>
        <NikkeButton type={buttonType.Cancel} content="导出对话" style={buttonStyle} />
        <NikkeButton
          type={buttonType.Success}
          content="创建对话"
          onClick={createProject.open}
          style={buttonStyle}
        />
      </div>
      <div className={styles.box}>
        <div className={`${styles.box} ${styles.back}`}>
          <Image
            src={`/background.png`}
            alt="background"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
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

        <Contents filteredData={filteredData} onCurrentProject={handleCurrentProject} />
      </div>
    </>
  );
}
