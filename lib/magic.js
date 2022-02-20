import { Magic } from "magic-sdk";

const magic =
  typeof window !== "undefined" &&
  new Magic(process.env.NEXT_PUBLIC_MAGIC_PK || "a");

export default magic;
