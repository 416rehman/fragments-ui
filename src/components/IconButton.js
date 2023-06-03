import { styled } from '@nextui-org/react';

// IconButton component will be available as part of the core library soon
export const IconButton = styled('button', {
    dflex: 'center',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    padding: '5px',
    margin: '0',
    borderRadius: '50%',
    bg: '$primaryLight',
    transition: '$default',
    '&:hover': {
        opacity: '0.8'
    },
    '&:active': {
        opacity: '0.6'
    }
});
