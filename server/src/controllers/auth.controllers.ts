import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import User from "../models/User";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/dotenv";

const handleLogin = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res
      .status(400)
      .json({ message: "Username and Password are required." });
  }
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) {
    return res.sendStatus(401); // Unauthorized
  }

  // Evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles).filter(Boolean);

    // Create JWTs
    const accessToken = jwt.sign(
      {
        userInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      ACCESS_TOKEN_SECRET as Secret,
      { expiresIn: "10s" } // Production expiresIn 5-15 min
    );
    const newRefreshToken = jwt.sign(
      { username: foundUser.username },
      REFRESH_TOKEN_SECRET as Secret,
      { expiresIn: "1d" }
    );

    // If there is no jwt cookie, we keep the refreshToken array that the user already had, otherwise we filter it by removing the one that came in the cookies
    let newRefreshTokenArray = !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter((rt: string) => rt !== cookies.jwt);

    // If that cookie exists:
    if (cookies?.jwt) {
      /* 
      Scenario added here: 
          1) User logs in but never uses RT and does not logout 
          2) RT is stolen
          3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
      */
      const refreshToken = cookies.jwt;
      const foundToken = await User.findOne({ refreshToken }).exec();

      // Detected refresh token reuse!
      if (!foundToken) {
        console.log("attempted refresh token reuse at login!");
        // clear out ALL previous refresh tokens
        newRefreshTokenArray = [];
      }
      //  we send the order to delete it from the browser
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
    }

    // We update the user with the new refresh Tokens array created and the new refreshToken
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const result = await foundUser.save();
    console.log(result);

    // Send tokens to the frontEnd developer.
    // Send the refreshToken and save as a cookie in the browser
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true, // With 'httpOnly' it will only be accessible from an http request, not from a javascript, which makes it more secure
      sameSite: "none", // None: The cookie will be sent with requests made from any site, including requests from third parties.
      secure: true, // The cookie will only be sent over a secure connection (https) (Only use in production)
      maxAge: 24 * 60 * 60 * 1000, // 1d in milliseconds
    });

    // Send the accessToken
    res.json({ accessToken });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

export default handleLogin;
