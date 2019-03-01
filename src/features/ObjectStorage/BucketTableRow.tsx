import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  StyleRulesCallback,
  WithStyles,
  withStyles
} from 'src/components/core/styles';
import Typography from 'src/components/core/Typography';
import DateTimeDisplay from 'src/components/DateTimeDisplay';
import EntityIcon from 'src/components/EntityIcon';
import Grid from 'src/components/Grid';
import {} from 'src/components/StatusIndicator';
import TableCell from 'src/components/TableCell';
import TableRow from 'src/components/TableRow';
import { formatRegion } from 'src/utilities/formatRegion';
// import ActionMenu from './DomainActionMenu';

type ClassNames = 'domain' | 'labelStatusWrapper' | 'tagWrapper' | 'domainRow';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  domain: {
    width: '60%'
  },
  domainRow: {
    backgroundColor: theme.bg.white
  },
  labelStatusWrapper: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center'
  },
  tagWrapper: {
    marginTop: theme.spacing.unit / 2,
    '& [class*="MuiChip"]': {
      cursor: 'pointer'
    }
  }
});

interface BucketRowProps extends Linode.Bucket {}

type CombinedProps = BucketRowProps & WithStyles<ClassNames>;

const DomainTableRow: React.StatelessComponent<CombinedProps> = props => {
  const { classes, label, region, size, objects, hostname, created } = props;

  return (
    <TableRow
      key={label}
      data-qa-domain-cell={label}
      className={`${classes.domainRow} ${'fade-in-table'}`}
      // rowLink={`/domains/${id}`}
    >
      <TableCell parentColumn="Name" data-qa-domain-label>
        <Link to={`/buckets/${label}`}>
          <Grid container wrap="nowrap" alignItems="center">
            <Grid item className="py0">
              <EntityIcon
                variant="volume"
                status={status}
                marginTop={1}
                loading={status === 'edit_mode'}
              />
            </Grid>
            <Grid item>
              <div className={classes.labelStatusWrapper}>
                <Typography role="header" variant="h3" data-qa-label>
                  {label}
                </Typography>
              </div>
            </Grid>
          </Grid>
          <Grid style={{ marginLeft: 56 }}>
            <Typography variant="body2" data-qa-label>
              {hostname}
            </Typography>
          </Grid>
        </Link>
      </TableCell>
      <TableCell parentColumn="Size" data-qa-domain-type>
        <Grid>
          <Typography variant="body1">
            <b>{Math.round(size / 1000)} KB</b>
          </Typography>
        </Grid>
        <Grid>
          <Typography variant="body2">{objects} items</Typography>
        </Grid>
      </TableCell>
      <TableCell parentColumn="Region" data-qa-domain-type>
        {formatRegion(region)}
      </TableCell>
      <TableCell parentColumn="created" data-qa-domain-type>
        <DateTimeDisplay value={created} humanizeCutoff="month" />
      </TableCell>
    </TableRow>
  );
};

const styled = withStyles(styles);

export default styled(DomainTableRow);
