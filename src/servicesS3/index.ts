import * as S3 from 'aws-sdk/clients/s3';
// import * as AWSSign from 'aws-sign';
import * as aws4 from 'aws4';
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

export const formatHost = (region: string) => `${region}.${OBJ_ROOT}`;

const s3 = new S3({
  accessKeyId: process.env.REACT_APP_OBJ_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_OBJ_SECRET_KEY,
  apiVersion: '2006-03-01',
  endpoint: 'us-east-1.linodeobjects.com'
});

/**
 * OBJContext Class
 */
export class OBJContext {
  signer: any;
  isReady: boolean;
  credentials: { accessKeyId: string; secretAccessKey: string };

  constructor(accessKeyId?: string, secretAccessKey?: string) {
    if (!accessKeyId || !secretAccessKey) {
      this.isReady = false;
      return;
    }

    this.credentials = { accessKeyId, secretAccessKey };

    // this.signer = new AWSSign({
    //   accessKeyId,
    //   secretAccessKey
    // });

    this.isReady = true;
  }

  // getBucket = (bucketName: string, region: string): Promise<any> => {
  // if (!this.isReady) {
  //   return Promise.reject({
  //     reason: 'OBJ context needs an access key and a secret key',
  //     code: 'NOT_READY'
  //   });
  // }
  // const opts: any = {
  //   method: 'GET',
  //   host: `${bucketName}.${region}.${OBJ_ROOT}`,
  //   path: `/`
  //   // url: `https://${bucketName}.${region}.${OBJ_ROOT}/`
  // };
  // this.signer.sign(opts);
  // delete opts.headers.date;
  // console.log('GET opts');
  // console.log(opts);
  // return Request({
  //   ...opts,
  //   url: `https://${bucketName}.${region}.${OBJ_ROOT}/`
  // }).then(res => {

  // });
  // return new Promise((resolve, reject) => {
  //   s3.listObjects({ Bucket: bucketName, MaxKeys: 100 }, (err, data) => {
  //     if (err) {
  //       reject(err);
  //     }
  //     resolve(data);
  //   });
  // });
  // };
  getBucket = (bucketName: string, region: string): Promise<Bucket> => {
    if (!this.isReady) {
      return Promise.reject({
        reason: 'OBJ context needs an access key and a secret key',
        code: 'NOT_READY'
      });
    }

    const opts = aws4.sign(
      {
        service: 's3',
        host: `${bucketName}.${region}.${OBJ_ROOT}`
      },
      this.credentials
    );

    // aws4 adds a 'Host' header, which the browser will refuse to add.
    if (opts.headers && opts.headers.Host) {
      delete opts.headers.Host;
    }

    return Request({
      ...opts,
      url: `https://${bucketName}.${region}.${OBJ_ROOT}/`
    }).then(res => {
      const json = convert.xml2js(res.data, { compact: true });
      // tslint:disable-next-line
      const buckets = json['ListBucketResult'].Contents;
      return buckets.map((bucket: any) => parseBucket(bucket));
    });
  };

  uploadObject = (bucketName: string, region: string, file: File) => {
    const opts = aws4.sign(
      {
        service: 's3',
        host: `${bucketName}.${region}.${OBJ_ROOT}`,
        path: `/${file.name}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/octet-stream',
          'x-amz-content-sha256': 'UNSIGNED-PAYLOAD'
        }
      },
      this.credentials
    );

    if (opts.headers) {
      delete opts.headers.Host;
      delete opts.headers['Content-Length'];
    }

    return Request({
      ...opts,
      data: file,
      url: `https://${bucketName}.${region}.${OBJ_ROOT}/${file.name}`
    });

    return new Promise((resolve, reject) => {
      s3.upload(
        { Bucket: bucketName, Key: file.name, Body: file },
        (err, res) => {
          if (err) {
            reject(err);
          }
          resolve(res);
        }
      );
    });
  };

  deleteObject = (bucketName: string, region: string, fileName: string) => {
    const opts = aws4.sign(
      {
        service: 's3',
        host: `${bucketName}.${region}.${OBJ_ROOT}`,
        path: `/${fileName}`,
        method: 'DELETE'
      },
      this.credentials
    );

    if (opts.headers) {
      delete opts.headers.Host;
    }

    return Request({
      ...opts,
      url: `https://${bucketName}.${region}.${OBJ_ROOT}/${fileName}`
    })
      .then(res => {
        console.log('res');
      })
      .catch(err => {
        console.log(err);
      });
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
