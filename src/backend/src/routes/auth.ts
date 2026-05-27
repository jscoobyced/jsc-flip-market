import { Router } from "express";

import {
  createUser,
  findUserByEmailWithPassword,
} from "../repositories/userRepository";
import { asyncHandler } from "../utils/asyncHandler";
import { comparePassword, hashPassword } from "../utils/password";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "../validators/auth";
import { AppError } from "../utils/errors";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { authRateLimiter } from "../middleware/rateLimit";

const router = Router();

const issueTokens = (user: {
  id: string;
  email: string;
  userType: "FLIPPER" | "OWNER";
}) => ({
  accessToken: signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.userType,
  }),
  refreshToken: signRefreshToken({
    sub: user.id,
    email: user.email,
    role: user.userType,
  }),
});

router.post(
  "/register",
  authRateLimiter,
  asyncHandler(async (request, response) => {
    const payload = registerSchema.parse(request.body);
    const existing = await findUserByEmailWithPassword(payload.email);

    if (existing) {
      throw new AppError("Email is already registered", 409, "EMAIL_TAKEN");
    }

    const passwordHash = await hashPassword(payload.password);
    const user = await createUser({
      email: payload.email,
      passwordHash,
      name: payload.name,
      phone: payload.phone,
      userType: payload.userType,
      profilePicture: payload.profilePicture,
      bio: payload.bio,
      specializations: payload.specializations,
      portfolioProjects: payload.portfolioProjects,
      companyName: payload.companyName,
      taxId: payload.taxId,
    });

    response.status(201).json({
      user,
      tokens: issueTokens(user),
    });
  }),
);

router.post(
  "/login",
  authRateLimiter,
  asyncHandler(async (request, response) => {
    const payload = loginSchema.parse(request.body);
    const user = await findUserByEmailWithPassword(payload.email);

    if (!user) {
      throw new AppError(
        "Invalid email or password",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    const passwordValid = await comparePassword(
      payload.password,
      user.passwordHash,
    );
    if (!passwordValid) {
      throw new AppError(
        "Invalid email or password",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    response.json({
      user,
      tokens: issueTokens(user),
    });
  }),
);

router.post(
  "/refresh-token",
  authRateLimiter,
  asyncHandler(async (request, response) => {
    const payload = refreshTokenSchema.parse(request.body);
    const tokenPayload = verifyRefreshToken(payload.refreshToken);
    response.json({
      tokens: {
        accessToken: signAccessToken({
          sub: tokenPayload.sub,
          email: tokenPayload.email,
          role: tokenPayload.role,
        }),
        refreshToken: signRefreshToken({
          sub: tokenPayload.sub,
          email: tokenPayload.email,
          role: tokenPayload.role,
        }),
      },
    });
  }),
);

export { router as authRouter };
