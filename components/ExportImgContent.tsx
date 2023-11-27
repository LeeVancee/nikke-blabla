'use client';
import styles from '@/app/page.module.css';
import { exportImgType } from '@/script/project';
import NikkeInfo from './NikkeInfo';
import NikkeRadio from './NikkeRadio';
const ExportImgContent = ({ imgData, setImgData, preview }: any) => {
  return (
    <div className={styles.project}>
      <div className={styles.label}>
        <div className={styles.pcontent}>
          <span>图片名称 *</span>
          <input
            className="nikkeInput"
            value={imgData.imgName}
            onChange={(e) => setImgData(e.target.value)}
            type="text"
          />
        </div>
        <div className={styles.pcontent}>
          <span>是否添加水印</span>
          <input
            className="nikkeInput"
            value={imgData.mark}
            onChange={(e) => setImgData(e.target.value)}
            type="checkbox"
          />
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
                  value={0}
                  name="projectType"
                  onChange={(e) => setImgData(e.target.value)}
                  checked
                />
                <label htmlFor="png">PNG</label>
              </div>
              <div>
                <input
                  id="jpeg"
                  type="radio"
                  value={1}
                  name="projectType"
                  onChange={(e) => setImgData(e.target.value)}
                  checked
                />
                <label htmlFor="png">JPEG</label>
              </div>
            </div>
          </NikkeRadio>
        </div>
        {parseInt(imgData.exportType) === exportImgType.jpeg && (
          <div className={styles.pcontent}>
            <span>图片质量</span>
            <input
              className="nikkeInput"
              value={imgData.quality}
              onChange={(e) => setImgData(e.target.value)}
              min={0}
              max={1}
              type="number"
            />
            {parseInt(imgData.exportType) === exportImgType.jpeg && (
              <NikkeInfo> jepg导出时的质量取值范围{0 - 1}</NikkeInfo>
            )}
          </div>
        )}
        <div className={styles.pcontent}>
          <span>缩放</span>
          <input
            className="nikkeInput"
            style={{ flex: 0, width: '120px' }}
            maxLength={20}
            min={1}
            max={10}
            value={imgData.scale}
            onChange={(e) => setImgData(e.target.value)}
            type="number"
          />
        </div>
        <NikkeInfo>
          图片的缩放比例，值越高画面越清晰，但大小则会变得更大 推荐范围{1 - 10}
        </NikkeInfo>
        <div style={{ height: '1px', backgroundColor: '#e6e7e6' }}></div>
        <div style={{ textAlign: 'center' }}>预览</div>
        <div ref={preview} className={styles.preview}></div>
      </div>
    </div>
  );
};

export default ExportImgContent;
