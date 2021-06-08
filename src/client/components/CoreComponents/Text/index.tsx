import * as React from 'react';
import cn from 'classnames';

import styles from './styles.scss';

interface Props {
    header?: boolean;
    headerLevel?: 0 | 1 | 2 | 3 | 4 | 5;
    block?: boolean;
    size?: 'xs' | 's' | 'm' | 'l' | 'xl';
    className?: string;
}

const Text: React.FC<Props> = ({
    header,
    headerLevel = 0, 
    block,
    size = 'm',
    className,
    children,
    ...rest
}) => {
    const tag = headerLevel === 0 ? 'span' : 'h' + headerLevel;

    return React.createElement(
        tag,
        {
            className: cn(
                styles.text,
                styles[size],
                { 
                    [styles.header]: header,
                    [styles.block]: block,
                    
                },
                className
            ),
        },
        children //будет ли рабтать html-сущности?
    );
};

export default Text;