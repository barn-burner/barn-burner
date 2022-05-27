import React, { ReactNode } from 'react';
import classNames from 'classnames';
import "external-svg-loader";

interface OutlineSVGProps {
  className?: string,
  src: string
  width?: number,
}

const OutlineSVG: React.FC<OutlineSVGProps> = ({ className, src, width}) => {

  const classes = classNames(
    'OutlineSVG',
    className
  );

  const strokeWidth = width ? width : 2;


  return (
    <svg data-src={src} style={{ stroke: "white", strokeWidth}} className={classes}/>
  );
};

export default OutlineSVG;
