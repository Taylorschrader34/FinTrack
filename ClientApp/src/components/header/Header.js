import React from 'react';
import { Navigation } from "./navigation/Navigation";
import './Header.css';

export const Header = (props) => {
    return (
        <div id="header">
            <Navigation></Navigation>
        </div>
    );
}

