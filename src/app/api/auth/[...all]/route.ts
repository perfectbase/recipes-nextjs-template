import { auth } from "@/lib/auth/server";
import { toNextJsHandler } from "better-auth/next-js";

const { GET, POST } = toNextJsHandler(auth.handler);

export { GET, POST }; 
