import * as React from 'react';
import BucketBreadcrumbIcon from 'src/assets/icons/bucketBreadcrumb.svg';

import { makeStyles, Theme } from 'src/components/core/styles';
import Typography from 'src/components/core/Typography';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex'
  },
  prefixWrapper: {
    display: 'flex'
  },
  slash: {
    marginRight: 4,
    marginLeft: 4
  },
  link: {
    color: theme.palette.primary.main,
    cursor: 'pointer'
  }
}));

interface Props {
  prefix: string;
}

type CombinedProps = Props;

const BucketBreadcrumb: React.FC<CombinedProps> = props => {
  const classes = useStyles();

  const { prefix } = props;

  const splitPrefix = prefix.split('/');
  // console.log(splitPrefix);

  return (
    <div className={classes.root}>
      <BucketBreadcrumbIcon />
      <div className={classes.prefixWrapper}>
        {splitPrefix.map(thisLevel => {
          if (!thisLevel) {
            return null;
          }

          return (
            <>
              <Typography variant="body1" className={classes.slash}>
                /
              </Typography>
              <Typography
                variant="body1"
                className={classes.link}
                onClick={() => {
                  // @todo: history.push splitPrefix.idx
                }}
              >
                {thisLevel}
              </Typography>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default BucketBreadcrumb;
