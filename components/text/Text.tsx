import styles from '@/app/page.module.css';

interface TextProps {
  listNumber: number;
}

const Text = ({ listNumber }: TextProps) => {
  return (
    <div className={styles.text}>
      <span>对话清单：{listNumber}</span>
      <span style={{ marginLeft: 'auto' }}>最新对话</span>
      <span style={{ color: 'grey', margin: '0 5px' }}> | </span>
      <span>图标</span>
    </div>
  );
};

export default Text;
