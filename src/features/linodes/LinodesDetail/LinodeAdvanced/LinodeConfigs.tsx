import { withSnackbar, WithSnackbarProps } from 'notistack';
import * as React from 'react';
import { compose } from 'recompose';
import ActionsPanel from 'src/components/ActionsPanel';
import AddNewLink from 'src/components/AddNewLink';
import Button from 'src/components/Button';
import ConfirmationDialog from 'src/components/ConfirmationDialog';
import RootRef from 'src/components/core/RootRef';
import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from 'src/components/core/styles';
import Typography from 'src/components/core/Typography';
import Grid from 'src/components/Grid';
import PanelErrorBoundary from 'src/components/PanelErrorBoundary';
import { resetEventsPolling } from 'src/events';
import {
  DeleteLinodeConfig,
  withLinodeDetailContext
} from 'src/features/linodes/LinodesDetail/linodeDetailContext';
import { linodeReboot } from 'src/services/linodes';
import { getAPIErrorOrDefault } from 'src/utilities/errorUtils';
import LinodeConfigActionMenu from '../LinodeSettings/LinodeConfigActionMenu';
import LinodeConfigDrawer from '../LinodeSettings/LinodeConfigDrawer';
import { LinodeConfigsTable } from './LinodeConfigsTable';

type ClassNames = 'root' | 'headline' | 'addNewWrapper';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {},
  headline: {
    marginBottom: theme.spacing.unit * 2,
    [theme.breakpoints.down('xs')]: {
      marginBottom: 0,
      marginTop: theme.spacing.unit * 2
    }
  },
  addNewWrapper: {
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      marginLeft: -(theme.spacing.unit + theme.spacing.unit / 2),
      marginTop: -theme.spacing.unit
    }
  }
});

type CombinedProps = LinodeContext & WithStyles<ClassNames> & WithSnackbarProps;

interface State {
  configDrawer: ConfigDrawerState;
  confirmDelete: ConfirmDeleteState;
  submitting: boolean;
  success?: string;
}

interface ConfigDrawerState {
  open: boolean;
  linodeConfigId?: number;
}

interface ConfirmDeleteState {
  open: boolean;
  submitting: boolean;
  id?: number;
  label?: string;
}

class LinodeConfigs extends React.Component<CombinedProps, State> {
  defaultConfigDrawerState: ConfigDrawerState = {
    open: false
  };

  state: State = {
    submitting: false,
    confirmDelete: {
      open: false,
      submitting: false
    },
    configDrawer: this.defaultConfigDrawerState
  };

  configsPanel = React.createRef();

  render() {
    const { classes, configs, readOnly, linodeId } = this.props;

    return (
      <React.Fragment>
        <Grid container justify="space-between" alignItems="flex-end">
          <RootRef rootRef={this.configsPanel}>
            <Grid item>
              <Typography variant="h3" className={classes.headline}>
                Configuration
              </Typography>
            </Grid>
          </RootRef>
          <Grid item className={classes.addNewWrapper}>
            <AddNewLink
              onClick={this.openConfigDrawerForCreation}
              label="Add a Configuration"
              disabled={readOnly}
            />
          </Grid>
        </Grid>
        <LinodeConfigsTable
          configs={configs}
          ref={this.configsPanel}
          renderActionMenu={(config: Linode.Config): React.ReactElement<{}> => (
            <LinodeConfigActionMenu
              config={config}
              linodeId={linodeId}
              onBoot={this.handleBoot}
              onEdit={this.openForEditing}
              onDelete={this.confirmDelete}
              readOnly={readOnly}
            />
          )}
        />
        <LinodeConfigDrawer
          linodeConfigId={this.state.configDrawer.linodeConfigId}
          linodeHypervisor={this.props.linodeHypervisor}
          linodeRegion={this.props.linodeRegion}
          maxMemory={this.props.linodeMemory}
          onClose={this.resetConfigDrawer}
          open={this.state.configDrawer.open}
        />
        <ConfirmationDialog
          title="Confirm Delete"
          open={this.state.confirmDelete.open}
          onClose={this.resetConfirmConfigDelete}
          actions={this.deleteConfigConfirmationActions}
        >
          <Typography>
            Are you sure you want to delete "{this.state.confirmDelete.label}"
          </Typography>
        </ConfirmationDialog>
      </React.Fragment>
    );
  }

