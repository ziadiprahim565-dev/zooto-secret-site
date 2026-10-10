export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const answers = body.answers;
    const expected = JSON.parse(env.ANSWERS_JSON || "[]");
    if (!Array.isArray(answers) || answers.length !== 10 || expected.length !== 10)
      return Response.json({ error: "لازم تجاوب على الأسئلة العشرة." }, { status: 400 });
    const normalize = s => String(s ?? "").normalize("NFKC").trim().replace(/\s+/g," ")
      .replace(/[أإآ]/g,"ا").replace(/ى/g,"ي").replace(/[ًٌٍَُِّْـ]/g,"");
    if (!answers.every((a,i) => normalize(a) === normalize(expected[i])))
      return Response.json({ error: "في إجابة مش صحيحة. راجع إجاباتك وحاول تاني." }, { status: 401 });
    const payload = { exp: Date.now() + 30*60*1000, ok: true };
    const enc = s => btoa(String.fromCharCode(...new TextEncoder().encode(s))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
    const data = enc(JSON.stringify(payload));
    const key = await crypto.subtle.importKey("raw",new TextEncoder().encode(env.SESSION_SECRET),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
    const sig = await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(data));
    const ticket = data+"."+enc(String.fromCharCode(...new Uint8Array(sig)));
    return Response.json({ ticket });
  } catch { return Response.json({ error:"حصلت مشكلة في التحقق. جرّب تاني." },{status:500}); }
}