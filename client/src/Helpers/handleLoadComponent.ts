
import { loadComponent, savePreviousComponent } from '../Store/Settings';
import { loadedComponentType, loadedSubComponentType } from '../Helpers/types';
import { Settings } from '../Models/Settings';

export const handleLoadComponent = (dispatch: any, type: loadedComponentType, settings?: Settings) => {
    if (settings) {
        dispatch(savePreviousComponent({
            type: settings.loadedComponentType
        }));
    }
    dispatch(loadComponent({
        type: type
    }));
}