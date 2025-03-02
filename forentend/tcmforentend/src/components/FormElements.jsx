export function Input({ type = "text", className, style, props }) {
    return <input type={type} className={className} style={style} {...props} />;
}

export function Textarea({ className, style, props }) {
    return <textarea className={className} style={style} {...props} />;
}
export function Form({ onSubmit, className, style, children }) {
    return (
        <form className={className} style={style} onSubmit={onSubmit}>
            {children}
        </form>
    );
}

export function Button({ className, style, children, props }) {
    return <button className={className} style={style} {...props}>{children}</button>;
}

export function Label({ htmlFor, className, style, children }) {
    return <label htmlFor={htmlFor} className={className} style={style}>{children}</label>;
}

export function Select({ className, style, children, props }) {
    return <select className={className} style={style} {...props}>{children}</select>;
}

export function Option({ value, className, style, children, props }) {
    return <option value={value} className={className} {...props} style={style}>{children}</option>;
}
