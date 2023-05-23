import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import User from "../models/User";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/dotenv";

const handleRefreshToken = async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401); // Unauthorized

  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });
  const foundUser = await User.findOne({ refreshToken }).exec();

  // Detected refreshToken reuse!
  if (!foundUser) {
    try {
      console.log("refreshToken reuse!");
      const decoded: any = jwt.verify(
        refreshToken,
        REFRESH_TOKEN_SECRET as Secret
      );
      const hackedUser = await User.findOne({
        username: decoded.username,
      }).exec();
      if (hackedUser) {
        hackedUser.refreshToken = [];
        const result = await hackedUser.save();
        console.log(result);
      }
    } catch (err) {
      return res.sendStatus(403); // Forbidden
    }
    return res.sendStatus(403); // Forbidden
  }

  // If the user was found, we create a new array without that refreshToken already used
  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt: string) => rt !== refreshToken
  );

  // Evaluate jwt
  try {
    const decoded: any = jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET as Secret
    );
    if (foundUser.username !== decoded.username) throw new Error();

    // RefreshToken was still valid
    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        userInfo: {
          username: decoded.username,
          roles: roles,
        },
      },
      ACCESS_TOKEN_SECRET as Secret,
      { expiresIn: "30s" } // Production expiresIn 5-15 min
    );

    const newRefreshToken = jwt.sign(
      { username: foundUser.username },
      REFRESH_TOKEN_SECRET as Secret,
      { expiresIn: "1d" }
    );

    // Saving the new refreshToken in the array
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    await foundUser.save();

    // Send the refreshToken and save as a cookie in the browser
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Send tokens to the frontEnd developer.
    res.json({ accessToken });
  } catch (err) {
    console.log("expired refreshToken");
    // For any errors, we update the refresh tokens array with the new array created without that refreshToken used
    foundUser.refreshToken = [...newRefreshTokenArray];
    const result = await foundUser.save();
    console.log(result);
    res.sendStatus(403); // Forbidden
  }
};

export default handleRefreshToken;

// const handleRefreshToken = async (req, res) => {
//   const cookies = req.cookies;
//   if (!cookies?.jwt) return res.sendStatus(401);
//   const refreshToken = cookies.jwt;
//   res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

//   const foundUser = await User.findOne({ refreshToken }).exec();

//   // Detected refresh token reuse!
//   if (!foundUser) {
//     jwt.verify(
//       refreshToken,
//       process.env.REFRESH_TOKEN_SECRET,
//       async (err, decoded) => {
//         if (err) return res.sendStatus(403); //Forbidden
//         console.log("refresh token reuse!");
//         const hackedUser = await User.findOne({
//           username: decoded.username,
//         }).exec();
//         hackedUser.refreshToken = [];
//         const result = await hackedUser.save();
//         console.log(result);
//       }
//     );
//     return res.sendStatus(403); //Forbidden
//   }

//   const newRefreshTokenArray = foundUser.refreshToken.filter(
//     (rt) => rt !== refreshToken
//   );

//   // evaluate jwt
//   jwt.verify(
//     refreshToken,
//     process.env.REFRESH_TOKEN_SECRET,
//     async (err, decoded) => {
//       if (err) {
//         console.log("expired refresh token");
//         foundUser.refreshToken = [...newRefreshTokenArray];
//         const result = await foundUser.save();
//         console.log(result);
//       }
//       if (err || foundUser.username !== decoded.username)
//         return res.sendStatus(403);

//       // Refresh token was still valid
//       const roles = Object.values(foundUser.roles);
//       const accessToken = jwt.sign(
//         {
//           UserInfo: {
//             username: decoded.username,
//             roles: roles,
//           },
//         },
//         process.env.ACCESS_TOKEN_SECRET,
//         { expiresIn: "10s" }
//       );

//       const newRefreshToken = jwt.sign(
//         { username: foundUser.username },
//         process.env.REFRESH_TOKEN_SECRET,
//         { expiresIn: "1d" }
//       );
//       // Saving refreshToken with current user
//       foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
//       const result = await foundUser.save();
//       console.log(result);

//       // Creates Secure Cookie with refresh token
//       res.cookie("jwt", newRefreshToken, {
//         httpOnly: true,
//         secure: true,
//         sameSite: "None",
//         maxAge: 24 * 60 * 60 * 1000,
//       });

//       res.json({ accessToken });
//     }
//   );
// };

// export default handleRefreshToken;
