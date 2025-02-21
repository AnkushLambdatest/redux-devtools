import {
  getActiveInstance,
  LIFTED_ACTION,
  StoreAction,
  StoreState,
  TOGGLE_PERSIST,
  UPDATE_STATE,
} from '@redux-devtools/app';
import { Dispatch, MiddlewareAPI, Store } from 'redux';
import { BackgroundState } from '../reducers/background';
import { WindowStoreAction } from '../stores/windowStore';
import { BackgroundAction } from '../stores/backgroundStore';

const syncStores =
  (baseStore: Store<BackgroundState, BackgroundAction>) =>
  (store: MiddlewareAPI<Dispatch<StoreAction>, StoreState>) =>
  (next: Dispatch<WindowStoreAction>) =>
  (action: StoreAction) => {
    if (action.type === UPDATE_STATE) {
      return next({
        ...action,
        instances: baseStore.getState().instances,
      });
    }
    if (action.type === LIFTED_ACTION || action.type === TOGGLE_PERSIST) {
      const instances = store.getState().instances;
      const instanceId = getActiveInstance(instances);
      const id = instances.options[instanceId].connectionId;
      baseStore.dispatch({ ...action, instanceId, id } as any);
    }
    return next(action);
  };

export default syncStores;
