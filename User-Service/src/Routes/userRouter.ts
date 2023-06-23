import {
  deleteUser,
  fetchCurrentUser,
  findAllUsers,
  findUserById,
  findUserByMail,
  getUsersByIds,
  registerUser,
  resetKeyIsValid,
  resetPasswordForm,
  searchUser,
  updateGoogleUser,
  updateUser,
  updateUserPassword,
} from "../Controllers/userController.js"
import { Router } from "express"
import multer from "multer"
//Configure multer to store the image as a Buffer Object in memory so we can send it to the Media-Service
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
})

const userRouter = Router()
  .get("/one", findUserById)
  .get("/oneByMail", findUserByMail)
  .get("/all", findAllUsers)
  .post("/register", upload.single("image"), registerUser)
  .put("/update", updateUser)
  .put("/resetPassword", resetPasswordForm)
  .post("/resetKeyExist", resetKeyIsValid)
  .put("/updatePassword", updateUserPassword)
  .delete("/delete", deleteUser)
  .put("/updateGoogleUser", updateGoogleUser)
  .post("/getUsersByIds", getUsersByIds)
  .get("/currentUser", fetchCurrentUser)
  .get("/search", searchUser)

export default userRouter
