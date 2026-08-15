import React from 'react';
import { createRoot } from 'react-dom/client';
import UserPanel from './UserPanel';

const root = createRoot(document.getElementById('root'));
root.render(<UserPanel />);
