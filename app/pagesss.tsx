'use client';
import BtnBox from '@/components/BtnBox';
import React from 'react';
import styles from './page.module.css';

const page = () => {
  console.log(333);

  return (
    <div className={styles.box}>
      <BtnBox />
    </div>
  );
};

export default page;
