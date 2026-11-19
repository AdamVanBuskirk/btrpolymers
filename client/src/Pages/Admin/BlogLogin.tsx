import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../blog/api';
import '../../blog/blog.css';
export default function BlogLogin() {
  const [email,setEmail] = useState(''); const [password,setPassword] = useState('');
  const [error,setError] = useState(''); const [busy,setBusy] = useState(false); const navigate=useNavigate();
  async function submit(e:React.FormEvent) {
    e.preventDefault(); setBusy(true);setError('');
    const {error} = await auth.auth.signInWithPassword({email,password});
    setBusy(false);
    if (error) setError(error.message); else navigate('/admin/blog');
  }
  return <main className="btr-blog-admin"><div className="btr-blog-admin-box"><h1>BTR Blog Login</h1><form onSubmit={submit}>
    <label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>
    <label>Password<input type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>
    {error && <p role="alert" className="btr-blog-error">{error}</p>}
    <button disabled={busy} type="submit">{busy?'Signing in...':'Sign in'}</button>
  </form></div></main>;
}
