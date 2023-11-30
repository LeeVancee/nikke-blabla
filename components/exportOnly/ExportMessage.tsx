'use client';
import { INikkeData, Project, msgType } from '@/script/project';
import { useEffect, useRef, useState } from 'react';
import styles from '../css/NikkeMessage.module.css';
import Image from 'next/image';

interface NikkeMessageProps {
  msgs: Array<string>;
  nikke: INikkeData;
  type: msgType;
  index: number;
  currentData: string[];
  dialogData: Project;
  isEdit: boolean;
}

const NikkeMessage = ({
  msgs: initialMsgs,
  nikke,
  type,
  currentData,
  dialogData: initialData,
}: NikkeMessageProps) => {
  const [dialogData, setDialogData] = useState(initialData);
  const [msgs, setMsgs] = useState(initialMsgs);
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
    // 清空编辑状态
    setEditInputs([]);
    msgs[index] = editContent;
    console.log('失去焦点');
  };

  const parseImgToDataURL = (content: string) => {
    let value = content.split(' ');
    let index: string = value[1].substring(1, value[1].length - 1);
    return parseInt(index);
  };

  return (
    <>
      {type === msgType.nikke && (
        <div className={styles.msg}>
          <div
            className={styles.head}
            style={{ backgroundImage: `url(avatars/${nikke.img}.png)` }}
          ></div>

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
                    <img
                      src={currentData[parseImgToDataURL(value)]}
                      alt=""
                      className={styles.imgType}
                    />
                  </span>
                )}
                <img src="/g.png" alt="" className={styles.nikkeImg} />
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
                    <img
                      src={currentData[parseImgToDataURL(value)]}
                      alt=""
                      width={30}
                      height={30}
                      className={styles.imgType}
                    />
                  </span>
                </>
              )}
              <img src="/rg.png" alt="" width={16} height={16} className={styles.znikkeImg} />
            </div>
          ))}
        </div>
      )}

      {type === msgType.img && nikke.img === '指挥官' && (
        <div className={styles.zmsg}>
          {msgs.map((value, index) => (
            <div className={styles.ztextbox} key={index}>
              <span className={`${styles.text} ${styles.mzhg} ${styles.toimg}`}>
                <img
                  src={currentData[parseImgToDataURL(value)]}
                  alt=""
                  className={styles.imgType}
                />
              </span>
              <img src="/rg.png" alt="" className={styles.znikkeImg} />
            </div>
          ))}
        </div>
      )}

      {type === msgType.img && nikke.img !== '指挥官' && (
        <div className={styles.msg}>
          <div
            className={styles.head}
            style={{ backgroundImage: `url(avatars/${nikke.img}.png)` }}
          ></div>
          <div className={styles.textgroup}>
            <div className={styles.name}>{nikke.name}</div>
            {msgs.map((value, index) => (
              <div className={styles.textbox} key={index}>
                <span className={`${styles.text}  ${styles.toimg}`}>
                  {currentData[parseImgToDataURL(value)] && (
                    <img
                      src={currentData[parseImgToDataURL(value)]}
                      alt=""
                      className={styles.imgType}
                    />
                  )}
                </span>
                <img src="/g.png" alt="" className={styles.nikkeImg} />
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
