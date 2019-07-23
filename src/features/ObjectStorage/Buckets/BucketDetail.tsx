import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Bucket } from 'src/servicesS3';
import { ObjectStorageContext } from '../common';

interface MatchProps {
  bucketName: string;
  region: string;
}

type RouteProps = RouteComponentProps<MatchProps>;

type CombinedProps = RouteProps;

export const BucketDetail: React.FC<CombinedProps> = props => {
  const bucketName = props.match.params.bucketName;
  const region = props.match.params.region;

  const OBJ = React.useContext(ObjectStorageContext);
  const [bucket, setBucket] = React.useState<Bucket[] | null>(null);

  React.useEffect(() => {
    OBJ.getBucket(bucketName, region)
      .then(b => {
        setBucket(b);
      })
      .catch(err => {
        console.log(err);
      });
  }, [OBJ, bucketName, region]);

  return <pre>{JSON.stringify(bucket, null, 2)}</pre>;
};

export default BucketDetail;
