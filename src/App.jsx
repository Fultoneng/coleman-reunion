import { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

/* ═══ FIREBASE CONFIG ═══ */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

let db = null;
try {
  if (firebaseConfig.apiKey) {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
} catch (e) { console.error("Firebase init error:", e); }

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
  {id:"root-1",name:"Arthur Coleman",age:"",birthMonth:"",city:"Indianapolis",state:"IN",phone:"",email:"",isRootParent:true,isRootChild:false,isDeceased:true,parentId:null,parentRootId:null,spouse:"Orma Ree",childrenUnder18:[]},
  {id:"root-2",name:"Orma Ree Coleman",age:"",birthMonth:"",city:"Indianapolis",state:"IN",phone:"",email:"",isRootParent:true,isRootChild:false,isDeceased:true,parentId:null,parentRootId:null,spouse:"Arthur Coleman",childrenUnder18:[]},
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

/* ═══ STORAGE — Firestore (shared) → localStorage (fallback) → artifact storage ═══ */
const store = {
  async get(key) {
    // Try Firestore first (shared across all users)
    if (db) {
      try {
        const snap = await getDoc(doc(db, "appData", key));
        if (snap.exists()) return { value: snap.data().value };
      } catch (e) { console.warn("Firestore read error:", e); }
    }
    // Fallback to localStorage (per-device)
    try {
      const v = localStorage.getItem(key);
      return v !== null ? { value: v } : null;
    } catch { return null; }
  },
  async set(key, value) {
    // Write to Firestore (shared across all users)
    if (db) {
      try {
        await setDoc(doc(db, "appData", key), { value, updatedAt: new Date().toISOString() });
      } catch (e) { console.warn("Firestore write error:", e); }
    }
    // Also write to localStorage as backup
    try { localStorage.setItem(key, value); } catch {}
    return { key, value };
  }
};

/* ═══ FAMILY PASSKEY — change this to update the passkey ═══ */
const FAMILY_PASSKEY = "Arthur_OrmaRee_13";

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
        <p style={{color:"rgba(255,255,255,0.7)",fontSize:14,fontStyle:"italic",margin:"0 0 30px"}}>Rooted in Indianapolis — Founded by Arthur Coleman & Orma Ree</p>
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

  useEffect(()=>{(async()=>{try{
    // Load from Firebase (shared)
    let fbMembers = null;
    if(db){try{const snap=await getDoc(doc(db,"appData","coleman-v8"));if(snap.exists())fbMembers=JSON.parse(snap.data().value);}catch(e){console.warn("Firebase read:",e);}}

    // Load from localStorage (this device only)
    let localMembers = null;
    try{const v=localStorage.getItem("coleman-v8");if(v)localMembers=JSON.parse(v);}catch{}

    // Merge: start with Firebase data, add any local-only members
    if(fbMembers && Array.isArray(fbMembers) && fbMembers.length > 0){
      let merged = [...fbMembers];
      if(localMembers && Array.isArray(localMembers)){
        const fbNames = new Set(fbMembers.map(m=>(m.name||"").trim().toLowerCase()));
        const fbIds = new Set(fbMembers.map(m=>m.id));
        localMembers.forEach(lm=>{
          const nameKey = (lm.name||"").trim().toLowerCase();
          // Add if not a duplicate by name or ID, and not a root parent/child already in Firebase
          if(!fbIds.has(lm.id) && !fbNames.has(nameKey) && !lm.isRootParent && !lm.isRootChild){
            merged.push(lm);
          } else if(fbIds.has(lm.id) && !lm.isRootParent){
            // Same ID exists — keep Firebase version but merge in any fields localStorage has that Firebase doesn't
            merged = merged.map(fm=>{
              if(fm.id !== lm.id) return fm;
              return {...fm,
                phone:fm.phone||lm.phone||"",email:fm.email||lm.email||"",
                phone2:fm.phone2||lm.phone2||"",email2:fm.email2||lm.email2||"",
                spouseAge:fm.spouseAge||lm.spouseAge||"",spouseBirthMonth:fm.spouseBirthMonth||lm.spouseBirthMonth||"",
                city:fm.city||lm.city||"",state:fm.state||lm.state||"",
                age:fm.age||lm.age||"",birthMonth:fm.birthMonth||lm.birthMonth||""
              };
            });
          }
        });
      }
      setMembers(merged);
      // Save merged result back to Firebase
      if(merged.length > fbMembers.length){
        try{await setDoc(doc(db,"appData","coleman-v8"),{value:JSON.stringify(merged),updatedAt:new Date().toISOString()});}catch{}
      }
    } else if(localMembers && Array.isArray(localMembers) && localMembers.length > 0){
      // No Firebase data yet — push localStorage up as the starting point
      setMembers(localMembers);
      if(db){try{await setDoc(doc(db,"appData","coleman-v8"),{value:JSON.stringify(localMembers),updatedAt:new Date().toISOString()});}catch{}}
    }

    // Also merge other storage keys (rsvps, roles, votes, budget, guests)
    const mergeKeys = ["coleman-rsvp","coleman-roles-v2","coleman-first-vote","coleman-budget","coleman-guests"];
    for(const key of mergeKeys){
      if(!db) break;
      try{
        const snap = await getDoc(doc(db,"appData",key));
        const localVal = localStorage.getItem(key);
        if(!snap.exists() && localVal){
          // Local has data, Firebase doesn't — push up
          await setDoc(doc(db,"appData",key),{value:localVal,updatedAt:new Date().toISOString()});
        } else if(snap.exists() && localVal){
          // Both have data — merge objects (for rsvps, roles, guests, etc.)
          try{
            const fbObj = JSON.parse(snap.data().value);
            const localObj = JSON.parse(localVal);
            if(typeof fbObj === "object" && typeof localObj === "object" && !Array.isArray(fbObj)){
              const merged = {...localObj,...fbObj}; // Firebase wins on conflicts
              await setDoc(doc(db,"appData",key),{value:JSON.stringify(merged),updatedAt:new Date().toISOString()});
            }
          }catch{}
        }
      }catch(e){console.warn("Merge key",key,e);}
    }
  }catch(e){console.error("Load error:",e);}setLoaded(true);})();},[]);
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
          <div><h1 style={{fontFamily:"Georgia,serif",fontSize:"clamp(18px,4vw,28px)",margin:0,fontWeight:700}}>The Coleman Family Reunion</h1><p style={{margin:"2px 0 10px",opacity:0.8,fontSize:13,fontStyle:"italic"}}>Rooted in Indianapolis — Founded by Arthur Coleman & Orma Ree</p></div>
          <button onClick={()=>setShowHelp(!showHelp)} style={{background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.4)",borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:15,color:"#fff",fontWeight:700,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}} title="Help">?</button>
        </div>
        {/* Welcome action banner */}
        <div style={{background:"rgba(255,255,255,0.12)",borderRadius:8,padding:"10px 14px",marginBottom:8,border:"1px solid rgba(255,255,255,0.2)"}}>
          <div style={{fontSize:12,fontWeight:700,color:"#fff",marginBottom:4}}>👋 Welcome! Here's what we need from you:</div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",fontSize:11,color:"rgba(255,255,255,0.85)"}}>
            <span onClick={()=>setPage("form")} style={{cursor:"pointer",textDecoration:"underline"}}>① Add/update your family on the <strong>Members</strong> tab</span>
            <span onClick={()=>setPage("reunion")} style={{cursor:"pointer",textDecoration:"underline"}}>② Vote for a year & weekend on the <strong>Planner</strong> tab</span>
            <span onClick={()=>setPage("attend")} style={{cursor:"pointer",textDecoration:"underline"}}>③ RSVP on the <strong>Attendance</strong> tab</span>
          </div>
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
        {page==="form"&&<FormPage members={members} rootChildren={rootChildren} addMember={addMember} updateMember={updateMember} deleteMember={deleteMember} editTargetId={editTargetId} setEditTargetId={setEditTargetId} setPage={setPage}/>}
        {page==="map"&&<MapPage members={members}/>}
        {page==="bylaws"&&<ByLawsPage rootChildren={rootChildren}/>}
        {page==="reunion"&&<ReunionPage members={members}/>}
        {page==="costs"&&<CostsPage members={members}/>}
        {page==="attend"&&<AttendancePage members={members} rootChildren={rootChildren} updateMember={updateMember}/>}
        {page==="results"&&<TrackerPage members={members}/>}
      </div>
    </div>
  );
}

/* ═══ SHARED COMPONENTS ═══ */
function ParentSelector({members,value,onChange,label}){const gs=buildParentOpts(members);const is={width:"100%",padding:"10px 12px",border:"1px solid #C8DFB0",borderRadius:8,fontSize:14,background:"#fff",boxSizing:"border-box"};return (<div><label style={{display:"block",fontSize:12,fontWeight:600,color:"#4A7A28",marginBottom:4,marginTop:14}}>{label||"Parent"}</label><select style={is} value={value} onChange={e=>onChange(e.target.value)}><option value="">Select parent…</option>{gs.map(g=>(<optgroup key={g.root.id} label={`${g.root.name}${g.root.isDeceased?" ✝":""}`}><option value={g.root.id}>↳ Child of {g.root.name.split(/[\s(]/)[0]}</option>{g.desc.map(d=>{const indent="— ".repeat(getDepth(d,members)-1);return <option key={d.id} value={d.id}>{indent}↳ Child of {d.name}</option>;})}</optgroup>))}</select></div>);}

function ChildrenU18({children,onChange}){const[cn,setCn]=useState("");const[ca,setCa]=useState("");const[cb,setCb]=useState("");const[cd,setCd]=useState(false);const[err,setErr]=useState("");const add=()=>{if(!cn.trim())return;const ageNum=parseInt(ca);if(ca&&!isNaN(ageNum)&&ageNum>=18){setErr("Children 18 and older should fill out their own Member form using the \"+ Add New\" button.");return;}setErr("");onChange([...(children||[]),{name:cn,age:ca,birthMonth:cb,deceased:cd}]);setCn("");setCa("");setCb("");setCd(false);};const is={width:"100%",padding:"8px 10px",border:"1px solid #C8DFB0",borderRadius:6,fontSize:13,background:"#fff",boxSizing:"border-box"};return(<div style={{marginTop:0,padding:14,background:"#F5FAEF",borderRadius:10,border:"1px solid #C8DFB0"}}><div style={{fontSize:13,fontWeight:700,color:"#4A7A28",marginBottom:8}}>Children Under 18</div>{(children||[]).map((c,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,fontSize:13,padding:"8px 10px",background:"#fff",borderRadius:6,border:"1px solid #E8DFD0"}}><div style={{flex:1}}><div style={{fontWeight:500,display:"flex",alignItems:"center",gap:4}}>{c.deceased&&<HaloSVG size={12}/>}{c.name}</div><div style={{fontSize:11,color:"#8B7355"}}>{c.age&&`Age ${c.age}`}{c.age&&c.birthMonth&&" · "}{c.birthMonth&&`Born ${c.birthMonth}`}{c.deceased&&" · Passed away"}</div></div><button onClick={()=>onChange(children.filter((_,x)=>x!==i))} style={{background:"none",border:"none",color:"#C77",cursor:"pointer",fontSize:12}}>✕</button></div>))}<div style={{display:"grid",gridTemplateColumns:"3fr 1fr 2fr auto",gap:6,marginTop:8,alignItems:"end"}}><div><label style={{fontSize:11,color:"#4A7A28",fontWeight:600}}>Name</label><input placeholder="Child's name" value={cn} onChange={e=>setCn(e.target.value)} style={is}/></div><div><label style={{fontSize:11,color:"#4A7A28",fontWeight:600}}>Age</label><input placeholder="Age" type="number" value={ca} onChange={e=>{setCa(e.target.value);setErr("");}} max="17" style={is}/></div><div><label style={{fontSize:11,color:"#4A7A28",fontWeight:600}}>Birth Month</label><select value={cb} onChange={e=>setCb(e.target.value)} style={is}><option value="">Select…</option>{MONTHS.map(m=><option key={m}>{m}</option>)}</select></div><div style={{paddingBottom:2}}><label style={{display:"flex",alignItems:"center",gap:4,fontSize:11,cursor:"pointer",whiteSpace:"nowrap"}}><input type="checkbox" checked={cd} onChange={e=>setCd(e.target.checked)} style={{accentColor:"#D4A843"}}/>Passed</label></div></div>{err&&<div style={{marginTop:8,padding:"8px 12px",background:"#FFF8EC",borderRadius:6,border:"1px solid #E8DFD0",fontSize:12,color:"#C4963A",fontWeight:500}}>{err}</div>}<button onClick={add} style={{marginTop:10,padding:"8px 16px",background:"#4A7A28",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:13,fontWeight:600,width:"100%"}}>+ Add Child</button></div>);}

