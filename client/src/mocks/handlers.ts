import { rest } from "msw";

export const handlers = [
  rest.post("account", async (req, res, ctx) => {
    const { email, password } = await req.json();
    let IsAuthenticated = false;
    const responseData = {
      msg: "successful login",
      payload: {
        loginStatus: true,
        accountData: {
          _id: "1234567890",
          email: email,
        },
      },
    };

    // Mock database call to create account and check if email exists already
    if (email === "test@gmail.com" && password === "password") {
      IsAuthenticated = true;
    }

    if (IsAuthenticated) {
      return res(ctx.status(200), ctx.json(responseData));
    } else {
      return res(
        ctx.status(404),
        ctx.json({
          error: true,
          msg: "No account with that email",
        })
      );
    }
  }),
];
