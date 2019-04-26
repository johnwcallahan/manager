import * as React from 'react';
import { connect, MapDispatchToProps, MapStateToProps } from 'react-redux';
import { compose } from 'recompose';
import Drawer from 'src/components/core/Drawer';
import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from 'src/components/core/styles';
import { ApplicationState } from 'src/store';
import { closeCLIDrawer } from 'src/store/cli/cli.actions';
import CLITerminal from './CLITerminal';

type ClassNames = 'root' | 'backdrop';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {
    height: 600
  },
  backdrop: {
    backgroundColor: theme.color.drawerBackdrop
  }
});

type CombinedProps = StateProps & DispatchProps & WithStyles<ClassNames>;

const CLIDrawer: React.FunctionComponent<CombinedProps> = props => {
  const { classes, isOpen, closeDrawer } = props;
  return (
    <Drawer
      open={isOpen}
      onClose={closeDrawer}
      anchor="bottom"
      ModalProps={{
        BackdropProps: { className: classes.backdrop }
      }}
    >
      <div className={classes.root}>
        <CLITerminal />
      </div>
    </Drawer>
  );
};

interface StateProps {
  isOpen: boolean;
}

const mapStateToProps: MapStateToProps<StateProps, {}, ApplicationState> = (
  state: ApplicationState
) => ({
  isOpen: state.cliDrawer.isOpen
});

interface DispatchProps {
  closeDrawer: () => void;
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
  closeDrawer: () => dispatch(closeCLIDrawer())
});

const connected = connect(
  mapStateToProps,
  mapDispatchToProps
);

const styled = withStyles(styles);

const enhanced = compose<CombinedProps, {}>(
  connected,
  styled
);

export default enhanced(CLIDrawer);
