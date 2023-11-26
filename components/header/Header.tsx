import styles from '@/app/page.module.css';
import Image from 'next/image';
import Timer from '../Timer';
import { useMemo } from 'react';
import { IProjectData, Project, ProjectType } from '@/script/project';

const initialData = [
  { id: ProjectType.Task, type: '任务' },
  { id: ProjectType.Nikke, type: '妮姬' },
  { id: ProjectType.Group, type: '群组' },
];

const initialProject: IProjectData = { datas: [] };

const Header = ({ currentTabId, selectTab, currentTime }: any) => {
  const data = useMemo(
    () => [
      { id: ProjectType.Task, type: '任务' },
      { id: ProjectType.Nikke, type: '妮姬' },
      { id: ProjectType.Group, type: '群组' },
    ],
    []
  );
  return (
    <div className={styles.header}>
      <div className={styles.title}>
        <span style={{ verticalAlign: 'middle' }}>
          <Image src="/wifi.png" alt=" Logo" width={20} height={14} />
        </span>
        <span style={{ marginLeft: '5px', display: 'inline-block' }}>
          <Timer currentTime={currentTime} />
        </span>
        <span className={styles.logoText}>blabla Genrator</span>
      </div>
      <div className={styles.logo}>
        <Image src="/ele_title_sns.png" alt=" Logo" width={136} height={35} />
      </div>
      <div className={styles.tab}>
        {data.map((value) => (
          <span
            key={value.id}
            className={`${styles.tabName} ${
              value.id === currentTabId ? styles.show : ''
            }`}
            onClick={() => selectTab(value.id)}
          >
            {value.type}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Header;
