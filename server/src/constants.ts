export const IS_PRODUCTION = process.env.NODE_ENV === "production";

export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: IS_PRODUCTION,
    // sameSite: "strict",
    // maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days //deprecated
    // signed: true
}

export const ROLES = {
    ADMIN: "admin",
    LENDER: "lender",
    COLLECTOR: "collector"
  } as const;
  
