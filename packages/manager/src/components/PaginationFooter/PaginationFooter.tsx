import * as classNames from 'classnames';
import * as React from 'react';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from 'src/components/core/styles';
import Select, { Item } from 'src/components/EnhancedSelect/Select';
import Grid from 'src/components/Grid';
import PaginationControls from '../PaginationControls';

type ClassNames = 'root' | 'padded';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(1)
    },
    padded: {
      padding: `0 ${theme.spacing(2)}px ${theme.spacing(1)}px`
    }
  });

export interface PaginationProps {
  count: number;
  page: number;
  pageSize: number;
  eventCategory: string;
  showAll?: boolean;
}

interface Props extends PaginationProps {
  handlePageChange: (page: number) => void;
  handleSizeChange: (pageSize: number) => void;
  padded?: boolean;
}

type CombinedProps = Props & WithStyles<ClassNames>;

const baseOptions = [
  { label: 'Show 25', value: 25 },
  { label: 'Show 50', value: 50 },
  { label: 'Show 75', value: 75 },
  { label: 'Show 100', value: 100 }
];

class PaginationFooter extends React.PureComponent<CombinedProps> {
  handleSizeChange = (e: Item) => this.props.handleSizeChange(+e.value);

  render() {
    const {
      classes,
      count,
      page,
      pageSize,
      handlePageChange,
      padded,
      eventCategory,
      showAll
    } = this.props;

    if (count <= 25) {
      return null;
    }

    const finalOptions = [...baseOptions];
    // Add "Show All" to the list of options if the consumer has so specified.
    if (showAll) {
      finalOptions.push({ label: 'Show All', value: Infinity });
    }

    // If the user has selected "Show All", the page size should be set to the
    // total number of elements.
    const finalPageSize = pageSize === Infinity ? count : pageSize;

    // If the user has selected "Show All", the selected page should be `1`
    // since there is only one page.
    const finalPage = pageSize === Infinity ? 1 : page;

    const defaultPagination = finalOptions.find(eachOption => {
      return eachOption.value === pageSize;
    });

    const isShowingAll = defaultPagination
      ? defaultPagination.label === 'Show All'
      : false;

    return (
      <Grid
        container
        justify="space-between"
        alignItems="center"
        className={classNames({
          [classes.root]: true,
          [classes.padded]: padded
        })}
      >
        <Grid item>
          {!isShowingAll && (
            <PaginationControls
              onClickHandler={handlePageChange}
              page={finalPage}
              count={count}
              pageSize={finalPageSize}
              eventCategory={eventCategory}
            />
          )}
        </Grid>
        <Grid item>
          <Select
            options={finalOptions}
            defaultValue={defaultPagination}
            onChange={this.handleSizeChange}
            isClearable={false}
            noMarginTop
            menuPlacement="top"
            medium
          />
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(PaginationFooter);
