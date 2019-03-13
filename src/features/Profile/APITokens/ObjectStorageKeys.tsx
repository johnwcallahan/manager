import { FormikBag } from 'formik';
import * as React from 'react';
import { compose } from 'recompose';
import AddNewLink from 'src/components/AddNewLink';
import {
  StyleRulesCallback,
  WithStyles,
  withStyles
} from 'src/components/core/styles';
import Typography from 'src/components/core/Typography';
import Grid from 'src/components/Grid';
import Pagey, { PaginationProps } from 'src/components/Pagey';
import PaginationFooter from 'src/components/PaginationFooter';
import { useOpenClose } from 'src/hooks/useOpenClose';
import {
  CreateObjectStorageKeyRequest,
  createObjectStorageKeys,
  getObjectStorageKeys
} from 'src/services/profile/objectStorageKeys';
import { getAPIErrorOrDefault, getErrorMap } from 'src/utilities/errorUtils';
import ObjectStorageDrawer from './ObjectStorageDrawer';
import ObjectStorageKeyDisplayDialog from './ObjectStorageKeyDisplayDialog';
import ObjectStorageKeyTable from './ObjectStorageKeyTable';

type ClassNames = 'headline';

const styles: StyleRulesCallback<ClassNames> = theme => {
  return {
    headline: {
      marginTop: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 2
    }
  };
};

interface KeysState {
  accessKey?: string;
  secretKey?: string;
}
type Props = PaginationProps<Linode.ObjectStorageKey> & WithStyles<ClassNames>;

export type FormikProps = FormikBag<Props, CreateObjectStorageKeyRequest>;

export const ObjectStorageKeys: React.StatelessComponent<Props> = props => {
  const { classes, ...paginationProps } = props;

  const [keys, setKeys] = React.useState<KeysState>({});

  const objectStorageKeyDisplayDialog = useOpenClose();
  const createDrawer = useOpenClose();

  const handleSubmit = (
    values: CreateObjectStorageKeyRequest,
    { setSubmitting, setErrors, setStatus }: FormikProps
  ) => {
    setSubmitting(true);

    createObjectStorageKeys(values)
      .then(data => {
        setSubmitting(false);

        const accessKey = data.access_key;
        const secretKey = data.secret_key;
        setKeys({ accessKey, secretKey });

        paginationProps.request();

        createDrawer.close();
        objectStorageKeyDisplayDialog.open();
      })
      .catch(err => {
        setSubmitting(false);

        const errors = getAPIErrorOrDefault(
          err,
          'Error generating Object Storage Key.'
        );
        const mappedErrors = getErrorMap(['label'], errors);

        // If there's a general error, set it as the form status
        if (mappedErrors.none) {
          setStatus(mappedErrors.none);
        }

        setErrors(mappedErrors);
      });
  };

  React.useEffect(() => {
    paginationProps.request();
  }, []);

  return (
    <React.Fragment>
      <Grid container justify="space-between" alignItems="flex-end">
        <Grid item>
          <Typography
            role="header"
            variant="h2"
            className={classes.headline}
            data-qa-table="Object Storage Keys"
          >
            Object Storage Keys
          </Typography>
        </Grid>
        <Grid item>
          <AddNewLink
            onClick={createDrawer.open}
            label="Create an Object Storage Key"
          />
        </Grid>
      </Grid>

      <ObjectStorageKeyTable {...paginationProps} />

      <PaginationFooter
        page={props.page}
        pageSize={props.pageSize}
        count={props.count}
        handlePageChange={props.handlePageChange}
        handleSizeChange={props.handlePageSizeChange}
        eventCategory="object storage keys table"
      />

      <ObjectStorageDrawer
        open={createDrawer.isOpen}
        onClose={createDrawer.close}
        onSubmit={handleSubmit}
      />

      <ObjectStorageKeyDisplayDialog
        accessKey={keys.accessKey}
        secretKey={keys.secretKey}
        isOpen={objectStorageKeyDisplayDialog.isOpen}
        close={objectStorageKeyDisplayDialog.close}
      />
    </React.Fragment>
  );
};

const styled = withStyles(styles);

const updatedRequest = (_: Props, params: any, filters: any) =>
  getObjectStorageKeys(params, filters);

const paginated = Pagey(updatedRequest);

const enhanced = compose(
  styled,
  paginated
);

export default enhanced(ObjectStorageKeys);
