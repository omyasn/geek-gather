import * as React from 'react';

interface BasePageProps {
    children: React.ReactNode
}

const BasePage = ({ children }: BasePageProps) => (
    <div>
        <header>Header</header>
            {children}
        <footer>footer</footer>
    </div>
);

export default BasePage;