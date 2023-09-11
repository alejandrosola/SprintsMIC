import React from 'react';
import Label from '../Label/Label';

interface TagCategoryProps {
    text: string;
}

const TagCategory: React.FC<TagCategoryProps> = ({ text }) => {
    return (
        <div
            style={{
                backgroundColor: '#8EA2A5',
                color: 'white',
                borderRadius: '20px',
                padding: '0px 2px',
                marginLeft: "5px",
                display: 'inline-block',
                whiteSpace: 'nowrap',
            }}
        >
            <Label text={text} variant='subtitle2' />
        </div>
    );
};

export default TagCategory;
