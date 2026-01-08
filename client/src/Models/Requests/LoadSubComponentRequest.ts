import { loadedComponentType, loadedSubComponentType} from '../../Helpers/types';
export interface loadedSubComponentRequest {
    parent: loadedComponentType,
    child: loadedSubComponentType
}