import { Router } from 'express';
import { createResource, deleteResource, getResources, updateResourceProgress } from '../controllers/resource.controller';

const router = Router();

router.get('/', getResources);
router.post('/', createResource);
router.put('/:id/progress', updateResourceProgress);
router.delete('/:id', deleteResource);

export default router;
