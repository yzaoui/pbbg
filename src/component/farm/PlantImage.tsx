import React from "react";
import "./PlantImage.scss";

type Props = {
    src: string;
    spriteIndex: number;
    alt: string;
};

const PlantImage: React.FC<Props> = ({ src, spriteIndex, alt }) => <img
    className="PlantImage"
    src={src}
    style={{ ["--sprite-index" as any]: spriteIndex }}
    alt={alt}
/>;

export default PlantImage;
