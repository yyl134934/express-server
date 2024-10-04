const { Router } = require("express");
const passport = require("passport");

const router = Router();

router.post("/api/auth", passport.authenticate("local"), (req, res) => {
  res.sendStatus(200);
});

router.get("/api/auth/status", (request, response) => {
  return request.user ? response.send(request.user) : response.sendStatus(401);
});

router.post("/api/auth/logout", (request, response) => {
  if (!request.user) return response.sendStatus(401);
  request.logout((err) => {
    if (err) return response.sendStatus(400);
    response.send(200);
  });
});

module.exports = router;
