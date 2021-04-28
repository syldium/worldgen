import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '../ui/Button';
import { DataContext } from '../context/DataContext';
import { useKeyedListOptions } from '../hooks/context';
import { useToggle } from '../hooks/ui';
import Select from '../ui/Select';

export function NamespacedKey({ children, example = 'daily_resource', type, value = '', expectBreakage = false, inline = true, mayReplaceVanilla = true, defaultReplace = false, onChange, onSelect, onSelectLoad }) {
    // To trigger form submit
    const hidden = useRef(null);

    // Final namespaced key
    const [key, setKey] = useState(value);
    const [fill, toggleFill] = useToggle(true);
    const [mayFill, setMayFill] = useToggle(value !== '');

    const options = useKeyedListOptions(type, false, !mayReplaceVanilla);

    const context = useContext(DataContext);
    const defaultNamespace = context.namespace;
    const [replace, toggle] = useToggle(value === '' ? defaultReplace : options.some(o => key === o.value));

    // Adjust value with default namespace if needed
    const handleKeyChange = useCallback(function (e) {
        const value = e.target.value.toLowerCase();
        if (value.includes(':')) {
            setKey(value);
        } else {
            setKey(defaultNamespace + ':' + value);
        }
    }, [defaultNamespace, setKey]);

    const handleReplaceTargetChange = useCallback((selected) => {
        const key = selected.value;
        setKey(key);
        setMayFill(true);
        if (typeof onSelect === 'function') {
            onSelect(key);
        }
        if (fill && typeof onSelectLoad === 'function') {
            context.vanilla.getVanillaResource(type, key)
                .then(onSelectLoad)
                .then(setMayFill)
                .catch(console.error);
        }
    }, [context.vanilla, fill, onSelect, onSelectLoad, setKey, setMayFill, type]);

    // Fire onChange
    useEffect(function() {
        if (typeof onChange === 'function' && key !== value) {
            onChange(key);
        }
    }, [key, onChange, value]);

    // Allow form submit by pressing enter
    const handleKeyDown = useCallback(function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const form = hidden.current.form;
            if (form !== null && form.checkValidity()) {
                form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            }
        }
    }, []);

    // Remove the "minecraft:" part when changing mode
    const handleToggle = useCallback(function (e) {
        if (replace && key.startsWith('minecraft:')) {
            setKey(key => defaultNamespace + ':' + key.split(':')[1]);
        }
        toggle(e);
    }, [defaultNamespace, key, setKey, replace, toggle]);

    const handleFillToggle = useCallback(function (e) {
        if (e.target.checked && mayFill && typeof onSelectLoad === 'function') {
            context.vanilla.getVanillaResource(type, key)
                .then(onSelectLoad)
                .then(setMayFill)
                .catch(console.error);
        }
        toggleFill(e);
    }, [context.vanilla, key, mayFill, onSelectLoad, setMayFill, toggleFill, type]);

    // Displayed input value - trim namespace if default
    const inputValue = useMemo(function () {
        if (key.startsWith(defaultNamespace + ':')) {
            return key.split(':')[1];
        }
        return key;
    }, [defaultNamespace, key]);

    // Hidden input value - set to empty when nothing is selected (keeps the key from text mode)
    const hiddenInputValue = useMemo(function () {
        if (replace && !options.some(o => o.value === key)) {
            return '';
        }
        return key;
    }, [key, options, replace]);

    // Adapt select width to its content
    const style = useMemo(function () {
        let width = 8 * Math.max.apply(Math, options.map(o => o.label.length)) + 60;
        if (!isFinite(width)) {
            width = '250px';
        }
        return { width };
    }, [options]);

    return <>
        {typeof children !== 'undefined' && <h3>{(typeof value === 'undefined' || value === '') ? 'Create new ' : 'Edit '}{children}</h3>}
        <div className="form-group">
            <label htmlFor="key">{replace ? 'Replace' : 'Key'}</label> :&nbsp;
            {replace && <div className="inbl" style={style}>
                <Select options={options} value={options.find(o => key === o.value)} onChange={handleReplaceTargetChange} inputId="key" />
            </div>}
            {!replace &&
                <input type="text" id="key" required pattern="^([\w.-]+:[\w/.-]+)$|^[\w/.-]+$" placeholder={`Example: ${example}`}
                    autoCapitalize="none" spellCheck="false" autoComplete="off" value={inputValue}
                    onChange={handleKeyChange} onKeyPress={handleKeyDown} />
            }
            <input type={replace ? 'text' : 'hidden'} name="key" value={hiddenInputValue} onChange={console.log} ref={hidden}
                required tabIndex="-1" style={{ opacity: 0, height: 0, position: 'absolute' }} />
            {mayReplaceVanilla && <Button cat="info mlm" onClick={handleToggle}>{replace ? 'Create a new one' : 'Replace vanilla'}</Button>}
            {!inline && <br />}{replace && <><input type="checkbox" className="checkbox mls" id="fill-values" checked={fill} onChange={handleFillToggle} /> Fill with values</>}
        
            {expectBreakage && value !== key && !key.startsWith('minecraft:') &&
                <p className="alert--warning">Warning: changing the name of a resource may break other resources that depend on it.</p>
            }
            {!mayReplaceVanilla && !replace && key.startsWith('minecraft:') &&
                <p className="alert--warning">Warning: datapacks cannot currently replace vanilla {type}.</p>
            }
        </div>
    </>;
}