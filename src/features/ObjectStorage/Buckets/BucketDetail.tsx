import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Button from 'src/components/Button';
import Input from 'src/components/core/Input';
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

  const [bucket, setBucket] = React.useState<any>(null);
  const [file, setFile] = React.useState<File | null>(null);

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = () => {
    if (file) {
      OBJ.putObject(bucketName, region, file).then(res => {
        console.log('res');
        console.log(res);
      });
    }
  };

  const deleteObject = () => {
    OBJ.deleteObject(bucketName, region, 'test.txt');
  };

  React.useEffect(() => {
    OBJ.getBucket(bucketName, region)
      .then(b => {
        setBucket(b);
      })
      .catch(err => {
        console.log(err);
      });
  }, [OBJ, bucketName, region]);

  return (
    <React.Fragment>
      <Input type="file" onChange={handleSelectFile} />
      <Button buttonType="primary" onClick={uploadFile}>
        Upload
      </Button>
      <Button onClick={deleteObject}>Delete</Button>
      <pre>{JSON.stringify(bucket, null, 2)}</pre>;
    </React.Fragment>
  );
};

export default BucketDetail;
