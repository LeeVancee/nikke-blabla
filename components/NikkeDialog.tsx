'use client';
import styles from './css/NikkeDialog.module.css';
import Image from 'next/image';
import { useEffect, useRef, RefObject, useState, useCallback } from 'react';
import {
  ICharacterData,
  Project,
  enterprise,
  msgType,
  exportImgType,
  ImgConfig,
} from '../script/project';
import Timer from './Timer';
import NikkeMessage from './NikkeMessage';
import useOpenExportImg from '@/hooks/useOpenExportImg';
import NikkeWindow from './NikkeWindow';
import ExportImgContent from './ExportImgContent';
import { saveAs } from 'file-saver';
import ExportMessage from '@/components/exportOnly/ExportMessage';

import html2canvas from 'html2canvas';

interface NikkeDialogProps {
  dialogData: any;
  back: (pro: Project) => void;
  currentTime: any;
  saveMsg: (pro: Project) => void;
}

const initialTypeList = [msgType.nikke, msgType.img, msgType.aside, msgType.partition];

const NikkeDialog = ({ dialogData: initialData, back, currentTime, saveMsg }: NikkeDialogProps) => {
  const openExportImg = useOpenExportImg();
  const fileInput = useRef<HTMLInputElement>(null);
  const [typeList, setTypeList] = useState(initialTypeList);
  const [currentModel, setCurrentModel] = useState(msgType.nikke);
  const [inputPlaceholder, setInputPlaceholder] = useState('请输入对话内容');
  const [inputContent, setInputContent] = useState('');
  const [isSelectView, setIsSelectView] = useState(false);
  const [isOC, setIsOC] = useState(false);
  const [currentNikke, setCurrentNikke] = useState(0);
  const [isImgListView, setIsImgListView] = useState(false);
  const [totalImages, setTotalImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentSelectImage, setCurrentSelectImage] = useState<number>(-1);
  const inputRef = useRef(null);
  const [dialogData, setDialogData] = useState(initialData);
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

  function selectModel(type: msgType) {
    setInputPlaceholder('请输入对话内容');

    if (type === msgType.img) {
      setInputContent('');
      setInputPlaceholder('');
    }

    if (type === msgType.partition) {
      setInputPlaceholder('请输入分割内容，默认为END');
    }

    if (type === msgType.aside) {
      setInputPlaceholder('请输入旁白内容');
    }

    setCurrentModel(type);
  }

  function selectOC() {
    setIsOC(true);
  }
  function selectNikke(index: number) {
    setCurrentNikke(index);
    setIsOC(false);
  }

  function selectImage(index: number) {
    if (currentSelectImage === index) {
      setCurrentSelectImage(-1);
    } else {
      setCurrentSelectImage(index);
    }
  }

  function show() {
    setIsSelectView(!isSelectView);
  }

  const openFile = () => {
    fileInput.current?.click();
  };

  const openFileInput = () => {
    setIsImgListView(!isImgListView);
  };

  const addImages = useCallback(() => {
    // 将选中的图像添加到totalImages，同时检查重复, 并且当数据有更新时我们将图片添加到本地数据存储中

    let sum = 0;
    selectedImages.forEach((image) => {
      if (!totalImages.includes(image)) {
        setTotalImages((prevTotalImages) => {
          const newImages = [...prevTotalImages, image];
          localStorage.setItem('totalImages', JSON.stringify(newImages));
          return newImages;
        });
        sum++;
      }
    });
  }, [totalImages, selectedImages]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInputRef = fileInput.current;
    const files = Array.from(fileInputRef?.files || []);

    if (files.length > 0) {
      const readerPromises = files.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readerPromises)
        .then((imageDataArray) => {
          console.log('图片数据：', imageDataArray);
          setSelectedImages(imageDataArray);
        })
        .finally(() => {
          console.log('图片读取完成');
          addImages();
        });
    }
  };

  useEffect(() => {
    addImages();
  }, [addImages, selectedImages]);

  const add = useCallback(() => {
    const newInfo: ICharacterData = {
      msgType: currentModel, //正常消息类型
      msg: [],
      nikke: dialogData.projectNikkes[currentNikke],
    };

    if (isOC && (currentModel === msgType.nikke || currentModel === msgType.img)) {
      newInfo.nikke = {
        name: '指挥官',
        img: '指挥官',
        enterprise: enterprise.主角,
      };
      newInfo.msgType = msgType.commander;
    }

    if (currentModel === msgType.img && currentSelectImage !== -1) {
      newInfo.msgType = msgType.img;
      console.log(currentSelectImage);

      newInfo.msg.push(`[url][base64:] [${currentSelectImage}]`);
    } else {
      newInfo.msg.push(inputContent);
    }
    const newDialogData = { ...dialogData };
    newDialogData.messageData.list.push(newInfo);
    setDialogData(newDialogData);

    setInputContent('');
    saveMsg(dialogData);
  }, [dialogData, currentModel, currentNikke, isOC, currentSelectImage, inputContent, saveMsg]);

  const append = () => {
    // 当前模式和最后对话的模式不同 即最后对话的是img则无需进行添加
    if (currentModel === msgType.img && currentSelectImage !== -1) {
      // 如果想最加图片则必须使得msgType为追加图片
      dialogData.messageData.list[dialogData.messageData.list.length - 1].msgType.push(
        `[url][base64:] [${currentSelectImage}]`
      );
    } else if (
      dialogData.messageData.list[dialogData.messageData.list.length - 1].msgType === msgType.img
    ) {
      let model: msgType = msgType.nikke;
      // 如果最后一项是指挥官则修改为指挥官
      if (
        dialogData.messageData.list[dialogData.messageData.list.length - 1].nikke.img === '指挥官'
      ) {
        model = msgType.commander;
      }
      // 如果最后一项是图片 且追加类型不等于图片则修改最后一项的类型
      dialogData.messageData.list[dialogData.messageData.list.length - 1].msgType = model;

      dialogData.messageData.list[dialogData.messageData.list.length - 1].msg.push(inputContent);
    } else {
      dialogData.messageData.list[dialogData.messageData.list.length - 1].msg.push(inputContent);

      setInputContent('');
      saveMsg(dialogData);
    }
  };

  const check = () => {
    // 如果当前模式是图片
    if (currentSelectImage !== -1) {
      return;
    }
    if (
      inputContent !== '' &&
      currentModel !== msgType.aside &&
      currentModel !== msgType.partition
    ) {
      setCurrentModel(msgType.nikke);
    }
  };

  useEffect(() => {
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [scrollContainer, add]);
  useEffect(() => {
    // 判断有没有 totalImages 这个字段
    const isV = localStorage.getItem('totalImages');
    if (isV === null) {
      localStorage.setItem('totalImages', JSON.stringify(totalImages));
    } else {
      setTotalImages(JSON.parse(isV));
    }
  }, []);

  function handleDelete(index: any) {
    const newDialogData = { ...dialogData };

    newDialogData.messageData.list.splice(index, 1);

    setDialogData(newDialogData);
  }

  const cancel = () => {
    openExportImg.close();
  };

  enum exportImgState {
    pause,
    run,
  }

  const [scale, setScale] = useState(2);
  const [quality, setQuality] = useState(0.95);
  const [exportType, setExportType] = useState('0');
  const [imgName, setImgName] = useState(dialogData.name);
  const [mark, setMark] = useState(true);

  const [currentExportImgState, setCurrentExportImgState] = useState(exportImgState.pause);
  const preview = useRef<HTMLDivElement | null>(null);
  const dialogImg = useRef<HTMLDivElement | null>(null);
  const dialogHeader = useRef<HTMLDivElement | null>(null);
  const dialogContent = useRef<HTMLDivElement | null>(null);
  const [imgConfig, setImgConfig] = useState<ImgConfig>({
    width: 500,
    maxWidth: 550,
    bottomHeigth: 15,
  });

  const exportRealToImg = () => {
    if (exportType === exportImgType.png.toString()) {
      setCurrentExportImgState(exportImgState.run);

      if (dialogImg.current != undefined) {
        html2canvas(dialogImg.current, {
          allowTaint: true,
          useCORS: true,
          scale: scale,
        })
          .then((canvas) => {
            saveAs(canvas.toDataURL(), `${imgName}.png`);

            const img = document.createElement('img');
            img.crossOrigin = 'anonymous';
            img.src = canvas.toDataURL();

            preview.current?.appendChild(img);

            if (dialogImg.current != undefined) {
              dialogImg.current.style.transform = `scale(${1})`;
            }
            setCurrentExportImgState(exportImgState.pause);
          })
          .catch((error: any) => {
            console.error('oops, something went wrong!', error);
            alert(error);
          });
      }
    } else if (exportType === exportImgType.jpeg.toString()) {
      setCurrentExportImgState(exportImgState.run);
      if (dialogImg.current != undefined) {
        html2canvas(dialogImg.current, {
          useCORS: true,
          allowTaint: true,
          scale: scale,
        })
          .then((canvas) => {
            saveAs(canvas.toDataURL(), `${imgName}.jpeg`);

            const img = document.createElement('img');
            img.src = canvas.toDataURL();

            preview.current?.appendChild(img);

            if (dialogImg.current != undefined) {
              dialogImg.current.style.transform = `scale(${1})`;
            }
            setCurrentExportImgState(exportImgState.pause);
          })
          .catch((error: any) => {
            console.error('oops, something went wrong!', error);
          });
      }
    } else {
      console.log('图片格式不支持');
    }
  };
  function clamp(vaule: number, min: number, max: number) {
    if (vaule < min) {
      return min;
    }

    if (vaule > max) {
      return max;
    }

    return vaule;
  }

  // 处理函数
  const handleExportType = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExportType(e.target.value);
  };
  const handleImgName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImgName(e.target.value);
  };
  const handleScale = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScale(Number(e.target.value));
  };
  const handleQuality = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuality(Number(e.target.value));
  };
  const handleMark = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMark(e.target.checked);
  };
  const props = {
    mark,
    imgName,
    exportType,
    scale,
    quality,
    handleImgName,
    handleExportType,
    handleQuality,
    handleScale,
    handleMark,
  };

  return (
    <>
      <div className={styles.dialog}>
        <div className={styles.dheader}>
          <div className={styles.title}>
            <span style={{ verticalAlign: 'middle' }}>
              <Image src="/wifi.png" alt=" Logo" width={20} height={14} />
            </span>
            <span style={{ marginLeft: '5px' }}>
              <Timer currentTime={currentTime} />
            </span>
          </div>
          <div className={styles.dback} onClick={() => back(dialogData)}>
            <div className={styles.dtitle}>
              <Image
                src="/back.png"
                alt=" back"
                width={25}
                height={25}
                style={{ marginTop: '2px' }}
              />
              <span style={{ verticalAlign: 'middle' }}>{dialogData?.name}</span>
            </div>
          </div>
        </div>

        <div className={styles.dcontent} ref={(ref) => setScrollContainer(ref)}>
          {dialogData.messageData.list.map((value: any, index: any) => (
            <NikkeMessage
              key={index}
              type={value.msgType}
              msgs={value.msg}
              index={index}
              currentData={totalImages}
              dialogData={dialogData}
              isEdit={true}
              nikke={value.nikke}
              onDelete={handleDelete}
            />
          ))}
        </div>

        <div style={{ position: 'relative', bottom: 0, width: '100%' }}>
          <div className={styles.dmodel}>
            {typeList.map((value, index) => (
              <div
                className={`${styles.dmodelView} ${
                  currentModel === value ? styles.selectModel : ''
                }`}
                onClick={() => selectModel(value)}
                key={index}
              >
                {value}
              </div>
            ))}

            <span
              className={`${styles.dmodelView} ${styles.export}`}
              style={{ marginLeft: 'auto', width: '80px' }}
              onClick={() => openExportImg.open()}
            >
              导出图片
            </span>
          </div>
          {isSelectView && (
            <>
              <div className={`${styles.selectNikkeInfo} ${styles.last}`} onClick={selectOC}>
                指
              </div>
              <div className={styles.dselectnikke}>
                {dialogData?.projectNikkes.map((value: any, index: number) => (
                  <div
                    className={styles.selectNikkeInfo}
                    style={{
                      backgroundImage: `url(avatars/${value.img}.png)`,
                    }}
                    key={index}
                    onClick={() => selectNikke(index)}
                  ></div>
                ))}
              </div>
            </>
          )}
          {/*  {isSelectView && (
         
        )} */}

          {isImgListView && (
            <div className={styles.imgList}>
              {totalImages.map((value, index) => (
                <div key={index}>
                  <div style={{ width: '96px', height: '96px' }}>
                    <Image
                      src={value}
                      width={96}
                      height={96}
                      alt=""
                      className={currentSelectImage === index ? styles.isSelectImageView : ''}
                      style={{
                        boxSizing: 'border-box',
                        backgroundColor: '#c6c6c6',
                        borderRadius: '5px',
                        border: '2px solid #c6c6c6',
                        transition: 'border 0.1s ease-in-out',
                      }}
                      onClick={() => selectImage(index)}
                    />
                  </div>
                </div>
              ))}

              <div
                style={{
                  fontSize: '64px',
                  color: 'black',
                  width: '96px',
                  height: '96px',
                  textAlign: 'center',
                  border: '1px solid skyblue',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onClick={openFile}
              >
                <span style={{ marginTop: '-11px' }}> + </span>
              </div>
            </div>
          )}

          <div className={styles.nikkeedit}>
            <div
              className={`${styles.selectNikkeInfo} ${isOC ? styles.zhg : ''}`}
              style={{
                backgroundImage: `url(avatars/${dialogData?.projectNikkes[currentNikke].img}.png)`,
              }}
              onClick={show}
            >
              {isOC && (
                <span
                  style={{
                    color: 'rgb(92, 58, 58)',
                    lineHeight: '32px',
                    textAlign: 'center',
                    width: '100%',
                    display: 'inline-block',
                  }}
                >
                  指挥官
                </span>
              )}
            </div>
            <div className={styles.upload} onClick={openFileInput}>
              <Image src="/image.png" alt="" width={32} height={32} />
            </div>
            <input
              id="fileInput"
              type="file"
              ref={fileInput}
              style={{ display: 'none' }}
              onChange={handleFileUpload}
              accept="image/*"
              multiple
            />

            <input
              ref={inputRef}
              type="text"
              className={`nikkeInput ${styles.dinput}`}
              value={inputContent}
              onChange={(e) => {
                setInputContent(e.target.value);
                check();
              }}
              onFocus={check}
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  add();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Tab') {
                  append();
                }
              }}
              placeholder={inputPlaceholder}
            />
            <div className={`${styles.add} ${styles.newadd}`} onClick={add}>
              新增
            </div>
            {currentModel !== msgType.aside && currentModel !== msgType.partition && (
              <div className={`${styles.add} ${styles.oldadd}`} onClick={append}>
                追加
              </div>
            )}
          </div>
        </div>
      </div>
      {openExportImg.isOpen && (
        <div
          className={styles.dialogImg}
          style={{
            height: `${
              (dialogHeader.current == null
                ? 80
                : clamp(dialogHeader.current.clientHeight, 70, 90)) +
              (dialogContent.current == null
                ? 50
                : clamp(dialogContent.current.scrollHeight + imgConfig.bottomHeigth, 150, 99999999))
            }px !important`,
          }}
          ref={dialogImg}
        >
          <div className={`${styles.dheader} ${styles.hImg}`} ref={dialogHeader}>
            <div className={styles.title}>
              <span style={{ verticalAlign: 'middle' }}>
                <img src="/wifi.png" alt=" Logo" style={{ width: '20px', height: '14px' }} />
              </span>
              <Timer currentTime={currentTime} />
            </div>
            <div className={styles.dback} onClick={() => back(dialogData)}>
              <div className={styles.dtitle}>
                <img
                  src="/back.png"
                  alt=" back"
                  style={{ marginTop: '2px', width: '25px', height: '25px' }}
                />

                <span style={{ verticalAlign: 'middle' }}>{dialogData?.name}</span>
              </div>
              {mark && (
                <div
                  className={styles.dtitle}
                  style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    marginRight: '10px',
                    fontSize: '16px',
                    marginTop: '5px',
                  }}
                >
                  Author: {dialogData.author}
                </div>
              )}
            </div>
          </div>
          <div className={`${styles.dcontent} ${styles.toImg}`} ref={dialogContent}>
            {dialogData.messageData.list.map((value: any, index: any) => (
              <ExportMessage
                key={index}
                type={value.msgType}
                msgs={value.msg}
                index={index}
                currentData={totalImages}
                dialogData={dialogData}
                isEdit={true}
                nikke={value.nikke}
              />
            ))}
          </div>
        </div>
      )}
      {openExportImg.isOpen && (
        <>
          <NikkeWindow
            title="导出图片"
            buttonSuccess="导出"
            buttonCancel="取消"
            success={exportRealToImg}
            cancel={cancel}
            confirm={true}
          >
            <ExportImgContent preview={preview} {...props} />
          </NikkeWindow>
        </>
      )}
    </>
  );
};

export default NikkeDialog;
