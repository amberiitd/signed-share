import { createStore } from 'redux';
import reducers from './reducer/index';


export const store: any = createStore(reducers, {})