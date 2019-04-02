import { useState } from 'react';
const toggleAbout = () => {
  const [isOpen, setOpen] = useState(false);
  const toggle = () => {
    setOpen(!isOpen);
  };
  return { isOpen, toggle };
};

export default toggleAbout;
