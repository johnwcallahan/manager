import { ObjectStorageBucket } from 'linode-js-sdk/lib/object-storage';
import * as React from 'react';
import { compose } from 'recompose';
import BucketIcon from 'src/assets/icons/entityIcons/bucket.svg';
import ActionsPanel from 'src/components/ActionsPanel';
import AddNewLink from 'src/components/AddNewLink';
import Button from 'src/components/Button';
import CircleProgress from 'src/components/CircleProgress';
import ConfirmationDialog from 'src/components/ConfirmationDialog';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from 'src/components/core/styles';
import Typography from 'src/components/core/Typography';
import { DocumentTitleSegment } from 'src/components/DocumentTitle';
import ErrorState from 'src/components/ErrorState';
import Grid from 'src/components/Grid';
import Notice from 'src/components/Notice';
import OrderBy from 'src/components/OrderBy';
import Placeholder from 'src/components/Placeholder';
import TextField from 'src/components/TextField';
import { objectStorageClusterDisplay } from 'src/constants';
import bucketContainer, { StateProps } from 'src/containers/bucket.container';
import bucketDrawerContainer, {
  DispatchProps
} from 'src/containers/bucketDrawer.container';
import bucketRequestsContainer, {
  BucketsRequests
} from 'src/containers/bucketRequests.container';
import useOpenClose from 'src/hooks/useOpenClose';
import { BucketError } from 'src/store/bucket/types';
import { getErrorStringOrDefault } from 'src/utilities/errorUtils';
import {
  sendDeleteBucketEvent,
  sendDeleteBucketFailedEvent
} from 'src/utilities/ga';
import CancelNotice from '../CancelNotice';
import BucketTable from './BucketTable';

type ClassNames = 'copy';

const styles = (theme: Theme) =>
  createStyles({
    copy: {
      marginTop: theme.spacing(1)
    }
  });

interface Props {
  isRestrictedUser: boolean;
}

type CombinedProps = Props &
  StateProps &
  DispatchProps &
  WithStyles<ClassNames> &
  BucketsRequests;

export const BucketLanding: React.FC<CombinedProps> = props => {
  const {
    classes,
    bucketsData,
    bucketsLoading,
    bucketErrors,
    isRestrictedUser,
    openBucketDrawer
  } = props;

  const removeBucketConfirmationDialog = useOpenClose();
  const [bucketToRemove, setBucketToRemove] = React.useState<
    ObjectStorageBucket | undefined
  >(undefined);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const [confirmBucketName, setConfirmBucketName] = React.useState<string>('');

  const handleClickRemove = (bucket: ObjectStorageBucket) => {
    setBucketToRemove(bucket);
    setError('');
    removeBucketConfirmationDialog.open();
  };

  const removeBucket = () => {
    const { deleteBucket } = props;

    // This shouldn't happen, but just in case (and to get TS to quit complaining...)
    if (!bucketToRemove) {
      return;
    }

    setError('');
    setIsLoading(true);

    const { cluster, label } = bucketToRemove;
    deleteBucket({ cluster, label })
      .then(() => {
        removeBucketConfirmationDialog.close();
        setIsLoading(false);

        // @analytics
        sendDeleteBucketEvent(cluster);
      })
      .catch(e => {
        // @analytics
        sendDeleteBucketFailedEvent(cluster);

        setIsLoading(false);
        const errorText = getErrorStringOrDefault(e, 'Error removing bucket.');
        setError(errorText);
      });
  };

  const actions = () => (
    <ActionsPanel>
      <Button
        buttonType="cancel"
        onClick={() => {
          removeBucketConfirmationDialog.close();
        }}
        data-qa-cancel
      >
        Cancel
      </Button>
      <Button
        buttonType="secondary"
        destructive
        onClick={removeBucket}
        data-qa-submit-rebuild
        loading={isLoading}
        disabled={
          bucketToRemove ? confirmBucketName !== bucketToRemove.label : true
        }
      >
        Delete
      </Button>
    </ActionsPanel>
  );

  const deleteBucketConfirmationMessage = bucketToRemove ? (
    <React.Fragment>
      <Typography>
        Deleting a bucket is permanent and can't be undone.
      </Typography>
      <Typography className={classes.copy}>
        A bucket must be empty before deleting it. Please{' '}
        <a
          href="https://www.linode.com/docs/platform/object-storage/lifecycle-policies/"
          target="_blank"
          aria-describedby="external-site"
          rel="noopener noreferrer"
        >
          delete all objects
        </a>
        , or use{' '}
        <a
          href="https://www.linode.com/docs/platform/object-storage/how-to-use-object-storage/#object-storage-tools"
          target="_blank"
          aria-describedby="external-site"
          rel="noopener noreferrer"
        >
          another tool
        </a>{' '}
        to force deletion.
      </Typography>
      {/* If the user is attempting to delete their last Bucket, remind them
      that they will still be billed unless they cancel Object Storage in
      Account Settings. */}
      {bucketsData.length === 1 && <CancelNotice className={classes.copy} />}
      <Typography className={classes.copy}>
        To confirm deletion, type the name of the bucket (
        <b>{bucketToRemove.label}</b>) in the field below:
      </Typography>
    </React.Fragment>
  ) : null;

  if (isRestrictedUser) {
    return <RenderEmpty onClick={openBucketDrawer} data-qa-empty-state />;
  }

  if (bucketsLoading) {
    return <RenderLoading data-qa-loading-state />;
  }

  const allBucketRequestsFailed =
    bucketErrors?.length === Object.keys(objectStorageClusterDisplay).length;

  // Show a general error state if all the bucket requests failed.
  if (allBucketRequestsFailed) {
    return <RenderError data-qa-error-state />;
  }

  if (bucketsData.length === 0) {
    return (
      <>
        {bucketErrors && <BucketErrorDisplay bucketErrors={bucketErrors} />}
        <RenderEmpty onClick={openBucketDrawer} data-qa-empty-state />;
      </>
    );
  }

  return (
    <React.Fragment>
      <DocumentTitleSegment segment="Buckets" />
      <div id="tabpanel-buckets" role="tabpanel" aria-labelledby="tab-buckets">
        <Grid container justify="flex-end">
          <Grid item>
            <AddNewLink onClick={openBucketDrawer} label="Add a Bucket" />
          </Grid>
        </Grid>
        {bucketErrors && <BucketErrorDisplay bucketErrors={bucketErrors} />}
        <Grid item xs={12}>
          <OrderBy data={bucketsData} order={'asc'} orderBy={'label'}>
            {({ data: orderedData, handleOrderChange, order, orderBy }) => {
              const bucketTableProps = {
                orderBy,
                order,
                handleOrderChange,
                handleClickRemove,
                data: orderedData
              };
              return <BucketTable {...bucketTableProps} />;
            }}
          </OrderBy>
        </Grid>
        <ConfirmationDialog
          open={removeBucketConfirmationDialog.isOpen}
          onClose={() => {
            removeBucketConfirmationDialog.close();
          }}
          title={
            bucketToRemove ? `Delete ${bucketToRemove.label}` : 'Delete bucket'
          }
          actions={actions}
          error={error}
        >
          {deleteBucketConfirmationMessage}
          <TextField
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setConfirmBucketName(e.target.value)
            }
            expand
            label="Bucket Name"
          />
        </ConfirmationDialog>
      </div>
    </React.Fragment>
  );
};

