import { useState, useMemo, useRef } from "react";

const FACTORS = [
  { key:"stress",   label:"ストレス耐性", color:"#ef4444" },
  { key:"work",     label:"勤労意欲",     color:"#3b82f6" },
  { key:"empathy",  label:"共感性",       color:"#8b5cf6" },
  { key:"coop",     label:"協調性",       color:"#10b981" },
  { key:"active",   label:"積極性",       color:"#f59e0b" },
  { key:"achieve",  label:"達成動機",     color:"#ec4899" },
  { key:"autonomy", label:"自律性",       color:"#06b6d4" },
  { key:"compete",  label:"競争性",       color:"#f97316" },
  { key:"mvv",      label:"MVV適合性",    color:"#0d9488" },
];

const QUESTIONS_MASTER = [
  {id:1,  factor:"stress",   rev:false, text:"断られたり否定されても、すぐに気持ちを切り替えられる方だ"},
  {id:2,  factor:"stress",   rev:false, text:"プレッシャーがかかる状況でも、普段通りのパフォーマンスを発揮できる"},
  {id:3,  factor:"stress",   rev:true,  text:"失敗が続くと、しばらく立ち直れないことが多い"},
  {id:4,  factor:"stress",   rev:true,  text:"批判されると、その日一日気分が沈んでしまう方だ"},
  {id:5,  factor:"work",     rev:false, text:"仕事を通じて成長したいという気持ちが強い"},
  {id:6,  factor:"work",     rev:false, text:"たとえ給料が同じでも、より良い仕事をしようと心がける"},
  {id:7,  factor:"work",     rev:true,  text:"特に理由がなければ、仕事は最低限こなせればよいと思う"},
  {id:8,  factor:"work",     rev:true,  text:"業務時間外に仕事のことを考えたくないと強く思う方だ"},
  {id:9,  factor:"empathy",  rev:false, text:"相手が何を望んでいるか、言葉にされなくても察することができる"},
  {id:10, factor:"empathy",  rev:false, text:"話を聞くとき、相手の立場に立って考えるようにしている"},
  {id:11, factor:"empathy",  rev:true,  text:"相手の気持ちよりも、論理や事実の方が大切だと思う"},
  {id:12, factor:"empathy",  rev:true,  text:"感情的な話をされても、正直よくわからないと感じることが多い"},
  {id:13, factor:"coop",     rev:false, text:"チームの目標のためなら、自分の意見を引っ込めることができる"},
  {id:14, factor:"coop",     rev:false, text:"仲間が困っているときは積極的にフォローする方だ"},
  {id:15, factor:"coop",     rev:true,  text:"チームで動くより、一人で進める方が効率的だと思うことが多い"},
  {id:16, factor:"coop",     rev:true,  text:"グループでの作業は、足を引っ張られることが多いと感じる"},
  {id:17, factor:"active",   rev:false, text:"やったことがないことにも、積極的に挑戦する方だ"},
  {id:18, factor:"active",   rev:false, text:"問題が起きたとき、誰かに言われる前に自分から動く"},
  {id:19, factor:"active",   rev:true,  text:"新しいことを始めるより、慣れたやり方の方が安心できる"},
  {id:20, factor:"active",   rev:true,  text:"自分から意見を言うより、様子を見てから動く方が多い"},
  {id:21, factor:"achieve",  rev:false, text:"数値目標やノルマがある方が、かえってやる気が出る"},
  {id:22, factor:"achieve",  rev:false, text:"高い目標を設定して、それに向けて努力することが好きだ"},
  {id:23, factor:"achieve",  rev:true,  text:"目標を達成できなかったとき、次への意欲がしばらく続かない"},
  {id:24, factor:"achieve",  rev:true,  text:"ノルマや数字に追われる仕事は、あまり好きではない"},
  {id:25, factor:"autonomy", rev:false, text:"指示がなくても、自分で考えて行動することができる"},
  {id:26, factor:"autonomy", rev:false, text:"うまくいかなかったことは、自分なりに原因を分析して次に活かす"},
  {id:27, factor:"autonomy", rev:true,  text:"何をすればいいか明確に指示してもらえると安心する"},
  {id:28, factor:"autonomy", rev:true,  text:"自分で判断するより、上司に確認してから動く方が多い"},
  {id:29, factor:"compete",  rev:false, text:"他の人より良い成績を出したいという気持ちが強い方だ"},
  {id:30, factor:"compete",  rev:false, text:"ランキングや順位があると、上を目指してより頑張れる"},
  {id:31, factor:"compete",  rev:true,  text:"順位や他者との比較はあまり気にしない方だ"},
  {id:32, factor:"compete",  rev:true,  text:"競争より、自分のペースで取り組む方が好きだ"},
  {id:33, factor:"mvv",      rev:false, text:"エネルギーや環境問題など、社会課題の解決に貢献する仕事に強い関心がある"},
  {id:34, factor:"mvv",      rev:false, text:"既存のやり方にとらわれず、新しいサービスや仕組みを生み出したいという気持ちが強い"},
  {id:35, factor:"mvv",      rev:false, text:"自分の意見や考えを、相手にわかりやすく論理的に伝えることができる"},
  {id:36, factor:"mvv",      rev:false, text:"うまくいかなかったときは、言い訳よりも自分の行動を振り返るようにしている"},
  {id:37, factor:"mvv",      rev:false, text:"日頃から感謝の気持ちを言葉や行動で表すことを大切にしている"},
  {id:38, factor:"mvv",      rev:false, text:"仕事においても、笑顔や明るさを意識して周囲に接することができる"},
  {id:39, factor:"mvv",      rev:false, text:"仲間と目標を共有し、共に高め合うことにやりがいを感じる"},
  {id:40, factor:"mvv",      rev:true,  text:"社会や環境への貢献よりも、自分の収入や待遇の方が仕事選びの基準として重要だ"},
];