/* ═══ TREE WRAPPER ═══ */
function TreeWrapper({members,rootChildren,goEdit}){const[view,setView]=useState("tree");return(<div>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
    <p style={{color:"#7A6B5A",fontSize:13,margin:0}}>Click a branch to focus. Click a leaf to see details. Golden halo = passed away.</p>
    <div style={{display:"flex",background:"#E8F3DC",borderRadius:8,overflow:"hidden",border:"1px solid #B8D4A0"}}>
      <button onClick={()=>setView("tree")} style={{padding:"6px 12px",border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:view==="tree"?"#2D5016":"transparent",color:view==="tree"?"#fff":"#2D5016"}}>🌳 Oak Tree</button>
      <button onClick={()=>setView("list")} style={{padding:"6px 12px",border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:view==="list"?"#2D5016":"transparent",color:view==="list"?"#fff":"#2D5016"}}>📋 List</button>
    </div>
  </div>
  {view==="tree"?<OakTree members={members} rootChildren={rootChildren} goEdit={goEdit}/>:<ListView members={members} rootChildren={rootChildren} goEdit={goEdit}/>}
</div>);}

/* ═══ OAK TREE — real image with interactive overlay ═══ */
function OakTree({members,rootChildren,goEdit}){
  const[selBranch,setSelBranch]=useState(null);
  const[selPerson,setSelPerson]=useState(null);
  const[search,setSearch]=useState("");

  const searchMatch = search.trim().toLowerCase();
  const foundMember = searchMatch ? members.find(m=>(m.name||"").toLowerCase().includes(searchMatch)) : null;
  const foundBranch = foundMember ? (foundMember.isRootChild ? foundMember.id : foundMember.parentRootId || findRootBranch(foundMember.parentId,members)) : null;
  useEffect(()=>{if(foundBranch && search.trim())setSelBranch(foundBranch);},[foundBranch,search]);

  const clickBranch=(id)=>{ setSelBranch(selBranch===id?null:id); setSelPerson(null); setSearch(""); };
  const clickPerson=(m)=>{ setSelPerson(selPerson?.id===m.id?null:m); };

  // 13 branch positions for wide Coleman oak tree
  // Order: Doris, Samuel, Luther, Sammie, Shirley, Paulette, Norma, Jackie, Arlene, Arthur Jr, Charles, Kevin, Evan
  const bp = [
    [35,6],   // 0 Doris — top left crown
    [50,3],   // 1 Samuel — top center
    [65,6],   // 2 Luther — top right crown
    [22,15],  // 3 Sammie — upper left
    [78,15],  // 4 Shirley — upper right
    [12,27],  // 5 Paulette — left canopy
    [88,27],  // 6 Norma — right canopy
    [5,40],   // 7 Jackie — far left branch
    [95,40],  // 8 Arlene — far right branch
    [10,52],  // 9 Arthur Jr — lower left
    [90,52],  // 10 Charles — lower right
    [18,62],  // 11 Kevin — bottom left
    [82,62],  // 12 Evan — bottom right
  ];

  const pq=(isD,isA)=>({
    padding:"4px 10px",borderRadius:14,fontSize:isA?13:11,fontWeight:700,
    cursor:"pointer",whiteSpace:"nowrap",userSelect:"none",
    background:isD?"rgba(196,150,58,.92)":"rgba(27,58,14,.92)",
    color:"#fff",border:isA?"2px solid #fff":"2px solid transparent",
    boxShadow:isA?"0 0 16px rgba(255,255,255,.5)":"0 2px 6px rgba(0,0,0,.3)",
    transform:isA?"scale(1.15)":"scale(1)",transition:"all .3s ease",
    display:"inline-flex",alignItems:"center",gap:4,
  });

  return (<div style={{position:"relative"}}>
    <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
      <button onClick={()=>{setSelBranch(null);setSelPerson(null);setSearch("");}} style={{padding:"6px 14px",background:!selBranch?"#2D5016":"#E8F3DC",color:!selBranch?"#fff":"#2D5016",border:"1px solid #B8D4A0",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600}}>🌳 All Family</button>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name..." style={{padding:"6px 12px",border:"1px solid #C8DFB0",borderRadius:6,fontSize:13,background:"#fff",minWidth:160,flex:1,maxWidth:250}}/>
      {search&&foundMember&&<span style={{fontSize:11,color:"#4A7A28",fontWeight:600}}>Found: {foundMember.name}</span>}
      {search&&!foundMember&&search.length>1&&<span style={{fontSize:11,color:"#C4963A"}}>No match</span>}
    </div>
    <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
      <div style={{flex:1,minWidth:300,position:"relative"}}>
        <div style={{position:"relative",borderRadius:16,overflow:"hidden",border:"2px solid #B8D4A0",background:"#FAF7F2"}}>
          <img src="/oak-tree.jpg" alt="Coleman Family Tree" style={{width:"95%",display:"block",pointerEvents:"none",margin:"0 auto"}}/>

          {rootChildren.map((c,i)=>{
            const pos=bp[i]||[50,50];const descendants=getAllBranch(c.id,members);const fn=c.name.split(/[\s(]/)[0];
            const isActive=selBranch===c.id;const isFaded=selBranch&&!isActive;
            return (<div key={c.id} style={{position:"absolute",left:`${pos[0]}%`,top:`${pos[1]}%`,transform:"translate(-50%,-50%)",zIndex:isActive?10:5,opacity:isFaded?0.3:1,transition:"all .3s ease"}}>
              {isActive&&(()=>{
                // Build generational rings from the root child
                const getDepth=(memberId,depth=0)=>{
                  const kids=members.filter(m=>m.parentId===memberId&&!m.isRootParent);
                  let result=kids.map(k=>({...k,gen:depth}));
                  kids.forEach(k=>{result=result.concat(getDepth(k.id,depth+1));});
                  return result;
                };
                const genMembers=getDepth(c.id);
                const maxGen=genMembers.length>0?Math.max(...genMembers.map(g=>g.gen)):0;
                const genColors=["rgba(45,80,22,.92)","rgba(74,140,40,.90)","rgba(106,175,61,.88)","rgba(140,200,90,.85)"];
                const genLabels=["Children","Grandchildren","Great-Grandchildren","Great-Great"];

                const rings=[];
                for(let g=0;g<=maxGen;g++){
                  const ring=genMembers.filter(m=>m.gen===g);
                  if(ring.length===0)continue;
                  const radius=55+g*45; // each generation ring is 45px further out
                  const startAngle=-90;
                  const spreadAngle=Math.min(28, 320/Math.max(ring.length,1));
                  rings.push(...ring.map((d,di)=>{
                    const angleDeg=startAngle+(di-(ring.length-1)/2)*spreadAngle;
                    const angleRad=angleDeg*Math.PI/180;
                    const lx=Math.cos(angleRad)*radius;
                    const ly=Math.sin(angleRad)*radius;
                    const isF=foundMember&&d.id===foundMember.id;
                    const isS=selPerson?.id===d.id;
                    const textRotate=angleDeg>90?angleDeg-180:angleDeg<-90?angleDeg+180:angleDeg;
                    const fontSize=Math.max(8,11-g);
                    return (<div key={d.id} onClick={(e)=>{e.stopPropagation();clickPerson(d);}}
                      style={{position:"absolute",left:lx,top:ly,
                        transform:`translate(-50%,-50%) rotate(${textRotate}deg)`,
                        padding:`2px ${10-g}px`,borderRadius:10,fontSize,fontWeight:600,
                        cursor:"pointer",whiteSpace:"nowrap",zIndex:7-g,
                        background:isF||isS?"#C4963A":d.isDeceased?"rgba(196,150,58,.92)":genColors[Math.min(g,genColors.length-1)],
                        color:"#fff",border:isS?"2px solid #fff":"1px solid rgba(255,255,255,.3)",
                        boxShadow:"0 2px 6px rgba(0,0,0,.25)",transition:"all .3s",
                        clipPath:"polygon(8% 0%, 92% 0%, 100% 50%, 92% 100%, 8% 100%, 0% 50%)"}}>
                      {d.name.split(" ")[0]}
                    </div>);
                  }));
                }

                // Generation ring labels
                const ringLabels=[];
                for(let g=0;g<=maxGen;g++){
                  const count=genMembers.filter(m=>m.gen===g).length;
                  if(count===0)continue;
                  const r=55+g*45;
                  ringLabels.push(<div key={`gl${g}`} style={{position:"absolute",left:0,top:-r-16,transform:"translateX(-50%)",
                    fontSize:8,color:"rgba(45,80,22,.6)",fontWeight:600,whiteSpace:"nowrap",zIndex:2}}>
                    {genLabels[Math.min(g,genLabels.length-1)]} ({count})
                  </div>);
                }

                return [...rings,...ringLabels];
              })()}
              <div onClick={()=>clickBranch(c.id)} style={pq(c.isDeceased,isActive)}>
                {c.isDeceased&&<HaloSVG size={11}/>}{fn}
                {descendants.length>0&&<span style={{background:"rgba(255,255,255,.25)",borderRadius:8,padding:"1px 5px",fontSize:9,marginLeft:2}}>{descendants.length}</span>}
              </div>
            </div>);
          })}
        </div>
        <div style={{marginTop:10,display:"flex",flexWrap:"wrap",gap:4,justifyContent:"center"}}>
          {rootChildren.map(c=>{const fn=c.name.split(/[\s(]/)[0];const isA=selBranch===c.id;return (
            <button key={c.id} onClick={()=>clickBranch(c.id)} style={{padding:"3px 8px",borderRadius:12,border:isA?"2px solid #2D5016":"1px solid #D4DFC8",background:isA?"#E8F3DC":"#fff",cursor:"pointer",fontSize:10,fontWeight:isA?700:500,color:c.isDeceased?"#8B7355":"#2D5016",display:"flex",alignItems:"center",gap:2}}>
              {c.isDeceased&&<HaloSVG size={9}/>}{fn}
            </button>
          );})}
        </div>
      </div>
      {selPerson&&(<div style={{width:280,flexShrink:0,background:"#fff",borderRadius:14,border:"1px solid #C8DFB0",padding:20,alignSelf:"flex-start",position:"sticky",top:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{width:50,height:50,borderRadius:"50%",background:selPerson.isDeceased?"#FFF8EC":"#E8F3DC",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,border:"2px solid "+(selPerson.isDeceased?"#D4A843":"#B8D4A0")}}>{selPerson.isDeceased?"\uD83D\uDC7C":"\uD83C\uDF3F"}</div>
          <button onClick={()=>setSelPerson(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:"#9A8B7A"}}>✕</button>
        </div>
        <h3 style={{fontFamily:"Georgia,serif",color:"#2D5016",margin:"10px 0 12px",fontSize:18}}>{selPerson.name}</h3>
        <div style={{display:"flex",flexDirection:"column",gap:8,fontSize:13}}>
          {selPerson.age&&<div style={{display:"flex",gap:8}}><span style={{color:"#9A8B7A",minWidth:70}}>Age</span><span style={{color:"#3B2F1E",fontWeight:500}}>{selPerson.age}</span></div>}
          {selPerson.birthMonth&&<div style={{display:"flex",gap:8}}><span style={{color:"#9A8B7A",minWidth:70}}>Born</span><span style={{color:"#3B2F1E",fontWeight:500}}>{selPerson.birthMonth}</span></div>}
          {selPerson.spouse&&<div style={{display:"flex",gap:8}}><span style={{color:"#9A8B7A",minWidth:70}}>Spouse</span><span style={{color:"#3B2F1E",fontWeight:500}}>{selPerson.spouse}{selPerson.spouseAge?` (${selPerson.spouseAge})`:""}</span></div>}
          {(selPerson.city||selPerson.state)&&<div style={{display:"flex",gap:8}}><span style={{color:"#9A8B7A",minWidth:70}}>Location</span><span style={{color:"#3B2F1E",fontWeight:500}}>{selPerson.city}{selPerson.city&&selPerson.state?", ":""}{selPerson.state}</span></div>}
          {selPerson.phone&&<div style={{display:"flex",gap:8}}><span style={{color:"#9A8B7A",minWidth:70}}>📞</span><span style={{color:"#3B2F1E"}}>{selPerson.phone}</span></div>}
          {selPerson.email&&<div style={{display:"flex",gap:8}}><span style={{color:"#9A8B7A",minWidth:70}}>✉️</span><span style={{color:"#3B2F1E"}}>{selPerson.email}</span></div>}
          {(selPerson.childrenUnder18||[]).length>0&&<div><span style={{color:"#9A8B7A",fontSize:12}}>Children</span>{selPerson.childrenUnder18.map((k,ki)=>(<div key={ki} style={{fontSize:12,color:"#6B5A4A",marginTop:2}}>👶 {k.name}{k.age?` (${k.age})`:""}</div>))}</div>}
        </div>
        <button onClick={()=>goEdit(selPerson.id)} style={{marginTop:14,padding:"10px 20px",background:"#2D5016",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600,width:"100%"}}>✏️ Edit Profile</button>
      </div>)}
    </div>
  </div>);
}

/* ═══ LIST VIEW — edit button beside each name ═══ */
function ListView({members,rootChildren,goEdit}){
  const[exp,setExp]=useState({});const rp=members.filter(m=>m.isRootParent);
  const tog=id=>setExp(p=>({...p,[id]:!p[id]}));
  const expandAll=(parentId)=>{const all=getAllBranch(parentId,members);const newExp={...exp,[parentId]:true};all.forEach(m=>{if(getChildren(m.id,members).length>0)newExp[m.id]=true;});setExp(newExp);};
  const collapseAll=(parentId)=>{const all=getAllBranch(parentId,members);const newExp={...exp};delete newExp[parentId];all.forEach(m=>delete newExp[m.id]);setExp(newExp);};

  const eBtn=id=>(<button onClick={e=>{e.stopPropagation();goEdit(id);}} style={{background:"#E8F3DC",border:"1px solid #B8D4A0",borderRadius:4,padding:"2px 8px",cursor:"pointer",fontSize:11,color:"#2D5016",fontWeight:600,whiteSpace:"nowrap"}}>✏️ Edit</button>);

  const renderM=(m,depth=0)=>{const kids=getChildren(m.id,members);const isE=exp[m.id];return (<div key={m.id} style={{marginLeft:depth>0?16:0}}>
    <div style={{padding:"7px 12px",borderBottom:"1px solid #F0EAE0",background:depth%2===0?"#FDFCF9":"#fff",display:"flex",alignItems:"center",gap:6}}>
      {kids.length>0?<button onClick={()=>tog(m.id)} style={{background:"#E8F3DC",border:"1px solid #D4DFC8",borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:12,color:"#4A7A28",fontWeight:700,flexShrink:0,minWidth:36,textAlign:"center"}}>{isE?"▾":"▸"} {kids.length}</button>:<div style={{minWidth:36}}/>}
      {m.isDeceased&&<HaloSVG size={13}/>}
      <span style={{fontSize:13,fontWeight:depth===0?600:500,color:m.isDeceased?"#8B7355":"#1B3A0E",flex:1}}>{m.name}</span>
      {m.age&&<span style={{fontSize:11,color:"#9A8B7A"}}>({m.age})</span>}
      {m.spouse&&<span style={{fontSize:11,color:"#8B7355"}}>⚭ {m.spouse}{m.spouseAge?` (${m.spouseAge})`:""}</span>}
      {m.state&&<span style={{fontSize:11,color:"#9A8B7A"}}>{m.city?`${m.city}, `:""}{m.state}</span>}
      {eBtn(m.id)}
    </div>
    {/* Children under 18 */}
    {(m.childrenUnder18||[]).length>0&&(<div style={{marginLeft:depth>0?16:0,paddingLeft:36}}>
      {m.childrenUnder18.map((c,ci)=>(<div key={ci} style={{padding:"4px 12px",borderBottom:"1px solid #F5F0E5",background:"#FEFDFB",display:"flex",alignItems:"center",gap:6,fontSize:12}}>
        {c.deceased&&<HaloSVG size={10}/>}
        <span style={{color:"#6B5A4A",fontWeight:400}}>👶 {c.name}</span>
        {c.age&&<span style={{fontSize:10,color:"#B0A090"}}>({c.age})</span>}
        {c.birthMonth&&<span style={{fontSize:10,color:"#B0A090"}}>{c.birthMonth}</span>}
        {c.deceased&&<span style={{fontSize:10,color:"#B0A090",fontStyle:"italic"}}>passed</span>}
      </div>))}
    </div>)}
    {isE&&kids.map(k=>renderM(k,depth+1))}
  </div>);};

  return (<div>
    <div style={{textAlign:"center",marginBottom:8}}><div style={{display:"inline-block",background:"linear-gradient(135deg,#2D5016,#4A7A28)",borderRadius:12,padding:"14px 28px",color:"#fff"}}><div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"3px",opacity:.6,marginBottom:6}}>The Roots</div><div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>{rp.map(p=>(<div key={p.id} style={{display:"flex",alignItems:"center",gap:5}}><HaloSVG size={14}/><span style={{fontSize:15,fontWeight:700}}>{p.name}</span></div>))}</div></div></div>
    <div style={{width:4,height:24,background:"#8B7355",margin:"0 auto",borderRadius:2}}/>
    <div style={{background:"#E8F3DC",borderRadius:14,padding:"14px 12px",border:"2px solid #B8D4A0"}}>
      <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:"2px",color:"#4A7A28",textAlign:"center",marginBottom:12,fontWeight:700}}>The 13 Branches</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:10}}>
        {rootChildren.map(c=>{const allD=getAllBranch(c.id,members);const dk=getChildren(c.id,members);const isE=exp[c.id];const anyExpanded=allD.some(m=>exp[m.id]);return (<div key={c.id} style={{background:"#fff",borderRadius:12,overflow:"hidden",border:c.isDeceased?"1px solid #D4C5AA":"1px solid #A8CF8A"}}>
          <div style={{padding:"10px 12px",display:"flex",alignItems:"center",gap:8,background:c.isDeceased?"#FAF6EF":"#F5FAEF"}}>
            {/* Expand button — LEFT side, larger */}
            <div style={{display:"flex",flexDirection:"column",gap:2,flexShrink:0}}>
              <button onClick={()=>tog(c.id)} style={{background:allD.length>0?(isE?"#2D5016":"#E8F3DC"):"#F5F0E5",border:isE?"none":"1px solid #B8D4A0",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:14,color:isE?"#fff":"#2D5016",fontWeight:700,minWidth:52,textAlign:"center"}}>{isE?"▾":"▸"} {allD.length}</button>
              {allD.length>1&&isE&&(<button onClick={()=>{if(anyExpanded)collapseAll(c.id);else expandAll(c.id);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:10,color:"#4A7A28",fontWeight:600,padding:0,whiteSpace:"nowrap"}}>{anyExpanded?"Collapse all":"Expand all"}</button>)}
            </div>
            {/* Name & info — CENTER */}
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>{c.isDeceased&&<HaloSVG size={14}/>}<span style={{fontSize:14,fontWeight:600,color:c.isDeceased?"#7A6B5A":"#1B3A0E"}}>{c.name}</span></div>
              {c.spouse&&<div style={{fontSize:11,color:"#8B7355",marginTop:2}}>⚭ {c.spouse}{c.spouseAge?` (${c.spouseAge})`:""}</div>}
              {c.state&&<div style={{fontSize:11,color:"#9A8B7A"}}>{c.city?`${c.city}, `:""}{c.state}</div>}
            </div>
            {/* Edit button — RIGHT side */}
            {eBtn(c.id)}
          </div>
          {isE&&<div style={{borderTop:"1px dashed #C8DFB0"}}>
            {/* Root sibling's own children under 18 */}
            {(c.childrenUnder18||[]).length>0&&(<div style={{paddingLeft:12}}>{c.childrenUnder18.map((ch,ci)=>(<div key={ci} style={{padding:"4px 12px",borderBottom:"1px solid #F5F0E5",background:"#FEFDFB",display:"flex",alignItems:"center",gap:6,fontSize:12}}>{ch.deceased&&<HaloSVG size={10}/>}<span style={{color:"#6B5A4A"}}>👶 {ch.name}</span>{ch.age&&<span style={{fontSize:10,color:"#B0A090"}}>({ch.age})</span>}{ch.birthMonth&&<span style={{fontSize:10,color:"#B0A090"}}>{ch.birthMonth}</span>}{ch.deceased&&<span style={{fontSize:10,color:"#B0A090",fontStyle:"italic"}}>passed</span>}</div>))}</div>)}
            {dk.length===0&&(c.childrenUnder18||[]).length===0&&<div style={{fontSize:12,color:"#B0A090",fontStyle:"italic",padding:12}}>No family added yet</div>}{dk.map(k=>renderM(k,0))}</div>}
        </div>);})}
      </div>
    </div>
  </div>);
}

