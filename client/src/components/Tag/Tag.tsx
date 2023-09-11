import React from 'react';
import Label from '../Label/Label';

interface TagProps {
    text: string;
}

const Tag: React.FC<TagProps> = ({ text }) => {
    return (
        <div
            style={{
                backgroundColor: '#B88268',
                color: 'white',
                borderRadius: '5px',
                padding: '5px 10px',
                display: 'inline-block',
                whiteSpace: 'nowrap',
            }}
        >
            <Label text={text} variant='subtitle2' />
        </div>
    );
};

export default Tag;
