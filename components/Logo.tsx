import Image from "next/image";

/** Aexon logo: white wordmark on the dark theme, dark wordmark on the light theme. */
export default function Logo({ priority = false }: { priority?: boolean }) {
  return (
    <>
      <Image
        src="/aexon-logo.png"
        alt="Aexon Healthcare"
        width={515}
        height={152}
        priority={priority}
        className="logo-for-dark"
      />
      <Image
        src="/aexon-logo-dark.png"
        alt="Aexon Healthcare"
        width={515}
        height={152}
        priority={priority}
        className="logo-for-light"
      />
    </>
  );
}
