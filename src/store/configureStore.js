import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers.js';


const loggerMiddleware = createLogger();
const middleware = [];

// For Redux Dev Tools
const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      })
    : compose;

const enhancer = composeEnhancers(
  applyMiddleware(...middleware, loggerMiddleware)
);


export default function configureStore(preloadedState) {
    return createStore(
        rootReducer,
        enhancer,
        preloadedState
    );
}