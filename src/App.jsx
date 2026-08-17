import { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";

const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const US_STATES=["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];
const STATE_NAMES={AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",CO:"Colorado",CT:"Connecticut",DE:"Delaware",FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",IN:"Indiana",IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",MS:"Mississippi",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",NY:"New York",NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming",DC:"Washington DC"};
const REUNION_CITIES=["Indianapolis, IN","Atlanta, GA","Nashville, TN","Charlotte, NC","Chicago, IL","Akron/Canton, OH"];
const CITY_TAGS={"Indianapolis, IN":"★ Hometown","Atlanta, GA":"Major Hub","Nashville, TN":"Affordable","Charlotte, NC":"East Coast","Chicago, IL":"Midwest Hub","Akron/Canton, OH":"Family Roots"};
const STATE_GRID={ME:[0,10],VT:[1,9],NH:[1,10],WA:[2,0],MT:[2,1],ND:[2,2],MN:[2,3],WI:[2,5],MI:[2,7],NY:[2,9],MA:[2,10],CT:[2,11],OR:[3,0],ID:[3,1],SD:[3,2],IA:[3,3],IL:[3,5],IN:[3,6],OH:[3,7],PA:[3,8],NJ:[3,9],RI:[3,10],NV:[4,0],WY:[4,1],NE:[4,2],MO:[4,3],KY:[4,5],WV:[4,6],VA:[4,7],MD:[4,8],DE:[4,9],DC:[4,10],CA:[5,0],UT:[5,1],CO:[5,2],KS:[5,3],AR:[5,4],TN:[5,5],NC:[5,6],SC:[5,7],AZ:[6,1],NM:[6,2],OK:[6,3],LA:[6,4],MS:[6,5],AL:[6,6],GA:[6,7],HI:[7,0],TX:[7,3],FL:[7,7],AK:[7,10]};
const BRANCHES=[{x:195,y:210,cx:380,cy:500},{x:140,y:370,cx:340,cy:560},{x:260,y:500,cx:420,cy:620},{x:370,y:140,cx:480,cy:440},{x:430,y:340,cx:520,cy:520},{x:420,y:510,cx:530,cy:620},{x:700,y:85,cx:700,cy:400},{x:970,y:340,cx:880,cy:520},{x:980,y:510,cx:870,cy:620},{x:1030,y:140,cx:920,cy:440},{x:1200,y:210,cx:1020,cy:500},{x:1260,y:370,cx:1060,cy:560},{x:1140,y:500,cx:980,cy:620}];
const COST_ESTIMATES={
  "Indianapolis, IN":{hotel:110,flight:220,food:45,venue:15},
  "Atlanta, GA":{hotel:120,flight:200,food:50,venue:18},
  "Nashville, TN":{hotel:130,flight:240,food:50,venue:20},
  "Charlotte, NC":{hotel:115,flight:230,food:45,venue:15},
  "Chicago, IL":{hotel:140,flight:210,food:55,venue:22},
  "Akron/Canton, OH":{hotel:95,flight:260,food:40,venue:12},
};

const INITIAL_MEMBERS=[
  {id:"root-1",name:"Aurthur Coleman",age:"",birthMonth:"",city:"Indianapolis",state:"IN",phone:"",email:"",isRootParent:true,isRootChild:false,isDeceased:true,parentId:null,parentRootId:null,spouse:"Orma Ree",childrenUnder18:[]},
  {id:"root-2",name:"Orma Ree Coleman",age:"",birthMonth:"",city:"Indianapolis",state:"IN",phone:"",email:"",isRootParent:true,isRootChild:false,isDeceased:true,parentId:null,parentRootId:null,spouse:"Aurthur Coleman",childrenUnder18:[]},
  {id:"child-01",name:"Doris (Thompson) Stigger",age:"",birthMonth:"",city:"",state:"",phone:"",email:"",isRootParent:false,isRootChild:true,isDeceased:true,parentId:"root",parentRootId:"child-01",spouse:"",childrenUnder18:[]},
  {id:"child-02",name:"Samuel Thompson Jr",age:"",birthMonth:"",city:"",state:"",phone:"",email:"",isRootParent:false,isRootChild:true,isDeceased:true,parentId:"root",parentRootId:"child-02",spouse:"",childrenUnder18:[]},
  {id:"child-03",name:"Luther Coleman",age:"",birthMonth:"",city:"",state:"",phone:"",email:"",isRootParent:false,isRootChild:true,isDeceased:true,parentId:"root",parentRootId:"child-03",spouse:"",childrenUnder18:[]},
  {id:"child-04",name:"Sammie Coleman",age:"",birthMonth:"",city:"",state:"",phone:"",email:"",isRootParent:false,isRootChild:true,isDeceased:false,parentId:"root",parentRootId:"child-04",spouse:"",childrenUnder18:[]},
  {id:"child-05",name:"Shirley (Coleman) Fulton",age:"",birthMonth:"",city:"",state:"",phone:"",email:"",isRootParent:false,isRootChild:true,isDeceased:false,parentId:"root",parentRootId:"child-05",spouse:"",childrenUnder18:[]},
  {id:"child-06",name:"Paulette (Coleman) Hill",age:"",birthMonth:"",city:"",state:"",phone:"",email:"",isRootParent:false,isRootChild:true,isDeceased:true,parentId:"root",parentRootId:"child-06",spouse:"",childrenUnder18:[]},
  {id:"child-07",name:"Norma (Coleman) Arnold",age:"",birthMonth:"",city:"",state:"",phone:"",email:"",isRootParent:false,isRootChild:true,isDeceased:true,parentId:"root",parentRootId:"child-07",spouse:"",childrenUnder18:[]},
  {id:"child-08",name:"Jackie Coleman",age:"",birthMonth:"",city:"",state:"",phone:"",email:"",isRootParent:false,isRootChild:true,isDeceased:false,parentId:"root",parentRootId:"child-08",spouse:"",childrenUnder18:[]},
  {id:"child-09",name:"Arlene Coleman",age:"",birthMonth:"",city:"",state:"",phone:"",email:"",isRootParent:false,isRootChild:true,isDeceased:false,parentId:"root",parentRootId:"child-09",spouse:"",childrenUnder18:[]},
  {id:"child-10",name:"Arthur Coleman Jr",age:"",birthMonth:"",city:"",state:"",phone:"",email:"",isRootParent:false,isRootChild:true,isDeceased:false,parentId:"root",parentRootId:"child-10",spouse:"",childrenUnder18:[]},
  {id:"child-11",name:"Charles Coleman",age:"",birthMonth:"",city:"",state:"",phone:"",email:"",isRootParent:false,isRootChild:true,isDeceased:false,parentId:"root",parentRootId:"child-11",spouse:"",childrenUnder18:[]},
  {id:"child-12",name:"Kevin Coleman",age:"",birthMonth:"",city:"",state:"",phone:"",email:"",isRootParent:false,isRootChild:true,isDeceased:false,parentId:"root",parentRootId:"child-12",spouse:"",childrenUnder18:[]},
  {id:"child-13",name:"Evan Coleman",age:"",birthMonth:"",city:"",state:"",phone:"",email:"",isRootParent:false,isRootChild:true,isDeceased:false,parentId:"root",parentRootId:"child-13",spouse:"",childrenUnder18:[]},
];

const genId=()=>`m-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
function findRootBranch(mid,ms){let c=ms.find(m=>m.id===mid);const v=new Set();while(c&&!v.has(c.id)){v.add(c.id);if(c.isRootChild)return c.id;if(c.isRootParent)return null;c=ms.find(m=>m.id===c.parentId);}return null;}
function getChildren(pid,ms){return ms.filter(m=>m.parentId===pid&&!m.isRootParent);}
function getAllBranch(rid,ms){const r=[];const q=[rid];const v=new Set();while(q.length>0){const p=q.shift();if(v.has(p))continue;v.add(p);ms.filter(m=>m.parentId===p&&!m.isRootParent&&!m.isRootChild).forEach(k=>{r.push(k);q.push(k.id);});}return r;}
function buildParentOpts(ms){return ms.filter(m=>m.isRootChild).map(r=>({root:r,desc:getAllBranch(r.id,ms)}));}
function getDepth(m,ms){let d=0;let c=m;const v=new Set();while(c&&!c.isRootChild&&!v.has(c.id)){v.add(c.id);d++;c=ms.find(x=>x.id===c.parentId);}return d;}
function HaloSVG({size=16}){return (<svg width={size} height={size*0.65} viewBox="0 0 24 15" style={{display:"inline-block",verticalAlign:"middle"}}><ellipse cx="12" cy="9" rx="9" ry="4" fill="none" stroke="#D4A843" strokeWidth="2.2" opacity="0.85"/><ellipse cx="12" cy="9" rx="9" ry="4" fill="none" stroke="#F5E6B8" strokeWidth="1" opacity="0.5"/></svg>);}

/* ═══ STORAGE — works in Claude artifacts AND deployed sites ═══ */
const store = {
  async get(key) {
    try {
      if (typeof window !== 'undefined' && window.storage && window.storage.get) {
        return await store.get(key);
      }
    } catch {}
    try {
      const v = localStorage.getItem(key);
      return v !== null ? { value: v } : null;
    } catch { return null; }
  },
  async set(key, value) {
    try {
      if (typeof window !== 'undefined' && window.storage && window.storage.set) {
        return await store.set(key, value);
      }
    } catch {}
    try { localStorage.setItem(key, value); return { key, value }; } catch { return null; }
  }
};

/* ═══ FAMILY PASSKEY — change this to update the passkey ═══ */
const FAMILY_PASSKEY = "Aurthur_OrmaRee_13";

/* ═══ MAIN APP — auth wrapper only ═══ */
export default function ColemanReunion(){
  const[authed,setAuthed]=useState(false);
  const[authChecked,setAuthChecked]=useState(false);
  const[passInput,setPassInput]=useState("");
  const[passError,setPassError]=useState(false);

  useEffect(()=>{(async()=>{try{const r=await store.get("coleman-auth");if(r?.value===FAMILY_PASSKEY)setAuthed(true);}catch{}setAuthChecked(true);})();},[]);

  const handleLogin=async()=>{
    if(passInput.trim()===FAMILY_PASSKEY){
      setAuthed(true);setPassError(false);
      try{await store.set("coleman-auth",FAMILY_PASSKEY);}catch{}
    }else{setPassError(true);}
  };
  const handleKeyDown=(e)=>{if(e.key==="Enter")handleLogin();};

  if(!authChecked)return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:"Georgia,serif",color:"#3B2F1E",background:"#FAF7F2"}}>Loading…</div>;

  if(!authed)return (
    <div style={{minHeight:"100vh",background:"linear-gradient(180deg,#2D5016 0%,#1B3A0E 40%,#0F2508 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{maxWidth:420,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:80,marginBottom:10,filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.3))"}}>🌳</div>
        <h1 style={{fontFamily:"Georgia,serif",color:"#fff",fontSize:"clamp(24px,5vw,36px)",margin:"0 0 6px",fontWeight:700,textShadow:"0 2px 8px rgba(0,0,0,0.3)"}}>The Coleman Family Reunion</h1>
        <p style={{color:"rgba(255,255,255,0.7)",fontSize:14,fontStyle:"italic",margin:"0 0 30px"}}>Rooted in Indianapolis — Founded by Aurthur Coleman & Orma Ree</p>
        <div style={{background:"rgba(255,255,255,0.1)",backdropFilter:"blur(10px)",borderRadius:16,padding:28,border:"1px solid rgba(255,255,255,0.15)"}}>
          <div style={{fontSize:15,color:"#fff",fontWeight:600,marginBottom:4}}>Family Access</div>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.6)",margin:"0 0 16px"}}>Enter the family passkey to continue</p>
          <input type="password" value={passInput} onChange={e=>{setPassInput(e.target.value);setPassError(false);}} onKeyDown={handleKeyDown}
            placeholder="Enter passkey"
            style={{width:"100%",padding:"14px 18px",border:passError?"2px solid #E85555":"2px solid rgba(255,255,255,0.2)",borderRadius:10,fontSize:16,background:"rgba(255,255,255,0.08)",color:"#fff",boxSizing:"border-box",outline:"none",textAlign:"center",letterSpacing:2}}/>
          {passError&&<div style={{color:"#FF8A8A",fontSize:13,marginTop:8,fontWeight:500}}>Incorrect passkey. Please try again or contact a family member.</div>}
          <button onClick={handleLogin}
            style={{marginTop:14,padding:"14px 32px",background:"linear-gradient(135deg,#4A7A28,#6AAF3D)",color:"#fff",border:"none",borderRadius:10,cursor:"pointer",fontSize:15,fontWeight:700,width:"100%",boxShadow:"0 4px 12px rgba(74,122,40,0.4)"}}>
            Enter
          </button>
        </div>
        <p style={{color:"rgba(255,255,255,0.35)",fontSize:11,marginTop:20}}>This site is for Coleman family members only.</p>
      </div>
    </div>
  );

  return <AppContent />;
}

/* ═══ APP CONTENT — only mounts after auth ═══ */
function AppContent(){
  const[members,setMembers]=useState(INITIAL_MEMBERS);
  const[page,setPage]=useState("tree");
  const[editTargetId,setEditTargetId]=useState(null);
  const[loaded,setLoaded]=useState(false);
  const[saveMsg,setSaveMsg]=useState("");
  const[showHelp,setShowHelp]=useState(false);

  useEffect(()=>{(async()=>{try{const r=await store.get("coleman-v8");if(r?.value){const p=JSON.parse(r.value);if(Array.isArray(p)&&p.length>0)setMembers(p);}}catch(e){console.error("Load error:",e);}setLoaded(true);})();},[]);
  const saveData=useCallback(async(data)=>{try{await store.set("coleman-v8",JSON.stringify(data));setSaveMsg("Saved");setTimeout(()=>setSaveMsg(""),1500);}catch{}},[]);
  const updateMember=(id,u)=>{const n=members.map(m=>m.id===id?{...m,...u}:m);setMembers(n);saveData(n);};
  const addMember=(member)=>{const rb=findRootBranch(member.parentId,members)||member.parentId;const n=[...members,{...member,id:genId(),parentRootId:rb}];setMembers(n);saveData(n);};
  const deleteMember=(id)=>{const m=members.find(x=>x.id===id);if(m?.isRootParent||m?.isRootChild)return;setMembers(p=>{const n=p.filter(x=>x.id!==id);saveData(n);return n;});};
  const rootChildren=members.filter(m=>m.isRootChild);
  const goEdit=(id)=>{setEditTargetId(id);setPage("form");};

  if(!loaded)return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:"Georgia,serif",color:"#3B2F1E",background:"#FAF7F2"}}>Loading…</div>;

  const tabs=[["tree","🌿 Tree"],["form","📝 Members"],["map","🗺 Map"],["bylaws","📜 By-Laws"],["reunion","🎉 Planner"],["costs","📅 Schedule & Costs"],["attend","👥 Attendance"],["results","📊 Tracker"]];

  return (
    <div style={{fontFamily:"'Segoe UI',system-ui,sans-serif",background:"#FAF7F2",minHeight:"100vh",color:"#3B2F1E"}}>
      <div style={{background:"linear-gradient(135deg,#2D5016 0%,#3A7D1E 50%,#2D5016 100%)",padding:"16px 20px 10px",color:"#fff",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-10,right:20,opacity:0.08,fontSize:100}}>🌳</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",position:"relative"}}>
          <div><h1 style={{fontFamily:"Georgia,serif",fontSize:"clamp(18px,4vw,28px)",margin:0,fontWeight:700}}>The Coleman Family Reunion</h1><p style={{margin:"2px 0 10px",opacity:0.8,fontSize:13,fontStyle:"italic"}}>Rooted in Indianapolis — Founded by Aurthur Coleman & Orma Ree</p></div>
          <button onClick={()=>setShowHelp(!showHelp)} style={{background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.4)",borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:15,color:"#fff",fontWeight:700,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}} title="Help">?</button>
        </div>
        <div style={{display:"flex",gap:2,flexWrap:"wrap",position:"relative"}}>{tabs.map(([k,l])=>(
          <button key={k} onClick={()=>{setPage(k);if(k!=="form")setEditTargetId(null);}} style={{padding:"6px 10px",border:"none",borderRadius:"5px 5px 0 0",cursor:"pointer",fontSize:11,fontWeight:600,background:page===k?"#FAF7F2":"rgba(255,255,255,0.15)",color:page===k?"#2D5016":"rgba(255,255,255,0.9)"}}>{l}</button>
        ))}</div>
      </div>
      {showHelp&&(<div style={{background:"#FFF8EC",borderBottom:"2px solid #E8DFD0",padding:"14px 20px"}}><div style={{maxWidth:960,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:8,fontSize:12,color:"#5C3D1E",lineHeight:1.5,flex:1}}>
          <div><strong>🌿 Tree</strong> — View the family tree. Click any name to edit.</div>
          <div><strong>📝 Members</strong> — Add new family or edit existing entries.</div>
          <div><strong>🗺 Map</strong> — See where living members are located.</div>
          <div><strong>📜 By-Laws</strong> — Family reunion guidelines (draft).</div>
          <div><strong>🎉 Planner</strong> — Submit reunion preferences.</div>
          <div><strong>📅 Schedule & Costs</strong> — Preliminary itinerary and per-person cost breakdown.</div>
          <div><strong>👥 Attendance</strong> — See who's registered and who's confirmed for the reunion.</div>
          <div><strong>📊 Tracker</strong> — See charts of everyone's preferences.</div>
        </div>
        <button onClick={()=>setShowHelp(false)} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#8B7355",flexShrink:0}}>✕</button>
      </div></div>)}
      {saveMsg&&<div style={{background:"#C4963A",color:"#fff",textAlign:"center",padding:"3px",fontSize:12,fontWeight:600}}>{saveMsg}</div>}
      <div style={{maxWidth:1200,margin:"0 auto",padding:"16px 14px"}}>
        {page==="tree"&&<TreeWrapper members={members} rootChildren={rootChildren} goEdit={goEdit}/>}
        {page==="form"&&<FormPage members={members} rootChildren={rootChildren} addMember={addMember} updateMember={updateMember} editTargetId={editTargetId} setEditTargetId={setEditTargetId}/>}
        {page==="map"&&<MapPage members={members}/>}
        {page==="bylaws"&&<ByLawsPage rootChildren={rootChildren}/>}
        {page==="reunion"&&<ReunionPage/>}
        {page==="costs"&&<CostsPage members={members}/>}
        {page==="attend"&&<AttendancePage members={members} rootChildren={rootChildren} updateMember={updateMember}/>}
        {page==="results"&&<TrackerPage/>}
      </div>
    </div>
  );
}

/* ═══ SHARED COMPONENTS ═══ */
function ParentSelector({members,value,onChange,label}){const gs=buildParentOpts(members);const is={width:"100%",padding:"10px 12px",border:"1px solid #C8DFB0",borderRadius:8,fontSize:14,background:"#fff",boxSizing:"border-box"};return (<div><label style={{display:"block",fontSize:12,fontWeight:600,color:"#4A7A28",marginBottom:4,marginTop:14}}>{label||"Parent"}</label><select style={is} value={value} onChange={e=>onChange(e.target.value)}><option value="">Select parent…</option>{gs.map(g=>(<optgroup key={g.root.id} label={`${g.root.name}${g.root.isDeceased?" ✝":""}`}><option value={g.root.id}>↳ Child of {g.root.name.split(/[\s(]/)[0]}</option>{g.desc.map(d=>{const indent="— ".repeat(getDepth(d,members)-1);return <option key={d.id} value={d.id}>{indent}↳ Child of {d.name}</option>;})}</optgroup>))}</select></div>);}

function ChildrenU18({children,onChange}){const[cn,setCn]=useState("");const[ca,setCa]=useState("");const[cb,setCb]=useState("");const[cd,setCd]=useState(false);const add=()=>{if(!cn.trim())return;onChange([...(children||[]),{name:cn,age:ca,birthMonth:cb,deceased:cd}]);setCn("");setCa("");setCb("");setCd(false);};const is={width:"100%",padding:"8px 10px",border:"1px solid #C8DFB0",borderRadius:6,fontSize:13,background:"#fff",boxSizing:"border-box"};return(<div style={{marginTop:0,padding:14,background:"#F5FAEF",borderRadius:10,border:"1px solid #C8DFB0"}}><div style={{fontSize:13,fontWeight:700,color:"#4A7A28",marginBottom:8}}>Children Under 18</div>{(children||[]).map((c,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,fontSize:13,padding:"8px 10px",background:"#fff",borderRadius:6,border:"1px solid #E8DFD0"}}><div style={{flex:1}}><div style={{fontWeight:500,display:"flex",alignItems:"center",gap:4}}>{c.deceased&&<HaloSVG size={12}/>}{c.name}</div><div style={{fontSize:11,color:"#8B7355"}}>{c.age&&`Age ${c.age}`}{c.age&&c.birthMonth&&" · "}{c.birthMonth&&`Born ${c.birthMonth}`}{c.deceased&&" · Passed away"}</div></div><button onClick={()=>onChange(children.filter((_,x)=>x!==i))} style={{background:"none",border:"none",color:"#C77",cursor:"pointer",fontSize:12}}>✕</button></div>))}<div style={{display:"grid",gridTemplateColumns:"3fr 1fr 2fr auto",gap:6,marginTop:8,alignItems:"end"}}><div><label style={{fontSize:11,color:"#4A7A28",fontWeight:600}}>Name</label><input placeholder="Child's name" value={cn} onChange={e=>setCn(e.target.value)} style={is}/></div><div><label style={{fontSize:11,color:"#4A7A28",fontWeight:600}}>Age</label><input placeholder="Age" type="number" value={ca} onChange={e=>setCa(e.target.value)} style={is}/></div><div><label style={{fontSize:11,color:"#4A7A28",fontWeight:600}}>Birth Month</label><select value={cb} onChange={e=>setCb(e.target.value)} style={is}><option value="">Select…</option>{MONTHS.map(m=><option key={m}>{m}</option>)}</select></div><div style={{paddingBottom:2}}><label style={{display:"flex",alignItems:"center",gap:4,fontSize:11,cursor:"pointer",whiteSpace:"nowrap"}}><input type="checkbox" checked={cd} onChange={e=>setCd(e.target.checked)} style={{accentColor:"#D4A843"}}/>Passed</label></div></div><button onClick={add} style={{marginTop:10,padding:"8px 16px",background:"#4A7A28",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:13,fontWeight:600,width:"100%"}}>+ Add Child</button></div>);}

/* ═══ TREE WRAPPER ═══ */
function TreeWrapper({members,rootChildren,goEdit}){const[view,setView]=useState("list");return(<div>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
    <p style={{color:"#7A6B5A",fontSize:13,margin:0}}>Click any name to edit. Golden halo = passed away.</p>
    <div style={{display:"flex",background:"#E8F3DC",borderRadius:8,overflow:"hidden",border:"1px solid #B8D4A0"}}>
      <button onClick={()=>setView("tree")} style={{padding:"6px 12px",border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:view==="tree"?"#2D5016":"transparent",color:view==="tree"?"#fff":"#2D5016"}}>🌳 Oak Tree</button>
      <button onClick={()=>setView("list")} style={{padding:"6px 12px",border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:view==="list"?"#2D5016":"transparent",color:view==="list"?"#fff":"#2D5016"}}>📋 List</button>
    </div>
  </div>
  {view==="tree"?<OakTree members={members} rootChildren={rootChildren} goEdit={goEdit}/>:<ListView members={members} rootChildren={rootChildren} goEdit={goEdit}/>}
</div>);}

/* ═══ OAK TREE — click leaf → edit ═══ */
function OakTree({members,rootChildren,goEdit}){
  const[zoom,setZoom]=useState(0.85);const[pan,setPan]=useState({x:0,y:0});const[dr,setDr]=useState(false);const[ds,setDs]=useState({x:0,y:0});
  const md=e=>{if(e.target.closest('.ln'))return;setDr(true);setDs({x:e.clientX-pan.x,y:e.clientY-pan.y});};
  const mm=e=>{if(dr)setPan({x:e.clientX-ds.x,y:e.clientY-ds.y});};const mu=()=>setDr(false);
  const ts=e=>{if(e.target.closest('.ln'))return;const t=e.touches[0];setDr(true);setDs({x:t.clientX-pan.x,y:t.clientY-pan.y});};
  const tm=e=>{if(dr){const t=e.touches[0];setPan({x:t.clientX-ds.x,y:t.clientY-ds.y});}};
  const ol="M0,-7 C1.5,-6 3,-4.5 3.5,-3 C5,-3.5 6,-2 5,0 C6.5,0.5 6,2.5 4.5,3 C5,4.5 3.5,5.5 2,4.5 C1,6 -1,6 -2,4.5 C-3.5,5.5 -5,4.5 -4.5,3 C-6,2.5 -6.5,0.5 -5,0 C-6,-2 -5,-3.5 -3.5,-3 C-3,-4.5 -1.5,-6 0,-7Z";
  const zB={padding:"6px 12px",background:"#fff",border:"1px solid #B8D4A0",borderRadius:6,cursor:"pointer",fontSize:16,fontWeight:700,color:"#2D5016",lineHeight:1};
  return (<div>
    <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:10,justifyContent:"flex-end"}}><button onClick={()=>setZoom(z=>Math.max(0.3,z-0.15))} style={zB}>−</button><span style={{fontSize:12,color:"#7A6B5A",minWidth:40,textAlign:"center"}}>{Math.round(zoom*100)}%</span><button onClick={()=>setZoom(z=>Math.min(2.5,z+0.15))} style={zB}>+</button><button onClick={()=>{setZoom(0.85);setPan({x:0,y:0});}} style={{...zB,fontSize:11,padding:"6px 10px"}}>Reset</button></div>
    <div onMouseDown={md} onMouseMove={mm} onMouseUp={mu} onMouseLeave={mu} onTouchStart={ts} onTouchMove={tm} onTouchEnd={mu} style={{background:"linear-gradient(180deg,#D4ECFA 0%,#A8D8EA 15%,#E8F3DC 40%,#C5DFA8 100%)",borderRadius:16,overflow:"hidden",cursor:dr?"grabbing":"grab",border:"2px solid #B8D4A0",height:"clamp(500px,70vh,800px)"}}>
      <div style={{transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom})`,transformOrigin:"center center",transition:dr?"none":"transform 0.2s",width:"100%",height:"100%"}}>
        <svg viewBox="0 0 1400 1050" style={{width:"100%",height:"100%"}}>
          <defs><linearGradient id="tG" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#5C3D1E"/><stop offset="30%" stopColor="#7A5A36"/><stop offset="70%" stopColor="#6B4C2A"/><stop offset="100%" stopColor="#4A3018"/></linearGradient><linearGradient id="cG" x1=".5" y1="0" x2=".5" y2="1"><stop offset="0%" stopColor="#5DA832"/><stop offset="50%" stopColor="#4A8C28"/><stop offset="100%" stopColor="#3A7020"/></linearGradient><radialGradient id="cL" cx=".4" cy=".3"><stop offset="0%" stopColor="#8CD660" stopOpacity=".4"/><stop offset="100%" stopColor="#4A8C28" stopOpacity="0"/></radialGradient><filter id="sh"><feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity=".15"/></filter><linearGradient id="gG" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#F5E6B8"/><stop offset="50%" stopColor="#D4A843"/><stop offset="100%" stopColor="#C49030"/></linearGradient></defs>
          <ellipse cx="700" cy="1010" rx="600" ry="60" fill="#8B7355" opacity=".25"/>
          <g stroke="#5C3D1E" strokeWidth="6" fill="none" strokeLinecap="round" opacity=".5"><path d="M660,950 Q580,980 500,990 Q440,995 400,980"/><path d="M680,955 Q620,1000 560,1010"/><path d="M740,950 Q820,980 900,990 Q960,995 1000,980"/><path d="M720,955 Q780,1000 840,1010"/><path d="M700,960 Q700,990 695,1010"/></g>
          <path d="M660,950 Q650,800 640,700 Q635,650 660,600 Q680,570 700,560 Q720,570 740,600 Q765,650 760,700 Q750,800 740,950Z" fill="url(#tG)"/>
          <g stroke="#6B4C2A" fill="none" strokeLinecap="round">{rootChildren.map((c,i)=>{const b=BRANCHES[i];return <path key={c.id} d={`M700,580 Q${b.cx},${b.cy} ${b.x},${b.y}`} strokeWidth={8-i*.3} opacity=".7"/>;})}</g>
          <path d="M700,50 C900,30 1100,80 1250,180 C1350,250 1380,380 1300,480 C1250,550 1180,590 1100,600 C1050,610 950,640 850,650 Q770,660 700,660 Q630,660 550,650 C450,640 350,610 300,600 C220,590 150,550 100,480 C20,380 50,250 150,180 C300,80 500,30 700,50Z" fill="url(#cG)" opacity=".35"/>
          <path d="M700,50 C900,30 1100,80 1250,180 C1350,250 1380,380 1300,480 C1250,550 1180,590 1100,600 C1050,610 950,640 850,650 Q770,660 700,660 Q630,660 550,650 C450,640 350,610 300,600 C220,590 150,550 100,480 C20,380 50,250 150,180 C300,80 500,30 700,50Z" fill="url(#cL)"/>
          {Array.from({length:80}).map((_,i)=>{const a=(i/80)*Math.PI*2;const r=180+Math.sin(i*7)*120+Math.cos(i*3)*80;const lx=700+Math.cos(a)*r*.9;const ly=370+Math.sin(a)*r*.5-30;if(ly>640||ly<40||lx<90||lx>1310)return null;return <path key={`b${i}`} d={ol} transform={`translate(${lx},${ly}) scale(${.5+Math.random()*.3}) rotate(${Math.sin(i*5)*30})`} fill={i%7===0?"#6BBF3A":"#4A8C28"} opacity={.12+Math.sin(i*3)*.06}/>;
          })}
          {rootChildren.map((c,i)=>{const b=BRANCHES[i];const ds=getAllBranch(c.id,members);const fn=c.name.split(/[\s(]/)[0];const lW=Math.max(60,fn.length*7+24);
            return (<g key={c.id} className="ln" style={{cursor:"pointer"}} onClick={()=>goEdit(c.id)}>
              <path d={ol} transform={`translate(${b.x},${b.y}) scale(1.8)`} fill={c.isDeceased?"url(#gG)":"#1B3A0E"} filter="url(#sh)"/>
              <circle cx={b.x} cy={b.y} r="20" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="1" strokeDasharray="3,3"/>
              <rect x={b.x-lW/2} y={b.y+16} width={lW} height="18" rx="9" fill={c.isDeceased?"rgba(180,140,60,.85)":"rgba(27,58,14,.92)"}/>
              <text x={b.x+(c.isDeceased?5:0)} y={b.y+29} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="600" fontFamily="Segoe UI,sans-serif">{fn}</text>
              {c.isDeceased&&<ellipse cx={b.x-lW/2+9} cy={b.y+25} rx="6" ry="3" fill="none" stroke="#F5E6B8" strokeWidth="1.5" opacity=".9"/>}
              {ds.length>0&&<><circle cx={b.x+22} cy={b.y-10} r="9" fill="#2D5016" stroke="#fff" strokeWidth="1"/><text x={b.x+22} y={b.y-6} textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">{ds.length}</text></>}
            </g>);})}
          {rootChildren.map((c,i)=>{const b=BRANCHES[i];return getAllBranch(c.id,members).map((d,di)=>{const a=((di-getAllBranch(c.id,members).length/2)*.7);const dist=40+di*20;const dx=b.x+Math.cos(a-.3)*dist*(b.x<700?-.8:.8);const dy=b.y-25-di*18;const fn=d.name.split(" ")[0];const fW=Math.max(40,fn.length*6+16);
            return (<g key={d.id} className="ln" style={{cursor:"pointer"}} onClick={()=>goEdit(d.id)}>
              <path d={ol} transform={`translate(${dx},${dy}) scale(1.1)`} fill={d.isDeceased?"#D4A843":"#1B3A0E"} filter="url(#sh)"/>
              <rect x={dx-fW/2} y={dy+12} width={fW} height="14" rx="7" fill={d.isDeceased?"rgba(180,140,60,.85)":"rgba(27,58,14,.9)"}/>
              <text x={dx+(d.isDeceased?4:0)} y={dy+23} textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600">{fn}</text>
              {d.isDeceased&&<ellipse cx={dx-fW/2+7} cy={dy+19} rx="4.5" ry="2.5" fill="none" stroke="#F5E6B8" strokeWidth="1.2" opacity=".9"/>}
            </g>);});})}
          <g><rect x="620" y="750" width="160" height="55" rx="10" fill="rgba(92,61,30,.85)" stroke="#D4A843" strokeWidth="1.5"/><ellipse cx="700" cy="738" rx="18" ry="6" fill="none" stroke="#D4A843" strokeWidth="2" opacity=".6"/><text x="700" y="768" textAnchor="middle" fill="#F5E6B8" fontSize="11" fontWeight="700" fontFamily="Georgia,serif">Aurthur Coleman</text><text x="700" y="782" textAnchor="middle" fill="#F5E6B8" fontSize="9">&amp;</text><text x="700" y="796" textAnchor="middle" fill="#F5E6B8" fontSize="11" fontWeight="700" fontFamily="Georgia,serif">Orma Ree Coleman</text></g>
          <text x="700" y="35" textAnchor="middle" fill="#2D5016" fontSize="16" fontWeight="700" fontFamily="Georgia,serif" opacity=".6">The Coleman Family Tree</text>
        </svg></div></div></div>);}

/* ═══ LIST VIEW — edit button beside each name ═══ */
function ListView({members,rootChildren,goEdit}){
  const[exp,setExp]=useState({});const rp=members.filter(m=>m.isRootParent);const tog=id=>setExp(p=>({...p,[id]:!p[id]}));
  const eBtn=id=>(<button onClick={e=>{e.stopPropagation();goEdit(id);}} style={{background:"#E8F3DC",border:"1px solid #B8D4A0",borderRadius:4,padding:"2px 8px",cursor:"pointer",fontSize:11,color:"#2D5016",fontWeight:600,marginLeft:4,whiteSpace:"nowrap"}}>✏️ Edit</button>);
  const renderM=(m,depth=0)=>{const kids=getChildren(m.id,members);const isE=exp[m.id];return (<div key={m.id} style={{marginLeft:depth>0?16:0}}>
    <div style={{padding:"7px 12px",borderBottom:"1px solid #F0EAE0",background:depth%2===0?"#FDFCF9":"#fff",display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>
      {m.isDeceased&&<HaloSVG size={13}/>}
      <span style={{fontSize:13,fontWeight:depth===0?600:500,color:m.isDeceased?"#8B7355":"#1B3A0E"}}>{m.name}</span>
      {m.age&&<span style={{fontSize:11,color:"#9A8B7A"}}>({m.age})</span>}
      {eBtn(m.id)}
      {kids.length>0&&<button onClick={()=>tog(m.id)} style={{background:"#E8F3DC",border:"1px solid #D4DFC8",borderRadius:4,padding:"1px 6px",cursor:"pointer",fontSize:11,color:"#4A7A28",fontWeight:700,marginLeft:2}}>{isE?"▾":"▸"} {kids.length}</button>}
      {m.spouse&&<span style={{fontSize:11,color:"#8B7355",marginLeft:4}}>⚭ {m.spouse}</span>}
      {m.state&&<span style={{fontSize:11,color:"#9A8B7A",marginLeft:4}}>{m.city?`${m.city}, `:""}{m.state}</span>}
    </div>
    {isE&&kids.map(k=>renderM(k,depth+1))}
  </div>);};
  return (<div>
    <div style={{textAlign:"center",marginBottom:8}}><div style={{display:"inline-block",background:"linear-gradient(135deg,#2D5016,#4A7A28)",borderRadius:12,padding:"14px 28px",color:"#fff"}}><div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"3px",opacity:.6,marginBottom:6}}>The Roots</div><div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>{rp.map(p=>(<div key={p.id} style={{display:"flex",alignItems:"center",gap:5}}><HaloSVG size={14}/><span style={{fontSize:15,fontWeight:700}}>{p.name}</span></div>))}</div></div></div>
    <div style={{width:4,height:24,background:"#8B7355",margin:"0 auto",borderRadius:2}}/>
    <div style={{background:"#E8F3DC",borderRadius:14,padding:"14px 12px",border:"2px solid #B8D4A0"}}>
      <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:"2px",color:"#4A7A28",textAlign:"center",marginBottom:12,fontWeight:700}}>The 13 Branches</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
        {rootChildren.map(c=>{const allD=getAllBranch(c.id,members);const dk=getChildren(c.id,members);const isE=exp[c.id];return (<div key={c.id} style={{background:"#fff",borderRadius:12,overflow:"hidden",border:c.isDeceased?"1px solid #D4C5AA":"1px solid #A8CF8A"}}>
          <div style={{padding:"10px 12px",display:"flex",alignItems:"center",gap:6,background:c.isDeceased?"#FAF6EF":"#F5FAEF"}}>
            <div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>{c.isDeceased&&<HaloSVG size={14}/>}<span style={{fontSize:14,fontWeight:600,color:c.isDeceased?"#7A6B5A":"#1B3A0E"}}>{c.name}</span>{eBtn(c.id)}</div>{c.spouse&&<div style={{fontSize:11,color:"#8B7355",marginTop:2}}>⚭ {c.spouse}</div>}{c.state&&<div style={{fontSize:11,color:"#9A8B7A"}}>{c.city?`${c.city}, `:""}{c.state}</div>}</div>
            <button onClick={()=>tog(c.id)} style={{background:allD.length>0?"#E8F3DC":"#F5F0E5",border:"1px solid #D4DFC8",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:12,color:"#4A7A28",fontWeight:700,flexShrink:0}}>{isE?"▾":"▸"} {allD.length}</button>
          </div>
          {isE&&<div style={{borderTop:"1px dashed #C8DFB0"}}>{dk.length===0&&<div style={{fontSize:12,color:"#B0A090",fontStyle:"italic",padding:12}}>No family added yet</div>}{dk.map(k=>renderM(k,0))}</div>}
        </div>);})}
      </div>
    </div>
  </div>);
}

