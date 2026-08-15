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

/* ═══ MAIN APP ═══ */
export default function ColemanReunion(){
  const[members,setMembers]=useState(INITIAL_MEMBERS);
  const[page,setPage]=useState("tree");
  const[editTargetId,setEditTargetId]=useState(null);
  const[loaded,setLoaded]=useState(false);
  const[saveMsg,setSaveMsg]=useState("");
  const[showHelp,setShowHelp]=useState(false);

  useEffect(()=>{(async()=>{try{const r=await window.storage.get("coleman-v8");if(r?.value){const p=JSON.parse(r.value);if(Array.isArray(p)&&p.length>0)setMembers(p);}}catch{}setLoaded(true);})();},[]);
  const saveData=useCallback(async(data)=>{try{await window.storage.set("coleman-v8",JSON.stringify(data));setSaveMsg("Saved");setTimeout(()=>setSaveMsg(""),1500);}catch{}},[]);
  const updateMember=(id,u)=>{const n=members.map(m=>m.id===id?{...m,...u}:m);setMembers(n);saveData(n);};
  const addMember=(member)=>{const rb=findRootBranch(member.parentId,members)||member.parentId;const n=[...members,{...member,id:genId(),parentRootId:rb}];setMembers(n);saveData(n);};
  const deleteMember=(id)=>{const m=members.find(x=>x.id===id);if(m?.isRootParent||m?.isRootChild)return;setMembers(p=>{const n=p.filter(x=>x.id!==id);saveData(n);return n;});};
  const rootChildren=members.filter(m=>m.isRootChild);
  const goEdit=(id)=>{setEditTargetId(id);setPage("form");};

  if(!loaded)return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:"Georgia,serif",color:"#3B2F1E",background:"#FAF7F2"}}>Loading…</div>;

  const tabs=[["tree","🌿 Tree"],["form","📝 Members"],["map","🗺 Map"],["bylaws","📜 By-Laws"],["reunion","🎉 Planner"],["costs","💰 Costs"],["attend","👥 Attendance"],["results","📊 Tracker"]];

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
          <div><strong>💰 Costs</strong> — Budget breakdown and per-person cost calculator.</div>
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

