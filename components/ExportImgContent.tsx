'use client';
import styles from '@/app/page.module.css';
import dialogStyles from '@/components/css/NikkeDialog.module.css';
import { exportImgType } from '@/script/project';
import NikkeInfo from './NikkeInfo';
import NikkeRadio from './NikkeRadio';
import { useState } from 'react';
import saveAs from 'file-saver';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';
import NikkeWindow from './NikkeWindow';
import useOpenExportImg from '@/hooks/useOpenExportImg';

enum exportImgState {
  pause,
  run,
}

const ExportImgContent = ({ preview, dialogData, dialogImg }: any) => {
  const [scale, setScale] = useState(2);
  const [quality, setQuality] = useState(0.95);
  const [exportType, setExportType] = useState('0');
  const [imgName, setImgName] = useState(dialogData.name);
  const [mark, setMark] = useState(true);
  const [currentExportImgState, setCurrentExportImgState] = useState(exportImgState.pause);
  const openExportImg = useOpenExportImg();

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
  const cancel = () => {
    openExportImg.close();
  };
  return (
    <NikkeWindow
      title="导出图片"
      buttonSuccess="导出"
      buttonCancel="取消"
      success={exportRealToImg}
      cancel={cancel}
      confirm={true}
      show={openExportImg.isOpen}
    >
      <div className={styles.project}>
        <div className={styles.label}>
          <div className={styles.pcontent}>
            <span>图片名称 *</span>
            <input className="nikkeInput" value={imgName} onChange={(e) => setImgName(e.target.value)} type="text" />
          </div>
          <div className={styles.pcontent}>
            <span>是否添加水印</span>
            <input checked={mark} onChange={(e) => setMark(e.target.checked)} type="checkbox" defaultChecked />
          </div>
          <NikkeInfo> 将会在头部添加作者名字、使用的工具等信息 (临时) </NikkeInfo>
          <div className={styles.pcontent}>
            <span>导出图片格式</span>
            <NikkeRadio checked={true} label="任务" style={{ flex: 1 }}>
              <div
                style={{
                  margin: '0',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <input
                    id="png"
                    type="radio"
                    value="0"
                    name="projectType"
                    onChange={(e) => setExportType(e.target.value)}
                    defaultChecked
                  />
                  <label htmlFor="png">PNG</label>
                </div>
                <div>
                  <input
                    id="jpeg"
                    type="radio"
                    value="1"
                    name="projectType"
                    onChange={(e) => setExportType(e.target.value)}
                  />
                  <label htmlFor="jpeg">JPEG</label>
                </div>
              </div>
            </NikkeRadio>
          </div>
          {parseInt(exportType) === exportImgType.jpeg && (
            <div className={styles.pcontent}>
              <span>图片质量</span>
              <input
                className="nikkeInput"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                min={0}
                max={1}
                type="number"
              />
              <div></div>
            </div>
          )}
          {parseInt(exportType) === exportImgType.jpeg && <NikkeInfo> jepg导出时的质量取值范围{0 - 1}</NikkeInfo>}
          <div className={styles.pcontent}>
            <span>缩放</span>
            <input
              className="nikkeInput"
              style={{ flex: 0, width: '120px' }}
              maxLength={20}
              min={1}
              max={10}
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              type="number"
            />
          </div>
          <NikkeInfo>图片的缩放比例，值越高画面越清晰，但大小则会变得更大 推荐范围{1 - 10}</NikkeInfo>
          <div style={{ height: '1px', backgroundColor: '#e6e7e6' }}></div>
          <div style={{ textAlign: 'center' }}>预览</div>
          <NikkeInfo> 图片预览，如果无法在你的浏览器导出则保存预览图 </NikkeInfo>
          <div ref={preview} className={dialogStyles.preview}>
            {currentExportImgState === exportImgState.run && <div className={styles.loading}>Loading&#8230;</div>}
          </div>
        </div>
      </div>
    </NikkeWindow>
  );
};

export default ExportImgContent;
