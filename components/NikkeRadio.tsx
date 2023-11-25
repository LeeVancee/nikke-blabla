import styles from './css/NikkeRadio.module.css';

interface NikkeRadioProps {
  label: string | undefined;
  checked: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const NikkeRadio = ({ label, checked, children, style }: NikkeRadioProps) => {
  return (
    <div className={styles.radio} style={style}>
      {children}
    </div>
  );
};

export default NikkeRadio;
