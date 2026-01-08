
export interface PopupContextParam {
    _id: string;
    event: React.MouseEvent<HTMLDivElement> | React.MouseEvent<HTMLAnchorElement> | undefined;
    closeHandler: (e: React.MouseEvent<HTMLDivElement>) => void;
    buttonClass: string;
    buttonText: string;
    message: string;
    headingText: string;
    backButton: boolean;
    buttonHandler?: (e: React.MouseEvent<HTMLDivElement>) => void;
    buttonHandlerWithId?: (e: React.MouseEvent<HTMLDivElement>, id: string) => void;
}