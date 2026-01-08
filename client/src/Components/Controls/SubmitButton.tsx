interface Props {
    text: string,
    className: string;
    visibility: boolean;
}

function Button(props: Props) {

    const style = {
        display: (props.visibility) ? "" : "none",
    };

    return (
        <input type="submit" className={props.className} style={style} value={props.text} />
    );
}

export default Button;