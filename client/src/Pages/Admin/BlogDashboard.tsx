import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, blogApi, categoryName, Post } from '../../blog/api';
import '../../blog/blog.css';
export default function BlogDashboard() {
 const [posts,setPosts]=useState<Post[]>([]); const [error,setError]=useState('');const [loading,setLoading]=useState(true); const navigate=useNavigate();
 useEffect(()=>{ let live=true; blogApi.adminPosts().then(p=>{if(live)setPosts(p)}).catch(e=>{if(live){setError(e.message); if(/log in/i.test(e.message))navigate('/admin/login')}}).finally(()=>{if(live)setLoading(false)}); return ()=>{live=false};},[navigate]);
 async function remove(post:Post) { if(!window.confirm(`Delete "${post.title}" permanently?`))return;try{await blogApi.remove(post.id);setPosts(p=>p.filter(x=>x.id!==post.id))}catch(e:any){setError(e.message)} }
 async function signOut(){await auth.auth.signOut();navigate('/admin/login')}
 return <main className="btr-blog-admin"><div className="btr-blog-admin-wide"><div className="btr-blog-admin-head"><div><p className="btr-blog-eyebrow">BTR POLYMERS</p><h1>Blog dashboard</h1></div><div><Link className="btr-blog-btn" to="/admin/blog/new">New article</Link> <button className="btr-blog-secondary" onClick={signOut}>Sign out</button></div></div>
 {error&&<p role="alert" className="btr-blog-error">{error}</p>}{loading?<p>Loading...</p>:posts.length===0?<p>No articles yet. Create your first post.</p>:<div className="btr-blog-table-wrap"><table className="btr-blog-table"><thead><tr><th>Article</th><th>Category</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead><tbody>{posts.map(p=><tr key={p.id}><td><strong>{p.title}</strong><small>/{p.slug}</small></td><td>{categoryName(p.category)}</td><td>{p.status}</td><td>{new Date(p.updated_at).toLocaleDateString()}</td><td><Link to={`/admin/blog/${p.id}`}>Edit</Link> {p.status==='published'&&<Link to={`/blog/${p.slug}`} target="_blank">View</Link>} <button className="btr-blog-link-danger" onClick={()=>remove(p)}>Delete</button></td></tr>)}</tbody></table></div>}</div></main>
}