const RenderLoading: React.StatelessComponent<{}> = () => {
  return <CircleProgress />;
};

const RenderError: React.StatelessComponent<{}> = () => {
  return (
    <ErrorState errorText="There was an error retrieving your buckets. Please reload and try again." />
  );
};

const RenderEmpty: React.StatelessComponent<{
  onClick: () => void;
}> = props => {
  return (
    <React.Fragment>
      <DocumentTitleSegment segment="Buckets" />
      <Placeholder
        title="Object Storage"
        copy={<EmptyCopy />}
        icon={BucketIcon}
        renderAsSecondary
        buttonProps={[
          {
            onClick: props.onClick,
            children: 'Add a Bucket'
          }
        ]}
      />
    </React.Fragment>
  );
};

const EmptyCopy = () => (
  <>
    <Typography variant="subtitle1">Need help getting started?</Typography>
    <Typography variant="subtitle1">
      <a
        href="https://linode.com/docs/platform/object-storage"
        target="_blank"
        aria-describedby="external-site"
        rel="noopener noreferrer"
        className="h-u"
      >
        Learn more about storage options for your multimedia, archives, and data
        backups here.
      </a>
    </Typography>
  </>
);

const styled = withStyles(styles);

const enhanced = compose<CombinedProps, Props>(
  styled,
  bucketContainer,
  bucketRequestsContainer,
  bucketDrawerContainer
);

export default enhanced(BucketLanding);

interface BucketErrorDisplayProps {
  bucketErrors: BucketError[];
}

const BucketErrorDisplay: React.FC<BucketErrorDisplayProps> = React.memo(
  ({ bucketErrors }) => {
    return (
      <Banner
        regionsAffected={bucketErrors.map(
          thisError => objectStorageClusterDisplay[thisError.clusterId]
        )}
      />
    );
  }
);

interface BannerProps {
  regionsAffected: string[];
}

const Banner: React.FC<BannerProps> = React.memo(({ regionsAffected }) => {
  const moreThanOneRegionAffected = regionsAffected.length > 1;

  return (
    <Notice warning important>
      There was an error loading buckets in{' '}
      {moreThanOneRegionAffected
        ? 'the following regions:'
        : `${regionsAffected[0]}.`}
      <ul>
        {moreThanOneRegionAffected &&
          regionsAffected.map(thisRegion => (
            <li key={thisRegion}>{thisRegion}</li>
          ))}
      </ul>
      If you have buckets in{' '}
      {moreThanOneRegionAffected ? 'these regions' : regionsAffected[0]}, you
      may not see them listed below.
    </Notice>
  );
});
