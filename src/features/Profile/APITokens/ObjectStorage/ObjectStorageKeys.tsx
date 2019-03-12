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
  CreateS3KeyRequest,
  createS3Keys,
  getS3Keys
} from 'src/services/profile/s3keys';
import { getAPIErrorOrDefault, getErrorMap } from 'src/utilities/errorUtils';
import ObjectStorageDrawer from './ObjectStorageDrawer';
import ObjectStorageKeyTable from './ObjectStorageKeyTable';
import S3KeyDisplayDialog from './S3KeyDisplayDialog';

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
type Props = PaginationProps<Linode.S3Key> & WithStyles<ClassNames>;

export type FormikProps = FormikBag<Props, CreateS3KeyRequest>;

export const ObjectStorageKeys: React.StatelessComponent<Props> = props => {
  const { classes, ...paginationProps } = props;

  const [keys, setKeys] = React.useState<KeysState>({});

  const s3KeyDisplayDialog = useOpenClose();
  const createDrawer = useOpenClose();

  React.useEffect(() => {
    paginationProps.request();
  }, []);

  const handleSubmit = (
    values: CreateS3KeyRequest,
    { setSubmitting, setErrors, setStatus }: FormikProps
  ) => {
    setSubmitting(true);

    createS3Keys(values)
      .then(data => {
        setSubmitting(false);

        const accessKey = data.access_key;
        const secretKey = data.secret_key;
        setKeys({ accessKey, secretKey });

        paginationProps.request();

        createDrawer.close();
        s3KeyDisplayDialog.open();
      })
      .catch(errorResponse => {
        setSubmitting(false);

        const errors = getAPIErrorOrDefault(
          errorResponse,
          'There was an issue creating Object Storage Keys.'
        );
        const mappedErrors = getErrorMap(['label'], errors);

        if (mappedErrors.none) {
          setStatus(mappedErrors.none);
        }

        setErrors(mappedErrors);
      });
  };

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

      <S3KeyDisplayDialog
        accessKey={keys.accessKey}
        secretKey={keys.secretKey}
        isOpen={s3KeyDisplayDialog.isOpen}
        close={s3KeyDisplayDialog.close}
      />
    </React.Fragment>
  );
};

const styled = withStyles(styles);

const updatedRequest = (_: Props, params: any, filters: any) =>
  getS3Keys(params, filters);

const paginated = Pagey(updatedRequest);

const enhanced = compose(
  styled,
  paginated
);

export default enhanced(ObjectStorageKeys);
