import { shallow } from 'enzyme';
import * as React from 'react';
import { buckets } from 'src/__data__/buckets';
import { objectStorageClusterDisplay } from 'src/constants';
import { BucketLanding } from './BucketLanding';

describe('ObjectStorageLanding', () => {
  const wrapper = shallow(
    <BucketLanding
      createBucket={jest.fn()}
      bucketsData={buckets}
      bucketsLoading={false}
      openBucketDrawer={jest.fn()}
      closeBucketDrawer={jest.fn()}
      classes={{ copy: '' }}
      deleteBucket={jest.fn()}
      isRestrictedUser={false}
    />
  );

  it('renders without crashing', () => {
    expect(wrapper).toHaveLength(1);
  });

  it('renders an "OrderBy" component, ordered by label', () => {
    expect(wrapper.find('Connect(OrderBy)').prop('orderBy')).toBe('label');
  });

  it('renders a loading state when the data is loading', () => {
    wrapper.setProps({ bucketsLoading: true });
    expect(wrapper.find('[data-qa-loading-state]')).toHaveLength(1);
  });

  it('renders an empty state when there is no data', () => {
    wrapper.setProps({ bucketsData: [], bucketsLoading: false });
    expect(wrapper.find('[data-qa-empty-state]')).toHaveLength(1);
  });

  it('renders an error state when there is an error in each cluster', () => {
    wrapper.setProps({
      bucketErrors: Object.keys(objectStorageClusterDisplay).map(
        thisClusterId => ({
          error: [{ reason: 'An error occurred.' }],
          clusterId: thisClusterId
        })
      ),
      bucketsLoading: false
    });
    expect(wrapper.find('[data-qa-error-state]')).toHaveLength(1);
  });
});
