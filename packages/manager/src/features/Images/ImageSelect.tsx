import { Image } from 'linode-js-sdk/lib/images';
import { always, cond, groupBy, propOr } from 'ramda';
import * as React from 'react';
import { makeStyles, Theme } from 'src/components/core/styles';
import Select, { GroupType, Item } from 'src/components/EnhancedSelect/Select';
import Grid from 'src/components/Grid';
import HelpIcon from 'src/components/HelpIcon';
import { useImages } from 'src/hooks/useImages';
import { useReduxLoad } from 'src/hooks/useReduxLoad';
import { getAPIErrorOrDefault } from 'src/utilities/errorUtils';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%'
  },
  icon: {
    marginTop: theme.spacing(2) + 14,
    marginLeft: -theme.spacing(1)
  },
  selectContainer: {
    width: 415 + theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  }
}));

interface Props {
  images: Image[];
  imageError?: string;
  imageFieldError?: string;
  isMulti?: boolean;
  helperText?: string;
  value?: Item | Item[];
  disabled?: boolean;
  onSelect: (selected: Item<any> | Item<any>[]) => void;
  label?: string;
  required?: boolean;
}

type CombinedProps = Props;

export const ImageSelect: React.FC<CombinedProps> = props => {
  const {
    helperText,
    images,
    imageError,
    imageFieldError,
    isMulti,
    label,
    onSelect,
    value,
    disabled,
    required
  } = props;

  const classes = useStyles();

  const { _loading } = useReduxLoad(['images']);

  // Check for request errors in Redux
  const {
    images: { error }
  } = useImages();
  const reduxError = error?.read
    ? getAPIErrorOrDefault(error.read, 'Unable to load Images')[0].reason
    : undefined;

  const renderedImages = React.useMemo(() => getImagesOptions(images), [
    images
  ]);

  return (
    <React.Fragment>
      <Grid
        className={classes.root}
        container
        wrap="nowrap"
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
      >
        <Grid item className={classes.selectContainer}>
          <Select
            id={'image-select'}
            isLoading={_loading}
            value={value}
            isMulti={Boolean(isMulti)}
            errorText={imageError || imageFieldError || reduxError}
            disabled={disabled || Boolean(imageError)}
            onChange={onSelect}
            options={renderedImages as any}
            placeholder="Select an Image"
            textFieldProps={{
              required
            }}
            label={label || 'Image'}
          />
        </Grid>
        <Grid item xs={1}>
          <HelpIcon
            className={classes.icon}
            text={helperText || 'Choosing a 64-bit distro is recommended.'}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export const getImagesOptions = (images: Image[]) => {
  const groupedImages = groupImages(images);
  return ['recommended', 'older', 'images', 'deleted'].reduce(
    (accumulator: GroupType<string>[], category: string) => {
      if (groupedImages[category]) {
        return [
          ...accumulator,
          {
            label: getDisplayNameForGroup(category),
            options: groupedImages[category].map(({ id, label }: Image) => ({
              label,
              value: id
            }))
          }
        ];
      }
      return accumulator;
    },
    []
  );
};

interface GroupedImages {
  deleted?: Image[];
  recommended?: Image[];
  older?: Image[];
  images?: Image[];
}

const isRecentlyDeleted = (i: Image) =>
  i.created_by === null && i.type === 'automatic';
const isByLinode = (i: Image) =>
  i.created_by !== null && i.created_by === 'linode';
const isDeprecated = (i: Image) => i.deprecated === true;
const isRecommended = (i: Image) => isByLinode(i) && !isDeprecated(i);
const isOlderImage = (i: Image) => isByLinode(i) && isDeprecated(i);

export let groupImages: (i: Image[]) => GroupedImages;
groupImages = groupBy(
  cond([
    [isRecentlyDeleted, always('deleted')],
    [isRecommended, always('recommended')],
    [isOlderImage, always('older')],
    [(i: Image) => true, always('images')]
  ])
);

export const groupNameMap = {
  _default: 'Other',
  deleted: 'Recently Deleted Disks',
  recommended: '64-bit Distributions - Recommended',
  older: 'Older Distributions',
  images: 'Images'
};

const getDisplayNameForGroup = (key: string) =>
  propOr('Other', key, groupNameMap);

export default ImageSelect;
