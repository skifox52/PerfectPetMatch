import protect from "../middlewares/protect.js"
import {
  deleteUser,
  registerUser,
  updateUser,
} from "../Controllers/userController.js"
import { Router } from "express"

const userRouter = Router()
  .post("/register", registerUser)
  .put("/update", protect, updateUser)
  .delete("/delete", protect("role"), deleteUser)

export default userRouter