/* ═══ FORM PAGE ═══ */
function FormPage({members,rootChildren,addMember,updateMember,deleteMember,editTargetId,setEditTargetId,setPage}){
  const bl={name:"",age:"",birthMonth:"",city:"",state:"",spouse:"",spouseAge:"",spouseBirthMonth:"",spouseDeceased:false,phone:"",email:"",phone2:"",email2:"",isDeceased:false,isRootChild:false,parentId:"",childrenUnder18:[]};
  const[mode,setMode]=useState(editTargetId?"edit":"add");const[editId,setEditId]=useState(editTargetId||"");const[form,setForm]=useState(bl);const[added,setAdded]=useState([]);const[saveNote,setSaveNote]=useState("");
  const s=(k,v)=>setForm(p=>({...p,[k]:v}));
  useEffect(()=>{if(editTargetId){setMode("edit");loadM(editTargetId);}},[editTargetId]);
  const loadM=id=>{if(!id){setForm(bl);setEditId("");return;}const m=members.find(x=>x.id===id);if(m){setForm({name:m.name||"",age:m.age||"",birthMonth:m.birthMonth||"",city:m.city||"",state:m.state||"",spouse:m.spouse||"",spouseAge:m.spouseAge||"",spouseBirthMonth:m.spouseBirthMonth||"",spouseDeceased:m.spouseDeceased||false,phone:m.phone||"",email:m.email||"",phone2:m.phone2||"",email2:m.email2||"",isDeceased:m.isDeceased||false,isRootChild:m.isRootChild||false,parentId:m.parentId||"",childrenUnder18:m.childrenUnder18||[]});setEditId(id);}};
  const sub=()=>{
    // Required field validation
    if(!form.name.trim())return alert("Please enter a full name.");
    if(!form.age)return alert("Please enter an age.");
    if(!form.birthMonth)return alert("Please select a birth month.");
    if(!form.city.trim())return alert("Please enter a city.");
    if(!form.state)return alert("Please select a state.");
    if(mode==="edit"){
      if(!editId)return alert("Select a member to edit.");
      updateMember(editId,form);
      setSaveNote(`Updated ${form.name}`);
      setTimeout(()=>{setSaveNote("");setPage("tree");},1500);
    }else{
      if(!form.parentId)return alert("Please select a parent.");
      addMember(form);setAdded(p=>[...p,form.name]);setForm(bl);
      setTimeout(()=>setPage("tree"),1500);
    }
  };
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

        {mode==="edit"&&editId&&!form.isRootParent&&!form.isRootChild&&(
          <button onClick={()=>{if(window.confirm(`Are you sure you want to permanently delete ${form.name}? This cannot be undone.`)){deleteMember(editId);setForm(bl);setEditId("");setSaveNote(`Deleted ${form.name}`);setTimeout(()=>setSaveNote(""),3000);}}}
            style={{marginTop:10,padding:"12px 32px",background:"#fff",color:"#C33",border:"2px solid #E8AAAA",borderRadius:10,cursor:"pointer",fontSize:14,fontWeight:600,width:"100%"}}>
            🗑 Delete This Member
          </button>
        )}
        {mode==="edit"&&editId&&(form.isRootParent||form.isRootChild)&&(
          <div style={{marginTop:10,padding:"10px 14px",background:"#F5E6E6",borderRadius:8,border:"1px solid #E0C8C8",fontSize:12,color:"#933",textAlign:"center"}}>Root family members cannot be deleted.</div>
        )}
      </>)}
    </div>
    {saveNote&&<div style={{marginTop:12,background:"#FFF8EC",borderRadius:10,padding:14,border:"1px solid #E8DFD0",textAlign:"center"}}><span style={{fontSize:14,fontWeight:600,color:"#C4963A"}}>✓ {saveNote}</span></div>}
    {added.length>0&&mode==="add"&&<div style={{marginTop:14,background:"#E8F3DC",borderRadius:10,padding:12,border:"1px solid #B8D4A0"}}><div style={{fontSize:13,fontWeight:600,color:"#2D5016",marginBottom:4}}>Added ({added.length})</div>{added.map((n,i)=><div key={i} style={{fontSize:13,color:"#4A7A28"}}>✓ {n}</div>)}</div>}
  </div>);
}

