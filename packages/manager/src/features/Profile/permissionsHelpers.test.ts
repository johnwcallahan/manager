import { GlobalGrants } from '@linode/api-v4/lib/account';
import { DeepPartial } from '@linode/api-v4/lib/types';
import { ApplicationState } from 'src/store';
import { hasGrant } from './permissionsHelpers';

const createState = (
  globalGrants: Partial<GlobalGrants['global']>
): DeepPartial<ApplicationState> => ({
  __resources: {
    profile: {
      data: {
        restricted: true,
        grants: {
          global: globalGrants
        }
      }
    }
  }
});

describe('hasGrant', () => {
  it('returns `false` if the grant is false, null, or undefined', () => {
    let state = createState({ account_access: false });
    expect(hasGrant(state as any, 'account_access')).toBe(false);

    state = createState({ account_access: null });
    expect(hasGrant(state as any, 'account_access')).toBe(false);

    state = createState({ account_access: undefined });
    expect(hasGrant(state as any, 'account_access')).toBe(false);
  });

  it('returns `true` if the grant is read_only or read_write', () => {
    let state = createState({
      account_access: 'read_only'
    });
    expect(hasGrant(state as any, 'account_access')).toBe(true);

    state = createState({ account_access: 'read_write' });
    expect(hasGrant(state as any, 'account_access')).toBe(true);
  });

  it('returns `true` only if the grant matches the given grant level exactly', () => {
    let state = createState({
      account_access: 'read_only'
    });
    expect(hasGrant(state as any, 'account_access', 'read_only')).toBe(true);
    expect(hasGrant(state as any, 'account_access', 'read_write')).toBe(false);

    state = createState({ account_access: 'read_write' });
    expect(hasGrant(state as any, 'account_access', 'read_only')).toBe(false);
    expect(hasGrant(state as any, 'account_access', 'read_write')).toBe(true);
  });
});
