import * as AsciiTable from 'ascii-table';

export const createAvailableActionsTable = (
  availableActions: [string, string][]
) => {
  const table = new AsciiTable();

  table.setHeading('action', 'summary');

  availableActions.forEach(([eachAction, eachSummary]) => {
    table.addRow(eachAction, eachSummary);
  });

  return table;
};

export const createResultsTable = (headers: string[], rows: any[][]) => {
  const table = new AsciiTable();
  table.setHeading(...headers);
  rows.forEach(eachRow => {
    table.addRow(...eachRow);
  });
  return table;
};

export const generalCLIErrorString = 'An error occurred.';
