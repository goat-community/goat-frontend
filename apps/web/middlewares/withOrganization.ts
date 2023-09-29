import type { MiddlewareFactory } from "@/middlewares/types";
import type { NextRequest } from "next/server";
import {
  NextResponse,
  type NextFetchEvent,
  type NextMiddleware,
} from "next/server";
import { fallbackLng, cookieName as lngCookieName } from "@/app/i18/settings";
import { USERS_API_BASE_URL } from "@/lib/api/users";
import { getToken } from "next-auth/jwt";
import { refreshAccessToken } from "@/app/api/auth/[...nextauth]/options";

const protectedPaths = ["/home", "/projects", "datasets", "/settings", "/map"];

export const withOrganization: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const { pathname, origin, basePath } = request.nextUrl;

    const lng = request.cookies.get(lngCookieName)?.value;
    const lngPath = lng ? `/${lng}` : fallbackLng ? `/${fallbackLng}` : "";
    const organizationPage = `${lngPath}/onboarding/organization/`;
    const _protectedPaths = protectedPaths.map((p) =>
      lngPath ? `${lngPath}${p}` : p,
    );

    if (!_protectedPaths.some((p) => pathname.startsWith(p)))
      return await next(request, _next);

    const hasOrganization = !!request.cookies.get("organization");
    if (hasOrganization || !process.env.NEXT_PUBLIC_ACCOUNTS_API_URL)
      return await next(request, _next);

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!token) return await next(request, _next);
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

    const organizationUrl = new URL(`${basePath}${organizationPage}`, origin);

    return NextResponse.redirect(organizationUrl);
  };
};
