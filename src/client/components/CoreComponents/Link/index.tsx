import * as React from 'react';
import cn from 'classnames';

import styles from './styles.css';

interface Props {
    url: string;
    className?: string;
}

const Link: React.FC<Props> = ({ className, url, children,...rest }) => (
    <a
        href={url}
        className={cn(styles.link, className)}
        {...rest}
    >
        {children}
    </a>
);

export default Link;