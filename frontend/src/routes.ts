import { createBrowserRouter } from 'react-router';

import Root from './layouts/Root';

import Landing from './pages/Landing';
import Planner from './pages/Planner';
import Results from './pages/Results';
import Login from './pages/Login';
import Register from './pages/Register';
import MyPlans from './pages/MyPlans';
import PlanDetails from './pages/PlanDetails';

import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,

    children: [
      {
        index: true,
        Component: Landing,
      },

      {
        path: 'login',
        Component: Login,
      },

      {
        path: 'register',
        Component: Register,
      },

      {
        Component: ProtectedRoute,

        children: [
          {
            path: 'planner',
            Component: Planner,
          },

          {
            path: 'results',
            Component: Results,
          },

          {
            path: 'my-plans',
            Component: MyPlans,
          },

          {
            path: 'my-plans/:id',
            Component: PlanDetails,
          },
        ],
      },
    ],
  },
]);