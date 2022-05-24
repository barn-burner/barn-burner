import React from 'react';
import classNames from 'classnames';
import Grid from '@mui/material/Grid';

import './Results.scss';

interface ResultsProps {
  className?: string,
  team1: number,
  team2: number,
}

const Results: React.FC<ResultsProps> = ({ className, team1, team2, ...props }) => {

  const classes = classNames(
    'Results',
    className
  );


  return (
    <Grid container spacing={2} className={classes} {...props}>
      <Grid item xs={12}>
        Results
      </Grid>
      <Grid item xs={6}>
        {team1} logo
        {team1} name
      </Grid>
      <Grid item xs={6}>
        {team2} logo
        {team2} name
      </Grid>
    </Grid>
  );
};

export default Results;
