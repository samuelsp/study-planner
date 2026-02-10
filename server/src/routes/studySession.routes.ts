import { Router } from 'express';
import { createSession, deleteSession, getSessions, updateSession, updateSessionStatus } from '../controllers/studySession.controller';

const router = Router();

router.get('/', getSessions);
router.post('/', createSession);
router.put('/:id', updateSession);
router.patch('/:id/status', updateSessionStatus);
router.delete('/:id', deleteSession);

export default router;