  resetConfigDrawer = () => this.setConfigDrawer({ open: false });

  deleteConfigConfirmationActions = ({ onClose }: { onClose: () => void }) => (
    <ActionsPanel style={{ padding: 0 }}>
      <Button onClick={onClose} type="cancel" data-qa-cancel-delete>
        Cancel
      </Button>
      <Button
        type="secondary"
        destructive
        onClick={this.deleteConfig}
        data-qa-confirm-delete
      >
        Delete
      </Button>
    </ActionsPanel>
  );

  resetConfirmConfigDelete = () =>
    this.setConfirmDelete({ open: false, id: undefined });

  setConfigDrawer = (obj: Partial<ConfigDrawerState>, fn?: () => void) =>
    this.setState(
      {
        configDrawer: {
          ...this.state.configDrawer,
          ...obj
        }
      },
      () => {
        if (fn) {
          fn();
        }
      }
    );

  setConfirmDelete = (obj: Partial<ConfirmDeleteState>, fn?: () => void) =>
    this.setState(
      {
        confirmDelete: {
          ...this.state.confirmDelete,
          ...obj
        }
      },
      () => {
        if (fn) {
          fn();
        }
      }
    );

  openConfigDrawerForCreation = () => {
    this.setConfigDrawer({
      open: true,
      linodeConfigId: undefined
    });
  };

  openForEditing = (config: Linode.Config) => {
    this.setConfigDrawer({
      open: true,
      linodeConfigId: config.id
    });
  };

  confirmDelete = (id: number, label: string) => {
    this.setConfirmDelete({ open: true, id, label });
  };

  handleBoot = (linodeId: number, configId: number, label: string) => {
    linodeReboot(linodeId, configId)
      .then(() => {
        resetEventsPolling();
      })
      .catch(errorResponse => {
        const errors = getAPIErrorOrDefault(
          errorResponse,
          `Error booting ${label}`
        );
        errors.map((error: Linode.ApiFieldError) => {
          this.props.enqueueSnackbar(error.reason, {
            variant: 'error'
          });
        });
      });
  };

  deleteConfig = () => {
    this.setConfirmDelete({ submitting: true });
    const { deleteLinodeConfig } = this.props;
    const {
      confirmDelete: { id: configId }
    } = this.state;
    if (!configId) {
      return;
    }

    deleteLinodeConfig(configId)
      .then(() => {
        this.setConfirmDelete(
          {
            submitting: false
          },
          () => {
            this.setConfirmDelete({
              submitting: false,
              open: false,
              id: undefined
            });
          }
        );
      })
      .catch(error => {
        this.setConfirmDelete({
          submitting: false,
          open: false,
          id: undefined
        });
        /** @todo move this inside the actual delete modal */
        this.props.enqueueSnackbar(`Unable to delete configuration.`, {
          variant: 'error'
        });
      });
  };
}

const styled = withStyles(styles);

const errorBoundary = PanelErrorBoundary({
  heading: 'Advanced Configurations'
});

interface LinodeContext {
  linodeHypervisor: 'kvm' | 'xen';
  linodeId: number;
  linodeLabel: string;
  linodeMemory: number;
  linodeRegion: string;
  linodeStatus: string;
  linodeTotalDisk: number;
  deleteLinodeConfig: DeleteLinodeConfig;
  readOnly: boolean;
  configs: Linode.Config[];
  getLinodeConfigs: () => void;
}

const linodeContext = withLinodeDetailContext<LinodeContext>(
  ({ linode, deleteLinodeConfig, getLinodeConfigs }) => ({
    linodeHypervisor: linode.hypervisor,
    linodeId: linode.id,
    linodeLabel: linode.label,
    linodeMemory: linode.specs.memory,
    linodeRegion: linode.region,
    linodeStatus: linode.status,
    linodeTotalDisk: linode.specs.disk,
    readOnly: linode._permissions === 'read_only',
    deleteLinodeConfig,
    configs: linode._configs,
    getLinodeConfigs
  })
);

const enhanced = compose<CombinedProps, {}>(
  linodeContext,
  styled,
  errorBoundary,
  withSnackbar
);

export default enhanced(LinodeConfigs);
