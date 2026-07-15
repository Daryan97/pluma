import{u as B,b as L,K as N,z as T,A as U,d as a,e as r,h as u,k as f,g as x,I as $,f as h,t as k,G as q,s as d,m,p,H as A,q as E}from"./PSvlVfzj.js";import{P as F,_ as I,C as D}from"./86hn4npc.js";import{u as R,a as z}from"./HqFgwiPs.js";import"./b5ZhttB9.js";import"./DwIYmnn7.js";import"./neHZ-Z64.js";import"./BFwIWxet.js";const M={class:"max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-10"},O={key:1,class:"text-center py-32"},V={class:"text-sm text-gray-500 dark:text-gray-400"},j={key:2},G={class:"mt-14"},H={key:1,class:"text-center text-gray-500 dark:text-gray-400 text-sm py-10"},K=`
  id,
  title,
  content,
  locale,
  category:categories (
    id,
    name,
    locale
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
`,ae={__name:"[slug]",async setup(J){let s,_;const{t:o,locale:w}=B(),{contentLocale:i}=L(),b=N(),P=E(),t=m(null),v=m(!1),g=m(null),l=p(()=>b.params.slug),{data:S,pending:y}=([s,_]=T(async()=>q(()=>`archive-post-${l.value}-${i.value}`,async()=>{if(!l.value)return null;const{data:e,error:n}=await d.from("posts").select(K).eq("slug",l.value).eq("locale",i.value).maybeSingle();return n||!e?null:e},{watch:[l,i],server:!0})),s=await s,_(),s);U(S,e=>{t.value=e||null,e&&(window.__PLUMA_CURRENT_POST=e)},{immediate:!0});const c=p(()=>P.resolveLocalizedSiteName?.(w.value)||A.name||"Pluma");R(p(()=>t.value?z(t.value,c.value):!y.value&&!v.value?{title:`${o("posts.notFoundTitle")} | ${c.value}`,description:o("posts.notFoundMeta"),type:"website",robots:"noindex, follow"}:{title:c.value,type:"website"}));async function C(){const{data:{user:e}}=await d.auth.getUser();if(e){const{data:n}=await d.from("profiles").select("username, display_name, role, avatar_url").eq("id",e.id).single();g.value=n||null}}return C(),(e,n)=>(a(),r("div",M,[u(y)||v.value?(a(),f(F,{key:0})):t.value?(a(),r("div",j,[x(I,{post:t.value,user:g.value},null,8,["post","user"]),h("div",G,[t.value.comments_disabled?(a(),r("div",H,k(u(o)("posts.commentsDisabled")),1)):(a(),f(D,{key:0,"post-id":t.value.id,"post-author-id":t.value.author?.id},null,8,["post-id","post-author-id"]))])])):(a(),r("div",O,[x(u($),{icon:"mdi:alert-circle-outline",class:"text-5xl text-gray-300 dark:text-gray-600 mb-6"}),h("p",V,k(u(o)("posts.notFound")),1)]))]))}};export{ae as default};
