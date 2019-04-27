import {
  createLinode as _createLinode,
  deleteLinode as _deleteLinode,
  getLinode,
  getLinodes,
  linodeBoot,
  linodeReboot,
  linodeShutdown
} from 'src/services/linodes';
import {
  createAvailableActionsTable,
  createResultsTable,
  generalCLIErrorString
} from './utils';

type LinodeAction =
  | 'create'
  | 'list'
  | 'view'
  | 'boot'
  | 'reboot'
  | 'shutdown'
  | 'delete';

const linodesCommand = (args: any, print: any, runCommand: any) => {
  const action = args._[0];

  // If no action given (or it isn't valid), display the list of options
  if (!isActionValid(action)) {
    print('Available actions:');
    return print(availableActionsTable.toString());
  }

  if (action === 'list') {
    return listLinodes(print);
  }

  if (action === 'create') {
    return createLinode(args, print);
  }

  // All other actions require a linodeId, so if it hasn't been supplied, we print an error message.
  const linodeId = args._[1];
  if (!linodeId) {
    return print('error: too few arguments');
  }

  const actions = {
    view: viewLinode,
    boot: bootLinode,
    reboot: rebootLinode,
    shutdown: shutdownLinode,
    delete: deleteLinode
  };

  return actions[action]
    ? actions[action](linodeId, print)
    : print(availableActionsTable.toString());
};

const isActionValid = (action: any) => {
  const validActions: LinodeAction[] = [
    'create',
    'list',
    'view',
    'boot',
    'reboot',
    'shutdown',
    'delete'
  ];
  return action && validActions.indexOf(action) > -1;
};

const availableActions: [LinodeAction, string][] = [
  ['create', 'Create Linode'],
  ['list', 'List Linodes'],
  ['view', 'View Linode'],
  ['boot', 'Boot Linode'],
  ['reboot', 'Reboot Linode'],
  ['shutdown', 'Shut Down Linode'],
  ['delete', 'Delete Linode']
];
const availableActionsTable = createAvailableActionsTable(availableActions);

const createLinodeResultsTable = (linodes: Linode.Linode[]) => {
  const linodeTableHeaders = [
    'id',
    'label',
    'region',
    'type',
    'image',
    'status',
    'ipv4'
  ];
  const linodeTableRows = linodes.map(eachLinode => [
    eachLinode.id,
    eachLinode.label,
    eachLinode.region,
    eachLinode.type,
    eachLinode.image,
    eachLinode.status,
    eachLinode.ipv4[0]
  ]);
  return createResultsTable(linodeTableHeaders, linodeTableRows);
};

const listLinodes = (print: any) => {
  getLinodes()
    .then(({ data: linodes }) => {
      const table = createLinodeResultsTable(linodes);
      return print(table.toString());
    })
    .catch(() => print(generalCLIErrorString));
};

const viewLinode = (linodeId: number, print: any) => {
  getLinode(linodeId)
    .then(({ data: linode }) => {
      const table = createLinodeResultsTable([linode]);
      return print(table.toString());
    })
    .catch(() => print(generalCLIErrorString));
};

const bootLinode = (linodeId: number, print: any) => {
  linodeBoot(linodeId).catch(() => print(generalCLIErrorString));
};

const rebootLinode = (linodeId: number, print: any) => {
  linodeReboot(linodeId).catch(() => print(generalCLIErrorString));
};

const shutdownLinode = (linodeId: number, print: any) => {
  linodeShutdown(linodeId).catch(() => print(generalCLIErrorString));
};

const deleteLinode = (linodeId: number, print: any) => {
  _deleteLinode(linodeId).catch(() => print(generalCLIErrorString));
};

const createLinode = (args: any, print: any) => {
  const { region, type, rootPass, image, label } = args;

  // Validate options

  // We have check that it's typeof string, since it would be a boolean
  // if just the flag was passed in, e.g. "--region"
  if (typeof region !== 'string') {
    return print('region required');
  }
  if (typeof type !== 'string') {
    return print('type required');
  }
  if (typeof image === 'string' && typeof rootPass !== 'string') {
    return print('root_pass required');
  }

  _createLinode({ region, type, root_pass: rootPass, image, label }).catch(() =>
    print(generalCLIErrorString)
  );
};

export default {
  linodes: {
    method: linodesCommand,
    options: [
      {
        name: 'region',
        description:
          '(required) The [Region](#operation/getRegions) where the Linode will be located.'
      },
      {
        name: 'type',
        description:
          '(required) The [Linode Type](#operation/getLinodeTypes) of the Linode you are creating.'
      },
      {
        name: 'root_pass',
        description: '(required)'
      },
      {
        name: 'image',
        description: 'An Image ID to deploy the Disk from.'
      },
      {
        name: 'label',
        description: `The Linode's label is for display purposes only.`
      }
    ]
  }
};
