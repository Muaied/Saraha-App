import { Router } from 'express'
import { login, signup } from './authentication.service.js';
import { successResponse } from '../../common/utils/response.utils.js';
import { asyncHandler } from '../../middleware/error.middleware.js';

const router = Router()

router.post('/signup', asyncHandler(async (req, res, next) => {
        const account = await signup(req.body);
        return successResponse({ res, status: 201, data: account })
}))

router.post('/login', asyncHandler(async (req, res, next) => {
        const account = await login(req.body);
        return successResponse({ res, data: account })
}))

export default router;