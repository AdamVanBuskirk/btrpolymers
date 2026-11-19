import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import sanitizeHtml from 'sanitize-html';
import fs from 'fs/promises';
import path from 'path';

const router = Router();
const SITE = 'https://btrpolymers.com';
const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceKey) throw new Error('Supabase configuration missing for blog SEO');
const db = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
const buildIndex = path.resolve(__dirname, '../../client/build/index.html');
const extensions = [StarterKit, Link, Image, Youtube];

function esc(value: unknown): string {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function iso(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}
function safeImage(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try { const u = new URL(value); return u.protocol === 'https:' ? u.toString() : null; }
  catch { return null; }
}
function articleHtml(doc: unknown): string {
  if (!doc || typeof doc !== 'object' || (doc as any).type !== 'doc') return '';
  const raw = generateHTML(doc as any, extensions);
  return sanitizeHtml(raw, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'iframe', 'h1', 'h2', 'figure', 'figcaption'],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      iframe: ['src', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder', 'title'],
    },
    allowedIframeHostnames: ['www.youtube.com', 'www.youtube-nocookie.com', 'player.vimeo.com'],
    allowedSchemes: ['https', 'http', 'mailto'],
  });
}
function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}
function insertIntoHead(html: string, tags: string): string {
  return html.replace('</head>', `${tags}\n</head>`);
}
function stripDefaultTags(html: string): string {
  return html
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\s+[^>]*name=["']description["'][^>]*>/gi, '')
    .replace(/<meta\s+[^>]*property=["']og:[^"']+["'][^>]*>/gi, '')
    .replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>/gi, '');
}
async function template(): Promise<string> { return fs.readFile(buildIndex, 'utf8'); }

router.get('/blog/:slug', async (req: Request, res: Response) => {
  const slug = req.params.slug;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return res.status(404).send('Not found');
  try {
    const { data: post, error } = await db.from('blog_posts')
      .select('title,slug,excerpt,content,category,featured_image,seo_title,seo_description,published_at,updated_at')
      .eq('slug', slug).eq('status', 'published')
      .lte('published_at', new Date().toISOString()).maybeSingle();
    if (error) throw error;
    if (!post) return res.status(404).send('Article not found');

    const title = String(post.seo_title || post.title);
    const fullTitle = `${title} | BTR Polymers`;
    const description = String(post.seo_description || post.excerpt || 'Industry insights and the journey of building BTR Polymers.').slice(0, 300);
    const canonical = `${SITE}/blog/${encodeURIComponent(post.slug)}`;
    const image = safeImage(post.featured_image);
    const published = iso(post.published_at);
    const modified = iso(post.updated_at);
    const content = articleHtml(post.content);
    const tags = [
      `<title>${esc(fullTitle)}</title>`,
      `<meta name="description" content="${esc(description)}">`,
      `<link rel="canonical" href="${esc(canonical)}">`,
      '<meta name="robots" content="index,follow">',
      '<meta property="og:type" content="article">',
      `<meta property="og:title" content="${esc(fullTitle)}">`,
      `<meta property="og:description" content="${esc(description)}">`,
      `<meta property="og:url" content="${esc(canonical)}">`,
      '<meta property="og:site_name" content="BTR Polymers">',
      ...(image ? [`<meta property="og:image" content="${esc(image)}">`, `<meta name="twitter:image" content="${esc(image)}">`] : []),
      '<meta name="twitter:card" content="summary_large_image">',
      `<meta name="twitter:title" content="${esc(fullTitle)}">`,
      `<meta name="twitter:description" content="${esc(description)}">`,
      ...(published ? [`<meta property="article:published_time" content="${esc(published)}">`] : []),
      ...(modified ? [`<meta property="article:modified_time" content="${esc(modified)}">`] : []),
      `<script type="application/ld+json">${jsonLd({
        '@context': 'https://schema.org', '@type': 'BlogPosting',
        headline: post.title, description, mainEntityOfPage: canonical, url: canonical,
        publisher: { '@type': 'Organization', name: 'BTR Polymers', url: SITE },
        ...(image ? { image } : {}),
        ...(published ? { datePublished: published } : {}),
        ...(modified ? { dateModified: modified } : {}),
      })}</script>`,
    ].join('\n');
    let html = insertIntoHead(stripDefaultTags(await template()), tags);
    // Static article body is present in the first HTML response. React replaces it on mount.
    const initialArticle = `<main class="btr-blog-article" id="seo-article"><article><header><h1>${esc(post.title)}</h1>${published ? `<time datetime="${esc(published)}">${esc(published.slice(0, 10))}</time>` : ''}</header>${image ? `<img src="${esc(image)}" alt="${esc(post.title)}">` : ''}<div class="btr-blog-content">${content}</div></article></main>`;
    html = html.replace(/(<div\s+id=["']root["']\s*>)([\s\S]*?)(<\/div>)/i, (_all, start, _middle, end) => `${start}${initialArticle}${end}`);
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300');
    res.type('html').send(html);
  } catch (e) {
    console.error('Blog SEO error:', e);
    res.status(500).send('Could not load article');
  }
});

router.get('/sitemap.xml', async (_req: Request, res: Response) => {
  try {
    const urls: { loc: string; lastmod?: string }[] = [
      { loc: SITE + '/' }, { loc: SITE + '/about' }, { loc: SITE + '/blog' },
    ];
    let from = 0;
    while (true) {
      const { data, error } = await db.from('blog_posts').select('slug,updated_at')
        .eq('status', 'published').lte('published_at', new Date().toISOString())
        .order('id', { ascending: true }).range(from, from + 999);
      if (error) throw error;
      for (const post of data || []) {
        const lastmod = iso(post.updated_at);
        urls.push({ loc: `${SITE}/blog/${encodeURIComponent(post.slug)}`, ...(lastmod ? { lastmod } : {}) });
      }
      if (!data || data.length < 1000) break;
      from += 1000;
    }
    const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      urls.map(u => `  <url><loc>${esc(u.loc)}</loc>${u.lastmod ? `<lastmod>${esc(u.lastmod)}</lastmod>` : ''}</url>`).join('\n') +
      '\n</urlset>';
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300');
    res.type('application/xml').send(xml);
  } catch (e) { console.error('Sitemap error:', e); res.status(500).send('Could not generate sitemap'); }
});

router.get('/robots.txt', (_req: Request, res: Response) => {
  res.type('text/plain').send(`User-agent: *\nDisallow: /admin/\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
});

export default router;
