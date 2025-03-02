export function Image({ src, alt, className, style, props }) {
    return <img src={src} alt={alt} className={className} style={style} {...props} />;
  }
  
  export function Video({ src, className, style, ...props }) {
    return <video src={src} className={className} style={style} controls {...props} />;
  }
  
  export function Audio({ src, className, style, ...props }) {
    return <audio src={src} className={className} style={style} controls {...props} />;
  }
  