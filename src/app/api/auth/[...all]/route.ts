import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth/server";

const { GET, POST } = toNextJsHandler(auth.handler);

export { GET, POST };