/* ═══ FORM PAGE ═══ */
function FormPage({members,rootChildren,addMember,updateMember,editTargetId,setEditTargetId}){
  const bl={name:"",age:"",birthMonth:"",city:"",state:"",spouse:"",spouseAge:"",spouseBirthMonth:"",spouseDeceased:false,phone:"",email:"",phone2:"",email2:"",isDeceased:false,isRootChild:false,parentId:"",childrenUnder18:[]};
  const[mode,setMode]=useState(editTargetId?"edit":"add");const[editId,setEditId]=useState(editTargetId||"");const[form,setForm]=useState(bl);const[added,setAdded]=useState([]);const[saveNote,setSaveNote]=useState("");
  const s=(k,v)=>setForm(p=>({...p,[k]:v}));
  useEffect(()=>{if(editTargetId){setMode("edit");loadM(editTargetId);}},[editTargetId]);
  const loadM=id=>{if(!id){setForm(bl);setEditId("");return;}const m=members.find(x=>x.id===id);if(m){setForm({name:m.name||"",age:m.age||"",birthMonth:m.birthMonth||"",city:m.city||"",state:m.state||"",spouse:m.spouse||"",spouseAge:m.spouseAge||"",spouseBirthMonth:m.spouseBirthMonth||"",spouseDeceased:m.spouseDeceased||false,phone:m.phone||"",email:m.email||"",phone2:m.phone2||"",email2:m.email2||"",isDeceased:m.isDeceased||false,isRootChild:m.isRootChild||false,parentId:m.parentId||"",childrenUnder18:m.childrenUnder18||[]});setEditId(id);}};
  const sub=()=>{if(mode==="edit"){if(!editId)return alert("Select a member to edit.");updateMember(editId,form);setSaveNote(`Updated ${form.name}`);setTimeout(()=>setSaveNote(""),3000);}else{if(!form.name.trim()||!form.parentId)return alert("Enter a name and select a parent.");addMember(form);setAdded(p=>[...p,form.name]);setForm(bl);}};
  const sw=m=>{setMode(m);setForm(bl);setEditId("");setSaveNote("");setEditTargetId(null);};
  const is={width:"100%",padding:"10px 12px",border:"1px solid #C8DFB0",borderRadius:8,fontSize:14,background:"#fff",boxSizing:"border-box"};
  const ls={display:"block",fontSize:11,fontWeight:600,color:"#4A7A28",marginBottom:3};
  const secStyle={background:"#F5FAEF",borderRadius:10,padding:14,border:"1px solid #C8DFB0",marginTop:14};
  const secTitle=(icon,text)=>(<div style={{fontSize:13,fontWeight:700,color:"#2D5016",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>{icon} {text}</div>);

  return (<div style={{maxWidth:860,margin:"0 auto"}}>
    <h2 style={{fontFamily:"Georgia,serif",color:"#2D5016",margin:"0 0 4px",fontSize:22}}>{mode==="add"?"Add Family Members":"Edit Family Member"}</h2>
    <p style={{color:"#7A6B5A",fontSize:13,margin:"0 0 14px",lineHeight:1.5}}>{mode==="add"?"Select the parent — any root sibling or existing member.":"Select a member to update their information."}</p>
    <div style={{display:"flex",background:"#E8F3DC",borderRadius:8,overflow:"hidden",border:"1px solid #B8D4A0",marginBottom:14}}>
      <button onClick={()=>sw("add")} style={{flex:1,padding:"10px",border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:mode==="add"?"#2D5016":"transparent",color:mode==="add"?"#fff":"#2D5016"}}>+ Add New</button>
      <button onClick={()=>sw("edit")} style={{flex:1,padding:"10px",border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:mode==="edit"?"#2D5016":"transparent",color:mode==="edit"?"#fff":"#2D5016"}}>✏️ Edit Existing</button>
    </div>
    <div style={{background:"#fff",borderRadius:14,padding:20,border:"1px solid #C8DFB0"}}>
      {mode==="edit"&&(<div style={{marginBottom:14}}><label style={{...ls,fontSize:12}}>Select member to edit</label><select style={{...is,borderColor:editId?"#2D5016":"#C8DFB0",borderWidth:editId?2:1}} value={editId} onChange={e=>loadM(e.target.value)}><option value="">Choose…</option>{rootChildren.map(rc=>{const bm=getAllBranch(rc.id,members);return (<optgroup key={rc.id} label={`${rc.name}${rc.isDeceased?" ✝":""}`}><option value={rc.id}>{rc.name}</option>{bm.map(b=><option key={b.id} value={b.id}>{"  — "}{b.name}</option>)}</optgroup>);})}</select>{editId&&<div style={{marginTop:8,padding:"8px 12px",background:"#FFF8EC",borderRadius:8,border:"1px solid #E8DFD0",fontSize:12,color:"#8B7355"}}>Editing <strong style={{color:"#2D5016"}}>{form.name}</strong></div>}</div>)}
      {mode==="add"&&<ParentSelector members={members} value={form.parentId} onChange={v=>s("parentId",v)} label="Who is this person's parent?"/>}

      {(mode==="add"||editId)&&(<>
        {/* ── MEMBER INFO ── */}
        <div style={secStyle}>
          {secTitle("👤","Member Information")}
          <div style={{display:"grid",gridTemplateColumns:"3fr 1fr 2fr auto",gap:"0 12px",alignItems:"end"}}>
            <div><label style={ls}>Full Name *</label><input style={is} value={form.name} onChange={e=>s("name",e.target.value)} placeholder="First and Last Name"/></div>
            <div><label style={ls}>Age</label><input style={is} type="number" value={form.age} onChange={e=>s("age",e.target.value)}/></div>
            <div><label style={ls}>Birth Month</label><select style={is} value={form.birthMonth} onChange={e=>s("birthMonth",e.target.value)}><option value="">Select…</option>{MONTHS.map(m=><option key={m}>{m}</option>)}</select></div>
            <div style={{paddingBottom:4}}><label style={{display:"flex",alignItems:"center",gap:4,fontSize:12,cursor:"pointer",whiteSpace:"nowrap"}}><input type="checkbox" checked={form.isDeceased} onChange={e=>s("isDeceased",e.target.checked)} style={{accentColor:"#D4A843"}}/>Passed <HaloSVG size={12}/></label></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px",marginTop:10}}>
            <div><label style={ls}>City</label><input style={is} value={form.city} onChange={e=>s("city",e.target.value)}/></div>
            <div><label style={ls}>State</label><select style={is} value={form.state} onChange={e=>s("state",e.target.value)}><option value="">Select…</option>{US_STATES.map(st=><option key={st} value={st}>{STATE_NAMES[st]}</option>)}</select></div>
          </div>
        </div>

        {/* ── SPOUSE INFO ── */}
        <div style={secStyle}>
          {secTitle("💍","Spouse Information")}
          <div style={{display:"grid",gridTemplateColumns:"3fr 1fr 2fr auto",gap:"0 12px",alignItems:"end"}}>
            <div><label style={ls}>Spouse Name</label><input style={is} value={form.spouse} onChange={e=>s("spouse",e.target.value)} placeholder="Spouse full name"/></div>
            <div><label style={ls}>Age</label><input style={is} type="number" value={form.spouseAge} onChange={e=>s("spouseAge",e.target.value)}/></div>
            <div><label style={ls}>Birth Month</label><select style={is} value={form.spouseBirthMonth} onChange={e=>s("spouseBirthMonth",e.target.value)}><option value="">Select…</option>{MONTHS.map(m=><option key={m}>{m}</option>)}</select></div>
            <div style={{paddingBottom:4}}><label style={{display:"flex",alignItems:"center",gap:4,fontSize:12,cursor:"pointer",whiteSpace:"nowrap"}}><input type="checkbox" checked={form.spouseDeceased||false} onChange={e=>s("spouseDeceased",e.target.checked)} style={{accentColor:"#D4A843"}}/>Passed <HaloSVG size={12}/></label></div>
          </div>
        </div>

        {/* ── CHILDREN ── */}
        <div style={{marginTop:14}}>
          <ChildrenU18 children={form.childrenUnder18} onChange={v=>s("childrenUnder18",v)}/>
        </div>

        {/* ── CONTACT INFO ── */}
        <div style={secStyle}>
          {secTitle("📞","Primary Contact Information")}
          <p style={{fontSize:12,color:"#7A6B5A",margin:"-6px 0 10px"}}>Space for both parents/guardians to provide contact info.</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div style={{padding:12,background:"#fff",borderRadius:8,border:"1px solid #E8DFD0"}}>
              <div style={{fontSize:12,fontWeight:600,color:"#2D5016",marginBottom:8}}>Contact 1</div>
              <div><label style={ls}>Phone</label><input style={is} type="tel" value={form.phone} onChange={e=>s("phone",e.target.value)} placeholder="(555) 123-4567"/></div>
              <div style={{marginTop:8}}><label style={ls}>Email</label><input style={is} type="email" value={form.email} onChange={e=>s("email",e.target.value)} placeholder="name@email.com"/></div>
            </div>
            <div style={{padding:12,background:"#fff",borderRadius:8,border:"1px solid #E8DFD0"}}>
              <div style={{fontSize:12,fontWeight:600,color:"#2D5016",marginBottom:8}}>Contact 2</div>
              <div><label style={ls}>Phone</label><input style={is} type="tel" value={form.phone2||""} onChange={e=>s("phone2",e.target.value)} placeholder="(555) 123-4567"/></div>
              <div style={{marginTop:8}}><label style={ls}>Email</label><input style={is} type="email" value={form.email2||""} onChange={e=>s("email2",e.target.value)} placeholder="name@email.com"/></div>
            </div>
          </div>
        </div>

        <button onClick={sub} style={{marginTop:20,padding:"14px 32px",background:mode==="edit"?"#C4963A":"#2D5016",color:"#fff",border:"none",borderRadius:10,cursor:"pointer",fontSize:15,fontWeight:700,width:"100%"}}>{mode==="edit"?"Save Changes":"Add to Family Tree"}</button>
      </>)}
    </div>
    {saveNote&&<div style={{marginTop:12,background:"#FFF8EC",borderRadius:10,padding:14,border:"1px solid #E8DFD0",textAlign:"center"}}><span style={{fontSize:14,fontWeight:600,color:"#C4963A"}}>✓ {saveNote}</span></div>}
    {added.length>0&&mode==="add"&&<div style={{marginTop:14,background:"#E8F3DC",borderRadius:10,padding:12,border:"1px solid #B8D4A0"}}><div style={{fontSize:13,fontWeight:600,color:"#2D5016",marginBottom:4}}>Added ({added.length})</div>{added.map((n,i)=><div key={i} style={{fontSize:13,color:"#4A7A28"}}>✓ {n}</div>)}</div>}
  </div>);
}

/* ═══ MAP ═══ */
function MapPage({members}){const lv=members.filter(m=>!m.isDeceased);const sc={};const sr={};lv.forEach(m=>{if(!m.state)return;sc[m.state]=(sc[m.state]||0)+1;const b=m.parentRootId||m.id;if(b){if(!sr[m.state])sr[m.state]=new Set();sr[m.state].add(b);}});const mx=Math.max(1,...Object.values(sc));const gc=c=>c?`rgba(27,58,14,${.25+(c/mx)*.75})`:"#F0EAE0";const sw=Object.entries(sc).sort((a,b)=>b[1]-a[1]);return (<div><h2 style={{fontFamily:"Georgia,serif",color:"#2D5016",margin:"0 0 4px",fontSize:22}}>Where the Coleman Family Lives</h2><p style={{color:"#7A6B5A",fontSize:14,margin:"0 0 4px"}}>{lv.filter(m=>m.state).length} living members across {sw.length} states</p><p style={{color:"#9A8B7A",fontSize:12,margin:"0 0 20px",fontStyle:"italic"}}>Living members only.</p><div style={{overflowX:"auto",marginBottom:24}}><div style={{display:"grid",gridTemplateColumns:"repeat(12,minmax(36px,1fr))",gap:3,minWidth:440}}>{Array.from({length:96}).map((_,idx)=>{const r=Math.floor(idx/12),c=idx%12;const se=Object.entries(STATE_GRID).find(([_,p])=>p[0]===r&&p[1]===c);if(!se)return <div key={idx}/>;const[st]=se;const ct=sc[st]||0;return <div key={idx} title={`${STATE_NAMES[st]}: ${ct}`} style={{background:gc(ct),borderRadius:4,padding:"6px 2px",textAlign:"center",border:ct>0?"1px solid rgba(27,58,14,.3)":"1px solid #E0D6C8",minHeight:36,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><div style={{fontSize:11,fontWeight:700,color:ct>0?"#fff":"#B0A090"}}>{st}</div>{ct>0&&<div style={{fontSize:10,fontWeight:800,color:"#fff"}}>{ct}</div>}</div>;})}</div></div>{sw.length>0&&<div style={{background:"#fff",borderRadius:12,padding:16,border:"1px solid #C8DFB0"}}><div style={{fontSize:13,fontWeight:700,color:"#2D5016",marginBottom:10}}>Breakdown by State</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:8}}>{sw.map(([st,ct])=><div key={st} style={{display:"flex",justifyContent:"space-between",padding:"8px 12px",background:"#F5FAEF",borderRadius:6,border:"1px solid #D4DFC8"}}><span style={{fontSize:14,fontWeight:500}}>{STATE_NAMES[st]}</span><span style={{fontSize:14,fontWeight:700,color:"#2D5016"}}>{ct}</span></div>)}</div></div>}</div>);}

/* ═══ BY-LAWS ═══ */
function ByLawsPage({rootChildren}){
  const S=({n,t,children})=>(<div style={{marginBottom:24}}><h3 style={{fontFamily:"Georgia,serif",color:"#2D5016",fontSize:15,margin:"0 0 8px",borderBottom:"1px solid #D4DFC8",paddingBottom:6}}>{n}. {t}</h3>{children}</div>);
  const P=({children})=>(<p style={{fontSize:14,color:"#3B2F1E",lineHeight:1.7,margin:"0 0 8px"}}>{children}</p>);
  const UL=({items})=>(<ul style={{margin:"6px 0 10px 20px",fontSize:14,color:"#3B2F1E",lineHeight:1.7}}>{items.map((it,i)=>(<li key={i} style={{marginBottom:3}}>{it}</li>))}</ul>);

  return (<div style={{maxWidth:760,margin:"0 auto"}}>
    <h2 style={{fontFamily:"Georgia,serif",color:"#2D5016",margin:"0 0 4px",fontSize:22}}>Preliminary Guidelines for the Coleman Family Reunion</h2>
    <div style={{background:"#FFF8EC",borderRadius:10,padding:14,border:"1px solid #E8DFD0",marginBottom:20,fontSize:13,color:"#8B7355",lineHeight:1.5}}>
      <strong style={{color:"#C4963A"}}>📋 Draft — August 15, 2026</strong> — Prepared by Michael Fulton. These guidelines are a starting point for discussion and family approval. They are intended to provide consistency, fairness, and transparency in planning future Coleman Family Reunions. The guidelines may be amended by family vote as needed.
    </div>
    <div style={{background:"#fff",borderRadius:14,padding:24,border:"1px solid #C8DFB0"}}>
      <S n="1" t="Reunion Schedule"><P>The Coleman Family Reunion shall be held biennially, during odd-numbered years.</P></S>

      <S n="2" t="Reunion Weekend"><P>The Reunion shall normally be held on the first full weekend of August.</P></S>

      <S n="3" t="Reunion Location"><P>The Reunion will rotate among designated host cities, including Akron, Ohio, and other approved family locations.</P><P>A Reunion may be held in another city on an ad hoc basis with approval of the family through the established voting process.</P></S>

      <S n="4" t="Family Voting"><P>Major decisions concerning the Reunion shall be decided through a family vote.</P><P>For voting purposes, each family branch shall receive one vote, regardless of:</P><UL items={["the number of people in that branch;","the number of people attending the Reunion;","the amount of money contributed by the branch; or","the number of individual households within that branch."]} /><P>The purpose of this structure is to ensure that larger family branches do not have more decision-making authority simply because they have more members.</P><P>The family should seek discussion and consensus whenever possible before a formal vote is taken.</P></S>

      <S n="5" t="Financial Responsibility Is Based on Individuals"><P>Although each family branch receives one vote, Reunion costs are different.</P><P>Reunion expenses will be calculated based on the individual family members and guests attending the Reunion. Each person's applicable Reunion fee will be determined by his or her age category and the final cost structure approved for that Reunion.</P><P>Households may submit one combined payment for everyone in their household; however, the underlying Reunion cost is calculated based upon the individuals attending.</P><div style={{background:"#F5FAEF",borderRadius:8,padding:12,border:"1px solid #D4DFC8",margin:"10px 0"}}><P><strong>Voting = One Vote Per Family Branch</strong></P><P><strong>Financial Responsibility = Based on Each Individual Attending</strong></P></div><P>This distinction is intended to provide equal family representation while fairly distributing the actual cost of the Reunion.</P></S>

      <S n="6" t="Host Family"><P>Each Reunion shall have a designated Host Family. The Host Family has primary responsibility for organizing and coordinating the Reunion and shall provide overall direction for the event.</P><P>The Host Family's responsibilities may include:</P><UL items={["selecting and coordinating Reunion venues;","developing the Reunion schedule;","arranging meals and catering;","coordinating hotel accommodations;","planning activities;","communicating with family members;","maintaining the Reunion budget;","collecting Reunion payments;","coordinating souvenirs;","conducting the Business Meeting; and","overseeing the Event Support families."]} /><P>The Host Family is responsible for planning and organizing the Reunion, but it is not expected to perform every operational task by itself.</P></S>

      <S n="7" t="Event Support Roles"><P>In addition to the Host Family, designated families will serve in Event Support Roles. These families work under the overall plan established by the Host Family and are responsible for helping execute specific Reunion activities.</P>
        <div style={{background:"#F5FAEF",borderRadius:8,padding:14,border:"1px solid #D4DFC8",margin:"10px 0"}}><div style={{fontSize:14,fontWeight:700,color:"#2D5016",marginBottom:6}}>Logistics Support</div><P>The Logistics Support Family assists with obtaining and transporting the physical items required for Reunion activities. Responsibilities may include:</P><UL items={["picking up tables and chairs;","picking up food or catering orders;","transporting supplies;","obtaining ice, beverages, decorations, or other requested items;","coordinating equipment pickup and return; and","assisting with movement of Reunion materials between locations."]} /><P>The Host Family determines what is needed and how the event will be set up. Logistics Support helps make sure those items arrive where and when they are needed.</P></div>
        <div style={{background:"#F5FAEF",borderRadius:8,padding:14,border:"1px solid #D4DFC8",margin:"10px 0"}}><div style={{fontSize:14,fontWeight:700,color:"#2D5016",marginBottom:6}}>Operations Support</div><P>The Operations Support Family assists with the physical operation and closing of Reunion activities. Responsibilities may include:</P><UL items={["assisting during events;","maintaining common areas;","organizing trash and recycling;","helping with cleanup;","returning areas to their original condition;","assisting with breakdown of tables, chairs, and equipment; and","ensuring rented or borrowed items are ready for return."]} /><P>The Host Family remains responsible for directing the event, including food presentation and event setup. Event Support families provide the additional hands necessary to make the Reunion operate efficiently.</P></div>
        <P>Additional Event Support roles may be created when necessary.</P></S>

      <S n="8" t="Host and Support Rotation"><P>Hosting and Event Support responsibilities shall rotate among the eligible family branches.</P><P>The goal of the rotation is that a family serving as either the Host Family or in a designated Event Support role will normally be called upon approximately once every eight (8) years.</P><P>The rotation is intended to:</P><UL items={["distribute Reunion responsibilities fairly;","prevent the same families from doing the majority of the work;","give each branch an opportunity to contribute;","create continuity between Reunions; and","allow families several years between major Reunion responsibilities."]} /><P>The rotation schedule should be maintained and communicated to the family so families know in advance when they are expected to serve.</P></S>

      <S n="9" t="Reunion Weekend Schedule"><P>The Reunion shall normally begin Friday evening and end at approximately Noon on Sunday. Activities shall normally include:</P>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:8,margin:"10px 0"}}><div style={{background:"#F5FAEF",borderRadius:8,padding:10,border:"1px solid #D4DFC8"}}><div style={{fontWeight:700,color:"#2D5016",fontSize:13}}>Friday</div><div style={{fontSize:13}}>Evening get-together</div></div><div style={{background:"#F5FAEF",borderRadius:8,padding:10,border:"1px solid #D4DFC8"}}><div style={{fontWeight:700,color:"#2D5016",fontSize:13}}>Saturday</div><div style={{fontSize:13}}>Family picnic & evening activity</div></div><div style={{background:"#F5FAEF",borderRadius:8,padding:10,border:"1px solid #D4DFC8"}}><div style={{fontWeight:700,color:"#2D5016",fontSize:13}}>Sunday</div><div style={{fontSize:13}}>Family breakfast & Business Meeting</div></div></div>
        <P>Unless specifically included in the approved Reunion budget, optional activities requiring an additional fee shall be paid directly by the individuals choosing to participate. The Business Meeting shall be limited to family members.</P></S>

      <S n="10" t="Activities for All Ages"><P>The Reunion shall include reasonable activities and opportunities for participation by family members of all ages.</P></S>

      <S n="11" t="Hotel Accommodations"><P>The Host Family shall attempt to arrange group accommodations or a hotel room block for family members attending the Reunion.</P><P>Individual family members are responsible for paying their own hotel expenses.</P><div style={{background:"#FFF8EC",borderRadius:8,padding:14,border:"2px solid #C4963A",margin:"10px 0",textAlign:"center"}}><span style={{fontSize:17,fontWeight:700,color:"#B8860B",textDecoration:"underline"}}>Hotel expenses are not included in the standard Reunion fee.</span><p style={{fontSize:14,color:"#3B2F1E",margin:"8px 0 0",lineHeight:1.5}}>Each attending family/household is responsible for booking and paying for their own hotel accommodations separately.</p></div></S>

      <S n="12" t="Initial Reunion Notification"><P>No later than January 1 of the Reunion year, the Host Family shall provide family members with:</P><UL items={["Reunion dates;","Reunion city;","preliminary schedule, when available;","estimated full-price Reunion cost per person, excluding lodging;","RSVP instructions;","payment information; and","contact information for the person designated to confidentially assist with hardship situations."]} /></S>

      <S n="13" t="RSVP Deadline"><P>To allow adequate planning, all participating households should RSVP no later than February 1 of the Reunion year. The RSVP should include:</P><UL items={["names of everyone attending;","ages or applicable age categories;","guests;","applicable dietary or accessibility information; and","confidential notification of any financial hardship."]} /></S>

      <S n="14" t="Updated Cost Estimate"><P>No later than March 1, the Host Family shall provide an updated estimated Reunion price based upon:</P><UL items={["final or projected attendance;","age distribution of attendees;","expected food expenses;","facility costs;","souvenirs;","activities;","Event Support needs;","hardship assistance; and","other approved Reunion expenses."]} /></S>

      <S n="15" t="Reunion Payment Schedule"><P>The Reunion payment may be divided into installments to reduce the financial burden on families and to ensure the Host Family has sufficient funds to make required deposits and reservations.</P><P>At a minimum: 50% of each participant's applicable Reunion fee shall be due by April 1. The remaining balance and final payment deadline shall be communicated by the Host Family after final costs and attendance are determined.</P><P>Families may pay earlier or pay the full amount at one time if they choose.</P></S>

      <S n="16" t="Why Reunion Fees May Vary"><P>There will not necessarily be one identical Reunion price for every attendee. The Reunion fee will vary because different age groups have different expected costs and financial circumstances.</P>
        <div style={{overflowX:"auto",margin:"10px 0"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}><thead><tr style={{background:"#F5FAEF"}}><th style={{padding:"8px 12px",textAlign:"left",borderBottom:"2px solid #C8DFB0"}}>Age</th><th style={{padding:"8px 12px",textAlign:"left",borderBottom:"2px solid #C8DFB0"}}>Pricing Category</th></tr></thead><tbody><tr><td style={{padding:"6px 12px",borderBottom:"1px solid #F0EAE0"}}>0–12</td><td style={{padding:"6px 12px",borderBottom:"1px solid #F0EAE0"}}>Reduced Child Rate</td></tr><tr style={{background:"#FDFCF9"}}><td style={{padding:"6px 12px",borderBottom:"1px solid #F0EAE0"}}>13–26</td><td style={{padding:"6px 12px",borderBottom:"1px solid #F0EAE0"}}>Reduced Youth/Young Adult Rate</td></tr><tr><td style={{padding:"6px 12px",borderBottom:"1px solid #F0EAE0"}}>27–74</td><td style={{padding:"6px 12px",borderBottom:"1px solid #F0EAE0"}}>Full Adult Rate</td></tr><tr style={{background:"#FDFCF9"}}><td style={{padding:"6px 12px",borderBottom:"1px solid #F0EAE0"}}>75+</td><td style={{padding:"6px 12px",borderBottom:"1px solid #F0EAE0"}}>Reduced Senior Rate</td></tr></tbody></table></div>
        <P>The actual dollar amount for each category will be established for each Reunion after attendance and expected expenses are known. The percentage assigned to each age group may change from one Reunion to another because the makeup of the people attending directly affects the amount each participant must pay.</P><P>The Reunion website shall display the approved rates and calculate the amount owed based upon the members and guests registered by each household.</P></S>

      <S n="17" t="Reunion Expense Calculation"><P>The Host Family shall first estimate the total cost of conducting the Reunion. Eligible Reunion Expenses may include:</P><UL items={["Friday evening function;","Saturday picnic;","Saturday evening function;","Sunday breakfast;","food and non-alcoholic beverages;","facility rentals;","tables and chairs;","Reunion souvenirs;","hospitality-room refreshments, if applicable;","Reunion communications;","official family photographs;","Reunion website or administrative expenses approved by the family; and","other expenses necessary to conduct the Reunion."]} /><P>The total estimated Reunion cost will then be distributed across expected participants using the approved age-based pricing structure. Because participation changes from Reunion to Reunion, the exact Reunion fee cannot be permanently fixed in these guidelines.</P></S>

      <S n="18" t="Hardship Assistance"><P>Participation in the Coleman Family Reunion should not be prevented solely because of financial hardship.</P><P>Family members experiencing hardship should confidentially contact the designated hardship representative no later than February 1. Hardship information shall remain confidential and does not need to be disclosed to the broader family.</P><P>As part of Reunion budgeting, approximately 10% may be added to the estimated Reunion cost to provide a Hardship Assistance Reserve. This allows the Reunion to absorb some or all of the cost for family members who would otherwise be unable to participate.</P><P>Individuals receiving hardship assistance may contribute whatever amount they are reasonably able to contribute. Additional voluntary family contributions may also be accepted to support hardship participation.</P></S>

      <S n="19" t="Guests"><P>Guests of family members are welcome when permitted by the Reunion activities. Guests shall be included in the Reunion cost calculation based upon the guest's applicable age category. The family member or household registering the guest is responsible for the guest's Reunion fee.</P><P>The Reunion website shall allow family members to add guests and provide the guest's age category so the appropriate fee can be calculated.</P></S>

      <S n="20" t="Reunion Souvenir"><P>A Reunion souvenir should be provided to attending family members when financially practical. The souvenir does not need to be expensive. The objective is to provide a meaningful, reusable reminder of the Reunion while remaining financially responsible. The cost of the official Reunion souvenir shall be included in Reunion Expenses.</P></S>

      <S n="21" t="Family Photographs"><P>When practical, the Reunion shall include:</P><UL items={["an Official Family Photograph consisting of blood relatives and lawful family members; and","a Reunion Group Photograph including all Reunion attendees."]} /><P>These photographs are intended to document the continuing history of the Coleman Family Reunion.</P></S>

      <S n="22" t="Reunion Financial Reporting"><P>The Host Family shall maintain reasonable records of Reunion income and expenses. A summary of Reunion expenses shall be presented to the family during the Business Meeting.</P><P>The purpose of the report is transparency and accountability rather than requiring the Host Family to provide a formal audited financial statement. The report should include, at minimum:</P><UL items={["total Reunion money collected;","total Reunion expenses;","hardship assistance provided in aggregate, without identifying recipients;","additional contributions received; and","remaining Reunion funds."]} /></S>

      <S n="23" t="Remaining Reunion Funds"><P>After all Reunion expenses have been paid and final costs are known, any remaining Reunion funds shall be returned to participating families.</P><P>Any refund shall be distributed using an equitable method based upon the Reunion fees actually paid rather than the family's voting structure.</P><P>Alternatively, the family may vote at the Business Meeting to carry some or all remaining funds forward as seed money for the next Reunion.</P></S>

      <S n="24" t="Business Meeting"><P>The Reunion Business Meeting should include:</P><UL items={["Reunion financial report from the Host Family;","discussion and vote on any proposed changes to the Coleman Family Reunion Guidelines;","confirmation of the location and dates of the next Reunion;","confirmation of the next Host Family and Event Support families;","review of the Host and Event Support rotation schedule;","family website update;","Reunion sponsorships, voluntary contributions, and other financial matters;","proposals for future Reunion activities; and","any other family business requiring discussion or vote."]} /></S>

      <S n="25" t="Guiding Principle"><P>The purpose of these guidelines is not to make the Reunion overly formal.</P><P>They are intended to ensure that: every family branch has an equal voice, every attendee contributes fairly based upon the approved structure, families experiencing hardship can still participate, and the work required to conduct the Reunion is shared across the family.</P><P style={{fontWeight:600,color:"#2D5016",fontStyle:"italic"}}>The ultimate goal is to maintain and strengthen the Coleman Family Reunion for future generations.</P></S>
    </div>
  </div>);
}

/* ═══ REUNION PLANNER — role assignment + first reunion vote ═══ */
function ReunionPage(){
  const[roles,setRoles]=useState({});const[votes,setVotes]=useState({});const[saved,setSaved]=useState(false);
  useEffect(()=>{(async()=>{try{const r=await store.get("coleman-roles-v2");if(r?.value)setRoles(JSON.parse(r.value));}catch{} try{const r2=await store.get("coleman-first-vote");if(r2?.value)setVotes(JSON.parse(r2.value));}catch{}})();},[]);
  const saveRoles=async(d)=>{setRoles(d);try{await store.set("coleman-roles-v2",JSON.stringify(d));setSaved(true);setTimeout(()=>setSaved(false),2000);}catch{}};
  const saveVotes=async(d)=>{setVotes(d);try{await store.set("coleman-first-vote",JSON.stringify(d));}catch{}};
  const setRole=(id,val)=>{const n={...roles,[id]:val};saveRoles(n);};
  const is={width:"100%",padding:"10px 12px",border:"1px solid #C8DFB0",borderRadius:8,fontSize:14,background:"#fff",boxSizing:"border-box"};

  const siblings=[
    {id:"child-01",name:"Doris's Family",deceased:true},
    {id:"child-02",name:"Samuel's Family",deceased:true},
    {id:"child-03",name:"Luther's Family",deceased:true},
    {id:"child-04",name:"Sammie's Family",deceased:false},
    {id:"child-05",name:"Shirley's Family",deceased:false,locked:"Host — Akron, OH"},
    {id:"child-06",name:"Paulette's Family",deceased:true},
    {id:"child-07",name:"Norma's Family",deceased:true},
    {id:"child-08",name:"Jackie's Family",deceased:false},
    {id:"child-09",name:"Arlene's Family",deceased:false},
    {id:"child-10",name:"Arthur Jr's Family",deceased:false},
    {id:"child-11",name:"Charles's Family",deceased:false},
    {id:"child-12",name:"Kevin's Family",deceased:false},
    {id:"child-13",name:"Evan's Family",deceased:false},
  ];

  const supportCount = Object.values(roles).filter(r=>r==="operations"||r==="logistics").length;

  return (<div style={{maxWidth:720,margin:"0 auto"}}>
    <h2 style={{fontFamily:"Georgia,serif",color:"#2D5016",margin:"0 0 4px",fontSize:22}}>Reunion Planner</h2>

    {/* First reunion announcement */}
    <div style={{background:"linear-gradient(135deg,#2D5016,#4A7A28)",borderRadius:14,padding:20,color:"#fff",marginBottom:16}}>
      <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:"2px",opacity:.7,marginBottom:8}}>Restart of the Coleman Family Reunion</div>
      <p style={{fontSize:15,lineHeight:1.6,margin:"0 0 10px"}}>As probably the biggest family branch, <strong>Shirley's Family</strong> will host the first Coleman Family Reunion in <strong>Northeast Ohio (Akron area)</strong>.</p>
      <p style={{fontSize:14,lineHeight:1.6,margin:"0 0 10px",opacity:.9}}>We need the family to vote on two things to get started. Once we know the year, we will post estimated costs. We will do our best to adhere to the guidelines on the By-Laws page.</p>
      <p style={{fontSize:13,lineHeight:1.6,margin:0,opacity:.8}}>In order to execute this reunion, we need family branches to sign up for support roles. If your family is willing to help, please select a support role below. The remaining hosting rotation and future locations will be discussed and voted on at the first Business Meeting.</p>
    </div>

    {/* Voting section */}
    <div style={{background:"#fff",borderRadius:14,padding:20,border:"1px solid #C8DFB0",marginBottom:16}}>
      <div style={{fontSize:15,fontWeight:700,color:"#2D5016",marginBottom:12}}>🗳️ Family Vote — Help Us Decide</div>

      <div style={{marginBottom:16}}>
        <label style={{display:"block",fontSize:13,fontWeight:600,color:"#2D5016",marginBottom:6}}>What year should the first reunion be held?</label>
        <div style={{display:"flex",gap:8}}>
          {["2027","2028"].map(yr=>(<button key={yr} onClick={()=>saveVotes({...votes,year:yr})} style={{flex:1,padding:"14px",borderRadius:10,border:votes.year===yr?"2px solid #2D5016":"2px solid #E0D6C8",background:votes.year===yr?"#E8F3DC":"#fff",cursor:"pointer",fontSize:16,fontWeight:700,color:votes.year===yr?"#2D5016":"#7A6B5A"}}>{yr}</button>))}
        </div>
      </div>

      <div>
        <label style={{display:"block",fontSize:13,fontWeight:600,color:"#2D5016",marginBottom:6}}>Which weekend do you prefer?</label>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[["last-july","Last full weekend in July"],["first-aug","First full weekend in August"]].map(([k,label])=>(<button key={k} onClick={()=>saveVotes({...votes,weekend:k})} style={{padding:"14px",borderRadius:10,border:votes.weekend===k?"2px solid #2D5016":"2px solid #E0D6C8",background:votes.weekend===k?"#E8F3DC":"#fff",cursor:"pointer",fontSize:14,fontWeight:600,color:votes.weekend===k?"#2D5016":"#7A6B5A",textAlign:"left"}}>{label}</button>))}
        </div>
      </div>
    </div>

    {/* Support role assignment */}
    <div style={{background:"#fff",borderRadius:14,padding:20,border:"1px solid #C8DFB0"}}>
      <div style={{fontSize:15,fontWeight:700,color:"#2D5016",marginBottom:4}}>Family Roles for the Reunion</div>
      <p style={{fontSize:13,color:"#7A6B5A",margin:"0 0 6px",lineHeight:1.5}}>Each family branch can sign up for a role. Shirley's Family is locked in as the Host for the Akron reunion. We need at least one family for Operations Support and one for Logistics Support. Refer to the <strong>📜 By-Laws</strong> tab (Sections 6 & 7) for details on what each role involves.</p>
      <p style={{fontSize:12,color:"#8B7355",margin:"0 0 14px"}}>The support families will stay with the Host Family unless voted to change at the Business Meeting.</p>

      {supportCount < 2 && <div style={{background:"#FFF8EC",borderRadius:8,padding:10,border:"1px solid #E8DFD0",marginBottom:14,fontSize:13,color:"#C4963A",fontWeight:600}}>⚠️ We still need {2-supportCount} more support {2-supportCount===1?"family":"families"} to sign up to make this reunion happen.</div>}
      {supportCount >= 2 && <div style={{background:"#E8F3DC",borderRadius:8,padding:10,border:"1px solid #B8D4A0",marginBottom:14,fontSize:13,color:"#2D5016",fontWeight:600}}>✓ Support roles are filled! Thank you to the families who stepped up.</div>}

      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {siblings.map(sib=>{
          const isLocked = sib.locked;
          const currentRole = isLocked ? "host" : (roles[sib.id] || "");
          return (<div key={sib.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:10,border:isLocked?"2px solid #C4963A":currentRole?"2px solid #2D5016":"1px solid #E0D6C8",background:isLocked?"#FFF8EC":currentRole?"#E8F3DC":"#fff"}}>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:600,color:sib.deceased?"#8B7355":"#1B3A0E",display:"flex",alignItems:"center",gap:4}}>
                {sib.deceased&&<HaloSVG size={12}/>}{sib.name}
              </div>
              {isLocked && <div style={{fontSize:12,fontWeight:700,color:"#C4963A",marginTop:2}}>🏠 {sib.locked}</div>}
            </div>
            {isLocked ? (
              <span style={{fontSize:12,fontWeight:600,color:"#C4963A",background:"#FFF3D6",padding:"4px 12px",borderRadius:6}}>Host (Locked)</span>
            ) : (
              <select value={currentRole} onChange={e=>setRole(sib.id,e.target.value)} style={{...is,width:"auto",minWidth:180,borderColor:currentRole?"#2D5016":"#C8DFB0"}}>
                <option value="">No role selected</option>
                <option value="operations">🔧 Operations Support</option>
                <option value="logistics">🚛 Logistics Support</option>
              </select>
            )}
          </div>);
        })}
      </div>
      {saved&&<div style={{marginTop:10,textAlign:"center",fontSize:13,color:"#4A7A28",fontWeight:600}}>✓ Saved</div>}

      {/* Future rotation note */}
      <div style={{background:"#F5FAEF",borderRadius:12,padding:16,border:"1px solid #C8DFB0",marginTop:16}}>
        <div style={{fontSize:14,fontWeight:700,color:"#2D5016",marginBottom:6}}>📋 Looking Ahead — Building the Rotation</div>
        <p style={{fontSize:13,color:"#3B2F1E",lineHeight:1.6,margin:"0 0 8px"}}>Per the By-Laws (Section 8), the goal is that each family branch serves as Host or in a Support role approximately once every 8 years. To make that work on a biennial schedule, we need at least <strong>4 Host City/Family commitments</strong> with corresponding Support families for each reunion.</p>
        <p style={{fontSize:13,color:"#3B2F1E",lineHeight:1.6,margin:"0 0 8px"}}>This first reunion with Shirley's Family hosting in Akron is the starting point. At the Business Meeting, we will discuss and vote on the full rotation — identifying the next 3 Host Families and their preferred cities so every branch knows well in advance when their turn is coming.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:6,marginTop:10}}>
          {[["Reunion 1","Shirley's Family","Akron, OH ✓"],["Reunion 2","To be voted","TBD"],["Reunion 3","To be voted","TBD"],["Reunion 4","To be voted","TBD"]].map(([r,f,c])=>(
            <div key={r} style={{padding:"8px 10px",background:r==="Reunion 1"?"#E8F3DC":"#fff",borderRadius:8,border:"1px solid #D4DFC8",textAlign:"center"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#4A7A28"}}>{r}</div>
              <div style={{fontSize:12,fontWeight:600,color:"#2D5016",marginTop:2}}>{f}</div>
              <div style={{fontSize:11,color:"#7A6B5A"}}>{c}</div>
            </div>
          ))}
        </div>
        <p style={{fontSize:12,color:"#8B7355",marginTop:10,fontStyle:"italic",lineHeight:1.5}}>Each reunion also needs an Operations Support family and a Logistics Support family. With 4 host rotations and 2 support roles each, that's 12 family commitments spread across 8 years — ensuring responsibility is shared fairly across all branches.</p>
      </div>
    </div>
  </div>);
}