const CHOICES = ["全くそう思わない","そう思わない","どちらでもない","そう思う","強くそう思う"];

const THR = {
  stress:   {required:true,  min:3.5, label:"最重要"},
  work:     {required:true,  min:3.0, label:"必須"},
  empathy:  {required:true,  min:3.0, label:"必須"},
  coop:     {required:true,  min:3.0, label:"必須"},
  active:   {required:true,  min:3.0, label:"必須"},
  achieve:  {required:false, min:3.0, label:"営業強化"},
  autonomy: {required:false, min:3.0, label:"営業強化"},
  compete:  {required:false, min:2.5, label:"営業強化"},
  mvv:      {required:true,  min:3.5, label:"MVV必須"},
};

const DEPTS = [
  {
    key:"business", name:"ビジネスエネルギー営業部", color:"#0284c7", bg:"#e0f2fe",
    desc:"法人向け太陽光パネル テレアポ新規営業",
    note:"感情安定性（ストレス耐性）が特に重要。法人相手に粘り強く数字を追える人材が適性。",
    conds: function(s, g) {
      return [
        {label:"ストレス耐性 3.5以上", ok: s.stress  >= 3.5},
        {label:"積極性 3.0以上",       ok: s.active  >= 3.0},
        {label:"達成動機 3.0以上",     ok: s.achieve >= 3.0},
        {label:"MVV適合性 3.5以上",    ok: s.mvv     >= 3.5},
      ];
    },
  },
  {
    key:"home", name:"ホームエネルギー営業部", color:"#d97706", bg:"#fef3c7",
    desc:"個人宅向け訪問営業（太陽光・蓄電池）",
    note:"体力が必要な訪問営業のため男性のみ対象。断られ続ける環境への耐性と粘り強さが必須。",
    conds: function(s, g) {
      return [
        {label:"ストレス耐性 3.5以上", ok: s.stress >= 3.5},
        {label:"積極性 3.0以上",       ok: s.active >= 3.0},
        {label:"協調性 3.0以上",       ok: s.coop   >= 3.0},
        {label:"MVV適合性 3.5以上",    ok: s.mvv    >= 3.5},
        {label:"性別：男性",           ok: g === "男性"},
      ];
    },
  },
  {
    key:"retail", name:"電力小売事業部", color:"#0d9488", bg:"#f0fdfa",
    desc:"新電力 テレアポ（数を追いかける営業）",
    note:"架電数を高水準で維持しながら共感力で顧客の心を開く力が重要。勤労意欲が高い人が定着しやすい。",
    conds: function(s, g) {
      return [
        {label:"共感性 3.0以上",    ok: s.empathy >= 3.0},
        {label:"勤労意欲 3.0以上",  ok: s.work    >= 3.0},
        {label:"ストレス耐性 3.5以上", ok: s.stress >= 3.5},
        {label:"競争性 2.5以上",    ok: s.compete >= 2.5},
        {label:"MVV適合性 3.5以上", ok: s.mvv     >= 3.5},
      ];
    },
  },
];

const HR_PW = "hr2026";

function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length-1; i > 0; i--) {
    var j = Math.floor(Math.random()*(i+1)), t = a[i]; a[i]=a[j]; a[j]=t;
  }
  return a;
}

function calcScores(ans) {
  var s = {};
  FACTORS.forEach(function(f) {
    var qs = QUESTIONS_MASTER.filter(function(q){ return q.factor===f.key; });
    var vals = qs.map(function(q){
      var v = ans[q.id];
      if (v===undefined) return null;
      return q.rev ? (6-v) : v;
    }).filter(function(v){ return v!==null; });
    s[f.key] = vals.length ? vals.reduce(function(a,b){return a+b;},0)/vals.length : 0;
  });
  return s;
}

function getJudgment(s) {
  if (s.stress < THR.stress.min) return "要注意";
  if (s.mvv    < THR.mvv.min)    return "MVV不適合";
  var fails = FACTORS.filter(function(f){ return THR[f.key].required && s[f.key]<THR[f.key].min; });
  if (fails.length===0)  return "採用推奨";
  if (fails.length<=2)   return "要面接確認";
  return "採用慎重検討";
}

