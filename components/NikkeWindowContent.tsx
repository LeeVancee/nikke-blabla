'use client';
import styles from '@/app/page.module.css';
import { ChatMessageData, INikkeData, Project, ProjectType, nikkeData } from '@/script/project';
import NikkeRadio from './NikkeRadio';
import NikkeInfo from './NikkeInfo';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import NikkeWindow from './NikkeWindow';
import useCreateProject from '@/hooks/useCreateProject';
interface NikkeWindowContentProps {
  nikkeData?: INikkeData[];
  handleSuccess: (pro: any) => void;
}

const enterprises = ['All', '极乐净土', '米西里斯', '泰特拉', '朝圣者', '反常', '配角', '主角', '动物', '莱彻'];

const NikkeWindowContent = ({ handleSuccess }: NikkeWindowContentProps) => {
  const [selectedEnterprise, setSelectedEnterprise] = useState(0);
  const [filteredNikkes, setFilteredNikkes] = useState(nikkeData.nikkes);
  const [proName, setProName] = useState('');
  const [proType, setProType] = useState(ProjectType.Nikke);
  const [proDesc, setProDesc] = useState('这是一个简单的小故事');
  const [author, setAuthor] = useState('');
  const [isSelect, setIsSelect] = useState<Array<boolean>>([]);
  const [selectNikke, setSelectNikke] = useState<Array<INikkeData>>([]);

  const createProject = useCreateProject();

  const [selectType, setSelectType] = useState('1');

  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectType(e.target.value);
  }, []);

  const selectEnterprise = (enterprise: any) => {
    setSelectedEnterprise(enterprise);

    // 直接在这里进行筛选
    if (enterprise !== 0) {
      const newFilteredNikkes = nikkeData.nikkes.filter((nikke) => nikke.enterprise === enterprise);
      setFilteredNikkes(newFilteredNikkes);
    } else {
      setFilteredNikkes(nikkeData.nikkes);
    }
  };

  function select(value: any, index: any) {
    let selected = [...selectNikke];
    const isSelected = [...isSelect];
    if (isSelect.length > 0 && isSelect.some((isSelected) => isSelected)) {
      // 多选时将 proName 设置为 '空'
      setProName('');
    } else {
      setProName(value.name);
    }

    if (!selected.some((item) => item.img === value.img)) {
      selected.push(value);
      isSelected[index] = true;
    } else {
      selected = selected.filter((item) => item.img !== value.img);
      isSelected[index] = false;
    }

    // 更新状态
    setSelectNikke(selected);
    setIsSelect(isSelected);
    console.log('已选nikke：', selectNikke);
  }

  const success = () => {
    const checkData = () => proName !== '' && author !== '' && selectNikke.length !== 0;
    if (checkData()) {
      let msgData: ChatMessageData = {
        list: [],
      };
      const pro: Project = new Project(proName, proDesc, author, parseInt(selectType), msgData);
      pro.projectNikkes = selectNikke;
      handleSuccess(pro);
      // 清空其他状态
      setIsSelect([]);
      setSelectNikke([]);
      // selectTab(pro.type.valueOf());
      setProName('默认对话');
      setProType(ProjectType.Nikke);
      setProDesc('这是一个简单的小故事');
      setAuthor('');
      createProject.close();
    } else {
      toast.error('对话名称和作者以及对话妮姬不能小于1不能为空！');
    }
  };

  const cancel = () => {
    setIsSelect([]);
    setSelectNikke([]);
    createProject.close();
    setProName('默认对话');
    setProType(ProjectType.Nikke);
    setProDesc('这是一个简单的小故事');
    setAuthor('');
  };

  return (
    <NikkeWindow
      title="Nikke blabla"
      confirm={true}
      buttonSuccess="创建"
      buttonCancel="取消"
      success={success}
      cancel={cancel}
      show={createProject.isOpen}
    >
      <div className={styles.project}>
        <div className={styles.label}>
          <div className={styles.pcontent}>
            <span>对话名称 *</span>
            <input
              className="nikkeInput"
              value={proName}
              onChange={(e) => setProName(e.target.value)}
              type="text"
              placeholder="请输入对话名称"
            />
          </div>
          <div className={styles.pcontent}>
            <span>对话类型</span>
            <NikkeRadio label="任务" checked={true} style={{ flex: 1 }}>
              <div
                style={{
                  margin: '0',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <input id="task" type="radio" value="0" name="projectType" onChange={handleTypeChange} />
                  <label htmlFor="task">任务</label>
                </div>
                <div>
                  <input
                    id="nikke"
                    type="radio"
                    value="1"
                    name="projectType"
                    onChange={handleTypeChange}
                    defaultChecked
                  />
                  <label htmlFor="nikke">妮姬</label>
                </div>
                <div>
                  <input id="group" type="radio" value="2" name="projectType" onChange={handleTypeChange} />
                  <label htmlFor="group">群组</label>
                </div>
              </div>
              <NikkeInfo>(目前只实现妮姬类型)</NikkeInfo>
            </NikkeRadio>
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
                {enterprises.map((value, index) => (
                  <div
                    className={`${styles.enterpriseBox} ${
                      selectedEnterprise === index ? styles.selectedEnterprise : ''
                    }`}
                    key={index}
                    onClick={() => selectEnterprise(index)}
                  >
                    {value}
                  </div>
                ))}
              </div>
              <div className={styles.nikkeGrid}>
                {filteredNikkes.length > 0 ? (
                  filteredNikkes.map((value, index) => (
                    <div
                      className={`${styles.nikke} ${isSelect[index] ? styles.nikkeCheck : ''}`}
                      onClick={() => {
                        select(value, index);
                      }}
                      key={index}
                    >
                      <Image src={`/avatars/${value.img}.png`} alt="grid" width={60} height={60} />
                    </div>
                  ))
                ) : (
                  <span className={styles.noNikkeData}>NO DATA</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </NikkeWindow>
  );
};

export default NikkeWindowContent;
