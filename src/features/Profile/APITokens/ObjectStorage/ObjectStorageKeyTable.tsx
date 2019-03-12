import * as React from 'react';
import { compose } from 'recompose';
import Paper from 'src/components/core/Paper';
import {
  StyleRulesCallback,
  WithStyles,
  withStyles
} from 'src/components/core/styles';
import TableBody from 'src/components/core/TableBody';
import TableHead from 'src/components/core/TableHead';
import Typography from 'src/components/core/Typography';
import { PaginationProps } from 'src/components/Pagey';
import Table from 'src/components/Table';
import TableCell from 'src/components/TableCell';
import TableRow from 'src/components/TableRow';
import TableRowEmptyState from 'src/components/TableRowEmptyState';
import TableRowError from 'src/components/TableRowError';
import TableRowLoading from 'src/components/TableRowLoading';

type ClassNames = 'headline' | 'paper' | 'labelCell';

const styles: StyleRulesCallback<ClassNames> = theme => {
  return {
    headline: {
      marginTop: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 2
    },
    paper: {
      marginBottom: theme.spacing.unit * 2
    },
    labelCell: {
      width: '40%'
    }
  };
};

type Props = WithStyles<ClassNames> & PaginationProps<Linode.S3Key>;

export const ObjectStorageKeyTable: React.StatelessComponent<Props> = props => {
  const { classes, data, loading, error } = props;

  const renderContent = () => {
    if (loading) {
      return <TableRowLoading colSpan={6} />;
    }

    if (error) {
      return (
        <TableRowError
          colSpan={6}
          message="We were unable to load your Object Storage Keys."
        />
      );
    }

    return data && data.length > 0 ? (
      renderRows(data)
    ) : (
      <TableRowEmptyState colSpan={6} />
    );
  };

  const renderRows = (s3keys: Linode.S3Key[]) => {
    return s3keys.map((s3key: Linode.S3Key) => (
      <TableRow key={s3key.id} data-qa-table-row={s3key.label}>
        <TableCell parentColumn="Label">
          <Typography role="header" variant="h3" data-qa-key-label>
            {s3key.label}
          </Typography>
        </TableCell>
        <TableCell parentColumn="Access Key">
          <Typography variant="body1" data-qa-key-created>
            {s3key.access_key}
          </Typography>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <React.Fragment>
      <Paper className={classes.paper}>
        <Table aria-label="List of Object Storage Keys">
          <TableHead>
            <TableRow data-qa-table-head>
              <TableCell className={classes.labelCell}>Label</TableCell>
              <TableCell className={classes.labelCell}>Access Key</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderContent()}</TableBody>
        </Table>
      </Paper>
    </React.Fragment>
  );
};

const styled = withStyles(styles);

const enhanced = compose<Props, PaginationProps<Linode.S3Key>>(styled);

export default enhanced(ObjectStorageKeyTable);
