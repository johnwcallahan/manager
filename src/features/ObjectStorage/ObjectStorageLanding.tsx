import * as React from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import {
  matchPath,
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter
} from 'react-router-dom';
import { compose } from 'recompose';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import Breadcrumb from 'src/components/Breadcrumb';
import AppBar from 'src/components/core/AppBar';
import Box from 'src/components/core/Box';
import Tab from 'src/components/core/Tab';
import Tabs from 'src/components/core/Tabs';
import DefaultLoader from 'src/components/DefaultLoader';
import DocumentationButton from 'src/components/DocumentationButton';
import { DocumentTitleSegment } from 'src/components/DocumentTitle';
import TabLink from 'src/components/TabLink';
import { Keys, ObjectStorageContext, dummyCtx } from './common';
import { ApplicationState } from 'src/store';
import { getAllBuckets } from 'src/store/bucket/bucket.requests';
import { requestClusters as _requestClusters } from 'src/store/clusters/clusters.actions';
import { MapState } from 'src/store/types';
import { createExpiringObjectStorageKeys } from 'src/services/profile/objectStorageKeys';
import { OBJContext } from 'src/servicesS3';

const BucketLanding = DefaultLoader({
  loader: () => import('./Buckets/BucketLanding')
});

const AccessKeyLanding = DefaultLoader({
  loader: () => import('./AccessKeys/AccessKeyLanding')
});

const BucketDetail = DefaultLoader({
  loader: () => import('./Buckets/BucketDetail')
});

type CombinedProps = StateProps & DispatchProps & RouteComponentProps<{}>;

export const ObjectStorageLanding: React.FunctionComponent<
  CombinedProps
> = props => {
  const tabs = [
    /* NB: These must correspond to the routes inside the Switch */
    { title: 'Buckets', routeName: `${props.match.url}/buckets` },
    { title: 'Access Keys', routeName: `${props.match.url}/access-keys` }
  ];

  const handleTabChange = (
    event: React.ChangeEvent<HTMLDivElement>,
    value: number
  ) => {
    const { history } = props;
    const routeName = tabs[value].routeName;
    history.push(`${routeName}`);
  };

  React.useEffect(() => {
    const {
      bucketsLastUpdated,
      clustersLastUpdated,
      requestBuckets,
      requestClusters
    } = props;

    /**
     * @todo: Move these requests to App.tsx like other entities when OBJ is generally available.
     */

    // Request buckets if we haven't already
    if (bucketsLastUpdated === 0) {
      requestBuckets().catch(err => {
        /** We choose to do nothing, relying on the Redux error state. */
      });
    }

    // Request clusters if we haven't already
    if (clustersLastUpdated === 0) {
      requestClusters().catch(err => {
        /** We choose to do nothing, relying on the Redux error state. */
      });
    }
  }, []);

  const {
    match: { url }
  } = props;
  const matches = (p: string) => {
    return Boolean(matchPath(p, { path: props.location.pathname }));
  };

  // This is to hold our ObjectStorage session context
  const [ctx, setCtx] = React.useState<OBJContext>(dummyCtx);

  // After the first render, we create a short-lived OBJ access key pair
  // to use for the session.
  React.useEffect(() => {
    createExpiringObjectStorageKeys().then(
      ({ accessKeyId, secretAccessKey }) => {
        // Set the context so all children will have access to it.
        setCtx(new OBJContext(accessKeyId, secretAccessKey));
      }
    );
  }, []);

  const tabIdx = tabs.findIndex(tab => matches(tab.routeName));

  return (
    <React.Fragment>
      <ObjectStorageContext.Provider value={ctx}>
        <DocumentTitleSegment segment="Object Storage" />
        {/* <pre>{JSON.stringify(objData, null, 2)}</pre> */}
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Breadcrumb
            pathname={props.location.pathname}
            labelTitle="Object Storage"
            removeCrumbX={1}
          />
          <DocumentationButton href="https://www.linode.com/docs/platform/object-storage/how-to-use-object-storage/" />
        </Box>
        <AppBar position="static" color="default">
          <Tabs
            value={tabIdx > -1 ? tabIdx : 0}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="on"
          >
            {tabs.map(tab => (
              <Tab
                key={tab.title}
                data-qa-tab={tab.title}
                component={React.forwardRef((forwardedProps, ref) => (
                  <TabLink
                    to={tab.routeName}
                    title={tab.title}
                    {...forwardedProps}
                    ref={ref}
                  />
                ))}
              />
            ))}
          </Tabs>
        </AppBar>
        <Switch>
          <Route
            exact
            strict
            path={`${url}/buckets`}
            component={BucketLanding}
          />
          <Route
            exact
            strict
            path={`${url}/access-keys`}
            component={AccessKeyLanding}
          />
          <Route
            exact
            strict
            path={`${url}/buckets/:region/:bucketName`}
            component={BucketDetail}
          />
          <Redirect to={`${url}/buckets`} />
        </Switch>
      </ObjectStorageContext.Provider>
    </React.Fragment>
  );
};

interface StateProps {
  bucketsLastUpdated: number;
  clustersLastUpdated: number;
}

const mapStateToProps: MapState<StateProps, {}> = state => ({
  bucketsLastUpdated: state.__resources.buckets.lastUpdated,
  clustersLastUpdated: state.__resources.clusters.lastUpdated
});

interface DispatchProps {
  requestBuckets: () => Promise<Linode.Bucket[]>;
  requestClusters: () => Promise<Linode.Cluster[]>;
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (
  dispatch: ThunkDispatch<ApplicationState, undefined, Action<any>>
) => {
  return {
    requestBuckets: () => dispatch(getAllBuckets()),
    requestClusters: () => dispatch(_requestClusters())
  };
};

export const connected = connect(
  mapStateToProps,
  mapDispatchToProps
);

const enhanced = compose<CombinedProps, {}>(
  connected,
  withRouter
);
export default enhanced(ObjectStorageLanding);
