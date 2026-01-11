import React from "react";
import styles from "./PlantImage.module.scss";

type Props = {
    src: string;
    spriteIndex: number;
    alt: string;
};

const PlantImage: React.FC<Props> = ({ src, spriteIndex, alt }) => <img
    className={styles.PlantImage}
    src={src}
    style={{ ["--sprite-index" as any]: spriteIndex }}
    alt={alt}
/>;

export default PlantImage;
