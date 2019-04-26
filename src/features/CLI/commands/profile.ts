import { getProfile } from 'src/services/profile';
import { createAvailableActionsTable, createResultsTable } from './utils';

const availableActions: [string, string][] = [['view', 'View Profile']];
const availableActionsTable = createAvailableActionsTable(availableActions);

const profileCommand = (args: any, print: any, runCommand: any) => {
  const action = args._[0];
  if (!action) {
    print('Available actions:');
    print(availableActionsTable.toString());
    return;
  }

  if (action === 'view') {
    getProfile()
      .then(({ data: profile }) => {
        const profileTableHeaders = [
          'username',
          'email',
          'restricted',
          'two_factor_auth'
        ];
        const profileTableRows = [
          [
            profile.username,
            profile.email,
            profile.restricted,
            profile.two_factor_auth
          ]
        ];
        const table = createResultsTable(profileTableHeaders, profileTableRows);
        print(table.toString());
      })
      .catch(err => {
        print('An error occurred');
      });
  }
};

export default {
  profile: {
    method: profileCommand,
    options: [
      {
        name: 'action'
      }
    ]
  }
};
