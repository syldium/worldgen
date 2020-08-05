import { useMemo } from "react";

/**
 * @typedef RESOURCE_OPTION
 * @type {object}
 * @property {string} value Unique option value 
 * @property {string} label Text label 
 * @property {string|object} resource
 */

/**
 * 
 * @param {{ value: string, label: string }[]} options 
 * @param {string|object[]} [resources] 
 * @param {boolean} [mutable] 
 * @returns {[RESOURCE_OPTION[], RESOURCE_OPTION[]]} Options and selected options
 */
export function useInlineResources(options, resources = [], mutable = true) {
    const inline = getInline(resources);

    let values = options.map(option => {
        if (mutable) {
            option.resource = option.value;
            return option;
        }
        return { ...option, resource: option.value };
    });
    if (inline.length > 0) {
        if (mutable) {
            values.push(...inline);
        } else {
            values = [ ...options, ...inline ];
        }
    }
    return [
        values,
        useMemo(() => values.filter(o => resources.includes(o.resource)), [resources, values])
    ];
}

/**
 * @param {string|object[]} resources 
 * @returns {RESOURCE_OPTION[]}
 */
function getInline(resources) {
    return resources
        .filter(res => typeof res === 'object')
        .map((res, i) => {
            const inline = 'inline' + (i+1);
            return {
                value: inline,
                label: inline,
                resource: res
            }
        });
}
