export type addEditUserModeType = 'add' | 'update';
export type userType = undefined | 'active' | 'inactive';
export type adminSliceStatus = 'unset' | 'idle' | 'deleted' | 'loading' | 'deleting' | 'failed' | 'restoring' | 'restored' | 'updating' | 'updated' | 'adding' | 'added';
export type loadSliceStatus = 'idle' | 'loading' | 'loaded' | 'failed';
export type receiptSliceStatus = 'idle' | 'loading' | 'loaded' | 'failed';
export type loadType = 'inbound' | 'outbound';
export type sliceStatus = 'unset' | 'idle' | 'loading' | 'failed' | 'loggedIn' | 'loggedOut' | 'loggedOutForInviteComplete';
export type stripeStatus = 'unset' | 'idle' | 'loading' | 'failed' | 'subscriptionCanceled';
export type companyStatus = 'unset' | 'idle' | 'loading' | 'failed' | 'loadingMembers' | 'companyLoaded' | 
    'outreachSaved' | 'publicCompanyLoaded' |  'loadingSuccessStories'; 
export type settingsStatus = 'unset' | 'idle' | 'loading' | 'failed' | 'loadingComponent' | 'heartbeat' | 'userSettingsLoaded' | 'companySwitched'; 
export type requestStatus = 'unset' | 'idle' | 'loading' | 'failed';
export type loadedComponentType = 'work' | 'actions' | 'data' | 'stories' | 'meetings' | 'settings' | 'lists' | 'scripts' | '';
export type loadedSubComponentType = 'scorecards' | 'dashboards' | 'reports' | 
    'daily' | 'weekly' | 'monthly' | 'quarterly' | 'customer' |
    'product' | 'cross_selling' | 'company' | 'teams' | 'users' | 'delivery' | 
    'actions' | '';
export type Role = 'owner' | 'admin' | 'advisor' | 'member' | 'manager';
export const isUserType = (type: Role) => {
    const userTypes = ['owner', 'admin', 'advisor', 'manager', 'member', 'observer'];
    return type === undefined || userTypes.includes(type.toLowerCase());
}