var J_STYLE = {
  "採用推奨":     {color:"#10b981", bg:"#d1fae5", msg:"必須因子・MVVすべてクリアです。総合的に採用を推奨します。"},
  "要面接確認":   {color:"#f59e0b", bg:"#fef3c7", msg:"一部の必須因子が基準を下回っています。面接で詳しく確認してください。"},
  "採用慎重検討": {color:"#ef4444", bg:"#fee2e2", msg:"複数の必須因子が基準未満です。採用には慎重な判断が必要です。"},
  "要注意":       {color:"#ef4444", bg:"#fee2e2", msg:"ストレス耐性が基準を下回っています。早期離職リスクが高い傾向があります。"},
  "MVV不適合":    {color:"#6d28d9", bg:"#ede9fe", msg:"MVV適合性スコアが基準を下回っています。価値観・共感度を面接で深掘りしてください。"},
};

function deptMatch(scores, gender) {
  return DEPTS.map(function(d) {
    var cs = d.conds(scores, gender);
    var ok = cs.filter(function(c){ return c.ok; }).length;
    return {d:d, cs:cs, ok:ok, total:cs.length, rate:Math.round(ok/cs.length*100)};
  }).sort(function(a,b){ return b.rate-a.rate; });
}

function RadarChart(props) {
  var scores = props.scores;
  var cx=150,cy=155,r=95,n=FACTORS.length;
  var pts = FACTORS.map(function(f,i){
    var angle=Math.PI*2*i/n-Math.PI/2, ratio=(scores[f.key]||0)/5;
    return {
      x:cx+r*ratio*Math.cos(angle), y:cy+r*ratio*Math.sin(angle),
      fx:cx+r*Math.cos(angle),      fy:cy+r*Math.sin(angle),
      lx:cx+(r+24)*Math.cos(angle), ly:cy+(r+24)*Math.sin(angle),
      label:f.label, color:f.color
    };
  });
  var poly = pts.map(function(p){return p.x+","+p.y;}).join(" ");
  var grids = [0.2,0.4,0.6,0.8,1].map(function(ratio){
    return FACTORS.map(function(_,i){
      var a=Math.PI*2*i/n-Math.PI/2;
      return (cx+r*ratio*Math.cos(a))+","+(cy+r*ratio*Math.sin(a));
    }).join(" ");
  });
  return (
    <svg width="320" height="320" viewBox="0 0 320 320" style={{display:"block",margin:"0 auto"}}>
      {grids.map(function(g,i){ return <polygon key={i} points={g} fill="none" stroke="var(--color-border-secondary)" strokeWidth="0.8"/>; })}
      {pts.map(function(p,i){ return <line key={i} x1={cx} y1={cy} x2={p.fx} y2={p.fy} stroke="var(--color-border-secondary)" strokeWidth="0.8"/>; })}
      <polygon points={poly} fill="#3b82f622" stroke="#3b82f6" strokeWidth="2"/>
      {pts.map(function(p,i){ return <circle key={i} cx={p.x} cy={p.y} r="4" fill={p.color}/>; })}
      {pts.map(function(p,i){ return <text key={i} x={p.lx} y={p.ly} textAnchor="middle" dominantBaseline="central" fontSize="9" fill="var(--color-text-secondary)">{p.label}</text>; })}
    </svg>
  );
}

function ScoreBar(props) {
  var f=props.factor, score=props.score, th=THR[f.key], pass=score>=th.min;
  var tagBg = th.label==="MVV必須"?"#ede9fe":th.required?"#fee2e2":"#e0f2fe";
  var tagCol= th.label==="MVV必須"?"#6d28d9":th.required?"#ef4444":"#0284c7";
  return (
    <div style={{marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:12,fontWeight:500}}>{f.label}</span>
          <span style={{fontSize:10,padding:"1px 6px",borderRadius:10,background:tagBg,color:tagCol}}>{th.label}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:12,fontWeight:500,color:f.color}}>{score.toFixed(1)}</span>
          <span style={{fontSize:11,color:pass?"#10b981":"#ef4444",fontWeight:500}}>{pass?"✓ クリア":"✗ 基準未満"}</span>
        </div>
      </div>
      <div style={{background:"var(--color-background-secondary)",borderRadius:4,height:10,overflow:"hidden"}}>
        <div style={{width:(score/5*100)+"%",height:"100%",background:f.color,borderRadius:4,transition:"width 0.5s"}}/>
      </div>
      <div style={{fontSize:10,color:"var(--color-text-secondary)",marginTop:1}}>基準値：{th.min} / 5.0</div>
    </div>
  );
}

