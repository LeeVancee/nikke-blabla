'use client';
import { useState, useEffect } from 'react';
import { Project } from '@/script/project';
import styles from './css/ProjectCard.module.css';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps {
  selectNikkes: Project;
  children?: React.ReactNode;
  onClick?: () => void;
}

const MessageContent = ({ message }: any) => {
  if (message.msgType === '图片') {
    return <div>[图片]</div>;
  } else {
    return <span>{message.msg.slice(-1)[0]}</span>;
  }
};

const ProjectCard = ({ selectNikkes, children, onClick }: ProjectCardProps) => {
  const [lastMessage, setLastMessage] = useState(() => {
    // 初始状态设置为 messageData.list 的最后一项
    const initialMessage =
      selectNikkes.messageData.list.length > 0
        ? selectNikkes.messageData.list[selectNikkes.messageData.list.length - 1]
        : null;
    return initialMessage;
  });

  useEffect(() => {
    // 监听 messageData.list 的变化
    const handleNewMessages = () => {
      if (selectNikkes.messageData.list.length > 0) {
        setLastMessage(selectNikkes.messageData.list[selectNikkes.messageData.list.length - 1]);
      } else {
        setLastMessage(null);
      }
    };

    handleNewMessages(); // 初始调用
    const intervalId = setInterval(handleNewMessages, 1000); // 示例：每秒检查一次，实际可根据需求调整

    return () => clearInterval(intervalId); // 清理定时器
  }, [selectNikkes.messageData.list]);

  return (
    <div className={styles.card} onClick={onClick}>
      <div
        className={styles.role}
        style={{
          backgroundImage: `url(/avatars/${selectNikkes.projectNikkes[0].img}.png)`,
        }}
      ></div>
      <div className={styles.textContent}>
        {children}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: '5px',
          }}
        >
          <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
            <span style={{ marginRight: '5px' }}>
              <Image src="/allround.png" width={14} height={12} alt="" />
            </span>
            {selectNikkes.name}
          </span>
          <span className={styles.cardAuthor}>
            <Link href="#">{selectNikkes.author}</Link>
          </span>
        </div>
        <div style={{ flex: 1, fontSize: '15px', marginTop: '2px', color: 'gray' }}>
          <span>{lastMessage && <MessageContent message={lastMessage} />}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
