import { useEffect, useRef, useState, useCallback } from 'react';
import { addDataToDB, retrieveDataFromDB } from '@/data/db';
import { Project } from '@/script/project';

export enum NikkeDatabase {
  nikkeData = 1,
  nikkeTotalImages = 2,
}

const useInitializeData = (currentTabId: number, filterData: (tabId: number, projectData: any) => void) => {
  const [project, setProject] = useState<{ datas: Project[] }>({ datas: [] });
  const isInitialized = useRef(false);

  const initializeData = useCallback(async () => {
    try {
      const value = await retrieveDataFromDB(NikkeDatabase.nikkeData);
      if (value) {
        const parsedProject = JSON.parse(value.projects);
        setProject(parsedProject);
        filterData(currentTabId, parsedProject);
      }
      isInitialized.current = true;
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }, [currentTabId, filterData]);

  useEffect(() => {
    if (!isInitialized.current) {
      initializeData();
    }
  }, [initializeData]);

  return { project, setProject };
};

export default useInitializeData;

export const useInitializeImageData = (initialTotalImages: string[]) => {
  const [totalImages, setTotalImages] = useState<string[]>(initialTotalImages);
  const isInitialized = useRef(false);
  const addImages = (images: string[]) => {
    const newTotalImages = [...totalImages];
    let sum = 0;
    images.forEach((image) => {
      if (!newTotalImages.includes(image)) {
        newTotalImages.push(image);
        sum++;
        console.log('success');
      }
    });

    if (sum > 0) {
      const data = {
        sequenceId: 2,
        totalImages: JSON.stringify(newTotalImages),
      };
      addDataToDB(data);
      setTotalImages(newTotalImages);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        const value = await retrieveDataFromDB(NikkeDatabase.nikkeTotalImages);
        if (value) {
          const parsedImages = JSON.parse(value.totalImages);
          if (JSON.stringify(totalImages) !== JSON.stringify(parsedImages)) {
            setTotalImages(parsedImages);
          }
        } else {
          console.log('没有图片数据，数据写入中……');
          await addDataToDB({
            sequenceId: NikkeDatabase.nikkeTotalImages,
            totalImages: JSON.stringify(totalImages),
          });
        }
      } catch (error) {
        console.error('Error during initialization:', error);
      }
      isInitialized.current = true;
    };

    if (!isInitialized.current) {
      initializeData();
    }
  }, [totalImages]);

  return { totalImages, setTotalImages, addImages };
};
