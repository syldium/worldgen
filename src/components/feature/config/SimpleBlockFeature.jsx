import { BlockState, BlocksList } from '../../state/BlockState';
import React, { useCallback } from 'react';

export function SimpleBlockFeature({ configuration, onChange }) {

    const handleToPlaceChange = useCallback(function (to_place) {
        onChange({ ...configuration, to_place });
    }, [configuration, onChange]);
    const handlePlaceOnChange = useCallback(function (place_on) {
        onChange({ ...configuration, place_on });
    }, [configuration, onChange]);
    const handlePlaceInChange = useCallback(function (place_in) {
        onChange({ ...configuration, place_in });
    }, [configuration, onChange]);
    const handlePlaceUnderChange = useCallback(function (place_under) {
        onChange({ ...configuration, place_under });
    }, [configuration, onChange]);

    return <div>
        <fieldset>
            <legend>To place</legend>
            <BlockState block={configuration.to_place} className="" inputId="to_place" onChange={handleToPlaceChange} />
        </fieldset>
        <fieldset>
            <legend>Placement</legend>
            <fieldset>
                <legend>Place on</legend>
                <BlocksList list={configuration.place_on} className="" inputId="place_on" onChange={handlePlaceOnChange} />
            </fieldset>
            <fieldset>
                <legend>Place in</legend>
                <BlocksList list={configuration.place_in} className="" inputId="place_in" onChange={handlePlaceInChange} />
            </fieldset>
            <fieldset>
                <legend>Place under</legend>
                <BlocksList list={configuration.place_under} className="" inputId="place_under" onChange={handlePlaceUnderChange} />
            </fieldset>
        </fieldset>
    </div>
}
