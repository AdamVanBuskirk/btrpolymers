import React,{useEffect,useState} from 'react';
import {Link,useParams} from 'react-router-dom';
import {generateHTML} from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import DOMPurify from 'dompurify';
import Navigation from '../../Components/Navigation';
import Footer from '../../Components/Footer';
import {blogApi,categoryName,Post} from '../../blog/api';
import '../../blog/blog.css';
export default function BlogArticle(){
    
      useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    const {slug}=useParams();const [post,setPost]=useState<Post|null>(null);const [error,setError]=useState('');const [loading,setLoading]=useState(true);
 useEffect(()=>{if(!slug)return;let live=true;setLoading(true);blogApi.publicPost(slug).then(p=>{if(live)setPost(p)}).catch(e=>{if(live)setError(e.message)}).finally(()=>{if(live)setLoading(false)});return()=>{live=false}},[slug]);
 const html=post?DOMPurify.sanitize(generateHTML(post.content,[StarterKit,LinkExtension,Image,Youtube]),{ADD_TAGS:['iframe'],ADD_ATTR:['allow','allowfullscreen','frameborder','scrolling'] }):'';
 return <><Navigation/><main className="btr-blog"><article className="btr-blog-article">{loading?<p>Loading...</p>:error?<p role="alert">{error}</p>:post?<><Link className="btr-blog-back" to="/blog">← All articles</Link><header className="btr-blog-article-header"><div className="btr-blog-eyebrow">{categoryName(post.category)}</div><h1>{post.title}</h1><p className="btr-blog-date">{post.published_at&&new Date(post.published_at).toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"})}</p></header>{post.featured_image&&<img className="btr-blog-article-hero" src={post.featured_image} alt=""/>}<div className="btr-blog-content" dangerouslySetInnerHTML={{__html:html}}/></>:null}</article></main><Footer/></>}
