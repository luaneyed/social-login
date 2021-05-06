import { hot } from 'react-hot-loader';
import { Redirect, Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import { HomeComponent } from './Home';
import { SignInComponent } from './SignIn';

export default hot(module)(() =>
<BrowserRouter>
  <Switch>
    <Route exact path="/" component={HomeComponent}/>
    <Route path="/sign-in" component={SignInComponent}/>
    <Redirect to={{ pathname: '/' }} />
  </Switch>
</BrowserRouter>);
