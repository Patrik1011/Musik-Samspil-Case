import Login from '../components/unauthenticated/auth/Login';
import Register from '../components/unauthenticated/auth/Register';
import DummyComponent from '../components/authenticated/DummyComponent';

const routes = [
  {
    path: '/login',
    component: Login,
    protected: false,
  },
  {
    path: '/register',
    component: Register,
    protected: false,
  },
  {
    path: '/dummy',
    component: DummyComponent,
    protected: true,
  },
];

export default routes;