/* ═══ COSTS PAGE — budget-based with age tier scenarios ═══ */
const SCENARIOS = [
  {name:"Balanced",u12:.15,t13:.20,a27:.55,s75:.10},
  {name:"More Young Families",u12:.25,t13:.20,a27:.45,s75:.10},
  {name:"Middle-Heavy",u12:.10,t13:.15,a27:.65,s75:.10},
  {name:"Older Family",u12:.10,t13:.15,a27:.55,s75:.20},
  {name:"Very Generational",u12:.20,t13:.25,a27:.45,s75:.10},
];
const RATE_U12 = 25;
const RATE_75 = 30;
const TEEN_DISCOUNT = 0.60; // 13-26 pays 60% of full rate

function CostsPage({members}){
  const [admin,setAdmin]=useState(false);
  const [budget,setBudget]=useState({eventRoom:800,picnic:1200,activity:600,breakfast:500});
  const [attendees,setAttendees]=useState(75);
  const [saved,setSaved]=useState(false);
  const [rsvps,setRsvps]=useState({});
  useEffect(()=>{(async()=>{try{const r=await store.get("coleman-budget");if(r?.value){const d=JSON.parse(r.value);setBudget(d.budget||budget);setAttendees(d.attendees||75);}}catch{}try{const r2=await store.get("coleman-rsvp");if(r2?.value)setRsvps(JSON.parse(r2.value));}catch{}})();},[]);
  const saveBudget=async()=>{try{await store.set("coleman-budget",JSON.stringify({budget,attendees}));setSaved(true);setTimeout(()=>setSaved(false),2000);}catch{}};
  const feeBudget=budget.picnic+budget.activity+budget.breakfast;
  const is={width:"100%",padding:"10px 12px",border:"1px solid #C8DFB0",borderRadius:8,fontSize:14,background:"#fff",boxSizing:"border-box"};
  const ls={display:"block",fontSize:12,fontWeight:600,color:"#4A7A28",marginBottom:4,marginTop:10};
  const calcFR=(s)=>{const N=attendees;const fr=N*(s.u12*RATE_U12+s.s75*RATE_75);const vp=s.t13*TEEN_DISCOUNT+s.a27;return vp===0?0:(feeBudget-fr)/(N*vp);};
  const gm=members.filter(m=>!m.isDeceased&&!m.isRootParent&&rsvps[m.id]==="going");
  const ag={u:0,t:0,a:0,s:0,x:0};
  gm.forEach(m=>{const a=parseInt(m.age);if(!m.age||isNaN(a))ag.x++;else if(a<12)ag.u++;else if(a<=26)ag.t++;else if(a<=74)ag.a++;else ag.s++;});
  gm.forEach(m=>{(m.childrenUnder18||[]).forEach(c=>{const a=parseInt(c.age);if(!c.age||isNaN(a))ag.x++;else if(a<12)ag.u++;else ag.t++;});});
  const acd=[{name:"0–12",count:ag.u,rate:`$${RATE_U12}`},{name:"13–26",count:ag.t,rate:"60%"},{name:"27–74",count:ag.a,rate:"Full"},{name:"75+",count:ag.s,rate:`$${RATE_75}`}];
  if(ag.x>0)acd.push({name:"No Age",count:ag.x,rate:"—"});
  const tc=Object.values(ag).reduce((a,b)=>a+b,0);

  const DH=({day,color})=>(<div style={{background:color||"#2D5016",borderRadius:"10px 10px 0 0",padding:"10px 16px",color:"#fff",fontSize:15,fontWeight:700}}>{day}</div>);
  const EC=({title,time,desc,cost,costNote,items,highlight})=>(<div style={{padding:"14px 16px",borderBottom:"1px solid #F0EAE0",background:highlight?"#FFF8EC":"#fff"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:4}}>
      <div><div style={{fontSize:14,fontWeight:600,color:"#2D5016"}}>{title}</div>{time&&<div style={{fontSize:12,color:"#7A6B5A"}}>{time}</div>}</div>
      {cost&&<div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:700,color:costNote==="Self Pay"?"#C4963A":"#2D5016"}}>{cost}</div>{costNote&&<div style={{fontSize:11,color:costNote==="Self Pay"?"#C4963A":"#7A6B5A"}}>{costNote}</div>}</div>}
    </div>
    {desc&&<p style={{fontSize:13,color:"#3B2F1E",lineHeight:1.6,margin:"6px 0 0"}}>{desc}</p>}
    {items&&<ul style={{margin:"6px 0 0 16px",fontSize:13,color:"#3B2F1E",lineHeight:1.6}}>{items.map((it,i)=><li key={i} style={{marginBottom:2}}>{it}</li>)}</ul>}
  </div>);

  return (<div style={{maxWidth:860,margin:"0 auto"}}>
    <h2 style={{fontFamily:"Georgia,serif",color:"#2D5016",margin:"0 0 4px",fontSize:22}}>Preliminary Reunion Schedule & Costs</h2>
    <div style={{background:"#FFF8EC",borderRadius:10,padding:14,border:"1px solid #E8DFD0",marginBottom:20,fontSize:13,color:"#8B7355",lineHeight:1.5}}>
      <strong style={{color:"#C4963A"}}>⚠️ Planning Estimates Only</strong> — Activities, locations, and prices have not been finalized. This page will be updated at the beginning of the reunion year. Estimated prices do not account for future inflation or changes in vendor pricing.
    </div>

    {/* FRIDAY */}
    <div style={{borderRadius:12,border:"1px solid #C8DFB0",overflow:"hidden",marginBottom:16}}>
      <DH day="Friday — Arrival & Welcome" color="#4A7A28"/>
      <EC title="Travel / Arrival Day" desc="Family members check into the hotel throughout the day. No formal reunion activity is planned so families can arrive at their convenience."/>
      <EC title="Optional Friday Activity" time="Evening" cost="$20–$40/person" costNote="Self Pay" highlight
        desc="An optional activity may be organized for early arrivals. Participation is completely optional and not included in the reunion registration fee."
        items={["Topgolf, bowling, dinner, or local attraction","Individuals/families pay their own expenses"]}/>
      <EC title="Hotel Lobby Gathering" time="Evening" cost="$0" costNote="Included" desc="Informal family gathering in the hotel lobby/bar. Individuals may purchase their own food and drinks."/>
      <EC title="Reunion Souvenir" cost="$5–$15/person" costNote="Included in Fee"
        desc="Each registered family member receives a souvenir upon arrival. The goal is something useful, reusable, and memorable."
        items={["Custom Family Reunion T-Shirt","Insulated Stainless-Steel Tumbler","Reusable Water Bottle","Family Reunion Hat or Tote Bag","Family Recipe Book"]}/>
    </div>

    {/* SATURDAY */}
    <div style={{borderRadius:12,border:"1px solid #C8DFB0",overflow:"hidden",marginBottom:16}}>
      <DH day="Saturday — Main Family Reunion Day"/>
      <EC title="Saturday Morning" time="Morning — Open" desc="Open for late-arriving family, breakfast, hotel pool, free time, and visiting before the main event."/>
      <div style={{padding:"14px 16px",background:"#E8F3DC",borderBottom:"1px solid #C8DFB0"}}>
        <div style={{fontSize:14,fontWeight:700,color:"#2D5016",marginBottom:4}}>Saturday Main Event — The family will select ONE activity</div>
        <p style={{fontSize:12,color:"#4A7A28",margin:0}}>All options include Family Trivia Championship, family photos, and the Traveling Family Trivia Trophy presentation.</p>
      </div>
      <EC title="Option 1 — Spins Bowl: Family Bowling Day" cost="$25–$35/person" costNote="Included in Fee"
        items={["Family bowling tournament (~6 per lane)","Bowling shoes included","Arcade games","Food/pizza"]}/>
      <EC title="Option 2 — Park: Traditional Family Reunion" cost="$35–$45/person" costNote="Included in Fee"
        items={["Reserved pavilion/shelter","Catered BBQ or picnic meal","Cornhole, volleyball, family field games","Family Olympics & kids' bouncy castle","Cards, dominoes, and music"]}/>
      <EC title="Option 3 — Dave & Buster's: Family Game Day" cost="$30–$45/person" costNote="Included in Fee"
        items={["Family meal","Arcade games & Power Cards","Family game challenges","Kids and teen activities"]}/>
      <EC title="Option 4 — Topgolf: Family Golf & Games Day" cost="$35–$50/person" costNote="Included in Fee"
        items={["Reserved hitting bays","Golf games for all skill levels","Family meal","Family competition"]}/>
    </div>

    {/* SUNDAY */}
    <div style={{borderRadius:12,border:"1px solid #C8DFB0",overflow:"hidden",marginBottom:16}}>
      <DH day="Sunday — Family Breakfast & Departure" color="#6B4C2A"/>
      <EC title="Family Breakfast / Brunch" time="Morning" cost="$0–$25/person" costNote="Depends on Hotel"
        desc="Sunday is a relaxed closing morning before families begin traveling home."
        items={["$0 if breakfast is included with hotel stay","$15–$25 per person if a separate group breakfast is arranged"]}/>
      <EC title="Business Meeting" time="Following Breakfast" cost="$0"
        desc="Recognition of Family Trivia Champions, announcements regarding the next reunion, family votes, and final photos and goodbyes. Limited to family members."/>
      <EC title="Checkout & Departure" time="Late Morning" desc="Hotel checkout and travel home."/>
    </div>

    {/* COST COMPARISON */}
    <div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #C8DFB0",marginBottom:16}}>
      <div style={{fontSize:15,fontWeight:700,color:"#2D5016",marginBottom:10}}>Estimated Reunion Fee Per Person</div>
      <p style={{fontSize:12,color:"#7A6B5A",margin:"0 0 12px"}}>Assuming hotel breakfast is included and excluding the optional Friday activity. These are the estimated <strong>full adult rate</strong> (ages 27–74). Reduced rates apply for other age groups.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:8}}>
        {[["🎳 Spins Bowling","$30–$50"],["🌳 Park Reunion","$40–$60"],["🕹 Dave & Buster's","$35–$60"],["⛳ Topgolf","$40–$65"]].map(([l,r])=>(
          <div key={l} style={{padding:"14px",background:"#F5FAEF",borderRadius:10,border:"1px solid #D4DFC8",textAlign:"center"}}>
            <div style={{fontSize:13,color:"#4A7A28",marginBottom:4}}>{l}</div>
            <div style={{fontSize:22,fontWeight:800,color:"#2D5016"}}>{r}</div>
            <div style={{fontSize:11,color:"#7A6B5A"}}>per person (full rate)</div>
          </div>))}
      </div>
      <p style={{fontSize:12,color:"#9A8B7A",marginTop:10,fontStyle:"italic"}}>Final costs depend on attendance, vendor pricing, group discounts, food, and the Saturday activity chosen.</p>
    </div>

    {/* HOTEL NOTE */}
    <div style={{background:"#FFF8EC",borderRadius:12,padding:16,border:"2px solid #C4963A",marginBottom:16,textAlign:"center"}}>
      <div style={{fontSize:16,fontWeight:700,color:"#B8860B",textDecoration:"underline",marginBottom:6}}>Hotel expenses are NOT included in the reunion fee.</div>
      <p style={{fontSize:13,color:"#3B2F1E",margin:0}}>Each family books and pays their own hotel. The Host Family will arrange a group room block for discounted rates.</p>
    </div>

    {/* ADMIN */}
    <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
      <button onClick={()=>setAdmin(!admin)} style={{padding:"6px 14px",background:admin?"#C4963A":"#E8F3DC",color:admin?"#fff":"#2D5016",border:"1px solid "+(admin?"#C4963A":"#B8D4A0"),borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600}}>{admin?"Close Admin":"🔧 Host Admin"}</button>
    </div>
    {admin&&(<div style={{background:"#FFF8EC",borderRadius:14,padding:20,border:"2px solid #E8DFD0",marginBottom:16}}>
      <div style={{fontSize:15,fontWeight:700,color:"#C4963A",marginBottom:4}}>Host Family — Budget Entry</div>
      <p style={{fontSize:12,color:"#8B7355",margin:"0 0 12px"}}>Enter estimated costs to calculate per-person rates.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"0 16px"}}>
        <div><label style={ls}>🏨 Hotel Event Room</label><input style={is} type="number" value={budget.eventRoom} onChange={e=>setBudget(p=>({...p,eventRoom:+e.target.value||0}))}/></div>
        <div><label style={ls}>🌳 Saturday Event</label><input style={is} type="number" value={budget.picnic} onChange={e=>setBudget(p=>({...p,picnic:+e.target.value||0}))}/></div>
        <div><label style={ls}>🎁 Souvenir</label><input style={is} type="number" value={budget.activity} onChange={e=>setBudget(p=>({...p,activity:+e.target.value||0}))}/></div>
        <div><label style={ls}>🥞 Sunday Breakfast</label><input style={is} type="number" value={budget.breakfast} onChange={e=>setBudget(p=>({...p,breakfast:+e.target.value||0}))}/></div>
        <div><label style={ls}>👥 Expected Attendees</label><input style={is} type="number" value={attendees} onChange={e=>setAttendees(+e.target.value||1)}/></div>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center",marginTop:14}}><button onClick={saveBudget} style={{padding:"10px 24px",background:"#C4963A",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:14,fontWeight:700}}>Save Budget</button>{saved&&<span style={{fontSize:13,color:"#4A7A28",fontWeight:600}}>✓ Saved</span>}</div>
    </div>)}

    {/* FEE BUDGET */}
    <div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #C8DFB0",marginBottom:16}}>
      <div style={{fontSize:14,fontWeight:700,color:"#2D5016",marginBottom:10}}>Reunion Fee Budget</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:8}}>
        {[["🌳 Saturday Event",budget.picnic],["🎁 Souvenir",budget.activity],["🥞 Sunday Breakfast",budget.breakfast]].map(([l,a])=>(<div key={l} style={{padding:"10px 14px",background:"#F5FAEF",borderRadius:8,border:"1px solid #D4DFC8"}}><div style={{fontSize:12,color:"#7A6B5A"}}>{l}</div><div style={{fontSize:18,fontWeight:700,color:"#2D5016"}}>${a.toLocaleString()}</div></div>))}
      </div>
      <div style={{borderTop:"2px solid #E8F3DC",marginTop:12,paddingTop:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:14,fontWeight:700,color:"#2D5016"}}>Total Reunion Fee Budget</div><div style={{fontSize:12,color:"#7A6B5A"}}>{attendees} expected · per-person fees cover this</div></div><div style={{fontSize:28,fontWeight:800,color:"#2D5016"}}>${feeBudget.toLocaleString()}</div></div>
      <div style={{marginTop:10,padding:"10px 14px",background:"#FFF8EC",borderRadius:8,border:"1px solid #E8DFD0",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:13,color:"#8B7355"}}>🏨 Hotel Event Room</div><div style={{fontSize:11,color:"#9A8B7A"}}>Transparency — each family pays hotel separately</div></div><div style={{fontSize:16,fontWeight:700,color:"#C4963A"}}>${budget.eventRoom.toLocaleString()}</div></div>
    </div>

    {/* AGE TIERS */}
    <div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #C8DFB0",marginBottom:16}}>
      <div style={{fontSize:14,fontWeight:700,color:"#2D5016",marginBottom:4}}>Age-Based Pricing Tiers</div>
      <p style={{fontSize:12,color:"#7A6B5A",margin:"0 0 12px"}}>Costs shared by age. Dollar amounts established after attendance and expenses are known.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:8}}>
        <div style={{padding:12,background:"#E8F3DC",borderRadius:8,textAlign:"center"}}><div style={{fontSize:11,color:"#4A7A28",fontWeight:600}}>Ages 0–12</div><div style={{fontSize:20,fontWeight:800,color:"#2D5016"}}>${RATE_U12}</div><div style={{fontSize:10,color:"#7A6B5A"}}>Reduced Child</div></div>
        <div style={{padding:12,background:"#F5FAEF",borderRadius:8,textAlign:"center"}}><div style={{fontSize:11,color:"#4A7A28",fontWeight:600}}>Ages 13–26</div><div style={{fontSize:20,fontWeight:800,color:"#2D5016"}}>60%</div><div style={{fontSize:10,color:"#7A6B5A"}}>of Full Rate</div></div>
        <div style={{padding:12,background:"#2D5016",borderRadius:8,textAlign:"center",color:"#fff"}}><div style={{fontSize:11,fontWeight:600,opacity:.8}}>Ages 27–74</div><div style={{fontSize:20,fontWeight:800}}>Full Rate</div><div style={{fontSize:10,opacity:.7}}>See scenarios</div></div>
        <div style={{padding:12,background:"#FFF8EC",borderRadius:8,textAlign:"center"}}><div style={{fontSize:11,color:"#C4963A",fontWeight:600}}>Age 75+</div><div style={{fontSize:20,fontWeight:800,color:"#C4963A"}}>${RATE_75}</div><div style={{fontSize:10,color:"#7A6B5A"}}>Reduced Senior</div></div>
      </div>
    </div>

    {/* SCENARIOS */}
    <div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #C8DFB0",marginBottom:16}}>
      <div style={{fontSize:14,fontWeight:700,color:"#2D5016",marginBottom:4}}>Cost Per Person by Family Scenario</div>
      <p style={{fontSize:12,color:"#7A6B5A",margin:"0 0 14px"}}>The fee varies by age mix. Find your family's closest scenario.</p>
      <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}><thead><tr style={{background:"#F5FAEF"}}><th style={{padding:"10px 8px",textAlign:"left",borderBottom:"2px solid #C8DFB0",fontWeight:700,color:"#2D5016"}}>Scenario</th><th style={{padding:"10px 8px",textAlign:"center",borderBottom:"2px solid #C8DFB0",fontSize:11,color:"#4A7A28"}}>0–12</th><th style={{padding:"10px 8px",textAlign:"center",borderBottom:"2px solid #C8DFB0",fontSize:11,color:"#4A7A28"}}>13–26</th><th style={{padding:"10px 8px",textAlign:"center",borderBottom:"2px solid #C8DFB0",fontSize:11,color:"#4A7A28"}}>27–74</th><th style={{padding:"10px 8px",textAlign:"center",borderBottom:"2px solid #C8DFB0",fontSize:11,color:"#C4963A"}}>75+</th><th style={{padding:"10px 8px",textAlign:"center",borderBottom:"2px solid #C8DFB0",fontWeight:700,color:"#2D5016"}}>Full Rate</th><th style={{padding:"10px 8px",textAlign:"center",borderBottom:"2px solid #C8DFB0",fontWeight:700,color:"#2D5016"}}>13–26</th></tr></thead><tbody>{SCENARIOS.map((s,i)=>{const fr=calcFR(s);const tr2=fr*TEEN_DISCOUNT;return (<tr key={s.name} style={{background:i%2===0?"#fff":"#FDFCF9"}}><td style={{padding:"10px 8px",fontWeight:600,borderBottom:"1px solid #F0EAE0"}}>{s.name}</td><td style={{padding:"10px 8px",textAlign:"center",borderBottom:"1px solid #F0EAE0"}}>{Math.round(s.u12*100)}%</td><td style={{padding:"10px 8px",textAlign:"center",borderBottom:"1px solid #F0EAE0"}}>{Math.round(s.t13*100)}%</td><td style={{padding:"10px 8px",textAlign:"center",borderBottom:"1px solid #F0EAE0"}}>{Math.round(s.a27*100)}%</td><td style={{padding:"10px 8px",textAlign:"center",borderBottom:"1px solid #F0EAE0"}}>{Math.round(s.s75*100)}%</td><td style={{padding:"10px 8px",textAlign:"center",borderBottom:"1px solid #F0EAE0",fontWeight:800,color:"#2D5016",fontSize:16}}>${Math.round(fr)}</td><td style={{padding:"10px 8px",textAlign:"center",borderBottom:"1px solid #F0EAE0",fontWeight:600,color:"#4A7A28"}}>${Math.round(tr2)}</td></tr>);})}</tbody></table></div>
      <div style={{marginTop:12,fontSize:12,color:"#9A8B7A",lineHeight:1.5}}>The <strong>Full Rate</strong> covers the reunion fee budget of ${feeBudget.toLocaleString()} across {attendees} attendees. Hotel is separate. Ages 13–26 pay 60%. Under 12 and 75+ have fixed rates.</div>
    </div>

    {/* AGE CHART */}
    <div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #C8DFB0"}}>
      <div style={{fontSize:14,fontWeight:700,color:"#2D5016",marginBottom:2}}>Confirmed Attendees by Age Group</div>
      <p style={{fontSize:12,color:"#7A6B5A",margin:"0 0 12px"}}>{tc} confirmed — includes children under 18.</p>
      {tc>0?(<div style={{width:"100%",height:220}}><ResponsiveContainer width="100%" height="100%"><BarChart data={acd} margin={{top:5,right:20,left:0,bottom:5}}><CartesianGrid strokeDasharray="3 3" stroke="#E8DFD0" vertical={false}/><XAxis dataKey="name" tick={{fontSize:11,fill:"#7A6B5A"}}/><YAxis allowDecimals={false} tick={{fontSize:11,fill:"#7A6B5A"}}/><Tooltip content={({active,payload,label})=>{if(!active||!payload?.length)return null;const d=acd.find(x=>x.name===label);return (<div style={{background:"rgba(59,47,30,.92)",borderRadius:8,padding:"8px 12px",color:"#fff",fontSize:12}}><div style={{fontWeight:600}}>{label}</div><div>Count: <strong>{payload[0].value}</strong></div><div>Rate: <strong>{d?.rate}</strong></div></div>);}}/><Bar dataKey="count" radius={[6,6,0,0]} barSize={40}>{acd.map((e,i)=> <Cell key={i} fill={i===0?"#6AAF3D":i===1?"#4A8C28":i===2?"#2D5016":i===3?"#D4A843":"#9A8B7A"}/>)}<LabelList dataKey="count" position="top" style={{fontSize:13,fontWeight:700,fill:"#2D5016"}} formatter={v=>v>0?v:""}/></Bar></BarChart></ResponsiveContainer></div>):(<div style={{textAlign:"center",padding:20,color:"#9A8B7A",fontStyle:"italic",fontSize:13}}>No confirmed attendees yet. Check the Attendance tab.</div>)}
    </div>
  </div>);
}

