import {
  StyleRulesCallback,
  withStyles,
  WithStyles
} from '@material-ui/core/styles';
import * as React from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { compose } from 'recompose';
import { openCLIDrawer } from 'src/store/cli/cli.actions';
import NavItem, { PrimaryLink } from './NavItem';

type ClassNames = 'root';

const styles: StyleRulesCallback<ClassNames> = theme => ({
  root: {}
});

interface Props {
  closeMenu: () => void;
  linkClasses: (href?: string) => string;
  listItemClasses: string;
  dividerClasses: string;
}

type CombinedProps = Props & WithStyles<ClassNames> & DispatchProps;

const AdditionalMenuItems: React.FC<CombinedProps> = props => {
  // const [adaError, setAdaError] = React.useState<string>('');

  // React.useEffect(() => {
  //   /*
  //    * Init Ada Chaperone chat app
  //    * Script is included in index.html
  //    */
  //   if ('AdaChaperone' in window) {
  //     ada = new (window as any).AdaChaperone('linode');
  //   } else {
  //     setAdaError(
  //       'There was an issue loading the support bot. Please try again later.'
  //     );
  //   }
  // });

  // const handleAdaInit = () => {
  //   /*
  //    * Show the Ada chat
  //    */

  //   if (typeof ada === 'undefined') {
  //     return;
  //   }

  //   setAdaError('');
  //   sendEvent({
  //     category: 'Support Bot',
  //     action: 'Open',
  //     label: location.pathname
  //   });
  //   ada.show();
  // };

  const links: PrimaryLink[] = [
    { display: 'Get Help', href: '/support', key: 'help' },
    { display: '</>', onClick: props.openCLIDrawer, key: 'cli' }

    // {
    //   display: 'Support Bot',
    //   key: 'chat',
    //   onClick: handleAdaInit,
    //   isDisabled: () => adaError
    // }
  ];

  /** ada chat bot */
  // let ada: any;

  const { classes, ...restOfProps } = props;

  return (
    <React.Fragment>
      {links.map(eachLink => {
        return <NavItem {...eachLink} {...restOfProps} key={eachLink.key} />;
      })}
    </React.Fragment>
  );
};

const styled = withStyles(styles);

interface DispatchProps {
  openCLIDrawer: () => void;
}

const mapStateToProps = undefined;

const mapDispatchToProps: MapDispatchToProps<
  DispatchProps,
  Props
> = dispatch => ({
  openCLIDrawer: () => dispatch(openCLIDrawer())
});

const connected = connect(
  mapStateToProps,
  mapDispatchToProps
);

export default compose<CombinedProps, Props>(
  styled,
  connected,
  React.memo
)(AdditionalMenuItems);
