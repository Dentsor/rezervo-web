import { TAuthConfig } from "react-oauth2-code-pkce/dist/types";

import { requireServerEnv } from "@/lib/helpers/env";

export const GET = () => {
    return Response.json({
        clientId: requireServerEnv("FUSIONAUTH_CLIENT_ID"),
        authorizationEndpoint: `${requireServerEnv("FUSIONAUTH_URL")}/oauth2/authorize`,
        logoutEndpoint: `${requireServerEnv("FUSIONAUTH_URL")}/oauth2/logout`,
        logoutRedirect: requireServerEnv("HOST"),
        redirectUri: requireServerEnv("HOST"),
        // TODO: retrieve from FusionAuth
        refreshTokenExpiresIn: Number(requireServerEnv("FUSIONAUTH_REFRESH_TOKEN_EXPIRES_IN_SECONDS")),
    } satisfies Partial<TAuthConfig>);
};
