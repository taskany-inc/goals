import React from 'react';
import { Button } from '@taskany/bricks';
import { IconEyeOutline, IconEyeClosedSolid } from '@taskany/icons';

import { tr } from './WatchButton.i18n';

interface WatchButtonProps {
    watcher?: boolean;

    onToggle: (val: WatchButtonProps['watcher']) => void;
}

interface IconProps {
    watching: boolean;
}

const Icon: React.FC<IconProps> = ({ watching }) => {
    const Comp = watching ? IconEyeOutline : IconEyeClosedSolid;

    return <Comp size="s" noWrap />;
};

export const WatchButton: React.FC<WatchButtonProps> = ({ watcher, onToggle }) => {
    const onClick = () => {
        onToggle(watcher);
    };

    return (
        <Button
            text={watcher ? tr('Watching') : tr('Watch')}
            iconLeft={<Icon watching={!!watcher} />}
            onClick={onClick}
        />
    );
};
