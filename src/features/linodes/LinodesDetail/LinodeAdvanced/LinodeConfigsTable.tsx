import * as React from 'react';
import TableBody from 'src/components/core/TableBody';
import TableCell from 'src/components/core/TableCell';
import TableHead from 'src/components/core/TableHead';
import TableRow from 'src/components/core/TableRow';
import Paginate from 'src/components/Paginate';
import PaginationFooter from 'src/components/PaginationFooter';
import Table from 'src/components/Table';

export interface Props {
  configs: Linode.Config[];
  ref: React.RefObject<any>;
  renderActionMenu?: (config: Linode.Config) => React.ReactElement<{}>;
}

export const LinodeConfigsTable: React.FC<Props> = props => {
  const { configs, ref: customRef, renderActionMenu } = props;

  const renderConfigTableBody = (data: Linode.Config[]) =>
    configs.map(config => (
      <TableRow key={config.id} data-qa-config={config.label}>
        <TableCell>{config.label}</TableCell>
        {renderActionMenu && <TableCell>{renderActionMenu(config)}</TableCell>}
      </TableRow>
    ));

  return (
    <Paginate data={configs} scrollToRef={customRef}>
      {({
        data: paginatedData,
        handlePageChange,
        handlePageSizeChange,
        page,
        pageSize,
        count
      }) => {
        return (
          <React.Fragment>
            <Table
              isResponsive={false}
              aria-label="List of Configurations"
              border
            >
              <TableHead>
                <TableRow>
                  <TableCell>Label</TableCell>
                  {renderActionMenu && <TableCell />}
                </TableRow>
              </TableHead>
              <TableBody>{renderConfigTableBody(paginatedData)}</TableBody>
            </Table>
            <PaginationFooter
              count={count}
              page={page}
              pageSize={pageSize}
              handlePageChange={handlePageChange}
              handleSizeChange={handlePageSizeChange}
              eventCategory="linode configs"
            />
          </React.Fragment>
        );
      }}
    </Paginate>
  );
};
