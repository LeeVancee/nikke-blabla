/* eslint-disable @next/next/no-img-element */
'use client';
import styles from './css/NikkeDialog.module.css';
import Image from 'next/image';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  ICharacterData,
  Project,
  enterprise,
  msgType,
  exportImgType,
  ImgConfig,
  retrieveDataFromDB,
  NikkeDatabase,
  addDataToDB,
  ImgType,
  builtinImageDatas,
} from '../script/project';
import { openDB } from '../data/useIndexedDB';
import Timer from './Timer';
import NikkeMessage from './NikkeMessage';
import useOpenExportImg from '@/hooks/useOpenExportImg';
import NikkeWindow from './NikkeWindow';
import ExportImgContent from './ExportImgContent';
import { saveAs } from 'file-saver';
import ExportMessage from '@/components/exportOnly/ExportMessage';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';
import NikkeSelect from './NikkeSelect';
import useAddNikkeWindow from '@/hooks/useAddNikkeWindow';

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
  const scrollContainer = useRef<HTMLDivElement | null>(null);
  const dbPromise: Promise<IDBDatabase> = openDB('nikkeDatabase') as Promise<IDBDatabase>;
  const [currentImageType, setCurrentImageType] = useState<ImgType>(ImgType.localImage);
  const addNikkeWindow = useAddNikkeWindow();

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

      if (currentImageType === ImgType.localImage) {
        newInfo.msg.push(`[url][base64:] [${totalImages[currentSelectImage]}]`);
        console.log(newInfo.msg);
      } else if (currentImageType === ImgType.builtinImage) {
        newInfo.msg.push(`[url][base64:] [${builtinImageDatas[currentSelectImage]}]`);
      } else {
        newInfo.msg.push('[表情]');
      }
    } else {
      newInfo.msg.push(inputContent);
    }
    const newDialogData = { ...dialogData };
    newDialogData.messageData.list.push(newInfo);
    setDialogData(newDialogData);

    setInputContent('');
    saveMsg(dialogData);
  }, [
    dialogData,
    currentModel,
    currentNikke,
    isOC,
    currentSelectImage,
    inputContent,
    saveMsg,
    totalImages,
    currentImageType,
  ]);

  const append = () => {
    // const lastMessage = dialogData.messageData.list[dialogData.messageData.list.length - 1];
    const updatedList = [...dialogData.messageData.list];

    const lastMessage = updatedList[updatedList.length - 1];

    if (currentModel === msgType.img && currentSelectImage !== -1) {
      // 如果最后一项是图片则无需进行添加

      if (currentImageType === ImgType.localImage) {
        lastMessage.msg.push(`[url][base64:] [${totalImages[currentSelectImage]}]`);
      } else if (currentImageType === ImgType.builtinImage) {
        lastMessage.msg.push(`[url][base64:] [${builtinImageDatas[currentSelectImage]}]`);
      } else {
        lastMessage.msg.push('差分');
      }
    } else if (lastMessage.msgType === msgType.img) {
      // 如果最后一项是图片，根据追加类型修改最后一项的类型
      let model = msgType.nikke;
      if (lastMessage.nikke.img === '指挥官') {
        model = msgType.commander;
      }
      lastMessage.msgType = model;
      lastMessage.msg.push(inputContent);
    } else {
      // 在修改之前打印

      lastMessage.msg.push(inputContent);
      // 在修改之后打印

      setInputContent('');
    }

    saveMsg(dialogData);
  };

  const check = () => {
    // 如果当前模式是图片
    if (currentSelectImage !== -1) {
      return;
    }
    if (inputContent !== '' && currentModel !== msgType.aside && currentModel !== msgType.partition) {
      setCurrentModel(msgType.nikke);
    }
  };

  const scrollToBottom = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollTop = scrollContainer.current.scrollHeight;
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [add]);

  const addImages = () => {
    // 将选中的图像添加到totalImages，同时检查重复，并且当数据有更新时我们将图片添加到本地数据存储中
    let sum = 0;
    selectedImages.forEach((image) => {
      if (!totalImages.includes(image)) {
        totalImages.push(image);
        sum++;
        console.log('success');
      }
    });

    if (sum > 0) {
      let data = { sequenceId: NikkeDatabase.nikkeTotalImages, totalImages: JSON.stringify(totalImages) };
      addDataToDB(dbPromise, NikkeDatabase.nikkeProject, data);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileInput = event.target;
    const files = Array.from(fileInput.files || []);

    if (files.length > 0) {
      const readerPromises = files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readerPromises)
        .then((imageDataArray: any) => {
          /*  const newImage = selectedImages.concat(imageDataArray);

          setSelectedImages(newImage); */
          selectedImages.push(imageDataArray);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          addImages();
        });
    }
  };

  const initialImages = () => {
    retrieveDataFromDB(dbPromise, NikkeDatabase.nikkeProject, NikkeDatabase.nikkeTotalImages).then((value) => {
      if (value) {
        //  totalImages = JSON.parse(value.totalImages);
        setTotalImages(JSON.parse(value.totalImages));
      } else {
        console.log('没有图片数据，数据写入中……');
        addDataToDB(dbPromise, NikkeDatabase.nikkeProject, {
          sequenceId: NikkeDatabase.nikkeTotalImages,
          totalImages: JSON.stringify(totalImages),
        });
      }
    });
  };

  useEffect(() => {
    // 在组件挂载时，从数据库中获取图片数据
    initialImages();
  }, [handleFileUpload]);

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
  const [filteredData, setFilteredData] = useState(dialogData.projectNikkes);
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

  const handleFilteredData = (newFilteredData: any) => {
    setFilteredData(newFilteredData);
  };

  const exportRealToImg = () => {
    console.log(preview);

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
            toast.error('oops, something went wrong!', error);
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
      toast.error('图片格式不支持');
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

  const selectType = (index: number) => {
    setCurrentImageType(index);
    console.log(index);
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
    currentExportImgState,
    exportImgState,
  };

  return (
    <>
      <div style={{ width: '100%', height: '75%', position: 'absolute' }}>
        {addNikkeWindow.isOpen && (
          <NikkeWindow
            title="添加新的妮姬对象"
            confirm={false}
            buttonCancel="取消"
            buttonSuccess="添加"
            cancel={addNikkeWindow.close}
          >
            <div>
              <NikkeSelect filteredData={filteredData} onFilteredData={handleFilteredData} />
            </div>
          </NikkeWindow>
        )}
      </div>

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
              <Image src="/back.png" alt=" back" width={25} height={25} style={{ marginTop: '2px' }} />
              <span style={{ verticalAlign: 'middle' }}>{dialogData?.name}</span>
            </div>
          </div>
        </div>

        <div className={styles.dcontent} ref={scrollContainer}>
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
              saveMsg={saveMsg}
            />
          ))}
        </div>

        <div style={{ position: 'relative', bottom: 0, width: '100%' }}>
          <div className={styles.dmodel}>
            {typeList.map((value, index) => (
              <div
                className={`${styles.dmodelView} ${currentModel === value ? styles.selectModel : ''}`}
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
                {filteredData.map((value: any, index: number) => (
                  <div
                    className={styles.selectNikkeInfo}
                    style={{
                      backgroundImage: `url(avatars/${value.img}.png)`,
                    }}
                    key={index}
                    onClick={() => selectNikke(index)}
                  ></div>
                ))}
                <div className={`${styles.selectNikkeInfo} ${styles.nadd}`} onClick={addNikkeWindow.open}></div>
              </div>
            </>
          )}
          {/*  {isSelectView && (
         
        )} */}

          {isImgListView && (
            <div style={{ backgroundColor: '#fcfcfc' }}>
              <div className={styles.imageType}>
                <ul style={{ color: 'black' }} className={styles.itab}>
                  <li
                    onClick={() => selectType(0)}
                    className={currentImageType === ImgType.localImage ? styles.selectType : ''}
                  >
                    <span>本地图片</span>
                  </li>
                  <li
                    onClick={() => selectType(1)}
                    className={currentImageType === ImgType.builtinImage ? styles.selectType : ''}
                  >
                    <span>内置图片</span>
                  </li>
                  <li
                    onClick={() => selectType(2)}
                    className={currentImageType === ImgType.difference ? styles.selectType : ''}
                  >
                    <span>表情差分</span>
                  </li>
                </ul>
              </div>

              {currentImageType === ImgType.localImage && (
                <div className={styles.imgList}>
                  {totalImages.map((value, index) => (
                    <div key={index}>
                      <div style={{ width: '96px', height: '96px' }}>
                        <img
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

              {currentImageType === ImgType.builtinImage && (
                <div className={styles.imgList}>
                  {builtinImageDatas.map((value, index) => (
                    <div key={index} style={{ width: '96px' }}>
                      <img
                        src={value}
                        width={96}
                        height={96}
                        alt=""
                        property=""
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
                  ))}
                </div>
              )}

              {currentImageType === ImgType.difference && (
                <div className={styles.imgList}>
                  {builtinImageDatas.map((value, index) => (
                    <div key={index}>{value}</div>
                  ))}
                </div>
              )}
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
            {currentModel === msgType.img && (
              <div className={styles.upload} onClick={openFileInput}>
                <Image src="/image.png" alt="" width={32} height={32} />
              </div>
            )}
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
              (dialogHeader.current == null ? 80 : clamp(dialogHeader.current.clientHeight, 70, 90)) +
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
                <img src="/back.png" alt=" back" style={{ marginTop: '2px', width: '25px', height: '25px' }} />

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
            <ExportImgContent
              preview={preview}
              {...props}
              dialogData={dialogData}
              currrentTime={currentTime}
              totalImages={totalImages}
            />
          </NikkeWindow>
        </>
      )}
    </>
  );
};

export default NikkeDialog;
