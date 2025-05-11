import React, { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(({ options = [], icon = 'user', placeholder = '', name, id, value, className, required, isFocused, handleChange }, ref) => {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, [isFocused]);

    return (
        <div className='input-group mb-3'>
            <span className='input-group-text'>
                <i className={'fa-solid ' + icon}></i>
            </span>
            <select 
                name={name} 
                id={id} 
                value={value} 
                className={className} 
                ref={input} 
                required={required} 
                onChange={handleChange}
            >
                <option value=''>{placeholder}</option>
                {options.map((op) => (
                    <option value={op.value} key={op.value}>{op.label}</option>
                ))}
            </select>
        </div>
    );
});
