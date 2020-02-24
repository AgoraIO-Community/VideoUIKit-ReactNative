import React from 'react';
import { Icon } from 'react-native-elements';
import PropsContext from '../../PropsContext';

function LocalBtnTemplate(props) {
    const { styleProps } = useContext(PropsContext);
    const { localControlStyles, theme } = styleProps || {};

    return (
        <Icon
            raised
            reverse
            type='material'
            color={theme || '#007aff'}
            size={18}
            style={localControlStyles}
            {...props}
        />
    )
}

export default LocalBtnTemplate;