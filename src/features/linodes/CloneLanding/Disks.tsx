import * as React from 'react';

interface Props {
  disks: Linode.Disk[];
}

export const Disks: React.FC<Props> = props => {
  const { disks } = props;
  return (
    <React.Fragment>
      {disks.map(eachDisk => (
        <div key={eachDisk.id}>{eachDisk.label}</div>
      ))}
    </React.Fragment>
  );
};

export default Disks;
