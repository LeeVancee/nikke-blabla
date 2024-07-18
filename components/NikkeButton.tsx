import {buttonType} from '@/script/project';
import styles from '@/components/css/NikkeButton.module.css';
import Image from 'next/image';

interface NikkeButtonProps {
    type: buttonType;
    content: string | undefined;
    onClick?: () => void; // 你可以根据实际需要调整
    style?: React.CSSProperties; // 添加 style 属性
    contents?: string;
}

const NikkeButton = ({type, content, style, onClick, contents}: NikkeButtonProps) => {
    return (
        <div className={styles.btn} style={style} onClick={onClick}>
      <span className={`${styles.value} ${type === buttonType.Cancel ? 'valueExit' : ''}`}>
        {content === undefined ? '按钮' : content}
      </span>
            {type === buttonType.Success && <Image src="/btn_bg.png" width={150} height={50} alt="" priority/>}
            {type === buttonType.Cancel && <Image src="/btn_white_bg.png" width={150} height={50} alt="" priority/>}
        </div>
    );
};

export default NikkeButton;
