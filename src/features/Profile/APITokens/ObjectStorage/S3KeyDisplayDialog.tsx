import * as React from 'react';
import { compose } from 'recompose';
import ConfirmationDialog from 'src/components/ConfirmationDialog';
import Button from 'src/components/core/Button';
import {
  StyleRulesCallback,
  WithStyles,
  withStyles
} from 'src/components/core/styles';
import Typography from 'src/components/core/Typography';
import Notice from 'src/components/Notice';
import { PaginationProps } from 'src/components/Pagey';

type ClassNames = 'helperText' | 'confirmationDialog';

const styles: StyleRulesCallback<ClassNames> = theme => {
  return {
    helperText: {
      marginBottom: theme.spacing.unit * 3
    },
    confirmationDialog: {
      paddingBottom: 0,
      marginBottom: 0
    }
  };
};

interface S3KeyDisplayDialogProps {
  accessKey?: string;
  secretKey?: string;
  isOpen: boolean;
  close: () => void;
}

type CombinedProps = S3KeyDisplayDialogProps &
  PaginationProps<Linode.S3Key> &
  WithStyles<ClassNames>;

export const S3KeyDisplayDialog: React.StatelessComponent<
  CombinedProps
> = props => {
  const { classes, isOpen, close, accessKey, secretKey } = props;
  const confirmationDialogActions = (
    <Button type="secondary" onClick={close} data-qa-close-dialog>
      OK
    </Button>
  );

  return (
    <React.Fragment>
      <ConfirmationDialog
        title="Object Storage Keys"
        actions={confirmationDialogActions}
        open={isOpen}
        onClose={close}
        className={classes.confirmationDialog}
      >
        <Typography variant="body1" className={classes.helperText}>
          Your Object Storage keys have been created. Store these credentials.
          They won't be shown again.
        </Typography>

        <Typography>
          <b>Access Key:</b>
        </Typography>
        <Notice
          spacingTop={16}
          typeProps={{ variant: 'body1' }}
          warning
          text={accessKey}
          breakWords
        />

        <Typography>
          <b>Secret Key:</b>
        </Typography>
        <Notice
          spacingTop={16}
          typeProps={{ variant: 'body1' }}
          warning
          text={secretKey}
          breakWords
        />
      </ConfirmationDialog>
    </React.Fragment>
  );
};

const styled = withStyles(styles);

const enhanced = compose<CombinedProps, S3KeyDisplayDialogProps>(styled);

export default enhanced(S3KeyDisplayDialog);
