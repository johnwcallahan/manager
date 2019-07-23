import * as AWSSign from 'aws-sign';
import Axios from 'axios';
import { OBJ_ROOT } from 'src/constants';
import * as convert from 'xml-js';

const Request = Axios.create({
  headers: {
    'Content-Type': 'application/xml',
    get: {
      Accept: '*'
    }
  }
});

export const formatURL = (bucketName: string, region: string) =>
  `https://${region}.${OBJ_ROOT}/${bucketName}`;

export const formatHost = (bucketName: string, region: string) =>
  `${region}.${OBJ_ROOT}`;

/**
 * OBJContext Class
 */
export class OBJContext {
  signer: any;
  isReady: boolean;

  constructor(accessKeyId?: string, secretAccessKey?: string) {
    if (!accessKeyId || !secretAccessKey) {
      this.isReady = false;
      return;
    }

    this.signer = new AWSSign({
      accessKeyId,
      secretAccessKey
    });

    this.isReady = true;
  }

  getBucket = (bucketName: string, region: string): Promise<Bucket[]> => {
    if (!this.isReady) {
      return Promise.reject({
        reason: 'OBJ context needs an access key and a secret key',
        code: 'NOT_READY'
      });
    }

    const opts = {
      method: 'GET',
      host: formatHost(bucketName, region),
      path: `${bucketName}?list-type=2`,
      url: formatURL(bucketName, region)
    };

    this.signer.sign(opts);
    return Request({ ...opts, headers: { Accept: 'application/xml' } }).then(
      res => {
        const json = convert.xml2js(res.data, { compact: true });
        // tslint:disable-next-line
        const buckets = json['ListBucketResult'].Contents;
        return buckets.map((bucket: any) => parseBucket(bucket));
      }
    );
  };
}

interface Text {
  _text: string;
}

interface RawBucket {
  Key: Text;
  LastModified: Text;
  ETag: Text;
  Size: Text;
  StorageClass: Text;
  Owner: {
    ID: Text;
    DisplayName: Text;
  };
  Type: Text;
}

export interface Bucket {
  key: string;
  lastModified: string;
  eTag: string;
  size: string;
  storageClass: string;
  owner: {
    id: string;
    displayName: string;
  };
  type: string;
}

const parseBucket = (rawBucket: RawBucket): Bucket => ({
  key: rawBucket.Key._text,
  lastModified: rawBucket.LastModified._text,
  eTag: rawBucket.ETag._text,
  size: rawBucket.Size._text,
  storageClass: rawBucket.StorageClass._text,
  owner: {
    id: rawBucket.Owner.ID._text,
    displayName: rawBucket.Owner.DisplayName._text
  },
  type: rawBucket.Type._text
});
