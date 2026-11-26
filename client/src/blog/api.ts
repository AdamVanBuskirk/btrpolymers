import { supabase } from '../Core/supabase';

export const auth = supabase;
export type Category = 'industry-insights' | 'building-btr';
export type Status = 'draft' | 'published';
export interface Post {
  id: string; title: string; slug: string; excerpt: string | null;
  content: any; category: Category; featured_image: string | null;
  seo_title: string | null; seo_description: string | null;
  status: Status; published_at: string | null; created_at: string; updated_at: string;
}
export type PostInput = Pick<Post, 'title'|'slug'|'excerpt'|'content'|'category'|'featured_image'|'seo_title'|'seo_description'|'status'>;
export const categoryName = (c: Category) => c === 'building-btr' ? 'Building BTR' : 'Industry Insights';

async function request<T>(path: string, options: RequestInit = {}, secured = false): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  if (secured) {
    const { data } = await auth.auth.getSession();
    if (!data.session?.access_token) throw new Error('Please log in again.');
    headers.set('Authorization', `Bearer ${data.session.access_token}`);
  }
  const response = await fetch(`/api/blog${path}`, { ...options, headers });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(typeof body.message === 'string' ? body.message : `Request failed (${response.status})`);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}
export const blogApi = {
  publicPosts: (category?: string, page = 1) => request<{posts: Post[];total:number;page:number}>(`/posts?page=${page}${category ? `&category=${encodeURIComponent(category)}` : ''}`),
  publicPost: (slug: string) => request<Post>(`/posts/${encodeURIComponent(slug)}`),
  adminPosts: () => request<Post[]>('/admin/posts', {}, true),
  create: (input: PostInput) => request<Post>('/admin/posts', {method:'POST',body:JSON.stringify(input)}, true),
  update: (id: string, input: PostInput) => request<Post>(`/admin/posts/${id}`, {method:'PUT',body:JSON.stringify(input)}, true),
  remove: (id: string) => request<void>(`/admin/posts/${id}`, {method:'DELETE'}, true),
  image: (file: File) => { const body = new FormData(); body.append('image', file); return request<{url:string;path:string}>('/admin/images', {method:'POST',body}, true); }
};
