export const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }
};

export const scalePop = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.35, type: 'spring', stiffness: 260, damping: 22 }
};

export const slideInLeft = (distance = 24) => ({
  initial: { opacity: 0, x: -distance },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }
});

export const containerStagger = (stagger = 0.08) => ({
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: stagger, when: 'beforeChildren' } }
});

export const listItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.36, ease: [0.2, 0.8, 0.2, 1] } }
};