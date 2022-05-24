import React from 'react';
import classNames from 'classnames';
import { Grid, Container } from '@mui/material';

import './GameList.scss';

interface GameListProps {
  className?: string,
}

const GameList: React.FC<GameListProps> = ({ className, ...props }) => {

  const classes = classNames(
    'GameList',
    className
  );


  return (
    <Grid container spacing={2} className={classes} {...props}>
      <Grid item xs={12}>
        Game List
      </Grid>
      <Grid item xs={5}>
        <Container>
          <span> Home icon </span>
          <span> Home Name </span>
          <span> Home score </span>
        </Container>
      </Grid>
      <Grid item xs={2}>
        <Container>
          <span> vs </span>
        </Container>
      </Grid>
      <Grid item xs={5}>
        <Container>
          <span> Home score </span>
          <span> Home Name </span>
          <span> Home icon </span>
        </Container>
      </Grid>
    </Grid>
  );
};

export default GameList;
