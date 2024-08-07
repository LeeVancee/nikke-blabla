/* eslint-disable @next/next/no-img-element */
'use client';
import styles from './css/NikkeDialog.module.css';
import Image from 'next/image';
import {useRef, useState} from 'react';
import {
  builtinImageDatas,
  Database,
  enterprise,
  ICharacterData,
  ImgConfig,
  ImgType,
  IProjectData,
  msgType,
  Project,
} from '@/script/project';
import Timer from './Timer';
import NikkeMessage from './NikkeMessage';
import useOpenExportImg from '@/hooks/useOpenExportImg';
import NikkeWindow from './NikkeWindow';
import ExportImgContent from './ExportImgContent';
import ExportMessage from '@/components/exportOnly/ExportMessage';
import NikkeSelect from './NikkeSelect';
import useAddNikkeWindow from '@/hooks/useAddNikkeWindow';
import {useRouter} from 'next/navigation';
import {addDataToDB} from '@/data/db';
import {useInitializeImageData} from '@/hooks/useInitializeData';
import useScrollToBottom from '@/hooks/useScrollToBottom';

interface NikkeDialogProps {
    dialogData: any;
    back: () => void;
    project: IProjectData;
    currentProject: number;
}

const typeList = [msgType.nikke, msgType.img, msgType.aside, msgType.partition];

