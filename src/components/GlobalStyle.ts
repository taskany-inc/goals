import { createGlobalStyle } from 'styled-components';

import { backgroundColor, fontDisplay } from '../design/@generated/themes';

export const GlobalStyle = createGlobalStyle`
    html, body {
        box-sizing: border-box;

        font-family: ${fontDisplay};

        margin: 0;
        padding: 0;

        width: 100%;
        height: 100%;

        background-color: ${backgroundColor};
    }
`;
