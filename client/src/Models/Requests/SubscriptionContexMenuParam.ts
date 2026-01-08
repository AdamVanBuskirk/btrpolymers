
export interface SubscriptionContextMenuParam {
    id: string;
    event?: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement> | React.MouseEvent<HTMLDivElement> 
    closeHandler: () => void;
    changingSubscription?: boolean;
}