/* ═══ ATTENDANCE PAGE ═══ */
function AttendancePage({members,rootChildren,updateMember}){
  const [rsvps,setRsvps] = useState({});
  const [guests,setGuests] = useState({});
  const [guestForm,setGuestForm] = useState({name:"",age:""});
  const [addingFor,setAddingFor] = useState(null);

  useEffect(()=>{(async()=>{try{const r=await store.get("coleman-rsvp");if(r?.value)setRsvps(JSON.parse(r.value));}catch{} try{const r2=await store.get("coleman-guests");if(r2?.value)setGuests(JSON.parse(r2.value));}catch{}})();},[]);
  const saveRsvp=async(id,status)=>{const next={...rsvps,[id]:status};setRsvps(next);try{await store.set("coleman-rsvp",JSON.stringify(next));}catch{}};
  const saveGuests=async(id,list)=>{const next={...guests,[id]:list};setGuests(next);try{await store.set("coleman-guests",JSON.stringify(next));}catch{}};
  const addGuest=(memberId)=>{if(!guestForm.name.trim())return;const cur=guests[memberId]||[];saveGuests(memberId,[...cur,{name:guestForm.name,age:guestForm.age}]);setGuestForm({name:"",age:""});};
  const removeGuest=(memberId,idx)=>{const cur=[...(guests[memberId]||[])];cur.splice(idx,1);saveGuests(memberId,cur);};

  const livingMembers = members.filter(m=>!m.isDeceased&&!m.isRootParent);
  const going = livingMembers.filter(m=>rsvps[m.id]==="going").length;
  const notGoing = livingMembers.filter(m=>rsvps[m.id]==="not-going").length;
  const maybe = livingMembers.filter(m=>rsvps[m.id]==="maybe").length;
  const noResp = livingMembers.filter(m=>!rsvps[m.id]).length;
  const totalGuests = Object.values(guests).reduce((a,b)=>a+b.length,0);

  const statusStyle = (s) => ({
    padding:"4px 10px",borderRadius:12,fontSize:11,fontWeight:600,cursor:"pointer",border:"none",
    background:s==="going"?"#E8F3DC":s==="not-going"?"#F5E6E6":s==="maybe"?"#FFF8EC":"#F0EAE0",
    color:s==="going"?"#2D5016":s==="not-going"?"#933":s==="maybe"?"#C4963A":"#9A8B7A",
  });
  const is={width:"100%",padding:"8px 10px",border:"1px solid #C8DFB0",borderRadius:6,fontSize:13,background:"#fff",boxSizing:"border-box"};

  return (<div style={{maxWidth:860,margin:"0 auto"}}>
    <h2 style={{fontFamily:"Georgia,serif",color:"#2D5016",margin:"0 0 4px",fontSize:22}}>Reunion Attendance</h2>
    <p style={{color:"#7A6B5A",fontSize:13,margin:"0 0 16px"}}>RSVP and add any guests you're bringing. Guest ages are needed for accurate cost calculation.</p>

    {/* Summary cards */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginBottom:16}}>
      <div style={{padding:10,background:"#E8F3DC",borderRadius:10,textAlign:"center",border:"1px solid #B8D4A0"}}><div style={{fontSize:22,fontWeight:800,color:"#2D5016"}}>{going}</div><div style={{fontSize:10,color:"#4A7A28",fontWeight:600}}>Going</div></div>
      <div style={{padding:10,background:"#FFF8EC",borderRadius:10,textAlign:"center",border:"1px solid #E8DFD0"}}><div style={{fontSize:22,fontWeight:800,color:"#C4963A"}}>{maybe}</div><div style={{fontSize:10,color:"#C4963A",fontWeight:600}}>Maybe</div></div>
      <div style={{padding:10,background:"#F5E6E6",borderRadius:10,textAlign:"center",border:"1px solid #E0C8C8"}}><div style={{fontSize:22,fontWeight:800,color:"#933"}}>{notGoing}</div><div style={{fontSize:10,color:"#933",fontWeight:600}}>Not Going</div></div>
      <div style={{padding:10,background:"#F0EAE0",borderRadius:10,textAlign:"center",border:"1px solid #D4C5AA"}}><div style={{fontSize:22,fontWeight:800,color:"#8B7355"}}>{noResp}</div><div style={{fontSize:10,color:"#8B7355",fontWeight:600}}>No Response</div></div>
      <div style={{padding:10,background:"#F0E8FF",borderRadius:10,textAlign:"center",border:"1px solid #D4C5E8"}}><div style={{fontSize:22,fontWeight:800,color:"#6B4C8A"}}>{totalGuests}</div><div style={{fontSize:10,color:"#6B4C8A",fontWeight:600}}>Guests</div></div>
    </div>

    {/* Member list by branch */}
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {rootChildren.map(rc=>{
        const branchMembers = [rc,...getAllBranch(rc.id,members)].filter(m=>!m.isDeceased);
        const branchGuests = branchMembers.reduce((a,m)=>a+(guests[m.id]||[]).length,0);
        return (<div key={rc.id} style={{background:"#fff",borderRadius:12,border:"1px solid #C8DFB0",overflow:"hidden"}}>
          <div style={{padding:"8px 14px",background:"#F5FAEF",fontSize:13,fontWeight:700,color:"#2D5016",borderBottom:"1px solid #D4DFC8",display:"flex",alignItems:"center",gap:4}}>
            {rc.isDeceased&&<HaloSVG size={12}/>}{rc.name.split(/[\s(]/)[0]}'s Family
            <span style={{fontWeight:400,color:"#7A6B5A",marginLeft:8}}>{branchMembers.length>0?`(${branchMembers.filter(m=>rsvps[m.id]==="going").length} going${branchGuests>0?` + ${branchGuests} guest${branchGuests===1?"":"s"}`:""})`:"(no living members registered)"}</span>
          </div>
          {branchMembers.map((m,mi)=>{
            const status = rsvps[m.id]||"";
            const memberGuests = guests[m.id]||[];
            const isAdding = addingFor===m.id;
            return (<div key={m.id} style={{borderBottom:mi<branchMembers.length-1?"1px solid #F0EAE0":"none",background:mi%2===0?"#fff":"#FDFCF9"}}>
              <div style={{padding:"8px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
                <div style={{display:"flex",alignItems:"center",gap:6,flex:1,minWidth:150,flexWrap:"wrap"}}>
                  <span style={{fontSize:13,fontWeight:m.isRootChild?600:400,color:"#3B2F1E"}}>{m.name}</span>
                  {m.age&&<span style={{fontSize:11,color:"#9A8B7A"}}>(age {m.age})</span>}
                  {m.spouse&&<span style={{fontSize:11,color:"#8B7355"}}>⚭ {m.spouse}{m.spouseAge?` (${m.spouseAge})`:""}</span>}
                </div>
                <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>
                  <button onClick={()=>saveRsvp(m.id,"going")} style={{...statusStyle("going"),outline:status==="going"?"2px solid #2D5016":"none"}}>✓ Going</button>
                  <button onClick={()=>saveRsvp(m.id,"maybe")} style={{...statusStyle("maybe"),outline:status==="maybe"?"2px solid #C4963A":"none"}}>? Maybe</button>
                  <button onClick={()=>saveRsvp(m.id,"not-going")} style={{...statusStyle("not-going"),outline:status==="not-going"?"2px solid #933":"none"}}>✕ No</button>
                  <button onClick={()=>setAddingFor(isAdding?null:m.id)} style={{padding:"4px 8px",borderRadius:12,fontSize:11,fontWeight:600,cursor:"pointer",border:"1px solid #D4C5E8",background:isAdding?"#6B4C8A":"#F0E8FF",color:isAdding?"#fff":"#6B4C8A"}}>+ Guest</button>
                </div>
              </div>
              {/* Guest list for this member */}
              {memberGuests.length>0&&(<div style={{padding:"4px 14px 8px 30px"}}>
                {memberGuests.map((g,gi)=>(<div key={gi} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#6B4C8A",marginBottom:2}}>
                  <span>👤 {g.name}{g.age?` (age ${g.age})`:""}</span>
                  <button onClick={()=>removeGuest(m.id,gi)} style={{background:"none",border:"none",color:"#C77",cursor:"pointer",fontSize:11}}>✕</button>
                </div>))}
              </div>)}
              {/* Add guest form */}
              {isAdding&&(<div style={{padding:"6px 14px 10px 30px",display:"flex",gap:6,flexWrap:"wrap"}}>
                <input placeholder="Guest name" value={guestForm.name} onChange={e=>setGuestForm(p=>({...p,name:e.target.value}))} style={{...is,flex:2,minWidth:120}}/>
                <input placeholder="Age" type="number" value={guestForm.age} onChange={e=>setGuestForm(p=>({...p,age:e.target.value}))} style={{...is,flex:1,minWidth:60}}/>
                <button onClick={()=>addGuest(m.id)} style={{padding:"8px 14px",background:"#6B4C8A",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600,whiteSpace:"nowrap"}}>Add Guest</button>
              </div>)}
            </div>);
          })}
        </div>);
      })}
    </div>
  </div>);
}

/* ═══ REUNION TRACKER ═══ */
const CG=["#1B3A0E","#2D5016","#3A7D1E","#4A8C28","#5DA832","#6AAF3D","#8CD660"];
function CT({active,payload,label,vl}){if(!active||!payload?.length)return null;return (<div style={{background:"rgba(59,47,30,.92)",borderRadius:8,padding:"8px 12px",color:"#fff",fontSize:12}}><div style={{fontWeight:600,marginBottom:2}}>{label}</div><div>{vl||"Value"}: <span style={{fontWeight:700}}>{typeof payload[0].value==='number'?(Number.isInteger(payload[0].value)?payload[0].value:payload[0].value.toFixed(1)):payload[0].value}</span></div></div>);}
function CC({title,sub,children}){return (<div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #C8DFB0"}}><div style={{fontSize:14,fontWeight:700,color:"#2D5016",marginBottom:2}}>{title}</div>{sub&&<div style={{fontSize:12,color:"#7A6B5A",marginBottom:12}}>{sub}</div>}{children}</div>);}

function TrackerPage(){
  const[resp,setResp]=useState([]);
  useEffect(()=>{(async()=>{try{const r=await store.get("coleman-reunion-r2");if(r?.value)setResp(JSON.parse(r.value));}catch{}})();},[]);
  const t=resp.length;
  if(t===0)return (<div style={{maxWidth:800,margin:"0 auto",textAlign:"center",padding:"60px 20px"}}><div style={{fontSize:48,marginBottom:16}}>📊</div><h2 style={{fontFamily:"Georgia,serif",color:"#2D5016",margin:"0 0 8px",fontSize:22}}>No Results Yet</h2><p style={{color:"#7A6B5A",fontSize:14}}>Submit preferences on the Planner tab to see results here.</p></div>);

  const cs={};REUNION_CITIES.forEach(c=>{cs[c]={total:0,count:0};});resp.forEach(p=>{if(p.cityRankings&&Array.isArray(p.cityRankings))p.cityRankings.forEach((c,i)=>{if(cs[c]){cs[c].total+=i+1;cs[c].count+=1;}});});
  const cd=REUNION_CITIES.map(c=>({name:c.replace(/, \w+$/,""),full:c,avg:cs[c].count>0?+(cs[c].total/cs[c].count).toFixed(1):0,score:cs[c].count>0?+(REUNION_CITIES.length+1-(cs[c].total/cs[c].count)).toFixed(1):0,v:cs[c].count})).sort((a,b)=>b.score-a.score);
  const mv={};resp.forEach(p=>{(p.bestMonths||[]).forEach(m=>{if(m)mv[m]=(mv[m]||0)+1;});});const md=MONTHS.map(m=>({name:m.slice(0,3),full:m,votes:mv[m]||0}));
  const dv={};resp.forEach(p=>{if(p.preferredDays)dv[p.preferredDays]=(dv[p.preferredDays]||0)+1;});const dd=Object.entries(dv).map(([k,v])=>({name:k==="Thu-Sun"?"Thu–Sun":"Fri–Sun",votes:v})).sort((a,b)=>b.votes-a.votes);
  const tv={};resp.forEach(p=>{if(p.travelMode)tv[p.travelMode]=(tv[p.travelMode]||0)+1;});const td=Object.entries(tv).map(([k,v])=>({name:k==="fly"?"Fly":k==="drive"?"Drive":"Either",votes:v})).sort((a,b)=>b.votes-a.votes);
  const hy=resp.filter(p=>p.holidayWeekend==="yes").length;const hn=resp.filter(p=>p.holidayWeekend==="no").length;
  const hd=[{name:"Yes",votes:hy},{name:"No",votes:hn}];
  const topC=cd.length>0&&cd[0].v>0?cd[0]:null;const topM=Object.entries(mv).sort((a,b)=>b[1]-a[1]).slice(0,2);

  return (<div style={{maxWidth:900,margin:"0 auto"}}>
    <h2 style={{fontFamily:"Georgia,serif",color:"#2D5016",margin:"0 0 4px",fontSize:22}}>Reunion Tracker</h2>
    <p style={{color:"#7A6B5A",fontSize:13,margin:"0 0 16px"}}>Based on {t} response{t===1?"":"s"}.</p>
    {topC&&topM.length>=2&&(<div style={{background:"linear-gradient(135deg,#2D5016,#4A7A28)",borderRadius:14,padding:18,color:"#fff",marginBottom:16}}><div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"2px",opacity:.7,marginBottom:8}}>Front-Runners</div><div style={{display:"flex",gap:20,flexWrap:"wrap"}}><div><div style={{fontSize:11,opacity:.7}}>Top City</div><div style={{fontSize:18,fontWeight:700}}>{topC.full}</div></div><div><div style={{fontSize:11,opacity:.7}}>Top Months</div><div style={{fontSize:18,fontWeight:700}}>{topM.map(m=>m[0]).join(" & ")}</div></div><div><div style={{fontSize:11,opacity:.7}}>Responses</div><div style={{fontSize:18,fontWeight:700}}>{t}</div></div></div></div>)}
    <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <CC title="Host City Preference" sub={`Higher score = more preferred (${t} responses)`}><div style={{width:"100%",height:cd.length*50+30}}><ResponsiveContainer width="100%" height="100%"><BarChart data={cd} layout="vertical" margin={{top:5,right:30,left:10,bottom:5}} barCategoryGap="20%"><CartesianGrid strokeDasharray="3 3" stroke="#E8DFD0" horizontal={false}/><XAxis type="number" domain={[0,REUNION_CITIES.length]} tick={{fontSize:11,fill:"#7A6B5A"}}/><YAxis type="category" dataKey="name" width={110} tick={{fontSize:12,fontWeight:600,fill:"#3B2F1E"}} axisLine={false} tickLine={false}/><Tooltip content={<CT vl="Score"/>}/><Bar dataKey="score" radius={[0,6,6,0]} barSize={26}>{cd.map((_,i)=> <Cell key={i} fill={i===0?"#2D5016":i===1?"#3A7D1E":"#8BB873"}/>)}<LabelList dataKey="score" position="right" style={{fontSize:12,fontWeight:700,fill:"#2D5016"}}/></Bar></BarChart></ResponsiveContainer></div></CC>
      <CC title="Preferred Months" sub="Votes across 1st and 2nd choices"><div style={{width:"100%",height:260}}><ResponsiveContainer width="100%" height="100%"><BarChart data={md} margin={{top:5,right:20,left:0,bottom:5}}><CartesianGrid strokeDasharray="3 3" stroke="#E8DFD0" vertical={false}/><XAxis dataKey="name" tick={{fontSize:11,fill:"#7A6B5A"}}/><YAxis allowDecimals={false} tick={{fontSize:11,fill:"#7A6B5A"}}/><Tooltip content={<CT vl="Votes"/>}/><Bar dataKey="votes" radius={[6,6,0,0]} barSize={30}>{md.map((e,i)=> <Cell key={i} fill={e.votes>0?CG[i%CG.length]:"#E0D6C8"}/>)}<LabelList dataKey="votes" position="top" style={{fontSize:11,fontWeight:700,fill:"#2D5016"}} formatter={v=>v>0?v:""}/></Bar></BarChart></ResponsiveContainer></div></CC>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:14}}>
        <CC title="Duration"><div style={{width:"100%",height:160}}><ResponsiveContainer width="100%" height="100%"><BarChart data={dd} margin={{top:5,right:20,left:0,bottom:5}}><CartesianGrid strokeDasharray="3 3" stroke="#E8DFD0" vertical={false}/><XAxis dataKey="name" tick={{fontSize:11,fill:"#7A6B5A"}}/><YAxis allowDecimals={false} tick={{fontSize:11,fill:"#7A6B5A"}}/><Tooltip content={<CT vl="Votes"/>}/><Bar dataKey="votes" radius={[6,6,0,0]} barSize={44}>{dd.map((_,i)=> <Cell key={i} fill={CG[i+1]}/>)}<LabelList dataKey="votes" position="top" style={{fontSize:12,fontWeight:700,fill:"#2D5016"}}/></Bar></BarChart></ResponsiveContainer></div></CC>
        <CC title="Travel"><div style={{width:"100%",height:160}}><ResponsiveContainer width="100%" height="100%"><BarChart data={td} margin={{top:5,right:20,left:0,bottom:5}}><CartesianGrid strokeDasharray="3 3" stroke="#E8DFD0" vertical={false}/><XAxis dataKey="name" tick={{fontSize:11,fill:"#7A6B5A"}}/><YAxis allowDecimals={false} tick={{fontSize:11,fill:"#7A6B5A"}}/><Tooltip content={<CT vl="Votes"/>}/><Bar dataKey="votes" radius={[6,6,0,0]} barSize={44}>{td.map((_,i)=> <Cell key={i} fill={CG[i+2]}/>)}<LabelList dataKey="votes" position="top" style={{fontSize:12,fontWeight:700,fill:"#2D5016"}}/></Bar></BarChart></ResponsiveContainer></div></CC>
        <CC title="Holiday Weekend?"><div style={{width:"100%",height:160}}><ResponsiveContainer width="100%" height="100%"><BarChart data={hd} margin={{top:5,right:20,left:0,bottom:5}}><CartesianGrid strokeDasharray="3 3" stroke="#E8DFD0" vertical={false}/><XAxis dataKey="name" tick={{fontSize:11,fill:"#7A6B5A"}}/><YAxis allowDecimals={false} tick={{fontSize:11,fill:"#7A6B5A"}}/><Tooltip content={<CT vl="Votes"/>}/><Bar dataKey="votes" radius={[6,6,0,0]} barSize={44}><Cell fill="#2D5016"/><Cell fill="#D4A843"/><LabelList dataKey="votes" position="top" style={{fontSize:12,fontWeight:700,fill:"#2D5016"}}/></Bar></BarChart></ResponsiveContainer></div></CC>
      </div>
    </div>
  </div>);
}
