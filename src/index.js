import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  Route,
  Routes,
  BrowserRouter
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap'
import './index.css';

import App from './App';
import EditPersonForm from './EditPersonForm';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/edit/:id?" element={<EditPersonForm />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);