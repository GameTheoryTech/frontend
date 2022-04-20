import React from 'react';

interface LabelProps {
  text?: string;
  variant?: 'primary' | 'secondary' | 'normal';
  color?: string;
}

const Label: React.FC<LabelProps> = ({ text, variant = 'secondary', color: customColor }) => {

  let labelColor: string;
  if (customColor) {
    labelColor = customColor;
  } else {
    labelColor = 'var(--white)'; //color.grey[300];
  }
  return <div color={labelColor}>{text}</div>;
};

export default Label;
