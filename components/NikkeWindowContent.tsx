import styles from '@/app/page.module.css';
import { INikkeData, nikkeData } from '@/script/project';
import NikkeRadio from './NikkeRadio';
import NikkeInfo from './NikkeInfo';
import Image from 'next/image';

interface NikkeWindowContentProps {
  proName: string;
  setProName: (value: string) => void;
  proDesc: string;
  setProDesc: (value: string) => void;
  author: string;
  setAuthor: (value: string) => void;
  selectType: string;
  handleTypeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nikkeData?: INikkeData[];
  isSelect: boolean[];
  select: (value: any, index: number) => void;
}

const NikkeWindowContent = ({
  proName,
  setProName,
  proDesc,
  setProDesc,
  author,
  setAuthor,
  selectType,
  handleTypeChange,
  isSelect,
  select,
}: NikkeWindowContentProps) => {
  return (
    <div className={styles.project}>
      <div className={styles.label}>
        <div className={styles.pcontent}>
          <span>对话名称 *</span>
          <input
            className="nikkeInput"
            value={proName}
            onChange={(e) => setProName(e.target.value)}
            type="text"
          />
        </div>
        <div className={styles.pcontent}>
          <span>对话类型 *</span>
          <NikkeRadio label="任务" checked={true} style={{ flex: 1 }}>
            <div
              style={{
                margin: '0',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <input
                  id="task"
                  type="radio"
                  value="0"
                  name="projectType"
                  onChange={handleTypeChange}
                  checked={selectType === '0'}
                />
                <label htmlFor="task">任务</label>
              </div>
              <div>
                <input
                  id="nikke"
                  type="radio"
                  value="1"
                  name="projectType"
                  onChange={handleTypeChange}
                  checked={selectType === '1'}
                />
                <label htmlFor="nikke">妮姬</label>
              </div>
              <div>
                <input
                  id="group"
                  type="radio"
                  value="2"
                  name="projectType"
                  onChange={handleTypeChange}
                  checked={selectType === '2'}
                />
                <label htmlFor="group">群组</label>
              </div>
            </div>
            <NikkeInfo>(目前只实现妮姬类型)</NikkeInfo>
          </NikkeRadio>
        </div>
        <div className={styles.pcontent}>
          <span>对话名称 *</span>
          <input
            className="nikkeInput"
            value={proDesc}
            onChange={(e) => setProDesc(e.target.value)}
            type="text"
          />
        </div>
        <div className={styles.pcontent}>
          <span>作者 *</span>
          <input
            className="nikkeInput"
            style={{ width: '120px', flex: '1' }}
            type="text"
            maxLength={20}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div style={{ height: '1px', backgroundColor: '#e6e7e6' }} />
        <div>
          <span>选择对话妮姬（可多选|至少选一个）</span>
        </div>
        {selectType === '1' && (
          <div className={styles.nikkeSelect}>
            <div className={styles.enterprise}>
              <div
                className={styles.enterpriseBox}
                style={{ backgroundColor: '#32b1f4' }}
              >
                ALL
              </div>
              <div className={styles.enterpriseBox}>极乐净土</div>
              <div className={styles.enterpriseBox}>米西利斯</div>
              <div className={styles.enterpriseBox}>泰特拉</div>
              <div className={styles.enterpriseBox}>朝圣者</div>
              <div className={styles.enterpriseBox}>反常</div>
            </div>
            <div className={styles.nikkeGrid}>
              {nikkeData.nikkes.map((value, index) => (
                <div
                  className={`${styles.nikke} ${
                    isSelect[index] ? styles.nikkeCheck : ''
                  }`}
                  onClick={() => {
                    select(value, index);
                  }}
                  key={index}
                >
                  <Image
                    src={`/avatars/${value.img}.png`}
                    alt="grid"
                    width={60}
                    height={60}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NikkeWindowContent;
