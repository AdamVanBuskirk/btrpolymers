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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_js_1 = require("@supabase/supabase-js");
const multer_1 = __importDefault(require("multer"));
const crypto_1 = require("crypto");
const router = (0, express_1.Router)();
const url = process.env.SUPABASE_URL;
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminId = process.env.BLOG_ADMIN_USER_ID;
if (!url || !publishableKey || !serviceKey || !adminId) {
    throw new Error('Missing SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SERVICE_ROLE_KEY, or BLOG_ADMIN_USER_ID');
}
const authClient = (0, supabase_js_1.createClient)(url, publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });
const db = (0, supabase_js_1.createClient)(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
function requireAdmin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const match = /^Bearer (.+)$/i.exec(req.header('authorization') || '');
        if (!match) {
            res.status(401).json({ message: 'Login required' });
            return;
        }
        try {
            const { data, error } = yield authClient.auth.getUser(match[1]);
            if (error || !data.user || data.user.id !== adminId) {
                res.status(403).json({ message: 'Not authorized' });
                return;
            }
            req.adminUserId = data.user.id;
            next();
        }
        catch (_a) {
            res.status(401).json({ message: 'Invalid session' });
        }
    });
}
const fields = 'id,title,slug,excerpt,content,category,featured_image,seo_title,seo_description,status,published_at,created_at,updated_at';
const categories = ['industry-insights', 'building-btr'];
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function validatePost(input) {
    if (!input || typeof input !== 'object')
        return 'Invalid post';
    if (typeof input.title !== 'string' || !input.title.trim() || input.title.length > 200)
        return 'Invalid title';
    if (typeof input.slug !== 'string' || !slugPattern.test(input.slug) || input.slug.length > 180)
        return 'Invalid slug';
    if (!categories.includes(input.category))
        return 'Invalid category';
    if (!['draft', 'published'].includes(input.status))
        return 'Invalid status';
    if (!input.content || typeof input.content !== 'object' || Array.isArray(input.content) || input.content.type !== 'doc')
        return 'Invalid rich text document';
    for (const key of ['excerpt', 'featured_image', 'seo_title', 'seo_description']) {
        if (input[key] != null && typeof input[key] !== 'string')
            return `Invalid ${key}`;
    }
    if (input.featured_image && (!/^https:\/\//.test(input.featured_image) || input.featured_image.length > 2048))
        return 'Invalid featured image URL';
    return null;
}
function payload(input, publishedAt) {
    return {
        title: input.title.trim(), slug: input.slug, category: input.category,
        excerpt: input.excerpt || null, content: input.content,
        featured_image: input.featured_image || null,
        seo_title: input.seo_title || null, seo_description: input.seo_description || null,
        status: input.status, published_at: input.status === 'published' ? (publishedAt || new Date().toISOString()) : null,
    };
}
// Public routes: only published posts, regardless of service-role access.
router.get('/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = req.query.category;
    if (category && (typeof category !== 'string' || !categories.includes(category)))
        return res.status(400).json({ message: 'Invalid category' });
    const page = Math.max(1, Math.min(10000, Number.parseInt(String(req.query.page || '1'), 10) || 1));
    let query = db.from('blog_posts').select('id,title,slug,excerpt,category,featured_image,published_at', { count: 'exact' })
        .eq('status', 'published').lte('published_at', new Date().toISOString())
        .order('published_at', { ascending: false }).range((page - 1) * 12, page * 12 - 1);
    if (category)
        query = query.eq('category', category);
    const { data, error, count } = yield query;
    if (error)
        return res.status(500).json({ message: error });
    res.json({ posts: data, total: count, page });
}));
router.get('/posts/:slug', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield db.from('blog_posts').select(fields).eq('slug', req.params.slug)
        .eq('status', 'published').lte('published_at', new Date().toISOString()).maybeSingle();
    if (error)
        return res.status(500).json({ message: 'Could not load article' });
    if (!data)
        return res.status(404).json({ message: 'Article not found' });
    res.json(data);
}));
router.get('/admin/posts', requireAdmin, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, error } = yield db.from('blog_posts').select(fields).order('updated_at', { ascending: false });
    if (error)
        return res.status(500).json({ message: error });
    res.json(data);
}));
router.post('/admin/posts', requireAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const problem = validatePost(req.body);
    if (problem)
        return res.status(400).json({ message: problem });
    const { data, error } = yield db.from('blog_posts').insert(payload(req.body, null)).select(fields).single();
    if (error)
        return res.status(error.code === '23505' ? 409 : 500).json({ message: error.code === '23505' ? 'Slug already exists' : 'Could not save post' });
    res.status(201).json(data);
}));
router.put('/admin/posts/:id', requireAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const problem = validatePost(req.body);
    if (problem)
        return res.status(400).json({ message: problem });
    const { data: old, error: readError } = yield db.from('blog_posts').select('published_at').eq('id', req.params.id).maybeSingle();
    if (readError)
        return res.status(500).json({ message: 'Could not load post' });
    if (!old)
        return res.status(404).json({ message: 'Post not found' });
    const { data, error } = yield db.from('blog_posts').update(payload(req.body, old.published_at)).eq('id', req.params.id).select(fields).single();
    if (error)
        return res.status(error.code === '23505' ? 409 : 500).json({ message: error.code === '23505' ? 'Slug already exists' : 'Could not update post' });
    res.json(data);
}));
router.delete('/admin/posts/:id', requireAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = yield db.from('blog_posts').delete().eq('id', req.params.id);
    if (error)
        return res.status(500).json({ message: 'Could not delete post' });
    res.status(204).end();
}));
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024, files: 1 },
    fileFilter: (_req, file, cb) => cb(null, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)) });
router.post('/admin/images', requireAdmin, upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file)
        return res.status(400).json({ message: 'Valid image required (max 10 MB)' });
    const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };
    const objectPath = `articles/${(0, crypto_1.randomUUID)()}.${ext[req.file.mimetype]}`;
    const { error } = yield db.storage.from('blog-images').upload(objectPath, req.file.buffer, {
        contentType: req.file.mimetype, cacheControl: '3600', upsert: false,
    });
    if (error)
        return res.status(500).json({ message: 'Image upload failed' });
    const { data } = db.storage.from('blog-images').getPublicUrl(objectPath);
    res.status(201).json({ url: data.publicUrl, path: objectPath });
}));
exports.default = router;
