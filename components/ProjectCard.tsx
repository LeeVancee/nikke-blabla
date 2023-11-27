import { Project } from '@/script/project';
import styles from './css/ProjectCard.module.css';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps {
  selectNikkes: Project;
  children?: React.ReactNode;
  onClick?: () => void | undefined;
}

const MessageContent = ({ message }: any) => {
  if (message.msgType === '图片') {
    return <div>[图片]</div>;
  } else {
    return <span>{message.msg.slice(-1)[0]}</span>;
  }
};

const ProjectCard = ({ selectNikkes, children, onClick }: ProjectCardProps) => {
  const lastMessage =
    selectNikkes.messageData.list.length > 0
      ? selectNikkes.messageData.list[selectNikkes.messageData.list.length - 1]
      : null;

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

        <div
          style={{ flex: 1, fontSize: '15px', marginTop: '2px', color: 'gray' }}
        >
          <span>{lastMessage && <MessageContent message={lastMessage} />}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
