import { stackMiddlewares } from "@/middlewares/stackMiddlewares";
import { withAuth } from "@/middlewares/withAuth";
import { withLanguages } from "@/middlewares/withLanguages";

export default stackMiddlewares([withLanguages, withAuth]);