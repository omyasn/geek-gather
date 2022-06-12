import * as React from 'react';
import cn from 'classnames';

import styles from './styles.scss';

interface Props extends React.HTMLProps<HTMLElement> {
    header?: boolean;
    block?: boolean;
    textSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
    tag?: 'span' | 'a' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p' | 'label';
    secondary?: boolean;
    mardinRight?: boolean;
    bold?: boolean;
    className?: string;
}

const Text: React.FC<Props> = ({
    header,
    block,
    bold,
    textSize = 'm',
    tag = 'span',
    className,
    mardinRight,
    secondary,
    children,
    ...rest
}) => {
    return React.createElement(
        tag,
        {
            className: cn(
                styles.text,
                styles[textSize],
                { 
                    [styles.header]: header,
                    [styles.block]: block,
                    [styles.bold]: bold,
                    [styles.secondary]: secondary,
                    [styles.mardinRight]: mardinRight,
            
                },
                className
            ),
            ...rest
        },
        children
    );
};

export default Text;