const NikkeDialog = ({dialogData: initialData, back, project, currentProject}: NikkeDialogProps) => {
    const openExportImg = useOpenExportImg();
    const fileInput = useRef<HTMLInputElement>(null);
    const [currentModel, setCurrentModel] = useState(msgType.nikke);
    const [inputPlaceholder, setInputPlaceholder] = useState('请输入对话内容');
    const [inputContent, setInputContent] = useState('');
    const [isSelectView, setIsSelectView] = useState(false);
    const [isOC, setIsOC] = useState(false);
    const [currentNikke, setCurrentNikke] = useState(0);
    const [isImgListView, setIsImgListView] = useState(false);
    // const [totalImages, setTotalImages] = useState<string[]>([]);
    // const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [currentSelectImage, setCurrentSelectImage] = useState<number>(-1);
    const inputRef = useRef(null);
    const [dialogData, setDialogData] = useState(initialData);
    // const scrollContainer = useRef<HTMLDivElement | null>(null);
    const [currentImageType, setCurrentImageType] = useState<ImgType>(ImgType.localImage);
    const addNikkeWindow = useAddNikkeWindow();
    const router = useRouter();

    const initialTotalImages: string[] = []; // 初始化 totalImages 的默认值
    const {totalImages, addImages} = useInitializeImageData(initialTotalImages);

    const handleSaveMsg = (pro: Project) => {
        const updatedProject = {...project};
        updatedProject.datas[currentProject] = pro;
        let data: Database = {sequenceId: 1, projects: JSON.stringify(updatedProject)};
        addDataToDB(data);
    };

    const {scrollContainer} = useScrollToBottom([dialogData.messageData.list.length]);

    const selectModel = (type: msgType) => {
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
    };

    const selectOC = () => {
        setIsOC(true);
    };

    const selectNikke = (index: number) => {
        setCurrentNikke(index);
        setIsOC(false);
    };

    const selectImage = (index: number) => {
        if (currentSelectImage === index) {
            setCurrentSelectImage(-1);
        } else {
            setCurrentSelectImage(index);
        }
    };

    const show = () => {
        setIsSelectView(!isSelectView);
    };

    const openFile = () => {
        fileInput.current?.click();
    };

    const openFileInput = () => {
        setIsImgListView(!isImgListView);
    };

    const add = () => {
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
        const newDialogData = {...dialogData};
        newDialogData.messageData.list.push(newInfo);
        setDialogData(newDialogData);

        setInputContent('');
        handleSaveMsg(newDialogData);
    };

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
            lastMessage.msg.push(inputContent);

            setInputContent('');
        }

        const newDialogData = {...dialogData};
        setDialogData(newDialogData);

        handleSaveMsg(newDialogData);
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

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);

        if (files.length > 0) {
            const readerPromises = files.map((file) => {
                return new Promise<string | null>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        resolve(reader.result as string | null);
                    };
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(readerPromises)
                .then((imageDataArray) => {
                    const validImageDataArray = imageDataArray.filter((data) => typeof data === 'string') as string[];
                    // setSelectedImages(validImageDataArray);
                    addImages(validImageDataArray);
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    router.refresh();
                });
        }

        event.target.value = '';
    };
    const [filteredData, setFilteredData] = useState(dialogData.projectNikkes);

    const preview = useRef<HTMLDivElement | null>(null);
    const dialogImg = useRef<HTMLDivElement | null>(null);
    const dialogHeader = useRef<HTMLDivElement | null>(null);
    const dialogContent = useRef<HTMLDivElement | null>(null);

    const imgConfig: ImgConfig = {
        width: 500,
        maxWidth: 550,
        bottomHeight: 15,
    };

    const handleFilteredData = (newFilteredData: any) => {
        setFilteredData(newFilteredData);
    };

    const clamp = (vaule: number, min: number, max: number) => {
        if (vaule < min) {
            return min;
        }

        if (vaule > max) {
            return max;
        }

        return vaule;
    };

    const selectType = (index: number) => {
        setCurrentImageType(index);
        console.log(index);
    };
    const handleMsg = (dialogData: Project) => {
        setDialogData(dialogData);
        handleSaveMsg(dialogData);
    };

    return (
        <>
            <div style={{width: '100%', height: '75%', position: 'absolute'}}>
                <NikkeWindow
                    title="添加新的妮姬对象"
                    confirm={false}
                    buttonCancel="取消"
                    buttonSuccess="添加"
                    cancel={addNikkeWindow.close}
                    show={addNikkeWindow.isOpen}
                >
                    <div>
                        <NikkeSelect filteredData={filteredData} onFilteredData={handleFilteredData}/>
                    </div>
                </NikkeWindow>
            </div>

            <div className={styles.dialog}>
                <div className={styles.dheader}>
                    <div className={styles.title}>
            <span style={{verticalAlign: 'middle'}}>
              <Image src="/wifi.png" alt=" Logo" width={20} height={14}/>
            </span>
                        <span style={{marginLeft: '5px'}}>
              <Timer/>
            </span>
                    </div>
                    <div className={styles.dback} onClick={() => back()}>
                        <div className={styles.dtitle}>
                            <Image src="/back.png" alt=" back" width={25} height={25} style={{marginTop: '2px'}}/>
                            <span style={{verticalAlign: 'middle'}}>{dialogData?.name}</span>
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
                            isEdit={true}
                            nikke={value.nikke}
                            dialogData={dialogData}
                            handleMsg={handleMsg}
                        />
                    ))}
                </div>

                <div style={{position: 'relative', bottom: 0, width: '100%'}}>
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
                            style={{marginLeft: 'auto', width: '80px'}}
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
                                <div className={`${styles.selectNikkeInfo} ${styles.nadd}`}
                                     onClick={addNikkeWindow.open}></div>
                            </div>
                        </>
                    )}

                    {isImgListView && (
                        <div style={{backgroundColor: '#fcfcfc'}}>
                            <div className={styles.imageType}>
                                <ul style={{color: 'black'}} className={styles.itab}>
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
                                            <div style={{width: '96px', height: '96px'}}>
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
                                        <span style={{marginTop: '-11px'}}> + </span>
                                    </div>
                                </div>
                            )}

                            {currentImageType === ImgType.builtinImage && (
                                <div className={styles.imgList}>
                                    {builtinImageDatas.map((value, index) => (
                                        <div key={index} style={{width: '96px'}}>
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
                                <Image src="/image.png" alt="" width={32} height={32}/>
                            </div>
                        )}
                        <input
                            id="fileInput"
                            type="file"
                            ref={fileInput}
                            style={{display: 'none'}}
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
                                : clamp(dialogContent.current.scrollHeight + imgConfig.bottomHeight, 150, 99999999))
                        }px !important`,
                    }}
                    ref={dialogImg}
                >
                    <div className={`${styles.dheader} ${styles.hImg}`} ref={dialogHeader}>
                        <div className={styles.title}>
              <span style={{verticalAlign: 'middle'}}>
                <img src="/wifi.png" alt=" Logo" style={{width: '20px', height: '14px'}}/>
              </span>
                            <Timer/>
                        </div>
                        <div className={styles.dback} onClick={() => back()}>
                            <div className={styles.dtitle}>
                                <img src="/back.png" alt=" back"
                                     style={{marginTop: '2px', width: '25px', height: '25px'}}/>

                                <span style={{verticalAlign: 'middle'}}>{dialogData?.name}</span>
                            </div>
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

            <ExportImgContent preview={preview} dialogData={dialogData} dialogImg={dialogImg}
                              totalImages={totalImages}/>
        </>
    );
};

export default NikkeDialog;
