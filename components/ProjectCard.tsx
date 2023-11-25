import { Project } from '@/script/project';
import styles from './css/ProjectCard.module.css';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps {
  selectNikkes: Project;
  children?: React.ReactNode;
  onClick?: () => void | undefined;
}
const ProjectCard = ({ selectNikkes, children, onClick }: ProjectCardProps) => {
  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.role}>
        <Image
          src={`/avatars/${selectNikkes.projectNikkes[0].img}.png`}
          fill
          sizes="(max-width: 768px) 100vw,"
          alt=""
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
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
          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>
            {selectNikkes.name}
          </span>
          <span className={styles.cardAuthor}>
            <Link href="#">{selectNikkes.author}</Link>
          </span>
        </div>

        <div
          style={{ flex: 1, fontSize: '15px', marginTop: '2px', color: 'gray' }}
        >
          <span>{selectNikkes.description}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
