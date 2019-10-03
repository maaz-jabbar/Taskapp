import React from 'react';
import { Provider } from 'react-redux'
import Routes from './navigation/Routes'
import {store} from './redux/index';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Routes />
      </Provider>
    );
  }
}
