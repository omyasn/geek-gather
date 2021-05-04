import * as React from 'react';

interface BasePageProps {
    
}

const BasePage: React.FC<React.PropsWithChildren<BasePageProps>> = ({
    children
}) => (
    <div>
        <header>Header</header>
            {children}
        <footer>footer</footer>
    </div>
);

export default BasePage;