import * as React from 'react';
import { makePayment } from 'linode-js-sdk/lib/account';
import Button from 'src/components/Button';
import { Theme, makeStyles } from 'src/components/core/styles';
import Typography from 'src/components/core/Typography';
import Grid from 'src/components/Grid';
import TextField from 'src/components/TextField';
import { cleanCVV } from 'src/features/Billing/billingUtils';
import CreditCardDialog from './PaymentBits/CreditCardDialog';
import { getAPIErrorOrDefault } from 'src/utilities/errorUtils';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(4)
  },
  header: {
    fontSize: '1.1rem'
  },
  cvvField: {
    width: 180
  }
}));

export interface Props {
  lastFour: string;
  expiry: string;
  usd: string;
  setSuccess: (message: string | null, paymentWasMade?: boolean) => void;
}

export const CreditCard: React.FC<Props> = props => {
  const { expiry, lastFour, setSuccess, usd } = props;
  const [cvv, setCVV] = React.useState<string>('');
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const classes = useStyles();

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const _cvv = cleanCVV(e.target.value);
    setCVV(_cvv);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
    setErrorMessage(null);
  };

  const confirmCardPayment = () => {
    setSubmitting(true);
    setSuccess(null);
    setErrorMessage(null);

    makePayment({
      usd: (+usd).toFixed(2),
      cvv
    })
      .then(_ => {
        setSubmitting(false);
        setDialogOpen(false);
        setSuccess(`Payment for $${usd} submitted successfully`, true);
      })
      .catch(errorResponse => {
        setSubmitting(false);
        setErrorMessage(
          getAPIErrorOrDefault(
            errorResponse,
            'Unable to make a payment at this time.'
          )[0].reason
        );
      });
  };

  const hasCreditCardOnFile = Boolean(lastFour);

  return (
    <>
      <Grid container direction="column" className={classes.root}>
        <Grid item>
          <Typography variant="h3" className={classes.header}>
            <strong>Pay via credit card</strong>
          </Typography>
        </Grid>
        <Grid item>
          {hasCreditCardOnFile ? (
            // This will rarely/never happen, best to be safe.
            <Typography>XXXX XXXX XXXX {lastFour}</Typography>
          ) : (
            <Typography>No credit card on file.</Typography>
          )}
          {Boolean(expiry) && <Typography>Expires {expiry}</Typography>}
        </Grid>
        <Grid container alignItems="flex-end" justify="flex-start">
          <Grid item>
            <Button
              buttonType="primary"
              onClick={handleOpenDialog}
              disabled={!hasCreditCardOnFile}
            >
              Pay Now
            </Button>
          </Grid>
          <Grid item>
            <TextField
              label="CVV:"
              onChange={handleCVVChange}
              value={cvv}
              type="text"
              placeholder={'000'}
              inputProps={{ id: 'paymentCVV' }}
              className={classes.cvvField}
              hasAbsoluteError
              noMarginTop
            />
          </Grid>
        </Grid>
      </Grid>
      <CreditCardDialog
        error={errorMessage}
        isMakingPayment={submitting}
        cancel={handleClose}
        executePayment={confirmCardPayment}
        open={dialogOpen}
        usd={usd}
      />
    </>
  );
};

export default React.memo(CreditCard);