import styles from './css/NikkeWindow.module.css';
import Image from 'next/image';
import NikkeButton from './NikkeButton';
import { buttonType } from '@/script/project';

interface NikkeWindowProps {
  title?: string;
  show?: boolean;
  confirm?: boolean;
  buttonSuccess?: string;
  buttonCancel?: string;
  cancel?: () => void;
  success?: () => void;
  children: React.ReactNode;
}
const buttonStyle = {
  width: '170px',
  height: '50px',
  margin: '5px',
};

const NikkeWindow = ({
  title,
  show,
  confirm,
  buttonSuccess,
  buttonCancel,
  cancel,
  success,
  children,
}: NikkeWindowProps) => {
  return (
    <>
      <div className={styles.black}></div>
      <div className={styles.window}>
        <div className={styles.wcontent}>
          {!confirm && <div className={styles.x} onClick={cancel}></div>}
          <span className={styles.title}>{title}</span>

          <Image src="/gg_top.png" fill alt="" priority />
        </div>
        <div className={styles.contentBox}>{children}</div>
        {confirm && (
          <div className={styles.btnBox}>
            <NikkeButton
              type={buttonType.Cancel}
              content={buttonCancel}
              onClick={cancel !== undefined ? cancel : undefined}
              style={buttonStyle}
            />
            <NikkeButton
              type={buttonType.Success}
              content={buttonSuccess}
              onClick={success !== undefined ? success : undefined}
              style={buttonStyle}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default NikkeWindow;
