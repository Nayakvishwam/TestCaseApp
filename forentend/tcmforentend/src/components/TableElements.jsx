export function Table({ className, style, children, props }) {
    return <table className={className} style={style} {...props}>{children}</table>;
}

export function TableHead({ className, style, children, props }) {
    return <thead className={className} style={style} {...props}>{children}</thead>;
}

export function TableBody({ className, style, children, props }) {
    return <tbody className={className} style={style} {...props}>{children}</tbody>;
}

export function TableRow({ className, style, children, props }) {
    return <tr className={className} style={style} {...props}>{children}</tr>;
}

export function TableCell({ className, style, children, props }) {
    return <td className={className} style={style} {...props}>{children}</td>;
}

export function TableHeaderCell({ className, style, children, props }) {
    return <th className={className} style={style} {...props}>{children}</th>;
}
