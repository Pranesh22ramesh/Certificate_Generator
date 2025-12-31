import React from 'react';
import { motion } from 'framer-motion';
import useMotionVariants from './animations/useMotionVariants';

const AnimatedList = ({ items = [], renderItem, className = '', stagger = 0.08 }) => {
  const { container, item } = useMotionVariants({ stagger });

  return (
    <motion.ul className={className} variants={container} initial="hidden" animate="show">
      {items.map((it, idx) => (
        <motion.li key={it._id || idx} variants={item} initial="hidden" animate="show" transition={{ delay: idx * stagger }}>
          {renderItem(it, idx)}
        </motion.li>
      ))}
    </motion.ul>
  );
};

export default AnimatedList;