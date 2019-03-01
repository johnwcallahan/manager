import * as React from 'react';
import { compose } from 'recompose';
import { buckets } from 'src/__data__/buckets';
import AddNewLink from 'src/components/AddNewLink';
import {
  StyleRulesCallback,
  WithStyles,
  withStyles
} from 'src/components/core/styles';
import Typography from 'src/components/core/Typography';
import { DocumentTitleSegment } from 'src/components/DocumentTitle';
import Grid from 'src/components/Grid';
import OrderBy from 'src/components/OrderBy';
import ListBuckets from './ListBuckets';

type ClassNames =
  | 'root'
  | 'titleWrapper'
  | 'title'
  | 'domain'
  | 'tagWrapper'
  | 'tagGroup';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {},
  titleWrapper: {
    flex: 1
  },
  title: {
    marginBottom: theme.spacing.unit + theme.spacing.unit / 2
  },
  domain: {
    width: '60%'
  },
  tagWrapper: {
    marginTop: theme.spacing.unit / 2,
    '& [class*="MuiChip"]': {
      cursor: 'pointer'
    }
  },
  tagGroup: {
    flexDirection: 'row-reverse',
    marginBottom: theme.spacing.unit
  }
});

export interface ObjectStorageLandingProps {}

type CombinedProps = ObjectStorageLandingProps & WithStyles<ClassNames>;

const ObjectStorage: React.StatelessComponent<CombinedProps> = props => {
  const { classes } = props;

  return (
    <React.Fragment>
      <DocumentTitleSegment segment="Domains" />
      <Grid
        container
        justify="space-between"
        alignItems="flex-end"
        style={{ paddingBottom: 0 }}
      >
        <Grid item className={classes.titleWrapper}>
          <Typography
            role="header"
            variant="h1"
            data-qa-title
            className={classes.title}
          >
            Buckets
          </Typography>
        </Grid>
        <Grid item>
          <Grid container alignItems="flex-end" style={{ width: 'auto' }}>
            <Grid item className="pt0">
              <AddNewLink
                onClick={() => 'create a bucket'}
                label="Create a Bucket"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {/* Duplication starts here. How can we refactor this? */}
        <OrderBy data={buckets} order={'asc'} orderBy={'domain'}>
          {({ data: orderedData, handleOrderChange, order, orderBy }) => {
            const props = {
              orderBy,
              order,
              handleOrderChange,
              data: orderedData
              // onClone: this.props.openForCloning,
              // onRemove: this.openRemoveDialog
            };

            return <ListBuckets {...props} />;
          }}
        </OrderBy>
      </Grid>
    </React.Fragment>
  );
};

const styled = withStyles(styles);

const enhanced = compose<CombinedProps, ObjectStorageLandingProps>(styled);

export default enhanced(ObjectStorage);
