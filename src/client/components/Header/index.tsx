import * as React from 'react';
import cn from 'classnames';

import styles from './styles.css';

interface Props {
    className?: string;
}

const Header: React.FC<Props> = ({ className }) => (
    <header className={cn(styles.header, className)}>
        It's header
        <br/>
        lol
        <br/>
        kek
    </header>
);

export default Header;