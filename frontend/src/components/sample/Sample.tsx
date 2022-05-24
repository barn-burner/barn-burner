import React, { ReactNode } from 'react';
import classNames from 'classnames';

import './Sample.scss';

interface SampleProps {
  className?: string,
  children: ReactNode
}

const Sample: React.FC<SampleProps> = ({ className, children, ...props }) => {

  const classes = classNames(
    'sample',
    className
  );


  return (
    <span className={classes} {...props}> { children } </span>
  );
};

export default Sample;