function ChildrenU18({children,onChange}){const[cn,setCn]=useState("");const[ca,setCa]=useState("");const[cb,setCb]=useState("");const add=()=>{if(!cn.trim())return;onChange([...(children||[]),{name:cn,age:ca,birthMonth:cb}]);setCn("");setCa("");setCb("");};const is={width:"100%",padding:"8px 10px",border:"1px solid #C8DFB0",borderRadius:6,fontSize:14,background:"#fff",boxSizing:"border-box"};return(<div style={{marginTop:16,padding:12,background:"#F5FAEF",borderRadius:8,border:"1px solid #C8DFB0"}}><div style={{fontSize:13,fontWeight:600,color:"#4A7A28",marginBottom:8}}>Children Under 18</div>{(children||[]).map((c,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,fontSize:13,padding:"6px 8px",background:"#fff",borderRadius:6,border:"1px solid #E8DFD0"}}><div style={{flex:1}}><div style={{fontWeight:500}}>{c.name}</div><div style={{fontSize:11,color:"#8B7355"}}>{c.age&&`Age ${c.age}`}{c.age&&c.birthMonth&&" · "}{c.birthMonth&&`Born ${c.birthMonth}`}</div></div><button onClick={()=>onChange(children.filter((_,x)=>x!==i))} style={{background:"none",border:"none",color:"#C77",cursor:"pointer",fontSize:12}}>remove</button></div>))}<div style={{display:"grid",gridTemplateColumns:"2fr 1fr 2fr",gap:6,marginTop:6}}><input placeholder="Name" value={cn} onChange={e=>setCn(e.target.value)} style={is}/><input placeholder="Age" type="number" value={ca} onChange={e=>setCa(e.target.value)} style={is}/><select value={cb} onChange={e=>setCb(e.target.value)} style={is}><option value="">Month…</option>{MONTHS.map(m=><option key={m}>{m}</option>)}</select></div><button onClick={add} style={{marginTop:8,padding:"8px 16px",background:"#4A7A28",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontSize:13,fontWeight:600,width:"100%"}}>+ Add Child Under 18</button></div>);}

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
  const bl={name:"",age:"",birthMonth:"",city:"",state:"",spouse:"",phone:"",email:"",isDeceased:false,isRootChild:false,parentId:"",childrenUnder18:[]};
  const[mode,setMode]=useState(editTargetId?"edit":"add");const[editId,setEditId]=useState(editTargetId||"");const[form,setForm]=useState(bl);const[added,setAdded]=useState([]);const[saveNote,setSaveNote]=useState("");
  const s=(k,v)=>setForm(p=>({...p,[k]:v}));
  useEffect(()=>{if(editTargetId){setMode("edit");loadM(editTargetId);}},[editTargetId]);
  const loadM=id=>{if(!id){setForm(bl);setEditId("");return;}const m=members.find(x=>x.id===id);if(m){setForm({name:m.name||"",age:m.age||"",birthMonth:m.birthMonth||"",city:m.city||"",state:m.state||"",spouse:m.spouse||"",phone:m.phone||"",email:m.email||"",isDeceased:m.isDeceased||false,isRootChild:m.isRootChild||false,parentId:m.parentId||"",childrenUnder18:m.childrenUnder18||[]});setEditId(id);}};
  const sub=()=>{if(mode==="edit"){if(!editId)return alert("Select a member to edit.");updateMember(editId,form);setSaveNote(`Updated ${form.name}`);setTimeout(()=>setSaveNote(""),3000);}else{if(!form.name.trim()||!form.parentId)return alert("Enter a name and select a parent.");addMember(form);setAdded(p=>[...p,form.name]);setForm(bl);}};
  const sw=m=>{setMode(m);setForm(bl);setEditId("");setSaveNote("");setEditTargetId(null);};
  const is={width:"100%",padding:"10px 12px",border:"1px solid #C8DFB0",borderRadius:8,fontSize:14,background:"#fff",boxSizing:"border-box"};const ls={display:"block",fontSize:12,fontWeight:600,color:"#4A7A28",marginBottom:4,marginTop:14};
  return (<div style={{maxWidth:640,margin:"0 auto"}}>
    <h2 style={{fontFamily:"Georgia,serif",color:"#2D5016",margin:"0 0 4px",fontSize:22}}>{mode==="add"?"Add Family Members":"Edit Family Member"}</h2>
    <p style={{color:"#7A6B5A",fontSize:13,margin:"0 0 14px",lineHeight:1.5}}>{mode==="add"?"Select the parent — any root sibling or existing member.":"Select a member to update their information."}</p>
    <div style={{display:"flex",background:"#E8F3DC",borderRadius:8,overflow:"hidden",border:"1px solid #B8D4A0",marginBottom:14}}>
      <button onClick={()=>sw("add")} style={{flex:1,padding:"10px",border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:mode==="add"?"#2D5016":"transparent",color:mode==="add"?"#fff":"#2D5016"}}>+ Add New</button>
      <button onClick={()=>sw("edit")} style={{flex:1,padding:"10px",border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:mode==="edit"?"#2D5016":"transparent",color:mode==="edit"?"#fff":"#2D5016"}}>✏️ Edit Existing</button>
    </div>
    <div style={{background:"#fff",borderRadius:14,padding:20,border:"1px solid #C8DFB0"}}>
      {mode==="edit"&&(<div style={{marginBottom:14}}><label style={{...ls,marginTop:0}}>Select member to edit</label><select style={{...is,borderColor:editId?"#2D5016":"#C8DFB0",borderWidth:editId?2:1}} value={editId} onChange={e=>loadM(e.target.value)}><option value="">Choose…</option>{rootChildren.map(rc=>{const bm=getAllBranch(rc.id,members);return (<optgroup key={rc.id} label={`${rc.name}${rc.isDeceased?" ✝":""}`}><option value={rc.id}>{rc.name}</option>{bm.map(b=><option key={b.id} value={b.id}>{"  — "}{b.name}</option>)}</optgroup>);})}</select>{editId&&<div style={{marginTop:8,padding:"8px 12px",background:"#FFF8EC",borderRadius:8,border:"1px solid #E8DFD0",fontSize:12,color:"#8B7355"}}>Editing <strong style={{color:"#2D5016"}}>{form.name}</strong></div>}</div>)}
      {mode==="add"&&<ParentSelector members={members} value={form.parentId} onChange={v=>s("parentId",v)} label="Who is this person's parent?"/>}
      {(mode==="add"||editId)&&(<>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
          <div><label style={ls}>Full Name *</label><input style={is} value={form.name} onChange={e=>s("name",e.target.value)} placeholder="First and Last Name"/></div>
          <div><label style={ls}>Age</label><input style={is} type="number" value={form.age} onChange={e=>s("age",e.target.value)}/></div>
          <div><label style={ls}>Birth Month</label><select style={is} value={form.birthMonth} onChange={e=>s("birthMonth",e.target.value)}><option value="">Select…</option>{MONTHS.map(m=><option key={m}>{m}</option>)}</select></div>
          <div><label style={ls}>Spouse</label><input style={is} value={form.spouse} onChange={e=>s("spouse",e.target.value)}/></div>
          <div><label style={ls}>City</label><input style={is} value={form.city} onChange={e=>s("city",e.target.value)}/></div>
          <div><label style={ls}>State</label><select style={is} value={form.state} onChange={e=>s("state",e.target.value)}><option value="">Select…</option>{US_STATES.map(st=><option key={st} value={st}>{STATE_NAMES[st]}</option>)}</select></div>
          <div><label style={ls}>Phone <span style={{fontWeight:400,color:"#9A8B7A"}}>(optional)</span></label><input style={is} type="tel" value={form.phone} onChange={e=>s("phone",e.target.value)} placeholder="(555) 123-4567"/></div>
          <div><label style={ls}>Email <span style={{fontWeight:400,color:"#9A8B7A"}}>(optional)</span></label><input style={is} type="email" value={form.email} onChange={e=>s("email",e.target.value)} placeholder="name@email.com"/></div>
        </div>
        <div style={{marginTop:14}}><label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,cursor:"pointer"}}><input type="checkbox" checked={form.isDeceased} onChange={e=>s("isDeceased",e.target.checked)} style={{accentColor:"#D4A843"}}/> This person has passed away</label></div>
        <ChildrenU18 children={form.childrenUnder18} onChange={v=>s("childrenUnder18",v)}/>
        <button onClick={sub} style={{marginTop:20,padding:"12px 32px",background:mode==="edit"?"#C4963A":"#2D5016",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:15,fontWeight:700,width:"100%"}}>{mode==="edit"?"Save Changes":"Add to Family Tree"}</button>
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
  return (<div style={{maxWidth:740,margin:"0 auto"}}>
    <h2 style={{fontFamily:"Georgia,serif",color:"#2D5016",margin:"0 0 4px",fontSize:22}}>Coleman Family Reunion By-Laws</h2>
    <div style={{background:"#FFF8EC",borderRadius:10,padding:14,border:"1px solid #E8DFD0",marginBottom:20,fontSize:13,color:"#8B7355",lineHeight:1.5}}>
      <strong style={{color:"#C4963A"}}>📋 Preliminary Draft</strong> — This document will be presented, voted on, and amended during the first official family business meeting. All items are open for discussion and change.
    </div>
    <div style={{background:"#fff",borderRadius:14,padding:24,border:"1px solid #C8DFB0",fontSize:14,color:"#3B2F1E",lineHeight:1.7}}>
      <p style={{textAlign:"center",color:"#9A8B7A",fontStyle:"italic",margin:"20px 0"}}>The full by-laws document will be posted here soon. The family will review, discuss, and vote on these at the first business meeting.</p>
      <p style={{textAlign:"center",color:"#7A6B5A",fontSize:13}}>Key topics that will be covered:</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:8,margin:"16px 0"}}>
        {["Name & Purpose","Membership Definition","Reunion Schedule","Hosting Rotation","Finances & Dues","Officers & Committees","Business Meeting Rules","Amendments Process"].map(t=>(<div key={t} style={{padding:"10px 14px",background:"#F5FAEF",borderRadius:8,border:"1px solid #D4DFC8",fontSize:13,color:"#2D5016",fontWeight:500}}>📌 {t}</div>))}
      </div>

      <div style={{marginTop:24,borderTop:"1px solid #E8DFD0",paddingTop:16}}>
        <div style={{fontSize:15,fontWeight:700,color:"#2D5016",marginBottom:8}}>Key Definitions (Preview)</div>
        <p style={{margin:"0 0 8px"}}><strong>Family:</strong> A family is defined as all members (descendants, spouses, and children) of one of the 13 root siblings. Each root sibling's line represents one family branch.</p>
        <p style={{margin:"0 0 8px"}}><strong>Hosting Rotation:</strong> Each family branch will take a turn planning and hosting a reunion weekend. This can be changed during the family meeting, but this is to start off with.</p>
      </div>

      <div style={{marginTop:16,borderTop:"1px solid #E8DFD0",paddingTop:16}}>
        <div style={{fontSize:15,fontWeight:700,color:"#2D5016",marginBottom:8}}>Family Hosting Rotation (Draft)</div>
        <p style={{margin:"0 0 10px",fontSize:13,color:"#7A6B5A"}}>This can be changed during the family meeting, but this is to start off with. Each family gets a weekend to host.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:4}}>
          {rootChildren.map((c,i)=>(<div key={c.id} style={{fontSize:13,padding:"6px 10px",display:"flex",gap:8,alignItems:"center",background:i%2===0?"#F5FAEF":"#fff",borderRadius:6}}><span style={{fontWeight:700,color:"#2D5016",minWidth:50}}>Year {i+1}</span><span style={{color:c.isDeceased?"#8B7355":"#1B3A0E"}}>{c.name.split(/[\s(]/)[0]}'s Family</span>{c.isDeceased&&<HaloSVG size={11}/>}</div>))}
        </div>
      </div>

      <div style={{marginTop:16,borderTop:"1px solid #E8DFD0",paddingTop:16}}>
        <div style={{fontSize:15,fontWeight:700,color:"#2D5016",marginBottom:8}}>Potential Host Cities</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{REUNION_CITIES.map(c=>(<span key={c} style={{padding:"5px 12px",background:"#E8F3DC",borderRadius:6,fontSize:13,fontWeight:500,color:"#2D5016",border:"1px solid #B8D4A0"}}>{c}{c.startsWith("Indianapolis")?" ★":""}</span>))}</div>
      </div>
    </div>
  </div>);
}

/* ═══ REUNION PLANNER (no charts) ═══ */
function ReunionPage(){
  const bl={bestMonths:["",""],preferredDays:"",holidayWeekend:"",travelMode:"",cityRankings:[]};
  const[prefs,setPrefs]=useState(bl);const[submitted,setSubmitted]=useState(false);const[responses,setResponses]=useState([]);
  useEffect(()=>{(async()=>{try{const r=await window.storage.get("coleman-reunion-r2");if(r?.value)setResponses(JSON.parse(r.value));}catch{}})();},[]);
  const set=(k,v)=>setPrefs(p=>({...p,[k]:v}));const setMo=(i,v)=>{const n=[...prefs.bestMonths];n[i]=v;set("bestMonths",n);};
  const togC=city=>{const c=[...prefs.cityRankings];const i=c.indexOf(city);if(i>=0)c.splice(i,1);else c.push(city);set("cityRankings",c);};
  const gR=city=>{const i=prefs.cityRankings.indexOf(city);return i>=0?i+1:null;};
  const sub=async()=>{if(!prefs.bestMonths[0]||!prefs.bestMonths[1])return alert("Select your top 2 months.");if(!prefs.preferredDays||!prefs.travelMode)return alert("Answer all questions.");if(prefs.cityRankings.length<REUNION_CITIES.length)return alert("Rank all "+REUNION_CITIES.length+" cities.");const n=[...responses,{...prefs,ts:Date.now()}];setResponses(n);try{await window.storage.set("coleman-reunion-r2",JSON.stringify(n));}catch{}setSubmitted(true);};
  const is={width:"100%",padding:"10px 12px",border:"1px solid #C8DFB0",borderRadius:8,fontSize:14,background:"#fff",boxSizing:"border-box"};const ls={display:"block",fontSize:13,fontWeight:600,color:"#2D5016",marginBottom:5,marginTop:18,lineHeight:1.4};
  return (<div style={{maxWidth:640,margin:"0 auto"}}>
    <h2 style={{fontFamily:"Georgia,serif",color:"#2D5016",margin:"0 0 4px",fontSize:22}}>Reunion Planner</h2>
    <p style={{color:"#7A6B5A",fontSize:13,margin:"0 0 6px"}}>Help us find the best time and place for the family to come together.</p>
    <div style={{background:"#FFF8EC",borderRadius:8,padding:10,border:"1px solid #E8DFD0",marginBottom:16,fontSize:12,color:"#8B7355",lineHeight:1.5}}>This can be changed during the family meeting, but this is to start off with. View results on the <strong>Reunion Tracker</strong> tab.</div>
    {responses.length>0&&<div style={{background:"#E8F3DC",borderRadius:8,padding:8,border:"1px solid #B8D4A0",marginBottom:14,fontSize:13,color:"#2D5016",fontWeight:600,textAlign:"center"}}>{responses.length} response{responses.length===1?"":"s"} so far — check Reunion Tracker</div>}
    {!submitted?(<div style={{background:"#fff",borderRadius:14,padding:20,border:"1px solid #C8DFB0"}}>
      <label style={{...ls,marginTop:0}}>1st choice month for the reunion?</label><select style={is} value={prefs.bestMonths[0]} onChange={e=>setMo(0,e.target.value)}><option value="">Select…</option>{MONTHS.map(m=><option key={m}>{m}</option>)}</select>
      <label style={ls}>2nd choice month?</label><select style={is} value={prefs.bestMonths[1]} onChange={e=>setMo(1,e.target.value)}><option value="">Select…</option>{MONTHS.map(m=><option key={m}>{m}</option>)}</select>
      <label style={ls}>How many days?</label><select style={is} value={prefs.preferredDays} onChange={e=>set("preferredDays",e.target.value)}><option value="">Select…</option><option value="Thu-Sun">Thursday–Sunday (4 days)</option><option value="Fri-Sun">Friday–Sunday (weekend)</option></select>
      <label style={ls}>Holiday weekend?</label><select style={is} value={prefs.holidayWeekend} onChange={e=>set("holidayWeekend",e.target.value)}><option value="">Select…</option><option value="yes">Yes — more time together</option><option value="no">No — regular weekend</option></select>
      <label style={ls}>How would you travel?</label><select style={is} value={prefs.travelMode} onChange={e=>set("travelMode",e.target.value)}><option value="">Select…</option><option value="fly">Fly</option><option value="drive">Drive</option><option value="either">Either</option></select>
      <label style={ls}>Rank the potential host cities (#1 = most preferred)</label><p style={{fontSize:12,color:"#7A6B5A",margin:"0 0 8px"}}>Tap in order of preference. Tap again to remove.</p>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>{REUNION_CITIES.map(city=>{const rank=gR(city);const isR=rank!==null;return <button key={city} onClick={()=>togC(city)} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderRadius:10,border:isR?"2px solid #2D5016":"2px solid #E0D6C8",background:isR?"#E8F3DC":"#fff",cursor:"pointer",textAlign:"left"}}><div style={{width:30,height:30,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,background:isR?"#2D5016":"#F0EAE0",color:isR?"#fff":"#B0A090",flexShrink:0}}>{isR?rank:"—"}</div><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:"#3B2F1E"}}>{city}</div><div style={{fontSize:11,color:"#8B7355"}}>{CITY_TAGS[city]}</div></div>{isR&&<div style={{fontSize:11,color:"#4A7A28",fontWeight:600}}>#{rank}</div>}</button>;})}</div>
      {prefs.cityRankings.length>0&&<button onClick={()=>set("cityRankings",[])} style={{marginTop:6,background:"none",border:"none",color:"#C4963A",cursor:"pointer",fontSize:12,fontWeight:600}}>Clear rankings</button>}
      {prefs.cityRankings.length===REUNION_CITIES.length&&<div style={{marginTop:6,padding:6,background:"#E8F3DC",borderRadius:6,fontSize:12,color:"#2D5016",fontWeight:600,textAlign:"center"}}>All ranked!</div>}
      <button onClick={sub} style={{marginTop:20,padding:"14px",background:"linear-gradient(135deg,#2D5016,#4A7A28)",color:"#fff",border:"none",borderRadius:10,cursor:"pointer",fontSize:15,fontWeight:700,width:"100%"}}>Submit Preferences</button>
    </div>):(<div style={{background:"#E8F3DC",borderRadius:14,padding:24,border:"1px solid #B8D4A0",textAlign:"center"}}><div style={{fontSize:36,marginBottom:8}}>🌳</div><div style={{fontSize:18,fontWeight:700,color:"#2D5016"}}>Submitted!</div><button onClick={()=>{setSubmitted(false);setPrefs(bl);}} style={{marginTop:12,padding:"10px 24px",background:"#2D5016",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:14,fontWeight:600}}>Submit for another member</button></div>)}
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
  const [admin,setAdmin] = useState(false);
  const [budget,setBudget] = useState({eventRoom:800,picnic:1200,activity:600,breakfast:500});
  const [attendees,setAttendees] = useState(75);
  const [saved,setSaved] = useState(false);
  const [rsvps,setRsvps] = useState({});

  useEffect(()=>{(async()=>{try{const r=await window.storage.get("coleman-budget");if(r?.value){const d=JSON.parse(r.value);setBudget(d.budget||budget);setAttendees(d.attendees||75);}}catch{} try{const r2=await window.storage.get("coleman-rsvp");if(r2?.value)setRsvps(JSON.parse(r2.value));}catch{}})();},[]);
  const saveBudget=async()=>{try{await window.storage.set("coleman-budget",JSON.stringify({budget,attendees}));setSaved(true);setTimeout(()=>setSaved(false),2000);}catch{}};

  // Reunion fee budget = picnic + activity + breakfast (hotel paid separately)
  const feeBudget = budget.picnic + budget.activity + budget.breakfast;
  const totalBudgetWithHotel = Object.values(budget).reduce((a,b)=>a+b,0);
  const is={width:"100%",padding:"10px 12px",border:"1px solid #C8DFB0",borderRadius:8,fontSize:14,background:"#fff",boxSizing:"border-box"};
  const ls={display:"block",fontSize:12,fontWeight:600,color:"#4A7A28",marginBottom:4,marginTop:10};

  // Calculate full rate for each scenario
  const calcFullRate = (s) => {
    const N = attendees;
    const fixedRev = N * (s.u12 * RATE_U12 + s.s75 * RATE_75);
    const varPct = s.t13 * TEEN_DISCOUNT + s.a27;
    if (varPct === 0) return 0;
    return (feeBudget - fixedRev) / (N * varPct);
  };

  // Age group counts from confirmed attendees
  const goingMembers = members.filter(m => !m.isDeceased && !m.isRootParent && rsvps[m.id] === "going");
  const ageGroups = {under12:0, teen:0, adult:0, senior:0, unknown:0};
  goingMembers.forEach(m => {
    const age = parseInt(m.age);
    if (!m.age || isNaN(age)) ageGroups.unknown++;
    else if (age < 12) ageGroups.under12++;
    else if (age <= 26) ageGroups.teen++;
    else if (age <= 74) ageGroups.adult++;
    else ageGroups.senior++;
  });
  // Also count children under 18 from going members
  goingMembers.forEach(m => {
    (m.childrenUnder18 || []).forEach(c => {
      const ca = parseInt(c.age);
      if (!c.age || isNaN(ca)) ageGroups.unknown++;
      else if (ca < 12) ageGroups.under12++;
      else ageGroups.teen++;
    });
  });
  const ageChartData = [
    {name:"Under 12",count:ageGroups.under12,rate:`$${RATE_U12}`},
    {name:"Ages 13–26",count:ageGroups.teen,rate:"60%"},
    {name:"Ages 27–74",count:ageGroups.adult,rate:"Full"},
    {name:"Age 75+",count:ageGroups.senior,rate:`$${RATE_75}`},
  ];
  if (ageGroups.unknown > 0) ageChartData.push({name:"No Age Listed",count:ageGroups.unknown,rate:"—"});
  const totalConfirmed = Object.values(ageGroups).reduce((a,b)=>a+b,0);

  return (<div style={{maxWidth:860,margin:"0 auto"}}>
    <h2 style={{fontFamily:"Georgia,serif",color:"#2D5016",margin:"0 0 4px",fontSize:22}}>Reunion Cost Estimator</h2>
    <p style={{color:"#7A6B5A",fontSize:13,margin:"0 0 6px",lineHeight:1.5}}>This page calculates the per-person cost based on the reunion budget and expected family age mix. The host family sets the budget below.</p>

    {/* Admin toggle */}
    <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
      <button onClick={()=>setAdmin(!admin)} style={{padding:"6px 14px",background:admin?"#C4963A":"#E8F3DC",color:admin?"#fff":"#2D5016",border:"1px solid "+( admin?"#C4963A":"#B8D4A0"),borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:600}}>{admin?"Close Admin":"🔧 Host Admin"}</button>
    </div>

    {/* Admin budget entry */}
    {admin && (<div style={{background:"#FFF8EC",borderRadius:14,padding:20,border:"2px solid #E8DFD0",marginBottom:16}}>
      <div style={{fontSize:15,fontWeight:700,color:"#C4963A",marginBottom:4}}>Host Family — Budget Entry</div>
      <p style={{fontSize:12,color:"#8B7355",margin:"0 0 12px"}}>Enter the estimated costs for each reunion activity. This will be used to calculate per-person rates.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"0 16px"}}>
        <div><label style={ls}>🏨 Hotel Event Room</label><input style={is} type="number" value={budget.eventRoom} onChange={e=>setBudget(p=>({...p,eventRoom:+e.target.value||0}))}/></div>
        <div><label style={ls}>🌳 Saturday Picnic</label><input style={is} type="number" value={budget.picnic} onChange={e=>setBudget(p=>({...p,picnic:+e.target.value||0}))}/></div>
        <div><label style={ls}>🎯 Saturday Activity</label><input style={is} type="number" value={budget.activity} onChange={e=>setBudget(p=>({...p,activity:+e.target.value||0}))}/></div>
        <div><label style={ls}>🥞 Sunday Breakfast</label><input style={is} type="number" value={budget.breakfast} onChange={e=>setBudget(p=>({...p,breakfast:+e.target.value||0}))}/></div>
        <div><label style={ls}>👥 Expected Attendees</label><input style={is} type="number" value={attendees} onChange={e=>setAttendees(+e.target.value||1)}/></div>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center",marginTop:14}}>
        <button onClick={saveBudget} style={{padding:"10px 24px",background:"#C4963A",color:"#fff",border:"none",borderRadius:8,cursor:"pointer",fontSize:14,fontWeight:700}}>Save Budget</button>
        {saved&&<span style={{fontSize:13,color:"#4A7A28",fontWeight:600}}>✓ Saved</span>}
      </div>
    </div>)}

    {/* Budget summary */}
    <div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #C8DFB0",marginBottom:16}}>
      <div style={{fontSize:14,fontWeight:700,color:"#2D5016",marginBottom:10}}>Reunion Budget Breakdown</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:8}}>
        {[["🌳 Saturday Picnic",budget.picnic],["🎯 Saturday Activity",budget.activity],["🥞 Sunday Breakfast",budget.breakfast]].map(([label,amt])=>(
          <div key={label} style={{padding:"10px 14px",background:"#F5FAEF",borderRadius:8,border:"1px solid #D4DFC8"}}>
            <div style={{fontSize:12,color:"#7A6B5A"}}>{label}</div>
            <div style={{fontSize:18,fontWeight:700,color:"#2D5016"}}>${amt.toLocaleString()}</div>
          </div>
        ))}
      </div>
      <div style={{borderTop:"2px solid #E8F3DC",marginTop:12,paddingTop:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontSize:14,fontWeight:700,color:"#2D5016"}}>Reunion Fee Budget</div><div style={{fontSize:12,color:"#7A6B5A"}}>{attendees} expected attendees · per-person fees cover this amount</div></div>
        <div style={{fontSize:28,fontWeight:800,color:"#2D5016"}}>${feeBudget.toLocaleString()}</div>
      </div>
      <div style={{marginTop:10,padding:"10px 14px",background:"#FFF8EC",borderRadius:8,border:"1px solid #E8DFD0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontSize:13,color:"#8B7355"}}>🏨 Hotel Event Room</div><div style={{fontSize:11,color:"#9A8B7A"}}>Listed for transparency — each family pays their own hotel separately</div></div>
        <div style={{fontSize:16,fontWeight:700,color:"#C4963A"}}>${budget.eventRoom.toLocaleString()}</div>
      </div>
    </div>

    {/* Confirmed attendees by age group chart */}
    <div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #C8DFB0",marginBottom:16}}>
      <div style={{fontSize:14,fontWeight:700,color:"#2D5016",marginBottom:2}}>Confirmed Attendees by Age Group</div>
      <p style={{fontSize:12,color:"#7A6B5A",margin:"0 0 12px"}}>{totalConfirmed} confirmed attendee{totalConfirmed===1?"":"s"} (status "Going") — includes registered children under 18. Make sure ages are entered so we can plan accurately.</p>
      {totalConfirmed > 0 ? (
        <div style={{width:"100%",height:220}}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageChartData} margin={{top:5,right:20,left:0,bottom:5}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8DFD0" vertical={false}/>
              <XAxis dataKey="name" tick={{fontSize:11,fill:"#7A6B5A"}}/>
              <YAxis allowDecimals={false} tick={{fontSize:11,fill:"#7A6B5A"}}/>
              <Tooltip content={({active,payload,label})=>{if(!active||!payload?.length)return null;const d=ageChartData.find(x=>x.name===label);return (<div style={{background:"rgba(59,47,30,.92)",borderRadius:8,padding:"8px 12px",color:"#fff",fontSize:12}}><div style={{fontWeight:600}}>{label}</div><div>Count: <strong>{payload[0].value}</strong></div><div>Rate: <strong>{d?.rate}</strong></div></div>);}}/>
              <Bar dataKey="count" radius={[6,6,0,0]} barSize={40}>
                {ageChartData.map((e,i)=> <Cell key={i} fill={i===0?"#6AAF3D":i===1?"#4A8C28":i===2?"#2D5016":i===3?"#D4A843":"#9A8B7A"}/>)}
                <LabelList dataKey="count" position="top" style={{fontSize:13,fontWeight:700,fill:"#2D5016"}} formatter={v=>v>0?v:""}/>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{textAlign:"center",padding:20,color:"#9A8B7A",fontStyle:"italic",fontSize:13}}>No one has confirmed "Going" yet. Check the Attendance tab to update RSVPs.</div>
      )}
      {totalConfirmed > 0 && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:6,marginTop:8}}>
          {ageChartData.filter(d=>d.count>0).map(d=>(
            <div key={d.name} style={{padding:"6px 10px",background:"#F5FAEF",borderRadius:6,border:"1px solid #D4DFC8",textAlign:"center",fontSize:12}}>
              <div style={{fontWeight:600,color:"#2D5016"}}>{d.count}</div>
              <div style={{color:"#7A6B5A"}}>{d.name}</div>
              <div style={{color:"#4A7A28",fontWeight:600}}>{d.rate}</div>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Age tier rates */}
    <div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #C8DFB0",marginBottom:16}}>
      <div style={{fontSize:14,fontWeight:700,color:"#2D5016",marginBottom:4}}>Age-Based Pricing Tiers</div>
      <p style={{fontSize:12,color:"#7A6B5A",margin:"0 0 12px"}}>Costs are shared based on age. Fixed rates for the youngest and oldest; the full rate covers the difference.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:8}}>
        <div style={{padding:12,background:"#E8F3DC",borderRadius:8,textAlign:"center"}}><div style={{fontSize:11,color:"#4A7A28",fontWeight:600}}>Under 12</div><div style={{fontSize:20,fontWeight:800,color:"#2D5016"}}>${RATE_U12}</div><div style={{fontSize:10,color:"#7A6B5A"}}>Fixed</div></div>
        <div style={{padding:12,background:"#F5FAEF",borderRadius:8,textAlign:"center"}}><div style={{fontSize:11,color:"#4A7A28",fontWeight:600}}>Ages 13–26</div><div style={{fontSize:20,fontWeight:800,color:"#2D5016"}}>60%</div><div style={{fontSize:10,color:"#7A6B5A"}}>of Full Rate</div></div>
        <div style={{padding:12,background:"#2D5016",borderRadius:8,textAlign:"center",color:"#fff"}}><div style={{fontSize:11,fontWeight:600,opacity:.8}}>Ages 27–74</div><div style={{fontSize:20,fontWeight:800}}>Full Rate</div><div style={{fontSize:10,opacity:.7}}>See scenarios</div></div>
        <div style={{padding:12,background:"#FFF8EC",borderRadius:8,textAlign:"center"}}><div style={{fontSize:11,color:"#C4963A",fontWeight:600}}>Age 75+</div><div style={{fontSize:20,fontWeight:800,color:"#C4963A"}}>${RATE_75}</div><div style={{fontSize:10,color:"#7A6B5A"}}>Fixed</div></div>
      </div>
    </div>

    {/* Scenario table */}
    <div style={{background:"#fff",borderRadius:14,padding:18,border:"1px solid #C8DFB0"}}>
      <div style={{fontSize:14,fontWeight:700,color:"#2D5016",marginBottom:4}}>Cost Per Person by Family Scenario</div>
      <p style={{fontSize:12,color:"#7A6B5A",margin:"0 0 14px"}}>Different families have different age mixes. Find the scenario closest to your family to see what you'd pay.</p>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
          <thead><tr style={{background:"#F5FAEF"}}>
            <th style={{padding:"10px 8px",textAlign:"left",borderBottom:"2px solid #C8DFB0",fontWeight:700,color:"#2D5016"}}>Scenario</th>
            <th style={{padding:"10px 8px",textAlign:"center",borderBottom:"2px solid #C8DFB0",fontSize:11,color:"#4A7A28"}}>Under 12<br/>(${RATE_U12})</th>
            <th style={{padding:"10px 8px",textAlign:"center",borderBottom:"2px solid #C8DFB0",fontSize:11,color:"#4A7A28"}}>13–26<br/>(60%)</th>
            <th style={{padding:"10px 8px",textAlign:"center",borderBottom:"2px solid #C8DFB0",fontSize:11,color:"#4A7A28"}}>27–74<br/>(Full)</th>
            <th style={{padding:"10px 8px",textAlign:"center",borderBottom:"2px solid #C8DFB0",fontSize:11,color:"#C4963A"}}>75+<br/>(${RATE_75})</th>
            <th style={{padding:"10px 8px",textAlign:"center",borderBottom:"2px solid #C8DFB0",fontWeight:700,color:"#2D5016"}}>Full Rate</th>
            <th style={{padding:"10px 8px",textAlign:"center",borderBottom:"2px solid #C8DFB0",fontWeight:700,color:"#2D5016"}}>13–26 Rate</th>
          </tr></thead>
          <tbody>
            {SCENARIOS.map((s,i)=>{
              const fullRate = calcFullRate(s);
              const teenRate = fullRate * TEEN_DISCOUNT;
              return (<tr key={s.name} style={{background:i%2===0?"#fff":"#FDFCF9"}}>
                <td style={{padding:"10px 8px",fontWeight:600,borderBottom:"1px solid #F0EAE0"}}>{s.name}</td>
                <td style={{padding:"10px 8px",textAlign:"center",borderBottom:"1px solid #F0EAE0"}}>{Math.round(s.u12*100)}%</td>
                <td style={{padding:"10px 8px",textAlign:"center",borderBottom:"1px solid #F0EAE0"}}>{Math.round(s.t13*100)}%</td>
                <td style={{padding:"10px 8px",textAlign:"center",borderBottom:"1px solid #F0EAE0"}}>{Math.round(s.a27*100)}%</td>
                <td style={{padding:"10px 8px",textAlign:"center",borderBottom:"1px solid #F0EAE0"}}>{Math.round(s.s75*100)}%</td>
                <td style={{padding:"10px 8px",textAlign:"center",borderBottom:"1px solid #F0EAE0",fontWeight:800,color:"#2D5016",fontSize:16}}>${Math.round(fullRate)}</td>
                <td style={{padding:"10px 8px",textAlign:"center",borderBottom:"1px solid #F0EAE0",fontWeight:600,color:"#4A7A28"}}>${Math.round(teenRate)}</td>
              </tr>);
            })}
          </tbody>
        </table>
      </div>
      <div style={{marginTop:12,fontSize:12,color:"#9A8B7A",lineHeight:1.5}}>
        The <strong>Full Rate</strong> is what each person aged 27–74 would pay to cover the reunion fee budget of ${feeBudget.toLocaleString()} across {attendees} attendees. Hotel costs are separate — each family books and pays their own room. Ages 13–26 pay 60% of the full rate. Under 12 and 75+ have fixed rates regardless of scenario.
      </div>
    </div>
  </div>);
}

