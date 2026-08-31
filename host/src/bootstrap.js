import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router/dom";
import createRemoteLoader from './remotes/createRemoteLoader';


const Products = createRemoteLoader('Products', () => import('products/Products'));
const Cart = createRemoteLoader('Cart', () => import('cart/Cart'));
const UserPanel = createRemoteLoader('User Panel', () => import('user/UserPanel'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: '/', element: <Navigate to="/products" /> },
      { path: '/products', element: <Products /> },
      { path: '/cart', element: <Cart /> },
      { path: '/user', element: <UserPanel /> }
    ]
  },
]);

const root = createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router} />);
