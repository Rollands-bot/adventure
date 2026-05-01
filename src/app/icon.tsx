import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  const logo = readFileSync(join(process.cwd(), "public", "logo.png"));
  const dataUrl = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          overflow: "hidden",
          background: "#ffffff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
        <img
          src={dataUrl}
          width={64}
          height={64}
          style={{ objectFit: "cover", borderRadius: "50%" }}
        />
      </div>
    ),
    { ...size },
  );
}