async function generateComment(scores, info, verdict, dept1) {
  var factorLines = FACTORS.map(function(f){
    return f.label + "：" + scores[f.key].toFixed(2) + "点（基準" + THR[f.key].min + "点）";
  }).join("\n");
  var prompt = [
    "あなたは採用人事の専門家です。以下の適性検査結果をもとに、この候補者の特徴・傾向を人事担当者向けに200字程度の日本語で簡潔にまとめてください。",
    "強みと懸念点の両方に触れ、面接で確認すべきポイントも1点挙げてください。箇条書きは使わず、自然な文章でまとめてください。",
    "",
    "【候補者基本情報】",
    "氏名：" + info.name + "　年齢：" + info.age + "歳　性別：" + info.gender,
    "総合判定：" + verdict,
    "第1候補部署：" + dept1,
    "",
    "【因子別スコア（5点満点）】",
    factorLines,
  ].join("\n");

  var res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{role:"user", content: prompt}]
    })
  });
  var data = await res.json();
  var text = (data.content || []).filter(function(b){return b.type==="text";}).map(function(b){return b.text;}).join("");
  return text || "コメントの生成に失敗しました。";
}

function downloadCSV(records) {
  var header = ["受検日時","氏名","年齢","性別","応募媒体","総合判定","第1候補部署"].concat(FACTORS.map(function(f){return f.label;}));
  var rows = records.map(function(r){
    var cols = [r.date,r.name,r.age,r.gender,r.media,r.judgment,r.dept1];
    FACTORS.forEach(function(f){ cols.push(r.scores[f.key].toFixed(2)); });
    return cols.map(function(c){ return '"'+String(c).replace(/"/g,'""')+'"'; }).join(",");
  });
  var csv = "\uFEFF"+header.join(",")+"\n"+rows.join("\n");
  var blob = new Blob([csv],{type:"text/csv;charset=utf-8;"});
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a"); a.href=url; a.download="適性検査結果_"+new Date().toLocaleDateString("ja-JP")+".csv";
  a.click(); URL.revokeObjectURL(url);
}

export default function App() {
  var shuffled = useRef(null);
  if (!shuffled.current) shuffled.current = shuffle(QUESTIONS_MASTER);
  var QS = shuffled.current;
  var total = QS.length;

  var initScreen = (function(){
    try {
      var p = window.location.search || "";
      if (p.indexOf("hr") !== -1) return "list";
    } catch(e){}
    return "top";
  })();
  var [screen,  setScreen]  = useState(initScreen);
  var [info,    setInfo]    = useState({name:"",age:"",gender:"",media:""});
  var [answers, setAnswers] = useState({});
  var [cur,     setCur]     = useState(0);
  var [pw,      setPw]      = useState("");
  var [pwErr,   setPwErr]   = useState(false);
  var [pwOk,    setPwOk]    = useState(false);
  var [records, setRecords] = useState([]);
  var [lPw,     setLPw]     = useState("");
  var [lPwOk,   setLPwOk]   = useState(false);
  var [lPwErr,  setLPwErr]  = useState(false);
  var [tab,     setTab]     = useState("result");

  var [comment,    setComment]    = useState("");
  var [commentLoading, setCommentLoading] = useState(false);

  var scores  = useMemo(function(){ return calcScores(answers); }, [answers]);
  var verdict = useMemo(function(){ return getJudgment(scores); }, [scores]);
  var jst     = J_STYLE[verdict] || {color:"#6b7280",bg:"#f3f4f6",msg:""};
  var matches = useMemo(function(){ return deptMatch(scores, info.gender); }, [scores, info.gender]);

  var inp = {fontSize:13,padding:"7px 10px",borderRadius:8,border:"1px solid var(--color-border-secondary)",background:"var(--color-background-primary)",color:"var(--color-text-primary)",width:"100%",boxSizing:"border-box",marginBottom:10};
  function btn(bg,col,full){ return {background:bg,color:col||"#fff",border:"none",borderRadius:10,padding:"10px 24px",cursor:"pointer",fontSize:14,fontWeight:500,width:full?"100%":"auto"}; }

  function saveRecord() {
    var now = new Date();
    var dt = now.getFullYear()+"/"+(now.getMonth()+1)+"/"+now.getDate()+" "+now.getHours()+":"+String(now.getMinutes()).padStart(2,"0");
    var sc = calcScores(answers);
    var ms = deptMatch(sc, info.gender);
    setRecords(function(p){ return p.concat([{date:dt,name:info.name,age:info.age,gender:info.gender,media:info.media||"—",scores:sc,judgment:getJudgment(sc),dept1:ms[0].d.name}]); });
  }

  // TOP
  if (screen==="top") return (
    <div style={{padding:24,maxWidth:520,margin:"0 auto",textAlign:"center"}}>
      <div style={{fontSize:22,fontWeight:500,marginBottom:6}}>SAITEKI GROUP 適性検査</div>
      <div style={{fontSize:13,color:"var(--color-text-secondary)",marginBottom:4}}>営業職向け</div>
      <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:24}}>全{total}問 ／ 所要時間 約10〜12分</div>
      <div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:16,marginBottom:24,textAlign:"left"}}>
        <div style={{fontSize:13,color:"var(--color-text-secondary)",lineHeight:1.8}}>各設問を読み、あなた自身に当てはまる度合いを5段階で選んでください。正解・不正解はありません。直感で答えてください。</div>
      </div>
      <button style={btn("#0d9488","#fff",true)} onClick={function(){setScreen("info");}}>検査を開始する</button>
      <div style={{marginTop:16}}>
        <button style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:"var(--color-text-secondary)",textDecoration:"underline"}} onClick={function(){setScreen("list");}}>人事担当者：結果一覧を見る</button>
      </div>
    </div>
  );

  // INFO
  if (screen==="info") return (
    <div style={{padding:24,maxWidth:440,margin:"0 auto"}}>
      <div style={{fontSize:18,fontWeight:500,marginBottom:16}}>受検者情報</div>
      <div style={{fontSize:12,marginBottom:4}}>氏名 <span style={{color:"#ef4444"}}>*</span></div>
      <input style={inp} value={info.name} onChange={function(e){setInfo(function(v){return Object.assign({},v,{name:e.target.value});});}} placeholder="例：田中 太郎"/>
      <div style={{fontSize:12,marginBottom:4}}>年齢 <span style={{color:"#ef4444"}}>*</span></div>
      <input type="number" style={inp} value={info.age} onChange={function(e){setInfo(function(v){return Object.assign({},v,{age:e.target.value});});}} placeholder="例：28"/>
      <div style={{fontSize:12,marginBottom:4}}>性別 <span style={{color:"#ef4444"}}>*</span></div>
      <select style={inp} value={info.gender} onChange={function(e){setInfo(function(v){return Object.assign({},v,{gender:e.target.value});}); }}>
        <option value="">選択してください</option>
        <option value="男性">男性</option>
        <option value="女性">女性</option>
        <option value="回答しない">回答しない</option>
      </select>
      <div style={{fontSize:12,marginBottom:4}}>応募媒体</div>
      <input style={inp} value={info.media} onChange={function(e){setInfo(function(v){return Object.assign({},v,{media:e.target.value});});}} placeholder="例：マイナビ"/>
      <div style={{height:8}}/>
      <button style={btn("#0d9488","#fff",true)} onClick={function(){
        if(!info.name.trim()){alert("氏名を入力してください");return;}
        if(!info.age){alert("年齢を入力してください");return;}
        if(!info.gender){alert("性別を選択してください");return;}
        shuffled.current=shuffle(QUESTIONS_MASTER);
        setAnswers({});setCur(0);setScreen("test");
      }}>検査へ進む</button>
    </div>
  );

  // TEST
  if (screen==="test") {
    var q=QS[cur], prog=(cur/total)*100;
    return (
      <div style={{padding:20,maxWidth:540,margin:"0 auto"}}>
        <div style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"var(--color-text-secondary)",marginBottom:4}}>
            <span>{cur+1} / {total}問</span><span>{Math.round(prog)}%</span>
          </div>
          <div style={{background:"var(--color-background-secondary)",borderRadius:4,height:6,overflow:"hidden"}}>
            <div style={{width:prog+"%",height:"100%",background:"#0d9488",transition:"width 0.3s"}}/>
          </div>
        </div>
        <div style={{fontSize:15,fontWeight:500,lineHeight:1.9,marginBottom:28,minHeight:60}}>{q.text}</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {CHOICES.map(function(label,i){
            var val=i+1, sel=answers[q.id]===val;
            return (
              <button key={i} onClick={function(){
                var na=Object.assign({},answers); na[q.id]=val; setAnswers(na);
                setTimeout(function(){
                  if(cur<total-1) setCur(function(c){return c+1;});
                  else setScreen("done");
                },180);
              }} style={{padding:"11px 16px",borderRadius:10,border:"1.5px solid "+(sel?"#0d9488":"var(--color-border-secondary)"),background:sel?"#f0fdfa":"var(--color-background-primary)",color:sel?"#0d9488":"var(--color-text-primary)",cursor:"pointer",textAlign:"left",fontSize:13,fontWeight:sel?500:400}}>
                {label}
              </button>
            );
          })}
        </div>
        {cur>0 && <button onClick={function(){setCur(function(c){return c-1;});}} style={{background:"none",border:"none",cursor:"pointer",marginTop:16,fontSize:12,color:"var(--color-text-secondary)",padding:0}}>← 前の問いに戻る</button>}
      </div>
    );
  }

  // DONE
  if (screen==="done") return (
    <div style={{padding:32,maxWidth:480,margin:"0 auto",textAlign:"center"}}>
      <div style={{fontSize:40,marginBottom:16}}>✓</div>
      <div style={{fontSize:20,fontWeight:500,marginBottom:12}}>お疲れ様でした</div>
      <div style={{fontSize:14,color:"var(--color-text-secondary)",lineHeight:1.8,marginBottom:28}}>検査が完了しました。結果は人事担当者が確認いたします。このまま画面を閉じてください。</div>
      <div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:20,textAlign:"left"}}>
        <div style={{fontSize:13,fontWeight:500,marginBottom:8}}>人事担当者の方へ</div>
        <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:10}}>パスワードを入力して結果を確認してください。</div>
        <input type="password" style={inp} value={pw} onChange={function(e){setPw(e.target.value);setPwErr(false);}} placeholder="パスワードを入力"/>
        {pwErr && <div style={{fontSize:12,color:"#ef4444",marginBottom:8}}>パスワードが違います</div>}
        <button style={btn("#0d9488","#fff",true)} onClick={function(){
          if(pw===HR_PW){saveRecord();setPwOk(true);setTab("result");setScreen("result");}
          else setPwErr(true);
        }}>結果を確認する</button>
      </div>
    </div>
  );

  // RESULT
  if (screen==="result" && pwOk) {
    var fails = FACTORS.filter(function(f){return scores[f.key]<THR[f.key].min;});
    return (
      <div style={{padding:20,maxWidth:620,margin:"0 auto"}}>
        <div style={{display:"flex",gap:4,marginBottom:16,borderBottom:"1px solid var(--color-border-secondary)"}}>
          {["result","list"].map(function(t){
            return <button key={t} onClick={function(){setTab(t);}} style={{background:"none",border:"none",cursor:"pointer",padding:"8px 16px",fontSize:13,fontWeight:tab===t?500:400,color:tab===t?"var(--color-text-primary)":"var(--color-text-secondary)",borderBottom:tab===t?"2px solid #0d9488":"2px solid transparent",marginBottom:-1}}>{t==="result"?"今回の結果":"結果一覧・CSV"}</button>;
          })}
        </div>

        {tab==="result" && (
          <div>
            <div style={{fontSize:18,fontWeight:500,marginBottom:4}}>検査結果レポート</div>
            <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:14}}>
              {info.name}　{info.age}歳　{info.gender}　{info.media?"媒体："+info.media:""}　<span style={{background:"#fef3c7",color:"#92400e",padding:"1px 8px",borderRadius:8,fontSize:11}}>人事専用</span>
            </div>

            {/* AI傾向コメント */}
            <div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:16,marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontSize:14,fontWeight:500}}>AI候補者傾向コメント</div>
                {!comment && !commentLoading && (
                  <button style={btn("#6d28d9")} onClick={function(){
                    setCommentLoading(true);
                    generateComment(scores, info, verdict, matches[0].d.name)
                      .then(function(t){ setComment(t); setCommentLoading(false); })
                      .catch(function(){ setComment("生成に失敗しました。再度お試しください。"); setCommentLoading(false); });
                  }}>AIで傾向を生成</button>
                )}
                {comment && (
                  <button style={{background:"none",border:"1px solid var(--color-border-secondary)",borderRadius:8,padding:"5px 12px",cursor:"pointer",fontSize:12,color:"var(--color-text-secondary)"}} onClick={function(){
                    setComment(""); setCommentLoading(false);
                  }}>再生成</button>
                )}
              </div>
              {commentLoading && (
                <div style={{display:"flex",alignItems:"center",gap:8,padding:"12px 0",color:"var(--color-text-secondary)",fontSize:13}}>
                  <div style={{width:16,height:16,border:"2px solid #6d28d9",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
                  候補者の傾向を分析中...
                </div>
              )}
              {comment && !commentLoading && (
                <div style={{fontSize:13,lineHeight:1.9,color:"var(--color-text-primary)",padding:"10px 12px",background:"var(--color-background-primary)",borderRadius:8,border:"1px solid var(--color-border-secondary)"}}>{comment}</div>
              )}
              {!comment && !commentLoading && (
                <div style={{fontSize:12,color:"var(--color-text-secondary)"}}>ボタンを押すと、スコアをもとにAIが候補者の傾向・強み・懸念点を文章でまとめます。</div>
              )}
            </div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

            {/* 総合判定 */}
            <div style={{background:jst.bg,borderRadius:12,padding:16,marginBottom:14,border:"1px solid "+jst.color+"44"}}>
              <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:4}}>総合判定</div>
              <div style={{fontSize:22,fontWeight:500,color:jst.color,marginBottom:6}}>{verdict}</div>
              <div style={{fontSize:13,lineHeight:1.7}}>{jst.msg}</div>
            </div>

            {/* 部署マッチング */}
            <div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:16,marginBottom:14}}>
              <div style={{fontSize:14,fontWeight:500,marginBottom:12}}>部署適性マッチング</div>
              {matches.map(function(m,i){
                var d=m.d;
                var rankLabel=["第1候補","第2候補","第3候補"][i];
                return (
                  <div key={d.key} style={{marginBottom:10,border:"1px solid "+(i===0?d.color+"77":"var(--color-border-secondary)"),borderRadius:10,padding:12,background:i===0?d.bg:"var(--color-background-primary)"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                      <div>
                        <span style={{fontSize:10,fontWeight:500,padding:"1px 7px",borderRadius:8,border:"1px solid "+(i===0?d.color+"77":"var(--color-border-secondary)"),color:i===0?d.color:"var(--color-text-secondary)",marginRight:6}}>{rankLabel}</span>
                        <span style={{fontSize:13,fontWeight:500,color:i===0?d.color:"var(--color-text-primary)"}}>{d.name}</span>
                        <div style={{fontSize:11,color:"var(--color-text-secondary)",marginTop:2}}>{d.desc}</div>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0,marginLeft:8}}>
                        <div style={{fontSize:22,fontWeight:500,color:i===0?d.color:"var(--color-text-secondary)"}}>{m.rate}%</div>
                        <div style={{fontSize:10,color:"var(--color-text-secondary)"}}>{m.ok}/{m.total}項目</div>
                      </div>
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:6}}>
                      {m.cs.map(function(c,j){
                        return <span key={j} style={{fontSize:10,padding:"2px 8px",borderRadius:8,background:c.ok?"#dcfce7":"#fee2e2",color:c.ok?"#16a34a":"#dc2626"}}>{c.ok?"✓":"✗"} {c.label}</span>;
                      })}
                    </div>
                    <div style={{fontSize:11,color:"var(--color-text-secondary)",lineHeight:1.6}}>{d.note}</div>
                  </div>
                );
              })}
            </div>

            {/* MVVスコア */}
            <div style={{background:"#f0fdfa",borderRadius:12,padding:14,marginBottom:14,border:"1px solid #0d948844"}}>
              <div style={{fontSize:13,fontWeight:500,color:"#0d9488",marginBottom:6}}>MVV適合性スコア</div>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{fontSize:28,fontWeight:500,color:"#0d9488"}}>{(scores.mvv||0).toFixed(1)}<span style={{fontSize:13,color:"var(--color-text-secondary)",fontWeight:400}}> / 5.0</span></div>
                <div style={{fontSize:12,color:"var(--color-text-secondary)",lineHeight:1.7}}>
                  Mission・Vision・Value・Credoへの共感度<br/>
                  基準値：3.5以上　{scores.mvv>=3.5?"✓ クリア":"✗ 面接で価値観を深掘りしてください"}
                </div>
              </div>
            </div>

            {/* レーダー */}
            <div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:16,marginBottom:14}}>
              <div style={{fontSize:14,fontWeight:500,marginBottom:10}}>因子バランス</div>
              <RadarChart scores={scores}/>
            </div>

            {/* スコアバー */}
            <div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:16,marginBottom:14}}>
              <div style={{fontSize:14,fontWeight:500,marginBottom:14}}>因子別スコア</div>
              {FACTORS.map(function(f){ return <ScoreBar key={f.key} factor={f} score={scores[f.key]}/>; })}
            </div>

            {/* 面接ポイント */}
            <div style={{background:"var(--color-background-secondary)",borderRadius:12,padding:16,marginBottom:16}}>
              <div style={{fontSize:14,fontWeight:500,marginBottom:10}}>面接での確認推奨ポイント</div>
              {fails.length===0
                ? <div style={{fontSize:13,color:"var(--color-text-secondary)"}}>全因子が基準をクリアしています。面接では強みをさらに深掘りしてください。</div>
                : fails.map(function(f){
                    return (
                      <div key={f.key} style={{display:"flex",gap:8,marginBottom:8,alignItems:"flex-start"}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:f.color,marginTop:4,flexShrink:0}}/>
                        <div>
                          <span style={{fontSize:13,fontWeight:500}}>{f.label}</span>
                          <span style={{fontSize:12,color:"var(--color-text-secondary)",marginLeft:6}}>について具体的なエピソードを確認してください</span>
                        </div>
                      </div>
                    );
                  })
              }
            </div>

            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <button style={btn("#0d9488")} onClick={function(){window.print();}}>印刷 / PDF保存</button>
              <button style={btn("#10b981")} onClick={function(){downloadCSV(records);}}>CSV出力（全{records.length}件）</button>
              <button style={btn("var(--color-background-secondary)","var(--color-text-secondary)")} onClick={function(){
                setAnswers({});setCur(0);setInfo({name:"",age:"",gender:"",media:""});setPw("");setPwOk(false);setScreen("top");
              }}>次の受検者へ</button>
            </div>
          </div>
        )}

        {tab==="list" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div style={{fontSize:16,fontWeight:500}}>受検者一覧　<span style={{fontSize:13,color:"var(--color-text-secondary)",fontWeight:400}}>{records.length}件</span></div>
              <button style={btn("#10b981")} onClick={function(){downloadCSV(records);}}>CSV出力</button>
            </div>
            {records.length===0
              ? <div style={{fontSize:13,color:"var(--color-text-secondary)",padding:24,textAlign:"center"}}>まだ受検データがありません</div>
              : (
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                    <thead>
                      <tr style={{borderBottom:"1px solid var(--color-border-secondary)"}}>
                        {["受検日時","氏名","年齢","性別","媒体","判定","第1候補部署"].concat(FACTORS.map(function(f){return f.label;})).map(function(h){
                          return <th key={h} style={{padding:"6px",textAlign:"left",color:"var(--color-text-secondary)",fontWeight:400,whiteSpace:"nowrap"}}>{h}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {records.map(function(r,i){
                        var jc={"採用推奨":"#10b981","要面接確認":"#f59e0b","採用慎重検討":"#ef4444","要注意":"#ef4444","MVV不適合":"#6d28d9"}[r.judgment]||"#6b7280";
                        return (
                          <tr key={i} style={{borderBottom:"1px solid var(--color-border-tertiary)"}}>
                            <td style={{padding:"6px",color:"var(--color-text-secondary)",whiteSpace:"nowrap"}}>{r.date}</td>
                            <td style={{padding:"6px",fontWeight:500}}>{r.name}</td>
                            <td style={{padding:"6px",color:"var(--color-text-secondary)"}}>{r.age}</td>
                            <td style={{padding:"6px",color:"var(--color-text-secondary)"}}>{r.gender}</td>
                            <td style={{padding:"6px",color:"var(--color-text-secondary)"}}>{r.media}</td>
                            <td style={{padding:"6px"}}><span style={{color:jc,fontWeight:500}}>{r.judgment}</span></td>
                            <td style={{padding:"6px",fontSize:11,color:"var(--color-text-secondary)"}}>{r.dept1}</td>
                            {FACTORS.map(function(f){
                              var sc=r.scores[f.key],pass=sc>=THR[f.key].min;
                              return <td key={f.key} style={{padding:"6px",textAlign:"center",color:pass?f.color:"#ef4444",fontWeight:500}}>{sc.toFixed(1)}</td>;
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )
            }
          </div>
        )}
      </div>
    );
  }

  // LIST（TOPから直接）
  if (screen==="list") {
    if (!lPwOk) return (
      <div style={{padding:32,maxWidth:400,margin:"0 auto"}}>
        <div style={{fontSize:16,fontWeight:500,marginBottom:16}}>人事担当者ログイン</div>
        <input type="password" style={inp} value={lPw} onChange={function(e){setLPw(e.target.value);setLPwErr(false);}} placeholder="パスワードを入力"/>
        {lPwErr && <div style={{fontSize:12,color:"#ef4444",marginBottom:8}}>パスワードが違います</div>}
        <div style={{display:"flex",gap:8}}>
          <button style={btn("#0d9488")} onClick={function(){if(lPw===HR_PW)setLPwOk(true);else setLPwErr(true);}}>確認</button>
          <button style={btn("var(--color-background-secondary)","var(--color-text-secondary)")} onClick={function(){setScreen("top");}}>戻る</button>
        </div>
      </div>
    );
    return (
      <div style={{padding:20,maxWidth:720,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontSize:18,fontWeight:500}}>受検者一覧　<span style={{fontSize:13,color:"var(--color-text-secondary)",fontWeight:400}}>{records.length}件</span></div>
          <div style={{display:"flex",gap:8}}>
            <button style={btn("#10b981")} onClick={function(){downloadCSV(records);}}>CSV出力</button>
            <button style={btn("var(--color-background-secondary)","var(--color-text-secondary)")} onClick={function(){setScreen("top");setLPwOk(false);setLPw("");}}>戻る</button>
          </div>
        </div>
        {records.length===0
          ? <div style={{fontSize:13,color:"var(--color-text-secondary)",padding:32,textAlign:"center",background:"var(--color-background-secondary)",borderRadius:12}}>まだ受検データがありません</div>
          : (
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                <thead>
                  <tr style={{borderBottom:"1px solid var(--color-border-secondary)"}}>
                    {["受検日時","氏名","年齢","性別","媒体","判定","第1候補部署"].concat(FACTORS.map(function(f){return f.label;})).map(function(h){
                      return <th key={h} style={{padding:"6px",textAlign:"left",color:"var(--color-text-secondary)",fontWeight:400,whiteSpace:"nowrap"}}>{h}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {records.map(function(r,i){
                    var jc={"採用推奨":"#10b981","要面接確認":"#f59e0b","採用慎重検討":"#ef4444","要注意":"#ef4444","MVV不適合":"#6d28d9"}[r.judgment]||"#6b7280";
                    return (
                      <tr key={i} style={{borderBottom:"1px solid var(--color-border-tertiary)"}}>
                        <td style={{padding:"6px",color:"var(--color-text-secondary)",whiteSpace:"nowrap"}}>{r.date}</td>
                        <td style={{padding:"6px",fontWeight:500}}>{r.name}</td>
                        <td style={{padding:"6px",color:"var(--color-text-secondary)"}}>{r.age}</td>
                        <td style={{padding:"6px",color:"var(--color-text-secondary)"}}>{r.gender}</td>
                        <td style={{padding:"6px",color:"var(--color-text-secondary)"}}>{r.media}</td>
                        <td style={{padding:"6px"}}><span style={{color:jc,fontWeight:500}}>{r.judgment}</span></td>
                        <td style={{padding:"6px",fontSize:11,color:"var(--color-text-secondary)"}}>{r.dept1}</td>
                        {FACTORS.map(function(f){
                          var sc=r.scores[f.key],pass=sc>=THR[f.key].min;
                          return <td key={f.key} style={{padding:"6px",textAlign:"center",color:pass?f.color:"#ef4444",fontWeight:500}}>{sc.toFixed(1)}</td>;
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    );
  }

  return null;
}
