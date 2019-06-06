import * as React from 'react';
import CheckBox from 'src/components/CheckBox';

interface Props {
  configs: Linode.Config[];
  selectedConfigs: Record<number, boolean>;
  handleSelect: (id: number) => void;
}

export const Configs: React.FC<Props> = props => {
  const { configs, handleSelect, selectedConfigs } = props;

  return (
    <React.Fragment>
      {configs.map(eachConfig => (
        <CheckBox
          key={eachConfig.id}
          checked={selectedConfigs[eachConfig.id]}
          onChange={() => handleSelect(eachConfig.id)}
          text={eachConfig.label}
        />
      ))}
    </React.Fragment>
  );
};

export default Configs;
