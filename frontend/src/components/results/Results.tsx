import React from 'react';
import classNames from 'classnames';
import Grid from '@mui/material/Grid';
import { useQuery } from '../../utils';

import './Results.scss';

interface ResultsProps {
  className?: string,
}

const Results: React.FC<ResultsProps> = ({ className, ...props }) => {

  const classes = classNames(
    'Results',
    className
  );

  const team1 = useQuery('team1');
  const team2 = useQuery('team2');

  console.log(team1, team2);

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
