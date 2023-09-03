exports.get404Page = (req, res) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
    path: "/404", // user need to beauth to access
    isAuthenticated: req.session.isLoggedIn,
  });
};
exports.get500Page = (req, res) => {
  res.status(500).render("500", {
    pageTitle: "Erreur!",
    path: "/500", // user need to beauth to access
    isAuthenticated: req.session.isLoggedIn,
  });
};