/* ═══ MAP ═══ */
function MapPage({members}){
  const[selState,setSelState]=useState(null);
  const lv=members.filter(m=>!m.isDeceased&&!m.isRootParent);const sc={};const ppl={};const kidCount={};
  lv.forEach(m=>{if(!m.state)return;sc[m.state]=(sc[m.state]||0)+1;if(!ppl[m.state])ppl[m.state]=[];ppl[m.state].push(m);
    if(m.spouse&&!m.spouseDeceased){sc[m.state]++;ppl[m.state].push({name:m.spouse,age:m.spouseAge||"",isSpouseOf:m.name,phone:"",email:""});}
    // Count children under 18
    const kids=(m.childrenUnder18||[]).filter(k=>!k.deceased);
    if(kids.length>0){kidCount[m.state]=(kidCount[m.state]||0)+kids.length;sc[m.state]+=kids.length;}
  });
  const mx=Math.max(1,...Object.values(sc));const gc=c=>c?`rgba(27,58,14,${.25+(c/mx)*.75})`:"#F0EAE0";
  const sw=Object.entries(sc).sort((a,b)=>b[1]-a[1]);
  const selPeople=selState?ppl[selState]||[]:[];
  const fmtCount=(st)=>{const adults=sc[st]-(kidCount[st]||0);const kids=kidCount[st]||0;return kids>0?`${adults}(${kids})`:`${sc[st]}`;};
  return (<div><h2 style={{fontFamily:"Georgia,serif",color:"#2D5016",margin:"0 0 4px",fontSize:22}}>Where the Coleman Family Lives</h2>
    <p style={{color:"#7A6B5A",fontSize:14,margin:"0 0 4px"}}>{Object.values(sc).reduce((a,b)=>a+b,0)} living family members across {sw.length} states</p>
    <p style={{color:"#9A8B7A",fontSize:12,margin:"0 0 20px",fontStyle:"italic"}}>Click a state to see who lives there. Numbers in parentheses are children under 18.</p>
    <div style={{overflowX:"auto",marginBottom:24}}><div style={{display:"grid",gridTemplateColumns:"repeat(12,minmax(36px,1fr))",gap:3,minWidth:440}}>{Array.from({length:96}).map((_,idx)=>{const r=Math.floor(idx/12),c=idx%12;const se=Object.entries(STATE_GRID).find(([_,p])=>p[0]===r&&p[1]===c);if(!se)return <div key={idx}/>;const[st]=se;const ct=sc[st]||0;return <div key={idx} title={`${STATE_NAMES[st]}: ${ct}`} onClick={()=>ct>0&&setSelState(selState===st?null:st)} style={{background:selState===st?"#C4963A":gc(ct),borderRadius:4,padding:"6px 2px",textAlign:"center",border:ct>0?"1px solid rgba(27,58,14,.3)":"1px solid #E0D6C8",minHeight:36,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:ct>0?"pointer":"default",transition:"transform .1s",transform:selState===st?"scale(1.1)":"scale(1)"}}><div style={{fontSize:11,fontWeight:700,color:ct>0?"#fff":"#B0A090"}}>{st}</div>{ct>0&&<div style={{fontSize:10,fontWeight:800,color:"#fff"}}>{fmtCount(st)}</div>}</div>;})}</div></div>

    {/* Selected state detail */}
    {selState&&selPeople.length>0&&(<div style={{background:"#fff",borderRadius:12,padding:16,border:"2px solid #C4963A",marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{fontSize:15,fontWeight:700,color:"#2D5016"}}>{STATE_NAMES[selState]} — {selPeople.length} {selPeople.length===1?"person":"people"}</div>
        <button onClick={()=>setSelState(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:"#9A8B7A"}}>✕ Close</button>
      </div>
      {selPeople.map((p,i)=>(<div key={i} style={{padding:"10px 12px",borderBottom:i<selPeople.length-1?"1px solid #F0EAE0":"none",background:i%2===0?"#fff":"#FDFCF9"}}>
        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
          <span style={{fontSize:14,fontWeight:600,color:"#2D5016"}}>{p.name}</span>
          {p.age&&<span style={{fontSize:12,color:"#9A8B7A"}}>(age {p.age})</span>}
          {p.isSpouseOf&&<span style={{fontSize:11,color:"#8B7355",fontStyle:"italic"}}>spouse of {p.isSpouseOf}</span>}
          {p.city&&<span style={{fontSize:12,color:"#7A6B5A"}}>{p.city}, {p.state}</span>}
        </div>
        {(p.phone||p.email||p.phone2||p.email2)&&(<div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:4}}>
          {p.phone&&<span style={{fontSize:12,color:"#4A7A28"}}>📞 {p.phone}</span>}
          {p.email&&<span style={{fontSize:12,color:"#4A7A28"}}>✉️ {p.email}</span>}
          {p.phone2&&<span style={{fontSize:12,color:"#4A7A28"}}>📞 {p.phone2}</span>}
          {p.email2&&<span style={{fontSize:12,color:"#4A7A28"}}>✉️ {p.email2}</span>}
        </div>)}
        {!p.phone&&!p.email&&!p.isSpouseOf&&<div style={{fontSize:11,color:"#B0A090",fontStyle:"italic",marginTop:2}}>No contact info — please update on the Members tab</div>}
      </div>))}
    </div>)}

    {sw.length>0&&<div style={{background:"#fff",borderRadius:12,padding:16,border:"1px solid #C8DFB0"}}><div style={{fontSize:13,fontWeight:700,color:"#2D5016",marginBottom:10}}>Breakdown by State</div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:8}}>{sw.map(([st,ct])=><div key={st} onClick={()=>setSelState(selState===st?null:st)} style={{display:"flex",justifyContent:"space-between",padding:"8px 12px",background:selState===st?"#FFF8EC":"#F5FAEF",borderRadius:6,border:selState===st?"2px solid #C4963A":"1px solid #D4DFC8",cursor:"pointer"}}><span style={{fontSize:14,fontWeight:500}}>{STATE_NAMES[st]}</span><span style={{fontSize:14,fontWeight:700,color:"#2D5016"}}>{fmtCount(st)}</span></div>)}</div></div>}
  </div>);
}

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
function ReunionPage({members}){
  const[roles,setRoles]=useState({});
  const[allVotes,setAllVotes]=useState([]);
  const[voterName,setVoterName]=useState("");
  const[myYear,setMyYear]=useState("");
  const[myWeekend,setMyWeekend]=useState("");
  const[hasVoted,setHasVoted]=useState(false);
  const[voteSubmitted,setVoteSubmitted]=useState(false);
  const[roleSaved,setRoleSaved]=useState(false);

  useEffect(()=>{(async()=>{
    try{const r=await store.get("coleman-roles-v2");if(r?.value)setRoles(JSON.parse(r.value));}catch{}
    try{const r2=await store.get("coleman-votes-all");if(r2?.value){const v=JSON.parse(r2.value);setAllVotes(Array.isArray(v)?v:[]);}}catch{}
    // Check if this device already voted
    try{const lv=localStorage.getItem("coleman-voted-flag");if(lv)setHasVoted(true);}catch{}
  })();},[]);

  const submitVote=async()=>{
    if(!voterName.trim())return alert("Please enter your name so we know who voted.");
    if(!myYear)return alert("Please select a year.");
    if(!myWeekend)return alert("Please select a weekend.");
    // Check if name already voted
    const nameLower=voterName.trim().toLowerCase();
    if(allVotes.some(v=>(v.name||"").toLowerCase()===nameLower))return alert(`${voterName.trim()} has already voted. Each person gets one vote.`);
    const newVote={name:voterName.trim(),year:myYear,weekend:myWeekend,ts:new Date().toISOString()};
    const updated=[...allVotes,newVote];
    setAllVotes(updated);
    setHasVoted(true);
    setVoteSubmitted(true);
    try{await store.set("coleman-votes-all",JSON.stringify(updated));}catch{}
    try{localStorage.setItem("coleman-voted-flag","true");}catch{}
  };

  const saveRoles=async(d)=>{setRoles(d);try{await store.set("coleman-roles-v2",JSON.stringify(d));setRoleSaved(true);setTimeout(()=>setRoleSaved(false),2000);}catch{}};
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

  const hasOps = Object.values(roles).some(r=>r==="operations");
  const hasLog = Object.values(roles).some(r=>r==="logistics");
  const hasHost = true; // Shirley's family is locked
  const allRolesFilled = hasHost && hasOps && hasLog;

  // Track which branches have voted
  const voterNames = new Set(allVotes.map(v=>(v.name||"").trim().toLowerCase()));
  const branchVotes = siblings.map(sib=>{
    const branchMembers = [sib,...getAllBranch(sib.id,members||[])].filter(m=>!m.isDeceased);
    const branchVoted = branchMembers.some(m=>voterNames.has((m.name||"").trim().toLowerCase()));
    return {id:sib.id, name:sib.name, voted:branchVoted};
  });
  const branchesVoted = branchVotes.filter(b=>b.voted).length;
  const branchPct = Math.round(branchesVoted/13*100);

  return (<div style={{maxWidth:720,margin:"0 auto"}}>
    <h2 style={{fontFamily:"Georgia,serif",color:"#2D5016",margin:"0 0 4px",fontSize:22}}>Reunion Planner</h2>

    {/* First reunion announcement */}
    <div style={{background:"linear-gradient(135deg,#2D5016,#4A7A28)",borderRadius:14,padding:20,color:"#fff",marginBottom:16}}>
      <div style={{fontSize:11,textTransform:"uppercase",letterSpacing:"2px",opacity:.7,marginBottom:8}}>Restart of the Coleman Family Reunion</div>
      <p style={{fontSize:15,lineHeight:1.6,margin:"0 0 10px"}}>As probably the biggest family branch, <strong>Shirley's Family</strong> will host the first Coleman Family Reunion in <strong>Northeast Ohio (Akron area)</strong>.</p>
      <p style={{fontSize:14,lineHeight:1.6,margin:"0 0 10px",opacity:.9}}>We need the family to vote on two things to get started. Once we know the year, we will post estimated costs. We will do our best to adhere to the guidelines on the By-Laws page.</p>
      <p style={{fontSize:13,lineHeight:1.6,margin:0,opacity:.8}}>In order to execute this reunion, we need family branches to sign up for support roles. If your family is willing to help, please select a support role below.</p>
    </div>

    {/* ═══ VOTING SECTION ═══ */}
    <div style={{background:"#fff",borderRadius:14,padding:20,border:"1px solid #C8DFB0",marginBottom:16}}>
      <div style={{fontSize:15,fontWeight:700,color:"#2D5016",marginBottom:4}}>🗳️ Family Vote — Help Us Decide</div>
      <p style={{fontSize:12,color:"#7A6B5A",margin:"0 0 14px"}}>Each person gets one vote. Enter your name and make your selections, then hit Submit. Check the <strong>📊 Tracker</strong> tab to see results.</p>

      {hasVoted||voteSubmitted ? (
        <div style={{background:"#E8F3DC",borderRadius:10,padding:20,border:"1px solid #B8D4A0",textAlign:"center"}}>
          <div style={{fontSize:28,marginBottom:6}}>✓</div>
          <div style={{fontSize:16,fontWeight:700,color:"#2D5016",marginBottom:4}}>{voteSubmitted?"Vote Submitted!":"You've Already Voted"}</div>
          <p style={{fontSize:13,color:"#4A7A28",margin:0}}>Check the <strong>📊 Tracker</strong> tab to see how the family is voting.</p>
          <p style={{fontSize:12,color:"#7A6B5A",marginTop:8}}>{allVotes.length} vote{allVotes.length===1?"":"s"} submitted so far.</p>
        </div>
      ) : (<>
        <div style={{marginBottom:14}}>
          <label style={{display:"block",fontSize:13,fontWeight:600,color:"#2D5016",marginBottom:6}}>Your Name</label>
          <input style={is} value={voterName} onChange={e=>setVoterName(e.target.value)} placeholder="Enter your full name"/>
        </div>
        <div style={{marginBottom:14}}>
          <label style={{display:"block",fontSize:13,fontWeight:600,color:"#2D5016",marginBottom:6}}>What year should the first reunion be held?</label>
          <div style={{display:"flex",gap:8}}>
            {["2027","2028"].map(yr=>(<button key={yr} onClick={()=>setMyYear(yr)} style={{flex:1,padding:"14px",borderRadius:10,border:myYear===yr?"2px solid #2D5016":"2px solid #E0D6C8",background:myYear===yr?"#E8F3DC":"#fff",cursor:"pointer",fontSize:16,fontWeight:700,color:myYear===yr?"#2D5016":"#7A6B5A"}}>{yr}</button>))}
          </div>
        </div>
        <div style={{marginBottom:16}}>
          <label style={{display:"block",fontSize:13,fontWeight:600,color:"#2D5016",marginBottom:6}}>Which weekend do you prefer?</label>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[["last-july","Last full weekend in July"],["first-aug","First full weekend in August"]].map(([k,label])=>(<button key={k} onClick={()=>setMyWeekend(k)} style={{padding:"14px",borderRadius:10,border:myWeekend===k?"2px solid #2D5016":"2px solid #E0D6C8",background:myWeekend===k?"#E8F3DC":"#fff",cursor:"pointer",fontSize:14,fontWeight:600,color:myWeekend===k?"#2D5016":"#7A6B5A",textAlign:"left"}}>{label}</button>))}
          </div>
        </div>
        <button onClick={submitVote} style={{padding:"14px 32px",background:"linear-gradient(135deg,#2D5016,#4A7A28)",color:"#fff",border:"none",borderRadius:10,cursor:"pointer",fontSize:15,fontWeight:700,width:"100%",boxShadow:"0 4px 12px rgba(45,80,22,0.3)"}}>Submit My Vote</button>
      </>)}
    </div>

    {/* ═══ SUPPORT ROLE SECTION ═══ */}
    <div style={{background:"#fff",borderRadius:14,padding:20,border:"1px solid #C8DFB0"}}>
      <div style={{fontSize:15,fontWeight:700,color:"#2D5016",marginBottom:4}}>Family Roles for the Reunion</div>
      <p style={{fontSize:13,color:"#7A6B5A",margin:"0 0 6px",lineHeight:1.5}}>Shirley's Family is the Host. We need at least one Operations Support and one Logistics Support family. Refer to the <strong>📜 By-Laws</strong> tab (Sections 6 & 7) for details.</p>
      <p style={{fontSize:12,color:"#8B7355",margin:"0 0 14px"}}>Support families stay with the Host Family unless voted to change at the Business Meeting.</p>

      {/* ═══ REUNION GO / NO-GO DECISION ═══ */}
      {(()=>{
        const ready = allRolesFilled && branchesVoted>=13;
        const missingRoles = [];
        if(!hasOps) missingRoles.push("Operations Support");
        if(!hasLog) missingRoles.push("Logistics Support");
        return (<div style={{background:ready?"#E8F3DC":branchesVoted>=10&&allRolesFilled?"#FFF8EC":"#F5E6E6",borderRadius:12,padding:16,border:"2px solid "+(ready?"#2D5016":"#C33"),marginBottom:14}}>
          <div style={{fontSize:15,fontWeight:700,color:ready?"#2D5016":"#933",marginBottom:8}}>
            {ready?"✓ GO — The reunion can move forward!":"✕ NO-GO — The reunion cannot be confirmed yet"}
          </div>

          {/* Roles checklist */}
          <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:12,padding:12,background:"rgba(255,255,255,.5)",borderRadius:8}}>
            <div style={{fontSize:12,fontWeight:700,color:"#2D5016",marginBottom:2}}>Required Roles</div>
            <div style={{display:"flex",alignItems:"center",gap:6,fontSize:13}}><span style={{color:"#2D5016"}}>✓</span><span style={{fontWeight:500}}>Host — Shirley's Family (Akron, OH)</span></div>
            <div style={{display:"flex",alignItems:"center",gap:6,fontSize:13}}><span style={{color:hasOps?"#2D5016":"#C33"}}>{hasOps?"✓":"✕"}</span><span style={{fontWeight:600,color:hasOps?"#2D5016":"#C33"}}>Operations Support — {hasOps?"Filled":"NEEDED"}</span></div>
            <div style={{display:"flex",alignItems:"center",gap:6,fontSize:13}}><span style={{color:hasLog?"#2D5016":"#C33"}}>{hasLog?"✓":"✕"}</span><span style={{fontWeight:600,color:hasLog?"#2D5016":"#C33"}}>Logistics Support — {hasLog?"Filled":"NEEDED"}</span></div>
            {missingRoles.length>0&&<p style={{fontSize:11,color:"#933",margin:"4px 0 0"}}>See <strong>📜 By-Laws</strong> (Sections 6 & 7) for role details. Sign up below.</p>}
          </div>

          {/* Branch voting */}
          <div style={{padding:12,background:"rgba(255,255,255,.5)",borderRadius:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
              <div style={{fontSize:12,fontWeight:700,color:"#2D5016"}}>Family Branch Votes</div>
              <div style={{fontSize:16,fontWeight:800,color:branchesVoted>=13?"#2D5016":"#C4963A"}}>{branchesVoted}/13</div>
            </div>
            <div style={{background:"#E0D6C8",borderRadius:6,height:10,overflow:"hidden",marginBottom:8}}>
              <div style={{background:branchesVoted>=13?"#2D5016":"#C4963A",height:"100%",borderRadius:6,width:`${branchPct}%`,transition:"width .5s"}}/>
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
              {branchVotes.map(b=>(<span key={b.id} style={{padding:"3px 10px",borderRadius:10,fontSize:11,fontWeight:600,background:b.voted?"#E8F3DC":"#F5E6E6",color:b.voted?"#2D5016":"#933",border:"1px solid "+(b.voted?"#B8D4A0":"#E0C8C8")}}>
                {b.voted?"✓":"✕"} {b.name.replace("'s Family","")}
              </span>))}
            </div>
            <p style={{fontSize:11,color:"#7A6B5A",margin:"8px 0 0"}}>Everyone can vote individually, but we need at least one vote from every branch to move forward. {allVotes.length} total vote{allVotes.length===1?"":"s"} submitted.</p>
            {branchesVoted<13&&<p style={{fontSize:11,color:"#933",margin:"4px 0 0",fontWeight:600}}>Branches with ✕ — please have at least one adult from your branch vote above.</p>}
          </div>
        </div>);
      })()}

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
      {roleSaved&&<div style={{marginTop:10,textAlign:"center",fontSize:13,color:"#4A7A28",fontWeight:600}}>✓ Role Saved</div>}

      {/* Future rotation note */}
      <div style={{background:"#F5FAEF",borderRadius:12,padding:16,border:"1px solid #C8DFB0",marginTop:16}}>
        <div style={{fontSize:14,fontWeight:700,color:"#2D5016",marginBottom:6}}>📋 Looking Ahead — Building the Rotation</div>
        <p style={{fontSize:13,color:"#3B2F1E",lineHeight:1.6,margin:"0 0 8px"}}>Per the By-Laws (Section 8), the goal is that each family branch serves as Host or in a Support role approximately once every 8 years. To make that work on a biennial schedule, we need at least <strong>4 Host City/Family commitments</strong> with corresponding Support families for each reunion.</p>
        <p style={{fontSize:13,color:"#3B2F1E",lineHeight:1.6,margin:"0 0 8px"}}>This first reunion with Shirley's Family hosting in Akron is the starting point. At the Business Meeting, we will discuss and vote on the full rotation.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:6,marginTop:10}}>
          {[["Reunion 1","Shirley's Family","Akron, OH ✓"],["Reunion 2","To be voted","TBD"],["Reunion 3","To be voted","TBD"],["Reunion 4","To be voted","TBD"]].map(([r,f,c])=>(
            <div key={r} style={{padding:"8px 10px",background:r==="Reunion 1"?"#E8F3DC":"#fff",borderRadius:8,border:"1px solid #D4DFC8",textAlign:"center"}}>
              <div style={{fontSize:11,fontWeight:700,color:"#4A7A28"}}>{r}</div>
              <div style={{fontSize:12,fontWeight:600,color:"#2D5016",marginTop:2}}>{f}</div>
              <div style={{fontSize:11,color:"#7A6B5A"}}>{c}</div>
            </div>
          ))}
        </div>
        <p style={{fontSize:12,color:"#8B7355",marginTop:10,fontStyle:"italic",lineHeight:1.5}}>Each reunion also needs an Operations Support family and a Logistics Support family. With 4 host rotations and 2 support roles each, that's 12 family commitments spread across 8 years.</p>
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
  const ADMIN_PASS = "Coleman_Admin_2026";
  const [admin,setAdmin]=useState(false);
  const [adminInput,setAdminInput]=useState("");
  const [adminAuthed,setAdminAuthed]=useState(false);
  const [adminError,setAdminError]=useState(false);
  const [budget,setBudget]=useState({eventRoom:800,picnic:1200,activity:600,breakfast:500});
  const [attendees,setAttendees]=useState(75);
  const [saved,setSaved]=useState(false);
  const [rsvps,setRsvps]=useState({});
  const [allVotes,setAllVotes]=useState([]);
  const [roles,setRoles]=useState({});
  useEffect(()=>{(async()=>{
    try{const r=await store.get("coleman-budget");if(r?.value){const d=JSON.parse(r.value);setBudget(d.budget||budget);setAttendees(d.attendees||75);}}catch{}
    try{const r2=await store.get("coleman-rsvp");if(r2?.value)setRsvps(JSON.parse(r2.value));}catch{}
    try{const r3=await store.get("coleman-votes-all");if(r3?.value){const v=JSON.parse(r3.value);setAllVotes(Array.isArray(v)?v:[]);}}catch{}
    try{const r4=await store.get("coleman-roles-v2");if(r4?.value)setRoles(JSON.parse(r4.value));}catch{}
  })();},[]);
  const saveBudget=async()=>{try{await store.set("coleman-budget",JSON.stringify({budget,attendees}));setSaved(true);setTimeout(()=>setSaved(false),2000);}catch{}};
  const handleAdminLogin=()=>{if(adminInput===ADMIN_PASS){setAdminAuthed(true);setAdminError(false);setAdmin(true);}else{setAdminError(true);}};
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
    {admin&&!adminAuthed&&(<div style={{background:"#FFF8EC",borderRadius:14,padding:20,border:"2px solid #E8DFD0",marginBottom:16,maxWidth:400,margin:"0 auto 16px"}}>
      <div style={{fontSize:15,fontWeight:700,color:"#C4963A",marginBottom:8}}>Admin Access</div>
      <p style={{fontSize:12,color:"#8B7355",margin:"0 0 12px"}}>Enter the admin password to access budget controls and voter details.</p>
      <input type="password" value={adminInput} onChange={e=>{setAdminInput(e.target.value);setAdminError(false);}} onKeyDown={e=>{if(e.key==="Enter")handleAdminLogin();}}
        placeholder="Admin password" style={{...is,textAlign:"center",marginBottom:8}}/>
      {adminError&&<div style={{fontSize:12,color:"#C33",marginBottom:8,textAlign:"center"}}>Incorrect password</div>}
      <button onClick={handleAdminLogin} style={{padding:"10px 24px",background:"#C4963A",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:14,fontWeight:700,width:"100%"}}>Enter</button>
    </div>)}
    {admin&&adminAuthed&&(<>
      {/* Budget entry */}
      <div style={{background:"#FFF8EC",borderRadius:14,padding:20,border:"2px solid #E8DFD0",marginBottom:16}}>
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
      </div>

      {/* Admin voter details */}
      <div style={{background:"#fff",borderRadius:14,padding:18,border:"2px solid #C4963A",marginBottom:16}}>
        <div style={{fontSize:15,fontWeight:700,color:"#C4963A",marginBottom:4}}>🔒 Admin Only — Voter Details</div>
        <p style={{fontSize:12,color:"#8B7355",margin:"0 0 12px"}}>This section is only visible to admins. Use it to track who has and hasn't voted.</p>

        {/* Voting stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:8,marginBottom:14}}>
          {(()=>{
            const adultMembers=members.filter(m=>!m.isDeceased&&!m.isRootParent&&parseInt(m.age)>=18);
            const voterNames=allVotes.map(v=>(v.name||"").toLowerCase());
            const votedAdults=adultMembers.filter(m=>voterNames.includes((m.name||"").toLowerCase()));
            const pct=adultMembers.length>0?Math.round(votedAdults.length/adultMembers.length*100):0;
            return (<>
              <div style={{padding:10,background:"#E8F3DC",borderRadius:8,textAlign:"center",border:"1px solid #B8D4A0"}}><div style={{fontSize:22,fontWeight:800,color:"#2D5016"}}>{allVotes.length}</div><div style={{fontSize:10,color:"#4A7A28",fontWeight:600}}>Total Votes</div></div>
              <div style={{padding:10,background:"#E8F3DC",borderRadius:8,textAlign:"center",border:"1px solid #B8D4A0"}}><div style={{fontSize:22,fontWeight:800,color:"#2D5016"}}>{adultMembers.length}</div><div style={{fontSize:10,color:"#4A7A28",fontWeight:600}}>Adult Members</div></div>
              <div style={{padding:10,background:pct>=50?"#E8F3DC":"#FFF8EC",borderRadius:8,textAlign:"center",border:"1px solid "+(pct>=50?"#B8D4A0":"#E8DFD0")}}><div style={{fontSize:22,fontWeight:800,color:pct>=50?"#2D5016":"#C4963A"}}>{pct}%</div><div style={{fontSize:10,color:pct>=50?"#4A7A28":"#C4963A",fontWeight:600}}>Participation</div></div>
            </>);
          })()}
        </div>

        {/* Individual votes table */}
        {allVotes.length>0&&(<div style={{marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:700,color:"#2D5016",marginBottom:6}}>Who Voted & Their Choices</div>
          <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{background:"#F5FAEF"}}><th style={{padding:"8px 10px",textAlign:"left",borderBottom:"2px solid #C8DFB0",color:"#2D5016"}}>Name</th><th style={{padding:"8px 10px",textAlign:"center",borderBottom:"2px solid #C8DFB0",color:"#2D5016"}}>Year</th><th style={{padding:"8px 10px",textAlign:"center",borderBottom:"2px solid #C8DFB0",color:"#2D5016"}}>Weekend</th></tr></thead>
            <tbody>{allVotes.map((v,i)=>(<tr key={i} style={{background:i%2===0?"#fff":"#FDFCF9"}}><td style={{padding:"6px 10px",borderBottom:"1px solid #F0EAE0",fontWeight:500}}>{v.name}</td><td style={{padding:"6px 10px",textAlign:"center",borderBottom:"1px solid #F0EAE0",fontWeight:600}}>{v.year}</td><td style={{padding:"6px 10px",textAlign:"center",borderBottom:"1px solid #F0EAE0",fontSize:11}}>{v.weekend==="last-july"?"Last wknd July":"First wknd Aug"}</td></tr>))}</tbody>
          </table></div>
        </div>)}

        {/* Who hasn't voted — by branch */}
        <div>
          <div style={{fontSize:13,fontWeight:700,color:"#C4963A",marginBottom:6}}>Who Hasn't Voted Yet</div>
          {(()=>{
            const voterNames=new Set(allVotes.map(v=>(v.name||"").trim().toLowerCase()));
            const rootKids=members.filter(m=>m.isRootChild);
            return rootKids.map(rc=>{
              const branchMembers=[rc,...getAllBranch(rc.id,members)].filter(m=>!m.isDeceased&&parseInt(m.age)>=18);
              const notVoted=branchMembers.filter(m=>!voterNames.has((m.name||"").trim().toLowerCase()));
              const voted=branchMembers.length-notVoted.length;
              if(branchMembers.length===0)return null;
              return (<div key={rc.id} style={{marginBottom:6,padding:"6px 10px",background:notVoted.length===0?"#E8F3DC":"#FFF8EC",borderRadius:6,border:"1px solid "+(notVoted.length===0?"#B8D4A0":"#E8DFD0")}}>
                <div style={{fontSize:12,fontWeight:600,color:"#2D5016"}}>{rc.name.split(/[\s(]/)[0]}'s Family <span style={{fontWeight:400,color:"#7A6B5A"}}>({voted}/{branchMembers.length} voted)</span></div>
                {notVoted.length>0&&<div style={{fontSize:11,color:"#C4963A",marginTop:2}}>{notVoted.map(m=>m.name.split(" ")[0]).join(", ")}</div>}
              </div>);
            });
          })()}
        </div>
      </div>
    </>)}

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
            const kids18 = m.childrenUnder18||[];
            const householdCount = 1 + (m.spouse&&!m.spouseDeceased?1:0) + kids18.filter(k=>!k.deceased).length;
            return (<div key={m.id} style={{borderBottom:mi<branchMembers.length-1?"1px solid #F0EAE0":"none",background:mi%2===0?"#fff":"#FDFCF9"}}>
              <div style={{padding:"8px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
                <div style={{display:"flex",alignItems:"center",gap:6,flex:1,minWidth:150,flexWrap:"wrap"}}>
                  <span style={{fontSize:13,fontWeight:m.isRootChild?600:400,color:"#3B2F1E"}}>{m.name}</span>
                  {m.age&&<span style={{fontSize:11,color:"#9A8B7A"}}>(age {m.age})</span>}
                  {householdCount>1&&<span style={{fontSize:10,fontWeight:600,background:"#E8F3DC",color:"#2D5016",padding:"1px 6px",borderRadius:8}}>{householdCount} in household</span>}
                </div>
                <div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>
                  <button onClick={()=>saveRsvp(m.id,"going")} style={{...statusStyle("going"),outline:status==="going"?"2px solid #2D5016":"none"}}>✓ Going</button>
                  <button onClick={()=>saveRsvp(m.id,"maybe")} style={{...statusStyle("maybe"),outline:status==="maybe"?"2px solid #C4963A":"none"}}>? Maybe</button>
                  <button onClick={()=>saveRsvp(m.id,"not-going")} style={{...statusStyle("not-going"),outline:status==="not-going"?"2px solid #933":"none"}}>✕ No</button>
                  <button onClick={()=>setAddingFor(isAdding?null:m.id)} style={{padding:"4px 8px",borderRadius:12,fontSize:11,fontWeight:600,cursor:"pointer",border:"1px solid #D4C5E8",background:isAdding?"#6B4C8A":"#F0E8FF",color:isAdding?"#fff":"#6B4C8A"}}>+ Guest</button>
                </div>
              </div>
              {/* Spouse & children under 18 */}
              {(m.spouse||kids18.length>0)&&(<div style={{padding:"2px 14px 6px 30px"}}>
                {m.spouse&&!m.spouseDeceased&&(<div style={{fontSize:12,color:"#8B7355",display:"flex",alignItems:"center",gap:4,marginBottom:2}}>💍 {m.spouse}{m.spouseAge?` (age ${m.spouseAge})`:""}</div>)}
                {kids18.filter(k=>!k.deceased).map((k,ki)=>(<div key={ki} style={{fontSize:12,color:"#6B5A4A",display:"flex",alignItems:"center",gap:4,marginBottom:1}}>👶 {k.name}{k.age?` (age ${k.age})`:""}</div>))}
              </div>)}
              {/* Guest list */}
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

function TrackerPage({members}){
  const[allVotes,setAllVotes]=useState([]);
  const[roles,setRoles]=useState({});
  useEffect(()=>{(async()=>{
    try{const r=await store.get("coleman-votes-all");if(r?.value){const v=JSON.parse(r.value);setAllVotes(Array.isArray(v)?v:[]);}}catch{}
    try{const r2=await store.get("coleman-roles-v2");if(r2?.value)setRoles(JSON.parse(r2.value));}catch{}
  })();},[]);

  const yearVotes={"2027":0,"2028":0};
  const weekendVotes={"last-july":0,"first-aug":0};
  allVotes.forEach(v=>{if(v?.year)yearVotes[v.year]=(yearVotes[v.year]||0)+1;if(v?.weekend)weekendVotes[v.weekend]=(weekendVotes[v.weekend]||0)+1;});
  const totalVotes=allVotes.length;

  const opsCount=Object.values(roles).filter(r=>r==="operations").length;
  const logCount=Object.values(roles).filter(r=>r==="logistics").length;

  // Adult voter participation
  const adultMembers=(members||[]).filter(m=>!m.isDeceased&&!m.isRootParent&&parseInt(m.age)>=18);
  const voterPct=adultMembers.length>0?Math.round(totalVotes/adultMembers.length*100):0;

  const siblings=[
    {id:"child-01",name:"Doris's"},{id:"child-02",name:"Samuel's"},{id:"child-03",name:"Luther's"},
    {id:"child-04",name:"Sammie's"},{id:"child-05",name:"Shirley's"},{id:"child-06",name:"Paulette's"},
    {id:"child-07",name:"Norma's"},{id:"child-08",name:"Jackie's"},{id:"child-09",name:"Arlene's"},
    {id:"child-10",name:"Arthur Jr's"},{id:"child-11",name:"Charles's"},{id:"child-12",name:"Kevin's"},
    {id:"child-13",name:"Evan's"},
  ];

  const yearData=[{name:"2027",votes:yearVotes["2027"]},{name:"2028",votes:yearVotes["2028"]}];
  const weekData=[{name:"Last wknd July",votes:weekendVotes["last-july"]},{name:"First wknd Aug",votes:weekendVotes["first-aug"]}];

  return (<div style={{maxWidth:900,margin:"0 auto"}}>
    <h2 style={{fontFamily:"Georgia,serif",color:"#2D5016",margin:"0 0 4px",fontSize:22}}>Reunion Tracker</h2>
    <p style={{color:"#7A6B5A",fontSize:13,margin:"0 0 16px"}}>Live results from the Planner page — {totalVotes} vote{totalVotes===1?"":"s"} submitted.</p>

    {/* Summary banner */}
    {totalVotes>0&&(<div style={{background:"linear-gradient(135deg,#2D5016,#4A7A28)",borderRadius:14,padding:18,color:"#fff",marginBottom:16}}>
      <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"2px",opacity:.7,marginBottom:8}}>Current Leaders</div>
      <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
        <div><div style={{fontSize:11,opacity:.7}}>Year</div><div style={{fontSize:20,fontWeight:700}}>{yearVotes["2027"]>yearVotes["2028"]?"2027":yearVotes["2028"]>yearVotes["2027"]?"2028":"Tied"}</div></div>
        <div><div style={{fontSize:11,opacity:.7}}>Weekend</div><div style={{fontSize:20,fontWeight:700}}>{weekendVotes["last-july"]>weekendVotes["first-aug"]?"Last wknd July":weekendVotes["first-aug"]>weekendVotes["last-july"]?"First wknd Aug":"Tied"}</div></div>
        <div><div style={{fontSize:11,opacity:.7}}>Total Votes</div><div style={{fontSize:20,fontWeight:700}}>{totalVotes}</div></div>
        <div><div style={{fontSize:11,opacity:.7}}>Adult Participation</div><div style={{fontSize:20,fontWeight:700,color:voterPct<50?"#FF8A8A":"#fff"}}>{voterPct}%</div></div>
        <div><div style={{fontSize:11,opacity:.7}}>Branches Voted</div><div style={{fontSize:20,fontWeight:700}}>{(()=>{const rc=(members||[]).filter(m=>m.isRootChild);const vn=new Set(allVotes.map(v=>(v.name||"").trim().toLowerCase()));return rc.filter(c=>[c,...getAllBranch(c.id,members||[])].filter(m=>!m.isDeceased).some(m=>vn.has((m.name||"").trim().toLowerCase()))).length;})()}/13</div></div>
        <div><div style={{fontSize:11,opacity:.7}}>Ops Support</div><div style={{fontSize:20,fontWeight:700}}>{opsCount}</div></div>
        <div><div style={{fontSize:11,opacity:.7}}>Logistics</div><div style={{fontSize:20,fontWeight:700}}>{logCount}</div></div>
      </div>
    </div>)}

    {/* Charts */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14,marginBottom:16}}>
      <CC title="Reunion Year" sub={`${totalVotes} vote${totalVotes===1?"":"s"}`}>
        {totalVotes>0?(<div style={{width:"100%",height:180}}><ResponsiveContainer width="100%" height="100%"><BarChart data={yearData} margin={{top:5,right:20,left:0,bottom:5}}><CartesianGrid strokeDasharray="3 3" stroke="#E8DFD0" vertical={false}/><XAxis dataKey="name" tick={{fontSize:14,fill:"#2D5016",fontWeight:700}}/><YAxis allowDecimals={false} tick={{fontSize:11,fill:"#7A6B5A"}}/><Tooltip content={<CT vl="Votes"/>}/><Bar dataKey="votes" radius={[6,6,0,0]} barSize={50}><Cell fill="#2D5016"/><Cell fill="#4A8C28"/><LabelList dataKey="votes" position="top" style={{fontSize:16,fontWeight:800,fill:"#2D5016"}}/></Bar></BarChart></ResponsiveContainer></div>):(<div style={{textAlign:"center",padding:20,color:"#9A8B7A",fontStyle:"italic"}}>No votes yet — go to the Planner tab to vote.</div>)}
      </CC>
      <CC title="Preferred Weekend" sub={`${totalVotes} vote${totalVotes===1?"":"s"}`}>
        {totalVotes>0?(<div style={{width:"100%",height:180}}><ResponsiveContainer width="100%" height="100%"><BarChart data={weekData} margin={{top:5,right:20,left:0,bottom:5}}><CartesianGrid strokeDasharray="3 3" stroke="#E8DFD0" vertical={false}/><XAxis dataKey="name" tick={{fontSize:12,fill:"#2D5016",fontWeight:600}}/><YAxis allowDecimals={false} tick={{fontSize:11,fill:"#7A6B5A"}}/><Tooltip content={<CT vl="Votes"/>}/><Bar dataKey="votes" radius={[6,6,0,0]} barSize={50}><Cell fill="#2D5016"/><Cell fill="#D4A843"/><LabelList dataKey="votes" position="top" style={{fontSize:16,fontWeight:800,fill:"#2D5016"}}/></Bar></BarChart></ResponsiveContainer></div>):(<div style={{textAlign:"center",padding:20,color:"#9A8B7A",fontStyle:"italic"}}>No votes yet</div>)}
      </CC>
    </div>

    {/* Individual votes table - hidden for privacy, names stored only to prevent duplicates */}

    {/* Support roles */}
    <div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #C8DFB0"}}>
      <div style={{fontSize:14,fontWeight:700,color:"#2D5016",marginBottom:10}}>Support Role Signups</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:8}}>
        {siblings.map(sib=>{
          const role=sib.id==="child-05"?"host":(roles[sib.id]||"");
          const label=role==="host"?"🏠 Host":role==="operations"?"🔧 Operations":role==="logistics"?"🚛 Logistics":"—";
          const bg=role==="host"?"#FFF8EC":role?"#E8F3DC":"#fff";
          const bc=role==="host"?"#C4963A":role?"#2D5016":"#E0D6C8";
          return (<div key={sib.id} style={{padding:"8px 12px",background:bg,borderRadius:8,border:`1px solid ${bc}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:13,fontWeight:500}}>{sib.name} Family</span>
            <span style={{fontSize:12,fontWeight:600,color:role==="host"?"#C4963A":role?"#2D5016":"#B0A090"}}>{label}</span>
          </div>);
        })}
      </div>
    </div>
  </div>);
}