/* ═══ ATTENDANCE PAGE ═══ */
function AttendancePage({members,rootChildren,updateMember}){
  const [rsvps,setRsvps] = useState({});
  useEffect(()=>{(async()=>{try{const r=await window.storage.get("coleman-rsvp");if(r?.value)setRsvps(JSON.parse(r.value));}catch{}})();},[]);
  const saveRsvp=async(id,status)=>{const next={...rsvps,[id]:status};setRsvps(next);try{await window.storage.set("coleman-rsvp",JSON.stringify(next));}catch{}};

  const livingMembers = members.filter(m=>!m.isDeceased&&!m.isRootParent);
  const going = livingMembers.filter(m=>rsvps[m.id]==="going").length;
  const notGoing = livingMembers.filter(m=>rsvps[m.id]==="not-going").length;
  const maybe = livingMembers.filter(m=>rsvps[m.id]==="maybe").length;
  const noResp = livingMembers.filter(m=>!rsvps[m.id]).length;

  const statusStyle = (s) => ({
    padding:"4px 10px",borderRadius:12,fontSize:11,fontWeight:600,cursor:"pointer",border:"none",
    background:s==="going"?"#E8F3DC":s==="not-going"?"#F5E6E6":s==="maybe"?"#FFF8EC":"#F0EAE0",
    color:s==="going"?"#2D5016":s==="not-going"?"#933":s==="maybe"?"#C4963A":"#9A8B7A",
  });

  return (<div style={{maxWidth:860,margin:"0 auto"}}>
    <h2 style={{fontFamily:"Georgia,serif",color:"#2D5016",margin:"0 0 4px",fontSize:22}}>Reunion Attendance</h2>
    <p style={{color:"#7A6B5A",fontSize:13,margin:"0 0 16px"}}>See who's registered and their reunion RSVP status. Click the status buttons to update.</p>

    {/* Summary cards */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>
      <div style={{padding:12,background:"#E8F3DC",borderRadius:10,textAlign:"center",border:"1px solid #B8D4A0"}}><div style={{fontSize:24,fontWeight:800,color:"#2D5016"}}>{going}</div><div style={{fontSize:11,color:"#4A7A28",fontWeight:600}}>Going</div></div>
      <div style={{padding:12,background:"#FFF8EC",borderRadius:10,textAlign:"center",border:"1px solid #E8DFD0"}}><div style={{fontSize:24,fontWeight:800,color:"#C4963A"}}>{maybe}</div><div style={{fontSize:11,color:"#C4963A",fontWeight:600}}>Maybe</div></div>
      <div style={{padding:12,background:"#F5E6E6",borderRadius:10,textAlign:"center",border:"1px solid #E0C8C8"}}><div style={{fontSize:24,fontWeight:800,color:"#933"}}>{notGoing}</div><div style={{fontSize:11,color:"#933",fontWeight:600}}>Not Going</div></div>
      <div style={{padding:12,background:"#F0EAE0",borderRadius:10,textAlign:"center",border:"1px solid #D4C5AA"}}><div style={{fontSize:24,fontWeight:800,color:"#8B7355"}}>{noResp}</div><div style={{fontSize:11,color:"#8B7355",fontWeight:600}}>No Response</div></div>
    </div>

    {/* Member list by branch */}
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {rootChildren.map(rc=>{
        const branchMembers = [rc,...getAllBranch(rc.id,members)].filter(m=>!m.isDeceased);
        if(branchMembers.length===0) return null;
        return (<div key={rc.id} style={{background:"#fff",borderRadius:12,border:"1px solid #C8DFB0",overflow:"hidden"}}>
          <div style={{padding:"8px 14px",background:"#F5FAEF",fontSize:13,fontWeight:700,color:"#2D5016",borderBottom:"1px solid #D4DFC8"}}>
            {rc.name.split(/[\s(]/)[0]}'s Family
            <span style={{fontWeight:400,color:"#7A6B5A",marginLeft:8}}>({branchMembers.filter(m=>rsvps[m.id]==="going").length} of {branchMembers.length} going)</span>
          </div>
          {branchMembers.map((m,mi)=>{
            const status = rsvps[m.id]||"";
            return (<div key={m.id} style={{padding:"8px 14px",borderBottom:mi<branchMembers.length-1?"1px solid #F0EAE0":"none",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:6,background:mi%2===0?"#fff":"#FDFCF9"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,flex:1,minWidth:150}}>
                <span style={{fontSize:13,fontWeight:m.isRootChild?600:400,color:"#3B2F1E"}}>{m.name}</span>
                {m.age&&<span style={{fontSize:11,color:"#9A8B7A"}}>({m.age})</span>}
                {m.city&&m.state&&<span style={{fontSize:11,color:"#9A8B7A"}}>{m.city}, {m.state}</span>}
              </div>
              <div style={{display:"flex",gap:4}}>
                <button onClick={()=>saveRsvp(m.id,"going")} style={{...statusStyle("going"),outline:status==="going"?"2px solid #2D5016":"none"}}>✓ Going</button>
                <button onClick={()=>saveRsvp(m.id,"maybe")} style={{...statusStyle("maybe"),outline:status==="maybe"?"2px solid #C4963A":"none"}}>? Maybe</button>
                <button onClick={()=>saveRsvp(m.id,"not-going")} style={{...statusStyle("not-going"),outline:status==="not-going"?"2px solid #933":"none"}}>✕ No</button>
              </div>
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
  useEffect(()=>{(async()=>{try{const r=await window.storage.get("coleman-reunion-r2");if(r?.value)setResp(JSON.parse(r.value));}catch{}})();},[]);
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
