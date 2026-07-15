import{f as h,g as b,K as k,x as r,S as _,o as a,c as o,a as u,b as f,k as c,I as w,t as v,p as S,s as d,G as g}from"./CVl9Nd-T.js";import{_ as U,C as $}from"./Bp3_sx-0.js";import"./DNKx0mjs.js";import"./DtO4Aoao.js";import"./9ApwhsMh.js";import"./B2PBQ2Bn.js";const q={class:"max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-10"},B={key:0,class:"flex justify-center items-center py-32"},D={key:1,class:"text-center py-32"},I={class:"text-sm text-gray-500 dark:text-gray-400"},A={key:2},C={class:"mt-14"},F={key:1,class:"text-center text-gray-500 dark:text-gray-400 text-sm py-10"},P={__name:"[slug]",setup(N){const{t:l}=h();b();const m=k(),s=r(null),n=r(!0),p=r(null),i=r(m.params.slug);_(()=>m.params.slug,e=>{i.value=e,x()},{immediate:!0});async function y(){const{data:{user:e}}=await d.auth.getUser();if(e){const{data:t}=await d.from("profiles").select("username, display_name, role, avatar_url").eq("id",e.id).single();p.value=t||null}}async function x(){if(!i.value){s.value=null,n.value=!1;return}n.value=!0;const{data:e,error:t}=await d.from("posts").select(`
      id,
      title,
      content,
      category:categories (
        id,
        name
      ),
      tags,
      slug,
      comments_disabled,
      cover_image_url,
      created_at,
      status,
      updated_at,
      author:profiles (
        id,
        username,
        display_name
      )
    `).eq("slug",i.value).single();t?s.value=null:e?(s.value=e,window.__PLUMA_CURRENT_POST=e):s.value=null,n.value=!1}return _(s,e=>{if(e!==null){document.title=`${e.title} | ${g.name}`;const t=document.querySelector('meta[name="description"]');t&&t.setAttribute("content",(e.content||"").slice(0,150)+"...")}else{document.title=`${l("posts.notFoundTitle")} | ${g.name}`;const t=document.querySelector('meta[name="description"]');t&&t.setAttribute("content",l("posts.notFoundMeta"))}},{immediate:!0}),y(),(e,t)=>(a(),o("div",q,[n.value?(a(),o("div",B,[...t[0]||(t[0]=[u("div",{class:"w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"},null,-1)])])):s.value?(a(),o("div",A,[f(U,{post:s.value,user:p.value},null,8,["post","user"]),u("div",C,[s.value.comments_disabled?(a(),o("div",F,v(c(l)("posts.commentsDisabled")),1)):(a(),S($,{key:0,"post-id":s.value.id,"post-author-id":s.value.author?.id},null,8,["post-id","post-author-id"]))])])):(a(),o("div",D,[f(c(w),{icon:"mdi:alert-circle-outline",class:"text-5xl text-gray-300 dark:text-gray-600 mb-6"}),u("p",I,v(c(l)("posts.notFound")),1)]))]))}};export{P as default};
