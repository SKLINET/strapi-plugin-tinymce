import { Page } from '@strapi/strapi/admin';
import { Routes, Route } from 'react-router-dom';

import HomePage from './HomePage';
import { PLUGIN_ID } from '../pluginId';

const App = () => {
    return (
        <div>
            <Routes>
                <Route path={`/plugins/${PLUGIN_ID}`} element={<HomePage />} />
                <Route path="*" element={<Page.Error />} />
            </Routes>
        </div>
    );
};

export { App };
