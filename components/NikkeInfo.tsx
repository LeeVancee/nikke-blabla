import styles from './css/NikkeInfo.module.css';

interface NikkeInfoProps {
  content?: string | undefined;
  children?: React.ReactNode;
}

const NikkeInfo = ({ content, children }: NikkeInfoProps) => {
  return <div className={styles.info}>{children}</div>;
};

export default NikkeInfo;
