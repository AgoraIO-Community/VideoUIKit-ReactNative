import {CallbacksInterface} from 'src/Contexts/PropsContext';
import {ActionType} from 'src/Contexts/RtcContext';

export function actionTypeGuard<T extends keyof CallbacksInterface>(
  _act: ActionType<keyof CallbacksInterface>,
  _type: T,
): _act is ActionType<T> {
  return true;
}
