(() => {
 const cfg=window.SITE_CONFIG, $=id=>document.getElementById(id);
 const views=["intro-view","quiz-view","password-view","final-view"];
 function show(id){views.forEach(v=>$(v).classList.toggle("hidden",v!==id));window.scrollTo({top:0,behavior:"smooth"});}
 $("site-name").textContent=cfg.siteName;$("intro-kicker").textContent=cfg.introKicker;$("intro-title").textContent=cfg.introTitle;
 $("intro-message").textContent=cfg.introMessage;$("intro-extra").textContent=cfg.introExtra;$("start-btn").textContent=cfg.startButton;
 $("quiz-title").textContent=cfg.quizTitle;$("final-title").textContent=cfg.finalTitle;$("signature").textContent=cfg.signature;
 const gallery=$("photo-gallery");(cfg.photos||[]).forEach(src=>{const img=document.createElement("img");img.src=src;img.alt="صورة من الذكريات";gallery.appendChild(img);});
 const qs=cfg.questions;let index=0,attempts=0;
 function renderQuestion(){const root=$("question-stage");root.replaceChildren();const label=document.createElement("label");label.htmlFor="answer-now";label.textContent=qs[index].q;
 const input=document.createElement("input");input.id="answer-now";input.required=true;input.autocomplete="off";input.placeholder="اكتب إجابتك هنا";root.append(label,input);
 $("progress-label").textContent=`السؤال ${index+1} من ${qs.length}`;$("progress-bar").style.width=((index+1)/qs.length*100)+"%";input.focus();}
 function errorShake(el){el.classList.remove("shake");void el.offsetWidth;el.classList.add("shake");}
 $("start-btn").addEventListener("click",()=>{index=0;attempts=0;show("quiz-view");renderQuestion();});
 $("quiz-form").addEventListener("submit",e=>{e.preventDefault();const val=$("answer-now").value.trim();if(!val)return;attempts++;
 if(val.toLocaleLowerCase()!==qs[index].a.toLocaleLowerCase()){$("quiz-error").textContent="الإجابة مش صحيحة، جرّب تاني";errorShake($("quiz-view"));if(attempts>=3){$("quiz-error").textContent="لسه قدامك فرصة… افتكر كويس وجرب تاني 💙";attempts=0;}return;}
 $("quiz-error").textContent="";index++;attempts=0;if(index<qs.length){renderQuestion();}else{show("password-view");$("quiz-error").textContent="";}});
 $("hint-toggle").addEventListener("click",()=>{$("hint-text").textContent=cfg.hintText;$("hint-text").classList.toggle("hidden");});
 $("password-form").addEventListener("submit",e=>{e.preventDefault();if($("password-input").value!==cfg.password){$("password-error").textContent="مش دي الكلمة… فكر في التلميح يا zooto";errorShake($("password-view"));return;}
 show("final-view");$("final-message").textContent="";$("signature").classList.add("hidden");const text=cfg.finalMessage;let i=0;function tick(){if(i<text.length){$("final-message").textContent+=text[i++];setTimeout(tick,25);}else{$("signature").classList.remove("hidden");}}tick();});
})();
