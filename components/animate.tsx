'use client';

import { motion } from 'framer-motion';

export default function Animate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 0, opacity: 0 }}
      transition={{ ease: 'easeOut', duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
