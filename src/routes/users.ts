import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', updateUser);
router.get('/me', getCurrentUser);
router.patch('/me/avatar', updateAvatar);

export default router;
