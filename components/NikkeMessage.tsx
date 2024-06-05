/* eslint-disable @next/next/no-img-element */
'use client';
import NikkeMsgEdit from './NikkeMsgEdit';
import { INikkeData, Project, msgType } from '../script/project';
import { useRef, useState } from 'react';
import styles from './css/NikkeMessage.module.css';
import Image from 'next/image';

interface NikkeMessageProps {
  msgs: Array<string>;
  nikke: INikkeData;
  type: msgType;
  index: number;
  isEdit: boolean;
  saveMsg: (pro: any) => void;
  dialogData: any;
  setDialogData: any;
}

const NikkeMessage = ({
  msgs,
  nikke,
  type,
  index: currentIndex,
  isEdit,
  saveMsg,
  dialogData,
  setDialogData,
}: NikkeMessageProps) => {
  const spaceRefs = useRef<HTMLInputElement>(null);
  const [editContent, setEditContent] = useState('');
  const [editInputs, setEditInputs] = useState<Array<number>>([]);

  const parseImg = (content: string) => {
    let value = content.split(' ');
    if (value.length === 2) {
      if (value[0] !== '[url][base64:]') {
        return false;
      }
      let path: string = value[1].substring(1, value[1].length - 1);

      return true;
    }

    return false;
  };

  const lostfocus = (index: number) => {
    msgs[index] = editContent;
    // setMsgs(updatedMsgs);
    // 清空编辑状态
    setEditInputs([]);

    console.log('失去焦点');
  };

  const addMsg = (index: number, isUpDown: number) => {
    /*  if (isUpDown == 0) {
      msgs.splice(index, 0, '插入的数据');
    } else if (isUpDown == 1) {
      msgs.splice(index + 1, 0, '插入的数据');
    } */
  };

  const editMsg = (index: number) => {
    if (editInputs.includes(index)) {
      lostfocus(index);
    } else {
      setEditInputs([index]);
      setEditContent(msgs[index]);
    }
  };
  function deleteMsg(index: number) {
    const newDialogData = { ...dialogData };

    if (msgs.length === 1) {
      // msgs.splice(currentIndex, 1);
      newDialogData.messageData.list.splice(currentIndex, 1);
      console.log('删除');
    } else {
      msgs.splice(index, 1);

      console.log('删除追加');
    }
    setDialogData(newDialogData);
    saveMsg(newDialogData);
  }

  /*   const parseImgToDataURL = (content: string) => {
    let value = content.split(' ');
    let index: string = value[1].substring(1, value[1].length - 1);
    return parseInt(index);
  }; */

  const parseImgToDataURL = (content: string) => {
    const matches = content.match(/\[url\]\[base64:\]\s*\[([^\]]+)\]/);

    if (matches && matches[1]) {
      const index = matches[1];
      return index;
    }

    return ''; // 如果没有匹配到索引，返回 字符串
  };

  return (
    <>
      {type === msgType.nikke && (
        <div className={styles.msg}>
          <div className={styles.head} style={{ backgroundImage: `url(avatars/${nikke.img}.png)` }}></div>

          <div className={styles.textgroup}>
            <div className={styles.name}>{nikke.name}</div>

            {msgs.map((value, index) => (
              <div className={styles.textbox} key={index}>
                {!parseImg(value) ? (
                  <span className={styles.text}>
                    {!editInputs.indexOf(index) ? (
                      <input
                        ref={spaceRefs}
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onBlur={() => lostfocus(index)}
                        className={`${styles.nikkeInput} ${styles.msgInput}`}
                      />
                    ) : (
                      <div>{value}</div>
                    )}
                  </span>
                ) : (
                  <span className={`${styles.text} ${styles.mzhg} ${styles.toimg}`}>
                    <img src={parseImgToDataURL(value)} alt="" className={styles.imgType} />
                  </span>
                )}
                <Image src="/g.png" alt="" width={16} height={16} className={styles.nikkeImg} />
                {isEdit && <NikkeMsgEdit add={addMsg} edit={editMsg} deleted={deleteMsg} currentIndex={index} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {type === msgType.commander && (
        <div className={styles.zmsg}>
          {msgs.map((value, index) => (
            <div className={styles.ztextbox} key={index}>
              {!parseImg(value) ? (
                <span className={`${styles.text} ${styles.mzhg}`}>
                  {!editInputs.indexOf(index) ? (
                    <input
                      ref={spaceRefs}
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      onBlur={() => lostfocus(index)}
                      className={`${styles.nikkeInput} ${styles.msgInput}`}
                    />
                  ) : (
                    <div>{value}</div>
                  )}
                </span>
              ) : (
                <>
                  <span className={`${styles.text} ${styles.mzhg} ${styles.toimg}`}>
                    <Image src={parseImgToDataURL(value)} alt="" width={200} height={205} className={styles.imgType} />
                  </span>
                </>
              )}
              <Image src="/rg.png" alt="" width={16} height={16} className={styles.znikkeImg} />
              {isEdit && <NikkeMsgEdit add={addMsg} edit={editMsg} deleted={deleteMsg} currentIndex={index} />}
            </div>
          ))}
        </div>
      )}

      {type === msgType.img && nikke.img === '指挥官' && (
        <div className={styles.zmsg}>
          {msgs.map((value, index) => (
            <div className={styles.ztextbox} key={index}>
              <span className={`${styles.text} ${styles.mzhg} ${styles.toimg}`}>
                <img src={parseImgToDataURL(value)} alt="" width={200} height={205} className={styles.imgType} />
              </span>

              <Image src="/rg.png" alt="" width={16} height={16} className={styles.znikkeImg} />
              {isEdit && <NikkeMsgEdit add={addMsg} edit={editMsg} deleted={deleteMsg} currentIndex={index} />}
            </div>
          ))}
        </div>
      )}

      {type === msgType.img && nikke.img !== '指挥官' && (
        <div className={styles.msg}>
          <div className={styles.head} style={{ backgroundImage: `url(avatars/${nikke.img}.png)` }}></div>
          <div className={styles.textgroup}>
            <div className={styles.name}>{nikke.name}</div>
            {msgs.map((value, index) => (
              <div className={styles.textbox} key={index}>
                <span className={`${styles.text}  ${styles.toimg}`}>
                  <img src={parseImgToDataURL(value)} alt="" width={200} height={205} className={styles.imgType} />
                </span>
                <Image src="/g.png" alt="" width={16} height={16} className={styles.nikkeImg} />
                {isEdit && <NikkeMsgEdit add={addMsg} edit={editMsg} deleted={deleteMsg} currentIndex={index} />}
              </div>
            ))}
          </div>
        </div>
      )}

      {type === msgType.aside && (
        <div className={`${styles.zmsg} ${styles.ntext}`} style={{ color: 'rgb(59,50, 50)' }}>
          <span style={{ margin: '3px 0' }}>{msgs[0] === '' ? '这里是旁白请讲' : msgs[0]}</span>
        </div>
      )}

      {type === msgType.partition && (
        <div className={`${styles.zmsg} ${styles.ntext}`} style={{ color: 'rgb(59,50, 50)' }}>
          <div className={styles.partition}>
            <div className={styles.line}></div>
            <span className={styles.partitionContent}>{msgs[0] === '' ? 'END' : msgs[0]}</span>
            <div className={styles.line}></div>
          </div>
        </div>
      )}
    </>
  );
};

export default NikkeMessage;
