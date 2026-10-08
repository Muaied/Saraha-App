import { Router } from 'express'
import { login, signup, confirmEmail, resendConfirmEmail, requestForgotPasswordCode, verifyForgotPasswordCode, resetForgotPassword } from './authentication.service.js';
import { successResponse } from '../../common/utils/response.utils.js';
import * as validators from './authentication.validation.js'
import { validation } from '../../middleware/validation.middleware.js';

const router = Router()

router.post('/signup', validation(validators.signup), async (req, res, next) => {
        const account = await signup(req.body);
        return successResponse({ res, status: 201, data: account })
})

router.post('/request-forgot-password-code', validation(validators.resendConfirmEmail), async (req, res, next) => {
        const account = await requestForgotPasswordCode(req.body);
        return successResponse({ res, status: 201, data: account })
})

router.post('/verify-forgot-password', validation(validators.confirmEmail), async (req, res, next) => {
        const account = await verifyForgotPasswordCode(req.body);
        return successResponse({ res, status: 200, data: account })
})
router.patch('/reset-forgot-password', validation(validators.resetForgotPassword), async (req, res, next) => {
        const account = await resetForgotPassword(req.body);
        return successResponse({ res, status: 200, data: account })
})
router.patch('/confirm-email', validation(validators.confirmEmail), async (req, res, next) => {
        const account = await confirmEmail(req.body);
        return successResponse({ res, status: 200, data: account })
})
router.patch('/resend-confirm-email', validation(validators.resendConfirmEmail), async (req, res, next) => {
        const account = await resendConfirmEmail(req.body);
        return successResponse({ res, status: 200, data: account })
})
router.post('/login', validation(validators.login), async (req, res, next) => {

        const account = await login(req.validate.body, `${req.protocol}://${req.host}`);
        return successResponse({ res, data: account })
})

export default router;