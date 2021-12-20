import {CallbacksInterface} from '../Contexts/PropsContext';
import {ActionType} from '../Contexts/RtcContext';

export function actionTypeGuard<T extends keyof CallbacksInterface>(
  _act: ActionType<keyof CallbacksInterface>,
  _type: T,
): _act is ActionType<T> {
  return true;
}
