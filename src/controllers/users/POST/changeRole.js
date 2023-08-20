import UserModel from "../../../dao/models/user.model.js";

export const changeRole = async (req, res) => {
  const { newRole } = req.body;

  try {
    const user = await UserModel.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = newRole;
    await user.save();

    res.redirect("/api/users");
  } catch (error) {
    console.error(error);
    res.render("errors/500");
  }
};
