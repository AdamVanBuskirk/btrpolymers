"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const salesAuth_1 = require("../middleware/salesAuth");
const router = (0, express_1.Router)();
const profileFields = 'id,email,first_name,last_name,role,is_active';
const userFields = `${profileFields},created_at,updated_at`;
const companyEmail = /^[^@\s]+@btrpolymers\.com$/i;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function validRole(role) {
    return role === 'employee' || role === 'admin';
}
function validName(name) {
    return (typeof name === 'string' &&
        name.trim().length > 0 &&
        name.trim().length <= 100);
}
function serverError(res, error) {
    console.error('Sales API error:', error);
    return res.status(500).json({
        message: error instanceof Error
            ? error.message
            : JSON.stringify(error) || 'Unknown server error.',
    });
}
// Resolve or activate the current user's profile.
router.get('/me', salesAuth_1.requireIdentity, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const user = req.authUser;
        const { data: existing, error } = yield salesAuth_1.salesDb
            .from('sales_users')
            .select(profileFields)
            .eq('id', user.id)
            .maybeSingle();
        if (error) {
            console.error('Sales profile lookup failed:', error);
            return serverError(res, error);
        }
        if (existing) {
            if (!existing.is_active) {
                return res.status(403).json({
                    message: 'Your sales account is inactive.',
                });
            }
            return res.json(existing);
        }
        const email = (_a = user.email) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        const verifiedGoogleIdentity = (_b = user.identities) === null || _b === void 0 ? void 0 : _b.some(identity => {
            var _a, _b, _c;
            return identity.provider === 'google' &&
                ((_a = identity.identity_data) === null || _a === void 0 ? void 0 : _a.email_verified) === true &&
                ((_c = (_b = identity.identity_data) === null || _b === void 0 ? void 0 : _b.email) === null || _c === void 0 ? void 0 : _c.toLowerCase()) === email;
        });
        if (!email ||
            !companyEmail.test(email) ||
            !user.email_confirmed_at ||
            !verifiedGoogleIdentity) {
            return res.status(403).json({
                message: 'Your account is not authorized to access the BTR Sales Platform.',
            });
        }
        const { data, error: activationError } = yield salesAuth_1.salesDb.rpc('activate_sales_user', {
            p_user_id: user.id,
            p_email: email,
        });
        if (activationError) {
            console.error(activationError);
            return serverError(res);
        }
        const profile = data === null || data === void 0 ? void 0 : data[0];
        if (!profile || !profile.is_active) {
            return res.status(403).json({
                message: 'Your account is not authorized to access the BTR Sales Platform.',
            });
        }
        const { id, first_name, last_name, role, is_active, } = profile;
        return res.json({
            id,
            email: profile.email,
            first_name,
            last_name,
            role,
            is_active,
        });
    }
    catch (error) {
        console.error('Sales /me endpoint failed:', error);
        return serverError(res, error);
    }
}));
// Everything below requires an active administrator.
router.use('/admin', salesAuth_1.requireIdentity, salesAuth_1.requireSalesUser, salesAuth_1.requireSalesAdmin);
// List registered and pending users.
router.get('/admin/users', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [users, invitations] = yield Promise.all([
            salesAuth_1.salesDb
                .from('sales_users')
                .select(userFields)
                .order('created_at', { ascending: false }),
            salesAuth_1.salesDb
                .from('sales_user_invitations')
                .select(userFields)
                .order('created_at', { ascending: false }),
        ]);
        if (users.error || invitations.error) {
            return serverError(res);
        }
        return res.json([
            ...(users.data || []).map(user => (Object.assign(Object.assign({}, user), { type: 'user' }))),
            ...(invitations.data || []).map(user => (Object.assign(Object.assign({}, user), { type: 'invitation' }))),
        ]);
    }
    catch (_a) {
        return serverError(res);
    }
}));
// Preauthorize a new employee.
router.post('/admin/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, first_name, last_name, role, } = req.body || {};
        if (typeof email !== 'string' ||
            !companyEmail.test(email.trim()) ||
            !validName(first_name) ||
            !validName(last_name) ||
            !validRole(role)) {
            return res.status(400).json({
                message: 'Valid name, company email and role are required.',
            });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const { data: existing, error: readError } = yield salesAuth_1.salesDb
            .from('sales_users')
            .select('id')
            .eq('email', normalizedEmail)
            .maybeSingle();
        if (readError)
            return serverError(res);
        if (existing) {
            return res.status(409).json({
                message: 'This user already exists.',
            });
        }
        const { data, error } = yield salesAuth_1.salesDb
            .from('sales_user_invitations')
            .insert({
            email: normalizedEmail,
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            role,
            is_active: true,
            created_by: req.salesUser.id,
        })
            .select(userFields)
            .single();
        if (error) {
            return res
                .status(error.code === '23505' ? 409 : 500)
                .json({
                message: error.code === '23505'
                    ? 'This employee is already invited.'
                    : 'Unable to add employee.',
            });
        }
        return res.status(201).json(Object.assign(Object.assign({}, data), { type: 'invitation' }));
    }
    catch (_a) {
        return serverError(res);
    }
}));
// Edit an employee or pending invitation.
router.patch('/admin/users/:type/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, id } = req.params;
        if (!['user', 'invitation'].includes(type) ||
            !uuidPattern.test(id)) {
            return res.status(400).json({
                message: 'Invalid user.',
            });
        }
        const { first_name, last_name, role, is_active, } = req.body || {};
        if (!validName(first_name) ||
            !validName(last_name) ||
            !validRole(role) ||
            typeof is_active !== 'boolean') {
            return res.status(400).json({
                message: 'Invalid user information.',
            });
        }
        if (type === 'user' &&
            id === req.salesUser.id &&
            (!is_active || role !== 'admin')) {
            return res.status(400).json({
                message: 'You cannot deactivate or demote your own account.',
            });
        }
        const table = type === 'user'
            ? 'sales_users'
            : 'sales_user_invitations';
        const { data, error } = yield salesAuth_1.salesDb
            .from(table)
            .update({
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            role,
            is_active,
            updated_at: new Date().toISOString(),
        })
            .eq('id', id)
            .select(userFields)
            .maybeSingle();
        if (error)
            return serverError(res);
        if (!data) {
            return res.status(404).json({
                message: 'User not found.',
            });
        }
        return res.json(Object.assign(Object.assign({}, data), { type }));
    }
    catch (_a) {
        return serverError(res);
    }
}));
// Remove a pending invitation.
// Registered users are deactivated instead of deleted.
router.delete('/admin/users/:type/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type, id } = req.params;
        if (!['user', 'invitation'].includes(type) ||
            !uuidPattern.test(id)) {
            return res.status(400).json({
                message: 'Invalid user.',
            });
        }
        if (type === 'user' &&
            id === req.salesUser.id) {
            return res.status(400).json({
                message: 'You cannot remove your own account.',
            });
        }
        if (type === 'invitation') {
            const { error } = yield salesAuth_1.salesDb
                .from('sales_user_invitations')
                .delete()
                .eq('id', id);
            if (error)
                return serverError(res);
        }
        else {
            const { error } = yield salesAuth_1.salesDb
                .from('sales_users')
                .update({
                is_active: false,
                updated_at: new Date().toISOString(),
            })
                .eq('id', id);
            if (error)
                return serverError(res);
        }
        return res.status(204).end();
    }
    catch (_a) {
        return serverError(res);
    }
}));
exports.default = router;
