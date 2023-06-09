import { Request, Response } from "express";
import User from "../models/User";

const handleLogout = async (req: Request, res: Response) => {
  // On client, also delete the accessToken
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204); // No content
  }
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
    return res.sendStatus(204); // Successful, No content
  }

  // Delete refreshToken in db. We keep the refresh tokens that were in the array minus the one used
  foundUser.refreshToken = foundUser.refreshToken.filter(
    (rt: string) => rt !== refreshToken
  );
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  res.sendStatus(204);
};

export default handleLogout;
