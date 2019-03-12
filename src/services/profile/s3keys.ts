import { API_ROOT } from 'src/constants';
import Request, {
  setData,
  setMethod,
  setParams,
  setURL,
  setXFilter
} from '../index';
import { createS3KeySchema } from './s3keys.schema';

type Page<T> = Linode.ResourcePage<T>;
export interface CreateS3KeyRequest {
  label: string;
}
/**
 * getObjectStorageKeys
 *
 * Gets a list of a user's Object Storage Keys
 */
export const getS3Keys = (params?: any, filters?: any) =>
  Request<Page<Linode.S3Key>>(
    setMethod('GET'),
    setParams(params),
    setXFilter(filters),
    setURL(`${API_ROOT}beta/account/s3-keys`)
  ).then(response => response.data);

/**
 * createObjectStorageKeys
 *
 * Creates an Object Storage User and returns the Access Key and Secret Key
 */
export const createS3Keys = (data: CreateS3KeyRequest) =>
  Request<Linode.S3Key>(
    setMethod('POST'),
    setURL(`${API_ROOT}beta/account/s3-keys`),
    setData(data, createS3KeySchema)
  ).then(response => response.data);
