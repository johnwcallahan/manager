import actionCreatorFactory from 'typescript-fsa';

const actionCreator = actionCreatorFactory('@@manager/cli');

export const openCLIDrawer = actionCreator('open');
export const closeCLIDrawer = actionCreator('close');
