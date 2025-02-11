import { useContent } from "@ibrahimstudio/react";

const Img = ({ className, style, alt = "", src = "/img/fallback.jpg", onClick }) => {
  const { toPathname } = useContent();
  const compid = alt ? toPathname(alt) : "";
  return <img id={compid} className={className} style={style} alt={alt} loading="lazy" src={src} onClick={onClick} />;
};

export default Img;
