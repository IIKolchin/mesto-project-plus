import { Router } from 'express';
import { getUserByIdValidate, updateAvatarValidate, updateUserValidate } from '../validation/users';
import {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUserByIdValidate, getUserById);
router.patch('/me', updateUserValidate, updateUser);
router.patch('/me/avatar', updateAvatarValidate, updateAvatar);

export default router;
