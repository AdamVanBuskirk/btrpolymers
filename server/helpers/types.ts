
export type loadedComponentType = 'global_herdr' | 'global_maps' | 'global_work' | 'global_action' | 
    'dashboard' | 'roadmap' | 'members' | 'action' | 'work' | 'chat' | '';
export type loadedSubComponentType = 'calendar' | 'board' | 'list' | 'settings' | 'generate' | 'roadmap' | 'dashboard' | 'members' | undefined;
export type Role = 'owner' | 'admin' | 'advisor' | 'member' | 'observer';
export const isUserType = (type: Role) => {
    const userTypes = ['owner', 'admin', 'advisor', 'manager', 'member', 'observer'];
    return type === undefined || userTypes.includes(type.toLowerCase());
}



