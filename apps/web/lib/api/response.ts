import type { NextApiResponse } from "next";
import { NextResponse } from "next/server";

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiSuccessResponse<T = { [key: string]: any }> {
  data: T;
}

export interface ApiErrorResponse {
  code:
    | "not_found"
    | "bad_request"
    | "internal_server_error"
    | "unauthorized"
    | "method_not_allowed"
    | "not_authenticated";
  message: string;
  details: {
    [key: string]: string | string[] | number | number[] | boolean | boolean[];
  };
}

export type CustomNextApiResponse = NextApiResponse<ApiResponse>;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const badRequestResponse = (message: string, details?: { [key: string]: string }, cors = false) =>
  NextResponse.json(
    {
      code: "bad_request",
      message,
      details: details || {},
    } as ApiErrorResponse,
    {
      status: 400,
      ...(cors && { headers: corsHeaders }),
    }
  );

const missingFieldResponse = (field: string, cors = false) =>
  badRequestResponse(
    `Missing ${field}`,
    {
      missing_field: field,
    },
    cors
  );

const methodNotAllowedResponse = (res: CustomNextApiResponse, allowedMethods: string[], cors = false) =>
  NextResponse.json(
    {
      code: "method_not_allowed",
      message: `The HTTP ${res.req?.method} method is not supported by this route.`,
      details: {
        allowed_methods: allowedMethods,
      },
    } as ApiErrorResponse,
    {
      status: 405,
      ...(cors && { headers: corsHeaders }),
    }
  );

const notFoundResponse = (resourceType: string, resourceId: string, cors = false) =>
  NextResponse.json(
    {
      code: "not_found",
      message: `${resourceType} not found`,
      details: {
        resource_id: resourceId,
        resource_type: resourceType,
      },
    } as ApiErrorResponse,
    {
      status: 404,
      ...(cors && { headers: corsHeaders }),
    }
  );

const notAuthenticatedResponse = (cors = false) =>
  NextResponse.json(
    {
      code: "not_authenticated",
      message: "Not authenticated",
      details: {
        Authorization: "Header not provided or API token is invalid",
      },
    } as ApiErrorResponse,
    {
      status: 401,
      ...(cors && { headers: corsHeaders }),
    }
  );

const successResponse = (data: object, cors = false) =>
  NextResponse.json(
    {
      data,
    } as ApiSuccessResponse<typeof data>,
    {
      status: 200,
      ...(cors && { headers: corsHeaders }),
    }
  );

const internalServerErrorResponse = (message: string, cors = false) =>
  NextResponse.json(
    {
      code: "internal_server_error",
      message,
      details: {},
    } as ApiErrorResponse,
    {
      status: 500,
      ...(cors && { headers: corsHeaders }),
    }
  );

export const responses = {
  badRequestResponse,
  internalServerErrorResponse,
  missingFieldResponse,
  methodNotAllowedResponse,
  notAuthenticatedResponse,
  notFoundResponse,
  successResponse,
};
