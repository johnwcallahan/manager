import * as React from 'react';
import * as braintree from 'braintree-web';

import { makeStyles, Theme } from 'src/components/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}));

interface Props {
  isScriptLoaded: boolean;
}

type CombinedProps = Props;

const GooglePay: React.FC<CombinedProps> = (props) => {
  const classes = useStyles();

  const buttonRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    async function googlePay() {
      if (
        !props.isScriptLoaded ||
        !buttonRef.current ||
        !window.hasOwnProperty('google')
      ) {
        return;
      }

      const button = buttonRef.current;
      const paymentsClient = new (window as any).google.payments.api.PaymentsClient(
        {
          environment: 'TEST', // Or 'PRODUCTION'
        }
      );

      const braintreeClient = await braintree.client.create({
        authorization: getBraintreeClientToken(),
      });

      const buttonHandler = await initGooglePay(
        braintreeClient,
        paymentsClient,
        {
          transactionInfo: {
            currencyCode: 'USD',
            totalPriceStatus: 'NOT_CURRENTLY_KNOWN',
          },
        }
      );
      // eslint-disable-next-line scanjs-rules/call_addEventListener
      button.addEventListener('click', buttonHandler);
    }
    googlePay();
  }, [props.isScriptLoaded]);

  return <button ref={buttonRef}>Google Pay</button>;
};

export default GooglePay;

const getBraintreeClientToken = () => {
  return process.env.REACT_APP_BT_TOKEN || '';
};

export const getBraintreeClient = () => {
  return braintree.client.create({
    authorization: getBraintreeClientToken(),
  });
};

export const initGooglePay = async (
  braintreeClient: braintree.Client,
  googlePayClient: any,
  transactionInfo: any
) => {
  const googlePayInstance = await braintree.googlePayment.create({
    client: braintreeClient,
    googlePayVersion: 2,
    // googleMerchantId: 'merchant-id-from-google' // Optional in sandbox; if set in sandbox, this value must be a valid production Google Merchant ID
  });

  const paymentDataRequest = await googlePayInstance.createPaymentDataRequest(
    transactionInfo
  );

  const isReadyToPay = await googlePayClient.isReadyToPay({
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: paymentDataRequest.allowedPaymentMethods,
  });

  if (!isReadyToPay) {
    return () => null;
  }

  return async () => {
    const paymentData = await googlePayClient.loadPaymentData(
      paymentDataRequest
    );

    try {
      const parsed = await googlePayInstance.parseResponse(paymentData);
      console.log(parsed);
      return parsed;
    } catch (err) {
      return () => null;
    }
  };
};
