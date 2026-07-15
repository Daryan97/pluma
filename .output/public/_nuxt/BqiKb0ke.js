import{u as B,a as D,d as s,e as r,f as _,g as h,h as o,I as T,i as O,t as g,F as G,r as H,M as K,n as J,N as Q,j as b,b as W,K as X,z as Y,A as Z,k as S,G as ee,s as l,p,m as x,H as te,q as se}from"./PSvlVfzj.js";import{P as ae,_ as re,C as oe}from"./86hn4npc.js";import{u as ne,a as ie}from"./HqFgwiPs.js";import"./b5ZhttB9.js";import"./DwIYmnn7.js";import"./neHZ-Z64.js";import"./BFwIWxet.js";const le={key:0,class:"mt-10 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/40 p-5"},ue={class:"text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2"},ce={class:"list-none space-y-2 p-0 m-0"},de={class:"text-[11px] text-gray-400 w-5 shrink-0 tabular-nums"},me={class:"truncate"},pe={__name:"SeriesNav",props:{series:{type:Object,default:null},posts:{type:Array,default:()=>[]},currentId:{type:String,default:null}},setup(u){const{t:c}=B(),v=D();return(d,$)=>{const m=Q;return u.series&&u.posts.length?(s(),r("section",le,[_("h2",ue,[h(o(T),{icon:"mdi:bookshelf",class:"text-base text-indigo-500"}),O(" "+g(o(c)("series.label",{name:u.series.name})),1)]),_("ol",ce,[(s(!0),r(G,null,H(u.posts,a=>(s(),r("li",{key:a.id,class:"list-none"},[h(m,{to:o(v)(`/posts/${a.slug}`),class:J(["flex items-center gap-2 text-sm rounded-md px-2 py-1.5 transition",a.id===u.currentId?"bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-200 font-medium":"text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800"])},{default:K(()=>[_("span",de,g(a.series_order??"·"),1),_("span",me,g(a.title),1)]),_:2},1032,["to","class"])]))),128))])])):b("",!0)}}},_e={class:"max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-10"},ge={key:0,class:"mb-6 rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-900/30 dark:border-amber-700 px-4 py-2 text-sm text-amber-800 dark:text-amber-200"},ye={key:2,class:"text-center py-32"},ve={class:"text-sm text-gray-500 dark:text-gray-400"},fe={key:3},xe={class:"mt-14"},be={key:1,class:"text-center text-gray-500 dark:text-gray-400 text-sm py-10"},he=`
  id,
  title,
  content,
  locale,
  category:categories (
    id,
    name,
    slug,
    locale
  ),
  series_id,
  series_order,
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
`,Ce={__name:"[slug]",async setup(u){let c,v;const{t:d,locale:$}=B(),{contentLocale:m}=W(),a=X(),A=se(),t=x(null),q=x(!1),N=x(null),f=x([]),C=p(()=>!!a.query.preview),L=p(()=>t.value?.series||null);async function I(e){if(!e){f.value=[];return}const{data:n}=await l.from("posts").select("id, title, slug, series_order, locale").eq("series_id",e).eq("status","published").eq("locale",m.value).order("series_order",{ascending:!0,nullsFirst:!1});f.value=n||[]}async function M(e,n,E){if(!e)return null;if(n){const{data:i,error:j}=await l.rpc("get_post_by_preview_token",{p_token:n});if(j||!i)return null;if(i.series_id){const{data:z}=await l.from("series").select("id, name, slug").eq("id",i.series_id).maybeSingle();i.series=z||null}return i}const{data:y,error:V}=await l.from("posts").select(he).eq("slug",e).eq("locale",E).maybeSingle();if(V||!y)return null;if(y.series_id){const{data:i}=await l.from("series").select("id, name, slug").eq("id",y.series_id).maybeSingle();y.series=i||null}return y}const k=p(()=>a.params.slug),w=p(()=>typeof a.query.preview=="string"?a.query.preview:null),{data:R,pending:F}=([c,v]=Y(async()=>ee(()=>`post-${k.value}-${m.value}-${w.value||"pub"}`,async()=>await M(k.value,w.value,m.value),{watch:[k,m,w],server:!0})),c=await c,v(),c);Z(R,async e=>{t.value=e||null,e&&(window.__PLUMA_CURRENT_POST=e),e?.series_id?await I(e.series_id):f.value=[]},{immediate:!0});const P=p(()=>A.resolveLocalizedSiteName?.($.value)||te.name||"Pluma");ne(p(()=>t.value?ie(t.value,P.value):!F.value&&!q.value?{title:`${d("posts.notFoundTitle")} | ${P.value}`,description:d("posts.notFoundMeta"),type:"website",robots:"noindex, follow"}:{title:P.value,type:"website"}));async function U(){const{data:{user:e}}=await l.auth.getUser();if(e){const{data:n}=await l.from("profiles").select("username, display_name, role, avatar_url").eq("id",e.id).single();N.value=n||null}}return U(),(e,n)=>(s(),r("div",_e,[C.value?(s(),r("div",ge,g(o(d)("posts.previewMode")),1)):b("",!0),o(F)||q.value?(s(),S(ae,{key:1})):t.value?(s(),r("div",fe,[h(re,{post:t.value,user:N.value},null,8,["post","user"]),L.value?(s(),S(pe,{key:0,series:L.value,posts:f.value,"current-id":t.value.id},null,8,["series","posts","current-id"])):b("",!0),_("div",xe,[!t.value.comments_disabled&&!C.value?(s(),S(oe,{key:0,"post-id":t.value.id,"post-author-id":t.value.author?.id},null,8,["post-id","post-author-id"])):t.value.comments_disabled?(s(),r("div",be,g(o(d)("posts.commentsDisabled")),1)):b("",!0)])])):(s(),r("div",ye,[h(o(T),{icon:"mdi:alert-circle-outline",class:"text-5xl text-gray-300 dark:text-gray-600 mb-6"}),_("p",ve,g(o(d)("posts.notFound")),1)]))]))}};export{Ce as default};
