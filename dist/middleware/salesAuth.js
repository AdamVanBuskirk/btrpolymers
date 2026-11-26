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
exports.salesDb = exports.salesAuth = void 0;
exports.requireIdentity = requireIdentity;
exports.requireSalesUser = requireSalesUser;
exports.requireSalesAdmin = requireSalesAdmin;
const supabase_js_1 = require("@supabase/supabase-js");
const url = process.env.SUPABASE_URL;
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
exports.salesAuth = (0, supabase_js_1.createClient)(url, publishableKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});
exports.salesDb = (0, supabase_js_1.createClient)(url, serviceKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});
function requireIdentity(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const match = /^Bearer (.+)$/i.exec(req.header('authorization') || '');
        if (!match) {
            return res.status(401).json({
                message: 'Login required.',
            });
        }
        try {
            const { data, error } = yield exports.salesAuth.auth.getUser(match[1]);
            if (error || !data.user) {
                return res.status(401).json({
                    message: 'Invalid session.',
                });
            }
            req.authUser = data.user;
            next();
        }
        catch (_a) {
            return res.status(401).json({
                message: 'Unable to verify identity.',
            });
        }
    });
}
function requireSalesUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data, error } = yield exports.salesDb
                .from('sales_users')
                .select('id,email,role,is_active')
                .eq('id', req.authUser.id)
                .maybeSingle();
            if (error) {
                return res.status(500).json({
                    message: 'Unable to verify sales access.',
                });
            }
            if (!data || !data.is_active) {
                return res.status(403).json({
                    message: 'Sales platform access denied.',
                });
            }
            req.salesUser = data;
            next();
        }
        catch (_a) {
            return res.status(500).json({
                message: 'Unable to verify sales access.',
            });
        }
    });
}
function requireSalesAdmin(req, res, next) {
    var _a;
    if (!((_a = req.salesUser) === null || _a === void 0 ? void 0 : _a.is_active) ||
        req.salesUser.role !== 'admin') {
        return res.status(403).json({
            message: 'Administrator access required.',
        });
    }
    next();
}
