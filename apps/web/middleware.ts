import { stackMiddlewares } from "@/middlewares/stackMiddlewares";
import { withLanguages } from "@/middlewares/withLanguages";
import { withAuth } from "@/middlewares/withAuth";
import { withOrganization } from "@/middlewares/withOrganization";

export default stackMiddlewares([withLanguages, withAuth, withOrganization]);
