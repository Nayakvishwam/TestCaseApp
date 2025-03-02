export function Link({ href, className, style, children, props }) {
    return <a href={href} className={className} {...props} style={style}>{children}</a>;
}

export function Details({ className, style, children }) {
    return <details className={className} style={style}>{children}</details>;
}

export function Summary({ className, style, children }) {
    return <summary className={className} style={style}>{children}</summary>;
}