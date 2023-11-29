'use client';
import styles from '@/app/page.module.css';
import dialogStyles from '@/components/css/NikkeDialog.module.css';
import { exportImgType } from '@/script/project';
import NikkeInfo from './NikkeInfo';
import NikkeRadio from './NikkeRadio';
const ExportImgContent = ({
  preview,
  imgName,
  mark,
  scale,
  exportType,
  quality,
  handleImgName,
  handleMark,
  handleScale,
  handleExportType,
  handleQuality,
}: any) => {
  return (
    <div className={styles.project}>
      <div className={styles.label}>
        <div className={styles.pcontent}>
          <span>图片名称 *</span>
          <input className="nikkeInput" value={imgName} onChange={handleImgName} type="text" />
        </div>
        <div className={styles.pcontent}>
          <span>是否添加水印</span>
          <input value={mark} onChange={handleMark} type="checkbox" defaultChecked />
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
                  onChange={handleExportType}
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
                  onChange={handleExportType}
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
              onChange={handleQuality}
              min={0}
              max={1}
              type="number"
            />
            <div></div>
          </div>
        )}
        {parseInt(exportType) === exportImgType.jpeg && (
          <NikkeInfo> jepg导出时的质量取值范围{0 - 1}</NikkeInfo>
        )}
        <div className={styles.pcontent}>
          <span>缩放</span>
          <input
            className="nikkeInput"
            style={{ flex: 0, width: '120px' }}
            maxLength={20}
            min={1}
            max={10}
            value={scale}
            onChange={handleScale}
            type="number"
          />
        </div>
        <NikkeInfo>图片的缩放比例，值越高画面越清晰，但大小则会变得更大 推荐范围{1 - 10}</NikkeInfo>
        <div style={{ height: '1px', backgroundColor: '#e6e7e6' }}></div>
        <div style={{ textAlign: 'center' }}>预览</div>
        <NikkeInfo> 图片预览，如果无法在你的浏览器导出则保存预览图 </NikkeInfo>
        <div ref={preview} className={dialogStyles.preview}></div>
      </div>
    </div>
  );
};

export default ExportImgContent;
