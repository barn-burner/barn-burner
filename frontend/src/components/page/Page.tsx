import React from 'react';
import './Page.scss';

interface PageProps {
    title: string,
    children: React.ReactNode,
  }

const Page: React.FC<PageProps> = ({children, title}) => {

  return (
    <section className='page' >
        <h1>{title}</h1>
        {children}
    </section>
  );
};

export default Page;