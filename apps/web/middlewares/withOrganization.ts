import type { MiddlewareFactory } from "@/middlewares/types";
import type { NextRequest } from "next/server";
import {
  NextResponse,
  type NextFetchEvent,
  type NextMiddleware,
} from "next/server";
import { fallbackLng, cookieName as lngCookieName } from "@/i18n/settings";
import { getToken } from "next-auth/jwt";
import { refreshAccessToken } from "@/app/api/auth/[...nextauth]/options";

export const USERS_API_BASE_URL = new URL(
  "api/v1/users",
  process.env.NEXT_PUBLIC_ACCOUNTS_API_URL,
).href;
const protectedPaths = ["/home", "/projects", "datasets", "/settings", "/map"];

export const withOrganization: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const { pathname, origin, basePath } = request.nextUrl;

    const lng = request.cookies.get(lngCookieName)?.value;
    const lngPath = lng ? `/${lng}` : fallbackLng ? `/${fallbackLng}` : "";
    const organizationPageCreate = `${lngPath}/onboarding/organization/create`;
    const _protectedPaths = protectedPaths.map((p) =>
      lngPath ? `${lngPath}${p}` : p,
    );

    if (!_protectedPaths.some((p) => pathname.startsWith(p)))
      return await next(request, _next);

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) return await next(request, _next);
    try {
      const refreshedToken = await refreshAccessToken(token);
      const checkOrganization = await fetch(
        `${USERS_API_BASE_URL}/organization`,
        {
          headers: {
            Authorization: `Bearer ${refreshedToken.access_token}`,
          },
        },
      );
      if (checkOrganization.ok) {
        const organization = await checkOrganization.json();
        if (organization?.id) {
          const response = (await next(request, _next)) as NextResponse;
          response.cookies.set("organization", organization.id);
          return response;
        }
      }
    } catch (error) {
      console.error("Error while fetching organization", error);
    }

    const organizationUrl = new URL(`${basePath}${organizationPageCreate}`, origin);

    return NextResponse.redirect(organizationUrl);
  };
};
