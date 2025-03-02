export function Heading({ level = 1, className, style, children }) {
    const Tag = `h${level}`;
    return <Tag className={className} style={style}>{children}</Tag>;
}

export function Paragraph({ className, style, children }) {
    return <p className={className} style={style}>{children}</p>;
}

export function Span({ className, style, children }) {
    return <span className={className} style={style}>{children}</span>;
}

export function Bold({ className, style, children }) {
    return <strong className={className} style={style}>{children}</strong>;
}

export function Italic({ className, style, children }) {
    return <em className={className} style={style}>{children}</em>;
}
export function Icon({ className, style, children,props }) {
    return <i className={className} style={style} {...props}>{children}</i>;
}

export function LineBreak() {
    return <br />;
}
