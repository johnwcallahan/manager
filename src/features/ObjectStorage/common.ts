import { createContext } from 'react';
import { OBJContext } from 'src/servicesS3';

export interface Keys {
  accessKeyId: string;
  secretAccessKey: string;
}

export const dummyCtx = new OBJContext();

export const ObjectStorageContext = createContext<OBJContext>(dummyCtx);
