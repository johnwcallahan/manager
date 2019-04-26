import * as React from 'react';
import Terminal from 'terminal-in-react';

export const CLITerminal: React.FunctionComponent<{}> = () => {
  return (
    <Terminal
      color="green"
      backgroundColor="black"
      style={{
        fontWeight: 'bold',
        fontSize: '1.1em'
      }}
      startState="maximised"
      allowTabs={false}
      hideTopBar={true}
      showActions={false}
      msg="linode-cli"
    />
  );
};

export default CLITerminal;
