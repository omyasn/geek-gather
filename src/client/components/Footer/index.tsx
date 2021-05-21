import * as React from 'react';
import cn from 'classnames';

import styles from './styles.css';

interface Props {
    className?: string;
}

const Footer: React.FC<Props> = ({ className }) => (
    <footer className={cn(styles.footer, className)}>
        It's footer
        <br/>
        lol
        <br/>
        kek
    </footer>
);

export default Footer;