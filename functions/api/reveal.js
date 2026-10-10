export async function onRequestPost({ request, env }) {
  try {
    const { password, ticket } = await request.json();
    if (!ticket || typeof password !== "string") return Response.json({error:"أعد الإجابة عن الأسئلة أولًا."},{status:401});
    const [data,sig]=ticket.split(".");
    const enc=s=>btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
    const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(env.SESSION_SECRET),{name:"HMAC",hash:"SHA-256"},false,["verify"]);
    const bytes=Uint8Array.from(atob(sig.replace(/-/g,"+").replace(/_/g,"/")),c=>c.charCodeAt(0));
    const valid=await crypto.subtle.verify("HMAC",key,bytes,new TextEncoder().encode(data));
    const payload=JSON.parse(atob(data.replace(/-/g,"+").replace(/_/g,"/")));
    if(!valid||!payload.ok||payload.exp<Date.now())return Response.json({error:"انتهت صلاحية الرحلة. ارجع للأسئلة وحاول تاني."},{status:401});
    if(password!==env.SITE_PASSWORD)return Response.json({error:"كلمة السر مش صحيحة، جرّب تاني."},{status:401});
    return Response.json({message:env.FINAL_MESSAGE||"ضع الرسالة السرية في إعدادات الخادم."});
  } catch { return Response.json({error:"حصلت مشكلة. حاول تاني."},{status:500}); }
}