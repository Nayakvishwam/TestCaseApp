export function UnorderedList({ className, style, children }) {
    return <ul className={className} style={style}>{children}</ul>;
  }
  
  export function OrderedList({ className, style, children }) {
    return <ol className={className} style={style}>{children}</ol>;
  }
  
  export function ListItem({ className, style, children }) {
    return <li className={className} style={style}>{children}</li>;
  }
  