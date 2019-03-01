namespace Linode {
  export interface Bucket {
    label: string;
    objects: number;
    created: string;
    size: number;
    region: string; // @todo: region string literal type?
    hostname: string;
  }
}
