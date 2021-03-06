import * as React from "react";
import {render} from "react-dom";
import {App} from "./views/router";
import {store} from "./stores/AppStore";
import "./app.css";
import 'typeface-roboto';
// import injectTapEventPlugin = require('react-tap-event-plugin');

// injectTapEventPlugin()
render(<App store={store}/>, document.getElementById('app'));

