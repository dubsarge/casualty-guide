import { useState, useCallback, useRef, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// ZONES
// ═══════════════════════════════════════════════════════════════════════════════
const Z = [
  // HEAD
  {id:"crown",label:"Top of Head",x:150,y:24,r:10,anat:["Parietal bone","Brain (parietal lobe)"],sev:2,desc:"Thick bone but blunt force causes concussions. Scalp bleeds heavily — very vascular.",reg:"head",g:"Head"},
  {id:"forehead",label:"Forehead",x:150,y:38,r:12,anat:["Frontal bone (thick)","Brain (frontal lobe)"],sev:2,desc:"Relatively thick bone offering decent protection, but hard hits fracture it or concuss the brain beneath.",reg:"head",g:"Head"},
  {id:"l_temple",label:"Left Temple",x:128,y:48,r:8,anat:["Temporal bone (thin)","Temporal artery","Brain (temporal lobe)"],sev:3,desc:"One of the thinnest skull areas. The temporal artery is just beneath. Trauma here is extremely dangerous.",reg:"head",g:"Head"},
  {id:"r_temple",label:"Right Temple",x:172,y:48,r:8,anat:["Temporal bone (thin)","Temporal artery","Brain (temporal lobe)"],sev:3,desc:"Thinnest skull area. Temporal artery beneath. Extremely dangerous to trauma.",reg:"head",g:"Head"},
  {id:"l_eye",label:"Left Eye",x:141,y:56,r:6,anat:["Eyeball","Optic nerve","Orbital bone (eye socket)"],sev:2,desc:"The eye socket provides some bony protection, but the eye itself is extremely fragile. Damage can cause partial or total blindness.",reg:"head",g:"Head"},
  {id:"r_eye",label:"Right Eye",x:159,y:56,r:6,anat:["Eyeball","Optic nerve","Orbital bone (eye socket)"],sev:2,desc:"The orbital bone shields the eye but direct trauma risks blindness. Even minor injuries can impair vision — swelling, blood in the eye, or scratched cornea.",reg:"head",g:"Head"},
  {id:"l_ear",label:"Left Ear",x:120,y:58,r:6,anat:["Ear canal","Eardrum","Inner ear (balance)"],sev:1,desc:"Outer ear tears easily and bleeds heavily. Eardrum damage from blasts or blows causes deafness or vertigo. Fluid from the ear after head trauma suggests skull fracture.",reg:"head",g:"Head"},
  {id:"r_ear",label:"Right Ear",x:180,y:58,r:6,anat:["Ear canal","Eardrum","Inner ear (balance)"],sev:1,desc:"Outer ear bleeds heavily when torn. Eardrum damage causes hearing loss and balance issues. Fluid leaking from the ear after a blow is a red flag for skull fracture.",reg:"head",g:"Head"},
  {id:"nose",label:"Nose",x:150,y:66,r:5,anat:["Nasal bone (thin)","Nasal cartilage","Sinuses","Blood vessels (rich supply)"],sev:1,desc:"The nasal bone breaks easily — one of the most common facial fractures. Bleeds heavily due to rich blood supply. Cartilage can be displaced, affecting breathing.",reg:"head",g:"Head"},
  {id:"mouth",label:"Mouth / Jaw",x:150,y:76,r:7,anat:["Jaw (mandible)","Teeth","Tongue","Oral blood vessels"],sev:1,desc:"The jaw can fracture or dislocate. Teeth can be knocked out or shattered. The tongue bleeds profusely if bitten through. Jaw injuries make eating and speaking painful.",reg:"head",g:"Head"},
  {id:"chin",label:"Chin",x:150,y:86,r:6,anat:["Mandible (chin point)","Mentalis muscle"],sev:1,desc:"A hard hit to the chin transmits force into the jaw joint and up into the skull, causing a knockout or concussion even without visible damage.",reg:"head",g:"Head"},

  // NECK
  {id:"l_neck",label:"Left Neck",x:142,y:100,r:7,anat:["Left carotid artery","Left jugular vein","Cervical spine"],sev:4,desc:"Carotid carries blood to the brain — severing it means death in minutes. Jugular returns blood from the head. Both critically vulnerable.",reg:"neck",g:"Neck"},
  {id:"r_neck",label:"Right Neck",x:158,y:100,r:7,anat:["Right carotid artery","Right jugular vein","Cervical spine"],sev:4,desc:"Carotid and jugular critically exposed. Spinal damage at this level can mean paralysis or death.",reg:"neck",g:"Neck"},
  {id:"throat",label:"Throat",x:150,y:107,r:6,anat:["Trachea (windpipe)","Esophagus","Thyroid"],sev:3,desc:"Windpipe sits right at the surface with almost no protection. Damage compromises breathing immediately.",reg:"neck",g:"Neck"},

  // CHEST
  {id:"heart_area",label:"Upper Left Chest",x:136,y:138,r:14,anat:["Heart","Aorta","Left lung (upper)","Ribs 2-4"],sev:4,desc:"The heart and aorta — the body's largest artery. Damage to either is almost always fatal without immediate expert intervention.",reg:"chest",g:"Chest"},
  {id:"sternum",label:"Sternum",x:150,y:144,r:10,anat:["Sternum (breastbone)","Heart (behind)","Major vessels"],sev:3,desc:"Flat bone shielding the heart. Can fracture from blunt force; a bullet punches through into the heart.",reg:"chest",g:"Chest"},
  {id:"ur_chest",label:"Upper Right Chest",x:166,y:138,r:14,anat:["Right lung (upper)","Subclavian vessels","Ribs 2-4"],sev:3,desc:"Right lung fills this space. Puncture causes pneumothorax. Subclavian vessels near the collarbone.",reg:"chest",g:"Chest"},
  {id:"lm_chest",label:"Left Mid Chest",x:124,y:166,r:12,anat:["Left lung (lower)","Ribs 5-8","Diaphragm edge"],sev:2,desc:"Lower left lung. Diaphragm begins here — damage affects breathing and organs below.",reg:"chest",g:"Chest"},
  {id:"rm_chest",label:"Right Mid Chest",x:178,y:166,r:12,anat:["Right lung (lower)","Ribs 5-8","Liver edge"],sev:2,desc:"Lower right lung. Liver peeks up under the ribs. Injuries affect breathing and can cause liver bleeding.",reg:"chest",g:"Chest"},
  {id:"ll_ribs",label:"Left Lower Ribs",x:120,y:190,r:11,anat:["Floating ribs 9-12","Spleen (behind)","Diaphragm"],sev:2,desc:"Floating ribs offer less protection. Spleen sits behind — blood-rich, ruptures easily.",reg:"chest",g:"Chest"},
  {id:"rl_ribs",label:"Right Lower Ribs",x:182,y:190,r:11,anat:["Floating ribs 9-12","Liver (behind)","Diaphragm"],sev:2,desc:"Liver behind the right lower ribs. Largest internal organ, bleeds profusely when damaged.",reg:"chest",g:"Chest"},

  // ABDOMEN
  {id:"ul_abd",label:"Upper Left Abdomen",x:132,y:212,r:12,anat:["Spleen","Stomach","Pancreas (tail)","Left kidney (deep)"],sev:3,desc:"Spleen is fragile and blood-rich. Stomach sits centrally. Kidney tucked deep against the back.",reg:"abdomen",g:"Abdomen"},
  {id:"ur_abd",label:"Upper Right Abdomen",x:170,y:212,r:12,anat:["Liver","Gallbladder","Right kidney (deep)","Duodenum"],sev:3,desc:"Dominated by the liver — massive and blood-filled. Gallbladder underneath. Heavy bleeding is the danger.",reg:"abdomen",g:"Abdomen"},
  {id:"c_abd",label:"Center Abdomen",x:150,y:236,r:12,anat:["Small intestine","Abdominal aorta (deep)","Inferior vena cava"],sev:2,desc:"Intestines up front. Deep behind them, the aorta and vena cava — damage to those is catastrophic. Intestinal injuries risk deadly infection.",reg:"abdomen",g:"Abdomen"},
  {id:"ll_abd",label:"Lower Left Abdomen",x:138,y:258,r:11,anat:["Descending colon","Bladder (lower)","Left iliac vessels"],sev:1,desc:"Mostly large intestine. Intestinal contents leaking into the body cavity cause deadly infection if untreated.",reg:"abdomen",g:"Abdomen"},
  {id:"lr_abd",label:"Lower Right Abdomen",x:164,y:258,r:11,anat:["Appendix","Ascending colon","Right iliac vessels"],sev:1,desc:"Appendix sits here. Intestinal damage is the main concern.",reg:"abdomen",g:"Abdomen"},
  {id:"groin",label:"Groin / Pelvis",x:150,y:278,r:10,anat:["Femoral artery origin","Pelvic bones","Bladder","Nerves"],sev:3,desc:"Femoral arteries branch off here. Pelvis protects bladder. Pelvic fractures bleed internally.",reg:"abdomen",g:"Abdomen"},

  // SHOULDERS
  {id:"l_shoulder",label:"Left Shoulder",x:102,y:122,r:11,anat:["Shoulder joint","Clavicle","Deltoid","Rotator cuff"],sev:1,desc:"Ball-and-socket joint, prone to dislocation. Clavicle fractures easily. Painful, not typically lethal.",reg:"leftArm",g:"Left Arm"},
  {id:"r_shoulder",label:"Right Shoulder",x:198,y:122,r:11,anat:["Shoulder joint","Clavicle","Deltoid","Rotator cuff"],sev:1,desc:"Ball-and-socket joint. Clavicle fractures easily. Painful, not lethal.",reg:"rightArm",g:"Right Arm"},

  // LEFT ARM
  {id:"l_uarm",label:"Left Upper Arm",x:88,y:155,r:12,anat:["Humerus","Brachial artery","Bicep & tricep"],sev:1,desc:"Brachial artery runs along the inside. Humerus is large. Arterial damage here can be serious.",reg:"leftArm",g:"Left Arm"},
  {id:"l_elbow",label:"Left Elbow",x:78,y:188,r:8,anat:["Elbow joint","Ulnar nerve","Brachial artery"],sev:1,desc:"Hinge joint. Ulnar nerve at the surface (funny bone). Dislocation possible.",reg:"leftArm",g:"Left Arm"},
  {id:"l_farm",label:"Left Forearm",x:66,y:222,r:11,anat:["Radius & ulna","Radial artery","Tendons"],sev:0,desc:"Two parallel bones. Radial artery at the wrist side. Tendon damage affects hand function.",reg:"leftArm",g:"Left Arm"},
  {id:"l_hand",label:"Left Hand (Palm)",x:54,y:258,r:9,anat:["Metacarpal bones","Palm tendons","Palmar arteries"],sev:0,desc:"Complex bone and tendon structure. Injuries affect grip. Defensive wounds common here.",reg:"leftArm",g:"Left Arm"},
  {id:"l_fingers",label:"Left Fingers",x:48,y:282,r:9,anat:["Phalanges (finger bones)","Finger tendons","Small nerves","Nail bed"],sev:0,desc:"Tiny bones connected by tendons. Each finger has its own blood and nerve supply. Can be broken, dislocated, crushed, or amputated. Loss affects dexterity permanently.",reg:"leftArm",g:"Left Arm"},

  // RIGHT ARM
  {id:"r_uarm",label:"Right Upper Arm",x:212,y:155,r:12,anat:["Humerus","Brachial artery","Bicep & tricep"],sev:1,desc:"Brachial artery inside. Fractures painful but survivable.",reg:"rightArm",g:"Right Arm"},
  {id:"r_elbow",label:"Right Elbow",x:222,y:188,r:8,anat:["Elbow joint","Ulnar nerve","Brachial artery"],sev:1,desc:"Hinge joint. Ulnar nerve exposed. Dislocation possible.",reg:"rightArm",g:"Right Arm"},
  {id:"r_farm",label:"Right Forearm",x:234,y:222,r:11,anat:["Radius & ulna","Radial artery","Tendons"],sev:0,desc:"Two bones. Radial artery at wrist. Tendon cuts affect grip.",reg:"rightArm",g:"Right Arm"},
  {id:"r_hand",label:"Right Hand (Palm)",x:246,y:258,r:9,anat:["Metacarpal bones","Palm tendons","Palmar arteries"],sev:0,desc:"Defensive wound location. Tendon/bone damage affects grip permanently.",reg:"rightArm",g:"Right Arm"},
  {id:"r_fingers",label:"Right Fingers",x:252,y:282,r:9,anat:["Phalanges (finger bones)","Finger tendons","Small nerves","Nail bed"],sev:0,desc:"Small bones and tendons. Easily broken or dislocated. Loss of trigger finger or grip strength is a significant RP detail for gunslingers.",reg:"rightArm",g:"Right Arm"},

  // LEFT LEG
  {id:"l_uthigh",label:"Left Upper Thigh",x:138,y:302,r:12,anat:["Femoral artery","Femoral vein","Femur","Quadriceps"],sev:3,desc:"Femoral artery — one of the largest. Damage means death in minutes. Femur is the body's strongest bone.",reg:"leftLeg",g:"Left Leg"},
  {id:"l_mthigh",label:"Left Mid Thigh",x:136,y:336,r:11,anat:["Femur","Quad & hamstring","Deep femoral artery"],sev:1,desc:"Thick muscle around femur. GSWs can pass through without hitting bone. Painful but less dangerous.",reg:"leftLeg",g:"Left Leg"},
  {id:"l_knee",label:"Left Knee",x:134,y:368,r:9,anat:["Patella","Knee joint & ligaments","Popliteal artery (behind)"],sev:1,desc:"Complex joint with ligaments. Popliteal artery behind it. Knee injuries severely limit mobility.",reg:"leftLeg",g:"Left Leg"},
  {id:"l_shin",label:"Left Shin / Calf",x:132,y:410,r:12,anat:["Tibia","Fibula","Calf muscles"],sev:0,desc:"Tibia right at the surface. Common fracture site.",reg:"leftLeg",g:"Left Leg"},
  {id:"l_ankle",label:"Left Ankle",x:130,y:455,r:7,anat:["Ankle joint","Achilles tendon","Lateral ligaments"],sev:0,desc:"Ankle sprains and fractures common. Achilles tendon is vulnerable — cutting it removes the ability to walk properly.",reg:"leftLeg",g:"Left Leg"},
  {id:"l_foot",label:"Left Foot",x:123,y:475,r:9,anat:["Metatarsal bones","Foot arch","Plantar fascia"],sev:0,desc:"Many small bones. Crushing injuries painful and slow to heal.",reg:"leftLeg",g:"Left Leg"},
  {id:"l_toes",label:"Left Toes",x:114,y:490,r:7,anat:["Toe phalanges","Toe tendons","Small nerves"],sev:0,desc:"Tiny bones that break easily. The big toe is critical for balance — losing it affects how you walk forever. Crushed by hooves, caught in stirrups, or frostbitten.",reg:"leftLeg",g:"Left Leg"},

  // RIGHT LEG
  {id:"r_uthigh",label:"Right Upper Thigh",x:162,y:302,r:12,anat:["Femoral artery","Femoral vein","Femur","Quadriceps"],sev:3,desc:"Femoral artery here can mean death in minutes. Femur takes serious force to break.",reg:"rightLeg",g:"Right Leg"},
  {id:"r_mthigh",label:"Right Mid Thigh",x:164,y:336,r:11,anat:["Femur","Quad & hamstring","Deep femoral artery"],sev:1,desc:"Thick muscle. Less dangerous than upper thigh.",reg:"rightLeg",g:"Right Leg"},
  {id:"r_knee",label:"Right Knee",x:166,y:368,r:9,anat:["Patella","Knee joint & ligaments","Popliteal artery (behind)"],sev:1,desc:"Complex joint. Popliteal artery behind. Limits mobility severely.",reg:"rightLeg",g:"Right Leg"},
  {id:"r_shin",label:"Right Shin / Calf",x:168,y:410,r:12,anat:["Tibia","Fibula","Calf muscles"],sev:0,desc:"Shin bone close to surface. Fractures common.",reg:"rightLeg",g:"Right Leg"},
  {id:"r_ankle",label:"Right Ankle",x:170,y:455,r:7,anat:["Ankle joint","Achilles tendon","Lateral ligaments"],sev:0,desc:"Achilles tendon exposed at the back. Ankle fractures limit all mobility.",reg:"rightLeg",g:"Right Leg"},
  {id:"r_foot",label:"Right Foot",x:177,y:475,r:9,anat:["Metatarsal bones","Foot arch","Plantar fascia"],sev:0,desc:"Small bones, easily crushed. Walking impaired.",reg:"rightLeg",g:"Right Leg"},
  {id:"r_toes",label:"Right Toes",x:186,y:490,r:7,anat:["Toe phalanges","Toe tendons","Small nerves"],sev:0,desc:"Small, fragile bones. Big toe loss affects balance and gait. Crushed, frostbite, broken from kicks.",reg:"rightLeg",g:"Right Leg"},

  // BACK
  {id:"u_back",label:"Upper Back",x:150,y:140,r:16,anat:["Thoracic spine","Spinal cord","Scapulae","Lungs (behind ribs)"],sev:3,desc:"Spinal cord here — damage means paralysis. Shoulder blades offer some protection.",reg:"back",g:"Back",bo:true},
  {id:"m_back",label:"Mid Back",x:150,y:185,r:16,anat:["Thoracic/lumbar spine","Spinal cord","Kidneys (flanks)","Rear ribs"],sev:3,desc:"Kidneys on either side of the spine — blood-rich, vulnerable from behind. Spinal damage the greatest risk.",reg:"back",g:"Back",bo:true},
  {id:"lo_back",label:"Lower Back",x:150,y:236,r:16,anat:["Lumbar spine","Spinal nerves","Major back muscles"],sev:2,desc:"Lumbar spine bears most body weight. Nerve damage here affects legs.",reg:"back",g:"Back",bo:true},
];

// ═══════════════════════════════════════════════════════════════════════════════
// INJURY TYPES & REGION MAPPING
// ═══════════════════════════════════════════════════════════════════════════════
const IT = {
  open_wound:{l:"Open Wound",i:"🩸",bs:1},gsw_lodged:{l:"GSW — Bullet Lodged",i:"🔫",bs:3},gsw_tt:{l:"GSW — Through & Through",i:"🔫",bs:3},
  stab_wound:{l:"Stab Wound / Arrow",i:"🗡️",bs:2},burn_1:{l:"Burn — 1st Degree",i:"🔥",bs:1},burn_2:{l:"Burn — 2nd Degree",i:"🔥",bs:2},burn_3:{l:"Burn — 3rd Degree",i:"🔥",bs:3},
  concussion:{l:"Concussion",i:"💫",bs:2},broken_nose:{l:"Broken Nose",i:"👃",bs:1},skull_pressure:{l:"Skull Pressure / Drain",i:"🧠",bs:4},
  deflated_lung:{l:"Collapsed Lung",i:"🫁",bs:4},rib_fracture:{l:"Rib Fracture",i:"🦴",bs:2},organ_damage:{l:"Organ Damage",i:"🫀",bs:4},
  fracture_hairline:{l:"Hairline Fracture",i:"🦴",bs:1},fracture_linear:{l:"Simple Break",i:"🦴",bs:3},fracture_comminuted:{l:"Shattered Bone (Amputation)",i:"🦴",bs:5},
  dislocation:{l:"Dislocated Joint",i:"💢",bs:2},snake_bite:{l:"Snake Bite (Venomous)",i:"🐍",bs:3},arterial_bleed:{l:"Arterial Bleed",i:"❤️‍🩹",bs:4},
  eye_injury:{l:"Eye Injury",i:"👁️",bs:2},ear_injury:{l:"Ear Injury",i:"👂",bs:1},jaw_fracture:{l:"Jaw Fracture / Dislocation",i:"🦷",bs:2},
  tooth_damage:{l:"Tooth Damage",i:"🦷",bs:0},crush_injury:{l:"Crush Injury",i:"🔨",bs:2},frostbite:{l:"Frostbite",i:"🥶",bs:1},
};

const RI = {
  head:["open_wound","gsw_lodged","gsw_tt","burn_1","burn_2","burn_3","concussion","broken_nose","skull_pressure","eye_injury","ear_injury","jaw_fracture","tooth_damage"],
  neck:["open_wound","gsw_lodged","gsw_tt","stab_wound","arterial_bleed"],
  chest:["open_wound","gsw_lodged","gsw_tt","stab_wound","burn_1","burn_2","burn_3","rib_fracture","deflated_lung","organ_damage"],
  abdomen:["open_wound","gsw_lodged","gsw_tt","stab_wound","burn_1","burn_2","burn_3","organ_damage"],
  leftArm:["open_wound","gsw_lodged","gsw_tt","stab_wound","burn_1","burn_2","burn_3","fracture_hairline","fracture_linear","fracture_comminuted","dislocation","snake_bite","arterial_bleed","crush_injury"],
  rightArm:["open_wound","gsw_lodged","gsw_tt","stab_wound","burn_1","burn_2","burn_3","fracture_hairline","fracture_linear","fracture_comminuted","dislocation","snake_bite","arterial_bleed","crush_injury"],
  leftLeg:["open_wound","gsw_lodged","gsw_tt","stab_wound","burn_1","burn_2","burn_3","fracture_hairline","fracture_linear","fracture_comminuted","dislocation","snake_bite","arterial_bleed","crush_injury","frostbite"],
  rightLeg:["open_wound","gsw_lodged","gsw_tt","stab_wound","burn_1","burn_2","burn_3","fracture_hairline","fracture_linear","fracture_comminuted","dislocation","snake_bite","arterial_bleed","crush_injury","frostbite"],
  back:["open_wound","gsw_lodged","gsw_tt","stab_wound","burn_1","burn_2","burn_3"],
};

function gzi(zone) {
  const base = RI[zone.reg] || [];
  return base.filter(t => {
    if(t==="broken_nose"&&zone.id!=="nose") return false;
    if(t==="eye_injury"&&!zone.id.includes("eye")) return false;
    if(t==="ear_injury"&&!zone.id.includes("ear")) return false;
    if(t==="jaw_fracture"&&!["mouth","chin"].includes(zone.id)) return false;
    if(t==="tooth_damage"&&zone.id!=="mouth") return false;
    if(t==="concussion"&&!["forehead","l_temple","r_temple","crown","chin"].includes(zone.id)) return false;
    if(t==="skull_pressure"&&!["l_temple","r_temple","forehead","crown"].includes(zone.id)) return false;
    if(t==="deflated_lung"&&!zone.anat.some(a=>/lung/i.test(a))) return false;
    if(t==="organ_damage"&&!zone.anat.some(a=>/heart|lung|liver|spleen|kidney|stomach|intestine|bladder|gallbladder|pancreas|appendix/i.test(a))) return false;
    if(t==="rib_fracture"&&!zone.anat.some(a=>/rib/i.test(a))) return false;
    if(t==="dislocation"&&!zone.anat.some(a=>/joint|socket|knee|elbow|ankle|jaw|shoulder/i.test(a))) return false;
    if(t==="arterial_bleed"&&!zone.anat.some(a=>/artery|arterial|aorta|carotid|femoral|brachial|subclavian|iliac|popliteal|radial|palmar/i.test(a))) return false;
    if(/fracture/.test(t)&&t!=="rib_fracture"&&!zone.anat.some(a=>/bone|humerus|radius|ulna|femur|tibia|fibula|patella|metacarpal|metatarsal|clavicle|phalanges|mandible|parietal|frontal|temporal|nasal/i.test(a))) return false;
    if(t==="snake_bite"&&!["l_hand","r_hand","l_fingers","r_fingers","l_farm","r_farm","l_shin","r_shin","l_foot","r_foot","l_ankle","r_ankle","l_toes","r_toes"].includes(zone.id)) return false;
    if(t==="crush_injury"&&!["l_hand","r_hand","l_fingers","r_fingers","l_foot","r_foot","l_toes","r_toes"].includes(zone.id)) return false;
    if(t==="frostbite"&&!["l_toes","r_toes","l_foot","r_foot","l_fingers","r_fingers","l_ear","r_ear","nose"].includes(zone.id)) return false;
    return true;
  });
}

const SV = [
  {v:1,l:"Minor",c:"#6b8f3c",t:"No mandatory recovery",d:"A scratch in the grand scheme. Keep it clean."},
  {v:2,l:"Moderate",c:"#b8860b",t:"2–4 hours rest",d:"You'll want to take it easy. Light duty after."},
  {v:3,l:"Serious",c:"#cd6600",t:"~24 hours recovery",d:"You're hurt bad. Bed rest, follow-ups."},
  {v:4,l:"Severe",c:"#b22222",t:"48–72 hours recovery",d:"Survival was in question. Extended rest."},
  {v:5,l:"Critical",c:"#4a0000",t:"72+ hours recovery",d:"Death's door. Life-altering consequences possible."},
];
function cSev(injs){if(!injs.length)return 1;let mx=0;injs.forEach(i=>{const t=IT[i.type],z=Z.find(zn=>zn.id===i.zid);if(!t||!z)return;mx=Math.max(mx,t.bs+z.sev);});return Math.min(5,Math.max(1,Math.round(mx+(injs.length>=3?1:injs.length>=2?.5:0))));}

// ═══════════════════════════════════════════════════════════════════════════════
// OUTPUT DATA
// ═══════════════════════════════════════════════════════════════════════════════
const gfs=(o,s)=>{if(o[s])return o[s];for(let d=1;d<=5;d++){if(o[s-d])return o[s-d];if(o[s+d])return o[s+d];}return Object.values(o)[0]||[];};

const OD = {
  open_wound:{sym:{1:["Shallow cut, bleeding, stings"],2:["Deep laceration, steady bleeding, possible muscle visible"],3:["Gaping wound, heavy blood flow, pale skin"],4:["Devastating wound, blood pooling, barely conscious"]},doEx:{1:["/do A shallow gash across their {z}, bleeding lightly."],2:["/do A deep laceration on their {z}, bleeding steadily. Ragged edges."],3:["/do Gaping wound on their {z}. Blood flowing freely. Pale and clammy."]},rec:["Keep bandages clean — change daily","Watch for infection: redness, pus, dark tissue","Return for suture removal if stitched"],drugs:["Cocaine paste might numb the area for sutures","If stronger meds are used, in-game addiction mechanic may kick in"]},
  gsw_lodged:{sym:{1:["Small caliber, lodged shallow"],2:["Significant bleeding, numbness spreading"],3:["Bullet deep, internal damage likely, cold sweats"],4:["Possible fragmentation, fading in and out"]},doEx:{1:["/do Small entry wound on their {z}. No exit. Bleeding but controlled."],2:["/do Entry wound on their {z}, no exit. Swelling fast."],3:["/do Bullet wound on their {z}. Blood pooling. Ashen."]},rec:["Expect bed rest","Multiple follow-ups","Bullet path may have caused internal damage"],drugs:["Morphine likely — addictive in-game","Ether if surgery needed — groggy after","In-game addiction tracks opioid use"]},
  gsw_tt:{sym:{1:["Clean pass, entry small, exit bigger"],2:["Entry clean, exit messy, internal damage along path"],3:["Massive exit wound, shock"],4:["Exit devastating, barely responsive"]},doEx:{1:["/do Small entry on front of {z}, larger exit wound back. Bleeding both sides."],2:["/do Entry clean. Exit torn open on their {z}. Heavy bleeding."],3:["/do Through-and-through on {z}. Exit wound devastating. Fading."]},rec:["Extended bed rest","Daily bandage changes both wounds","Infection is biggest secondary risk"],drugs:["Morphine or laudanum almost certainly — addictive","Cocaine might maintain heart rate via IV","Opioid use adds up to 24h drug recovery"]},
  stab_wound:{sym:{1:["Shallow puncture, sharp pain"],2:["Deep puncture, steady bleeding"],3:["Deep stab, internal damage, heavy bleeding"]},doEx:{1:["/do Puncture wound on {z}, couple inches deep."],2:["/do Deep stab in {z}. Blood wells up. {OPTIONAL: Blade still embedded.}"],3:["/do Deep stab in {z}. Blood dark, flowing. Skin cold."]},rec:["Keep wound covered and clean","Stabbing instruments are rarely clean — infection risk high","Limit movement of affected area"],drugs:["Morphine for severe, cocaine paste for numbing sutures","If blade left in, doc won't remove until ready (it's plugging the hole)"]},
  burn_1:{sym:{1:["Red tender skin, like bad sunburn"],2:["Bright red, swollen, painful"]},doEx:{1:["/do Skin on their {z} bright red and tender. Intact but painful."]},rec:["Bandage change once daily","Heals in days, some peeling"],drugs:["Aspirin usually enough","Aloe gel for the burn"]},
  burn_2:{sym:{1:["Blistering, raw skin underneath"],2:["Blisters bursting, weeping fluid, intense pain"]},doEx:{1:["/do Blistered skin on {z}. Some burst, weeping. Flinches at contact."],2:["/do Extensive second-degree burns on {z}. Raw, weeping, agonizing."]},rec:["Bandage change TWICE daily","Scarring possible","Infection on burned skin is dangerous"],drugs:["Laudanum or morphine may be needed","Be aware of in-game addiction system"]},
  burn_3:{sym:{2:["Charred/waxy skin, center numb, edges hurt intensely"],3:["Skin destroyed, blackened, tissue visible"]},doEx:{2:["/do Charred skin on {z}. Blackened patches. Can't feel center, screams at edges."]},rec:["Bandage change THREE times daily","Permanent scarring almost certain","Maggots may remove dead tissue","Could become a defining character trait"],drugs:["Strong pain meds almost certainly — prolonged exposure","Addiction mechanic very relevant if you want to explore it"]},
  concussion:{sym:{1:["Slight headache, dizzy, seeing stars"],2:["Confusion, nausea, balance problems, light sensitivity"],3:["Severe disorientation, vomiting, may black out"]},doEx:{1:["/do Eyes slightly unfocused. Rubbing head, dazed but oriented."],2:["/do Eyes glazed, pupils uneven. Stumbles. Can't remember getting here."],3:["/do Barely conscious. Can't track movement. Vomiting, slurred speech."]},rec:["Minor: take it easy","Moderate/Severe: someone should watch you — avoid sleeping","Memory gaps, irritability, foggy thinking are natural to play if you want"],drugs:["Aspirin for headache — non-addictive","Docs avoid opioids for concussions — masks brain symptoms"]},
  broken_nose:{sym:{1:["Crooked, swelling, bloody nose"],2:["Badly displaced, heavy swelling, mouth-breathing"]},doEx:{1:["/do Nose visibly crooked, swelling. Blood from both nostrils."]},rec:["Don't touch it","Swelling for days","Might flinch near your face for a while"],drugs:["Cocaine paste to numb before reset","Leather to bite during the snap"]},
  skull_pressure:{sym:{3:["Intense headache, soft bump, fluid from nose/ears"],4:["Life-threatening pressure, unconscious"]},doEx:{3:["/do Soft spongy bump on skull. Fluid from ear. Mumbling."],4:["/do Unconscious. Soft depression on skull. Fluid from nose and ears."]},rec:["Extended bed rest — pressure change affects balance","Dizziness, light/sound sensitivity for days"],drugs:["Ether for procedure, morphine after — both addictive","24h drug recovery"]},
  deflated_lung:{sym:{3:["Shortness of breath, one-sided chest pain, gurgling"],4:["Extreme difficulty breathing, blue lips, gasping"]},doEx:{3:["/do Struggling to breathe. Shallow, wet-sounding. One side barely moves."],4:["/do Gasping. Lips blue. Gurgling each breath. Panicking."]},rec:["Bed rest — your lung collapsed","No running, shouting, heavy lifting","Shortness of breath for days"],drugs:["Ether and morphine — both addictive, 24h recovery"]},
  rib_fracture:{sym:{1:["Hurts to breathe deep, cough, laugh"],2:["Sharp pain every breath, heavy bruising"],3:["Multiple breaks, rapid shallow breathing, maybe blood"]},doEx:{1:["/do Winces breathing deep. Bruising across ribs."],2:["/do Each breath shallow and pained. Guards the area."]},rec:["No heavy lifting, running, fighting","Deep breaths hurt for days","Compression bandage stays on"],drugs:["Laudanum or morphine likely beyond hairline — breathing through rib pain is rough"]},
  organ_damage:{sym:{3:["Deep internal pain, rigid abdomen, nausea"],4:["Abdomen swollen, internal bleeding, fading"]},doEx:{3:["/do Abdomen rigid. Face twisted. Nauseous, sweating."],4:["/do Abdomen swollen and hard. Ashen. Pulse barely there."]},rec:["48-72h minimum bed rest","Soft food diet: broths, porridge","Multiple follow-ups"],drugs:["Ether for surgery, morphine after — both addictive"]},
  fracture_hairline:{sym:{1:["Aching, swelling, bruising — can move but hurts"],2:["Significant swelling, sharp pain with movement"]},doEx:{1:["/do Swelling and bruising on {z}. Can move it but grimaces."]},rec:["Keep splint/cast on","No heavy use","Tender for a while"],drugs:["Aspirin or phenacetin — non-addictive","Medicinal mota for pain and sleep"]},
  fracture_linear:{sym:{2:["Clear break, intense pain, can't use limb"],3:["Bone visibly displaced, wrong angle"],4:["Bone through skin, shock"]},doEx:{2:["/do Their {z} is bent wrong. Massive swelling. Screams if touched."],3:["/do Bone displaced under skin. Limb hangs wrong."]},rec:["Splint stays on","No use of limb for extended period","A limp, sling — natural to play out","Multiple follow-ups for plates"],drugs:["Morphine almost certainly — severe pain","Ether if surgery needed","24h drug recovery"]},
  fracture_comminuted:{sym:{4:["Bone shattered — limb unsalvageable"],5:["Catastrophic limb destruction, shock"]},doEx:{4:["/do Their {z} is destroyed. Bone fragments through flesh. Shock."]},rec:["You are losing a limb — permanent","Extended recovery, daily bandage changes","Phantom pain can be interesting to explore","Major character-defining moment"],drugs:["Ether — must be unconscious","Morphine post-op — highly addictive","Prolonged drug exposure — addiction mechanic likely kicks in"]},
  dislocation:{sym:{1:["Joint out of place, limited movement"],2:["Major joint displaced, visible deformity"]},doEx:{1:["/do Their {z} clearly out of socket. Bent wrong."],2:["/do Joint visibly dislocated. Bone bulging wrong. Cries out."]},rec:["Sling or splint after","Pops out easier next time — don't overdo it","Sore with limited range for days"],drugs:["Cocaine paste to numb before reset","Leather to bite during","Aspirin after"]},
  snake_bite:{sym:{1:["Two puncture marks, local swelling, mild nausea"],2:["Rapid swelling, dizziness, vomiting"],3:["Venom spreading, breathing difficulty, darkening tissue"]},doEx:{1:["/do Two small puncture marks on {z}. Red, swelling. Mild nausea."],2:["/do Fang marks on {z}, swelling rapidly, skin discoloring."]},rec:["Watch for tissue death — darkening skin","Tourniquet area monitored","Black skin = necrosis territory"],drugs:["Aspirin for mild, morphine if severe","Treatment mostly venom extraction"]},
  arterial_bleed:{sym:{3:["Bright red spurting with heartbeat, going pale"],4:["Massive spray, minutes from death"]},doEx:{3:["/do Bright red blood spurts from {z} in pulses. Going pale fast."],4:["/do Arterial spray from {z}. Blood everywhere. Going limp."]},rec:["Extended bed rest — you almost bled out","IV fluids for blood volume","Close to death — the weakness, fear, slow rebuild"],drugs:["Ether if surgery, morphine after — both addictive"]},
  eye_injury:{sym:{1:["Eye watering, swollen, blurred vision, light sensitivity"],2:["Blood in the eye, severe pain, vision impaired","Can't open the eye, swelling shut"],3:["Eye lacerated or ruptured, total vision loss that side","Extreme pain, blood and fluid leaking"]},doEx:{1:["/do Left/right eye swollen, watering badly. Squinting, can't focus. Light makes it worse."],2:["/do Blood visible in the eye. Can barely open it. Vision blurry or gone on that side."],3:["/do Eye ruptured. Fluid leaking. Clutching face, screaming. Blind on that side."]},rec:["Partial or total blindness on that side is possible — could be permanent","Depth perception is affected with one working eye","Bandage over the eye for healing — can't see from it during recovery"],drugs:["Cocaine solution can numb the eye area","Morphine for severe eye injuries","Laudanum for ongoing pain management"]},
  ear_injury:{sym:{1:["Ear torn or bleeding, ringing, muffled hearing"],2:["Eardrum burst — sharp pain, hearing loss, vertigo","Blood or fluid from ear canal, severe dizziness"],3:["Inner ear destroyed, permanent hearing loss that side","Extreme vertigo, can't walk straight, nausea"]},doEx:{1:["/do Ear torn and bleeding. Constant ringing. Sounds are muffled."],2:["/do Blood from ear canal. World spinning, can barely stand. Can't hear from that side."]},rec:["Hearing loss may be temporary or permanent","Balance problems from inner ear damage — stumbling, nausea","Ringing in the ears (tinnitus) can be ongoing"],drugs:["Aspirin for mild pain","Morphine if severe — eardrum rupture is agonizing"]},
  jaw_fracture:{sym:{1:["Jaw misaligned, painful to open mouth, swelling"],2:["Jaw dislocated or fractured — can't close mouth properly","Drooling, can't chew, slurred speech from swelling"],3:["Jaw shattered, teeth loose or missing, severe swelling"]},doEx:{1:["/do Jaw swollen, slightly off-center. Wincing trying to talk or open mouth."],2:["/do Jaw hanging wrong — can't close their mouth. Drooling. Speech barely intelligible."]},rec:["Eating will be limited to liquids and soft foods for a while","Speech affected — slurred, mumbled, painful to talk","Jaw may need to be wired or splinted — limits RP interactions in interesting ways"],drugs:["Cocaine paste to numb externally","Laudanum in drops under tongue — easier than swallowing pills with a broken jaw"]},
  tooth_damage:{sym:{1:["Tooth chipped, cracked, or knocked loose — sharp pain when breathing cold air","Blood in mouth, tender gums"],2:["Tooth knocked out entirely — socket bleeding, gap visible","Multiple teeth damaged, mouth full of blood"]},doEx:{1:["/do Spits blood. Tonguing a cracked tooth, wincing. Gap visible when they talk."],2:["/do Spits out a tooth (or pieces). Blood filling their mouth. Jaw tender."]},rec:["Missing teeth are permanent in this era — no implants","Affects eating, speech, and appearance","A gap-toothed grin tells a story"],drugs:["Clove oil or cocaine paste for tooth pain","Laudanum if multiple teeth affected"]},
  crush_injury:{sym:{1:["Severe bruising, swelling, throbbing pain"],2:["Bones cracked or shattered, skin split, blood blisters","Can't use the affected hand/foot, extreme swelling"],3:["Tissue destroyed, bones pulverized, skin degloving possible","May require amputation of affected digits"]},doEx:{1:["/do Their {z} is badly swollen and bruised. Deep purple. Throbbing. Can barely move it."],2:["/do Their {z} is crushed — bones cracked, skin split. Swelling rapidly. Can't move it at all."]},rec:["Crushed fingers/toes may need amputation if bones are destroyed","Permanent loss of dexterity or balance depending on what's lost","Healing is slow — the tissue damage goes deep"],drugs:["Morphine for severe crush injuries","Ether if amputation needed"]},
  frostbite:{sym:{1:["Skin white/grayish, numb, waxy feeling","Tingling as warming begins — then burning pain"],2:["Skin darkening, blisters forming, hard/frozen texture","No feeling in the area, tissue dying"],3:["Tissue black and dead — gangrene setting in","Amputation likely necessary"]},doEx:{1:["/do Their {z} is white and waxy. Numb — they can't feel it. As warmth returns, they hiss in pain."],2:["/do Their {z} is darkening, blistered. Hard to the touch. No feeling. Tissue is dying."]},rec:["Gradual rewarming — do NOT apply direct heat","Blisters should not be popped","Blackened tissue = gangrene = amputation territory","Nerve damage may be permanent even if tissue survives"],drugs:["Aspirin or phenacetin for pain during rewarming","Morphine if tissue is dying — the thawing pain is severe"]},
};

// ═══════════════════════════════════════════════════════════════════════════════
// ILLNESSES
// ═══════════════════════════════════════════════════════════════════════════════
const ILL={
  tuberculosis:{l:"Tuberculosis",i:"🫁",sym:["Persistent cough 2+ weeks","Coughing blood","Chest pain, fatigue","Weight loss","Fever, chills, night sweats","Swollen neck glands"],doEx:["/do Hacking wet cough, blood on cloth. Gaunt, pale.","/do Rattling chest. Thin, feverish."],rec:"Chronic. Blue mask has no end date. Good days and bad days.",drugs:["Belladonna vapors — not addictive","Environmental treatment mostly"],fol:["Bright BLUE mask — permanent, mandatory","Citizen record updated","Stay outdoors, light exercise"]},
  scarlet_fever:{l:"Scarlet Fever",i:"🤒",sym:["Red sore throat","Strawberry tongue","High fever","Sandpaper rash that peels","Red skin in creases","Swollen glands"],doEx:["/do Throat raw. Tongue white. Sandpaper rash. Feverish."],rec:"Mask ~2 weeks. Contagious.",drugs:["Herbal — low risk"],fol:["Mask (NOT blue) ~2 weeks","Peeling skin, scratchy voice"]},
  cholera:{l:"Cholera",i:"💧",sym:["Severe vomiting, fluid loss","Rapid heart rate","Extreme thirst","Muscle cramps","Shock/death in hours if untreated"],doEx:["/do Violently ill. Dehydrated, skin slack."],rec:"Fatal in hours without hydration. Few days if caught.",drugs:["Hydration only — no drug risk"],fol:["Keep drinking constantly"]},
  dysentery:{l:"Dysentery",i:"🤢",sym:["High fever","Gut cramping","Abdominal swelling","Bloody diarrhea"],doEx:["/do Doubled over, gut cramps. Feverish, weak."],rec:"Rest and hydration. Days to a week.",drugs:["Aspirin — non-addictive"],fol:["Boil your water"]},
  influenza:{l:"Influenza",i:"🤧",sym:["Fever, headaches","Fatigue, joint aches","Runny nose","Sore throat, coughing"],doEx:["/do Sniffling, coughing, aching everywhere."],rec:"1-2 weeks isolation.",drugs:["Aspirin, herbal remedies"],fol:["Mask for duration","Stay isolated"]},
  chickenpox:{l:"Chickenpox",i:"🔴",sym:["Fever, fatigue","Rash: bumps→blisters→scabs","SEVERE itching","Adults worse than kids"],doEx:["/do Covered in spots. Miserable. Scratching."],rec:"~2 weeks. Immune after. Scarring possible.",drugs:["Topical only"],fol:["DO NOT SCRATCH","Immune for life"]},
  smallpox:{l:"Smallpox",i:"⚠️",sym:["Fever, vomiting","Mouth ulcers","Dimpled blisters→scabs→scars","~30% fatal","Can blind"],doEx:["/do Dimpled blisters. Feverish, vomiting. Terrified."],rec:"~3 in 10 die. Permanent scars. Possible blindness.",drugs:["No treatment — rest and isolation"],fol:["Permanent scars","Possible blindness","Prevention: variolation/vaccination"]},
  measles:{l:"Measles",i:"🔴",sym:["Fever, body aches","Dry cough","Red swollen eyes","Light sensitivity","Red-brown rash"],doEx:["/do Blotchy rash. Red watering eyes. Shielding from light."],rec:"Keep warm. Immune after.",drugs:["Phenacetin (excess = dizziness/seizures)","Belladonna for cough"],fol:["Stay warm","Light sensitivity, coughing"]},
  rabies:{l:"Rabies",i:"🐺",sym:["Fever","Excess drooling","Confusion→aggression","Can't drink despite thirst","Loss of balance"],doEx:["/do Drooling, wild-eyed. Snapping. Can't drink. Feral."],rec:"NO recovery. 100% fatal once symptomatic. Get vaccine BEFORE symptoms.",drugs:["Vaccine prevents — can't cure","Morphine for euthanasia"],fol:["End-of-life once symptomatic","If bitten: GET VACCINE NOW"]},
  poisoning:{l:"Poisoning",i:"☠️",sym:["Nausea, vomiting","Hallucinations possible","Unconsciousness or seizures"],doEx:["/do Violently ill, vomiting, disoriented."],rec:"Depends on poison. Hours to days.",drugs:["Charcoal, fluids — no addiction risk"],fol:["Stay hydrated","Someone may have poisoned you"]},
  hypothermia:{l:"Hypothermia",i:"🥶",sym:["Shivering (stops when severe)","Slurred speech","Slow breathing","Confusion→unconsciousness"],doEx:["/do Shivering, lips blue, slurring. Stumbling."],rec:"Gradual rewarming over hours.",drugs:["Warmth and fluids only"],fol:["Stay warm and dry"]},
  hyperthermia:{l:"Heat Stroke",i:"🥵",sym:["Heavy sweating","Red hot skin","Erratic pulse","Nausea, headache, confusion"],doEx:["/do Flushed, burning hot. Barely coherent."],rec:"Hours to stabilize.",drugs:["Cooling and hydration only"],fol:["Small sips — not all at once"]},
};

// ═══════════════════════════════════════════════════════════════════════════════
// JOURNAL DATA — all injuries + illnesses as flat searchable list
// ═══════════════════════════════════════════════════════════════════════════════
const JOURNAL = [
  ...Object.entries(OD).map(([k,v])=>({id:k,type:"injury",label:IT[k]?.l||k,icon:IT[k]?.i||"",data:v,cat:"Injuries"})),
  ...Object.entries(ILL).map(([k,v])=>({id:k,type:"illness",label:v.l,icon:v.i,data:v,cat:"Illnesses"})),
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════
function Body({back,markers,act,onClick}){
  const ref=useRef(null);
  const vis=Z.filter(z=>back?z.bo:!z.bo);
  const hnd=(e)=>{const svg=ref.current;if(!svg)return;const pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;const sp=pt.matrixTransform(svg.getScreenCTM().inverse());let b=null,bd=99;vis.forEach(z=>{const d=Math.hypot(sp.x-z.x,sp.y-z.y);if(d<z.r+18&&d<bd){b=z;bd=d;}});if(b)onClick(b,sp.x,sp.y);};
  // Clean medical diagram style
  const S="#6b6b6b", F="rgba(240,240,240,0.5)", LT="#b0b0b0";
  return(
    <svg ref={ref} viewBox="0 0 300 510" onClick={hnd} style={{width:"100%",maxWidth:260,height:"auto",cursor:"crosshair",userSelect:"none"}}>
      <defs>
        <radialGradient id="hg"><stop offset="0%" stopColor="#b22222" stopOpacity=".4"/><stop offset="100%" stopColor="#b22222" stopOpacity="0"/></radialGradient>
        <filter id="gl"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      {back ? (<g>
        {/* BACK — clean outline */}
        <path d={`M150,15 C135,15 126,28 126,45 C126,65 132,78 140,88 L142,92 L142,108
          L112,118 Q100,122 96,132 L92,152 L90,180 L94,208 L102,240 L112,265 L122,280
          L128,290 L130,320 L132,350 L131,375 L130,405 L128,440 L126,460 L124,475 L119,488 L111,495 L126,498 L132,490 L136,470 L138,445 L140,410 L143,370 L146,330 L150,290
          L154,330 L157,370 L160,410 L162,445 L164,470 L168,490 L174,498 L189,495 L181,488 L176,475 L174,460 L172,440 L170,405 L169,375 L168,350 L170,320 L172,290
          L178,280 L188,265 L198,240 L206,208 L210,180 L208,152 L204,132 Q200,122 188,118
          L158,108 L158,92 L160,88 C168,78 174,65 174,45 C174,28 165,15 150,15Z`}
          fill={F} stroke={S} strokeWidth="1.2" strokeLinejoin="round"/>
        {/* Spine */}
        <line x1="150" y1="108" x2="150" y2="280" stroke={LT} strokeWidth="0.8" strokeDasharray="4,6" opacity="0.5"/>
        {/* Scapulae hints */}
        <path d="M130,135 Q122,152 128,170" fill="none" stroke={LT} strokeWidth="0.6" opacity="0.35"/>
        <path d="M170,135 Q178,152 172,170" fill="none" stroke={LT} strokeWidth="0.6" opacity="0.35"/>
        {/* Buttock line */}
        <path d="M135,275 Q150,285 165,275" fill="none" stroke={LT} strokeWidth="0.5" opacity="0.3"/>
        <text x="150" y="8" textAnchor="middle" fontSize="9" fill={LT} fontFamily="Georgia,serif" fontWeight="bold">BACK</text>
      </g>) : (<g>
        {/* FRONT — full body outline as single clean path */}
        <path d={`M150,15 C135,15 126,28 126,45 C126,58 128,68 132,76
          L126,62 C121,58 118,54 117,60 C116,66 118,70 122,70 L126,68 L130,76
          C132,80 136,87 140,90 L143,93 L143,108
          L112,118 Q100,122 96,132
          L94,142 L90,160 Q86,172 84,182 L78,192 Q75,196 76,200
          L72,215 L66,235 L60,252 L54,264
          Q50,270 49,274 L47,278 Q44,284 48,288 Q50,290 54,288 L56,284 Q58,280 60,274
          L55,282 Q52,290 54,296 Q56,300 60,298 L62,292 Q64,284 66,276
          L60,288 Q58,298 60,304 Q62,308 66,306 L68,298 Q70,288 72,276
          L68,288 Q66,296 68,302 Q70,306 74,302 L74,294 L76,278
          L73,286 Q72,292 74,296 Q76,298 78,294 L80,282
          L82,270 L86,254 L92,234 L100,210 Q104,196 106,186 L108,170
          L112,150 L116,136 L116,200 L114,236 L120,262 L128,280
          L138,290 L142,310 L140,340 L138,370 L136,400 L134,430 L132,455
          L128,470 L122,482 L115,490 Q110,494 108,496
          L126,500 L132,494 L136,478 L140,455 L143,420 L146,380 L148,340 L150,300
          L152,340 L154,380 L157,420 L160,455 L164,478 L168,494 L174,500
          L192,496 Q190,494 185,490 L178,482 L172,470 L168,455 L166,430 L164,400
          L162,370 L160,340 L158,310 L162,290 L172,280
          L180,262 L186,236 L184,200 L184,136 L188,150
          L192,170 L194,186 Q196,196 200,210 L208,234 L218,254 L220,270
          L222,282 L224,294 Q226,298 228,296 Q230,292 228,286 L224,278
          L226,302 Q228,306 232,306 Q234,308 236,298 L234,288 L228,276
          L232,292 Q234,300 238,298 Q240,296 240,288 L236,276
          L240,284 Q242,290 246,288 Q248,286 246,278
          L244,274 Q242,270 240,264
          L234,252 L228,235 L224,215 Q220,200 222,196 L218,182 Q216,172 210,160
          L206,142 L204,132 Q200,122 188,118
          L157,108 L157,93 L160,90
          C164,87 168,80 170,76 L174,68 L178,70 C182,70 184,66 183,60 C182,54 179,58 174,62
          L168,76 C172,68 174,58 174,45 C174,28 165,15 150,15Z`}
          fill={F} stroke={S} strokeWidth="1.2" strokeLinejoin="round"/>
        {/* Eyes */}
        <ellipse cx="141" cy="55" rx="5" ry="3" fill="none" stroke={S} strokeWidth="0.8"/>
        <ellipse cx="159" cy="55" rx="5" ry="3" fill="none" stroke={S} strokeWidth="0.8"/>
        <circle cx="141" cy="55" r="1.5" fill={S} opacity="0.4"/>
        <circle cx="159" cy="55" r="1.5" fill={S} opacity="0.4"/>
        {/* Nose */}
        <path d="M150,60 L148,68 Q150,70 152,68Z" fill="none" stroke={S} strokeWidth="0.7"/>
        {/* Mouth */}
        <path d="M145,76 Q150,79 155,76" fill="none" stroke={S} strokeWidth="0.7"/>
        {/* Navel */}
        <circle cx="150" cy="235" r="1.5" fill="none" stroke={LT} strokeWidth="0.6" opacity="0.5"/>
        {/* Nipple hints */}
        <circle cx="136" cy="148" r="1" fill={LT} opacity="0.3"/>
        <circle cx="164" cy="148" r="1" fill={LT} opacity="0.3"/>
        {/* Knee caps */}
        <ellipse cx="134" cy="370" rx="5" ry="6" fill="none" stroke={LT} strokeWidth="0.5" opacity="0.35"/>
        <ellipse cx="166" cy="370" rx="5" ry="6" fill="none" stroke={LT} strokeWidth="0.5" opacity="0.35"/>
        <text x="150" y="8" textAnchor="middle" fontSize="9" fill={LT} fontFamily="Georgia,serif" fontWeight="bold">FRONT</text>
      </g>)}

      {/* Zone hit areas — invisible */}
      {vis.map(z=><circle key={z.id} cx={z.x} cy={z.y} r={z.r} fill="transparent" stroke="none"/>)}

      {/* Injury markers */}
      {markers.map((m,i)=>{const z=Z.find(zn=>zn.id===m.zid);if(!z)return null;const cx=m.cx||z.x,cy=m.cy||z.y;return(<g key={i}><circle cx={cx} cy={cy} r={18} fill="url(#hg)"><animate attributeName="r" values="16;22;16" dur="2s" repeatCount="indefinite"/></circle><circle cx={cx} cy={cy} r={9} fill={i===act?"#cd853f":"#b22222"} stroke="#fff" strokeWidth="2" filter="url(#gl)"/><text x={cx} y={cy+3.5} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fff" fontFamily="Georgia">{i+1}</text></g>);})}
      {!markers.length&&<text x={150} y={505} textAnchor="middle" fontSize="10" fill="#8b7355" fontStyle="italic" fontFamily="Georgia">Click anywhere on the body</text>}
    </svg>
  );
}

const P=({children,style:s,...p})=><p style={{margin:"3px 0",fontSize:13,lineHeight:1.55,color:"#3d2b1f",fontFamily:"Georgia,serif",...(s||{})}} {...p}>{children}</p>;
const Code=({children})=><div style={{background:"rgba(107,143,60,0.08)",borderRadius:6,padding:"7px 11px",marginBottom:4,fontFamily:"'Courier New',monospace",fontSize:12,color:"#3d2b1f",lineHeight:1.45,whiteSpace:"pre-wrap"}}>{children}</div>;
function Sec({title,color,children,open:init=true}){const[o,sO]=useState(init);return(<div style={{marginBottom:11}}><button onClick={()=>sO(!o)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:5,padding:0,width:"100%",textAlign:"left"}}><span style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:13.5,fontWeight:"bold",color:color||"#3d2b1f"}}>{o?"▾":"▸"} {title}</span></button>{o&&<div style={{marginTop:4,paddingLeft:9,borderLeft:`3px solid ${color||"#c4a882"}`}}>{children}</div>}</div>);}
function AnatP({zone}){if(!zone)return null;const s=zone.sev,c=s>=4?"#b22222":s>=3?"#cd6600":s>=2?"#b8860b":"#6b8f3c";return(<div style={{background:"rgba(61,43,31,0.04)",border:"1px solid #ddd0bc",borderRadius:7,padding:"8px 10px",marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}><h4 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:13,margin:0}}>{zone.label}</h4><span style={{background:c,color:"#fff",padding:"1px 7px",borderRadius:10,fontSize:9,fontWeight:"bold",whiteSpace:"nowrap"}}>Danger: {s>=4?"Critical":s>=3?"High":s>=2?"Moderate":"Low"}</span></div><P style={{fontSize:11,fontStyle:"italic",color:"#5c4033",marginBottom:3}}>{zone.desc}</P><div style={{display:"flex",flexWrap:"wrap",gap:2}}>{zone.anat.map((a,i)=><span key={i} style={{background:"rgba(178,34,34,0.06)",border:"1px solid rgba(178,34,34,0.1)",borderRadius:10,padding:"1px 6px",fontSize:10,color:"#5c4033"}}>{a}</span>)}</div></div>);}

// ── JOURNAL TAB ──
function JournalTab({onJump}){
  const[search,setSearch]=useState("");
  const[filter,setFilter]=useState("all");
  const[expanded,setExpanded]=useState(null);
  const filtered=useMemo(()=>{
    let items=JOURNAL;
    if(filter==="injuries") items=items.filter(j=>j.type==="injury");
    if(filter==="illnesses") items=items.filter(j=>j.type==="illness");
    if(search.trim()) items=items.filter(j=>j.label.toLowerCase().includes(search.toLowerCase()));
    return items;
  },[search,filter]);

  return(<div>
    <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search injuries & illnesses..." style={{flex:1,minWidth:160,padding:"8px 10px",borderRadius:6,border:"1px solid #c4a882",background:"#faf3e8",fontFamily:"Georgia,serif",fontSize:13,color:"#3d2b1f"}}/>
      {["all","injuries","illnesses"].map(f=><button key={f} onClick={()=>setFilter(f)} style={{padding:"6px 12px",borderRadius:8,border:"1px solid #c4a882",background:filter===f?"#3d2b1f":"transparent",color:filter===f?"#f4e8d1":"#8b7355",fontSize:11,fontWeight:"bold",cursor:"pointer",fontFamily:"Georgia,serif",textTransform:"capitalize"}}>{f}</button>)}
    </div>
    <P style={{fontSize:11,color:"#8b7355",fontStyle:"italic",marginBottom:10}}>Click any entry to expand it. Full details from the State of Monroe Medical SOP.</P>
    <div style={{display:"flex",flexDirection:"column",gap:4}}>
      {filtered.map(j=>{
        const isOpen=expanded===j.id;
        const d=j.data;
        return(<div key={j.id} style={{border:"1px solid "+(isOpen?"#cd853f":"#ddd0bc"),borderRadius:8,background:isOpen?"rgba(205,133,63,0.06)":"rgba(61,43,31,0.02)",overflow:"hidden",transition:"all 0.15s"}}>
          <button onClick={()=>setExpanded(isOpen?null:j.id)} style={{width:"100%",padding:"10px 12px",background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:8,textAlign:"left"}}>
            <span style={{fontSize:16}}>{j.icon}</span>
            <span style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:14,fontWeight:"bold",color:"#3d2b1f",flex:1}}>{j.label}</span>
            <span style={{fontSize:10,color:"#8b7355",background:"rgba(61,43,31,0.06)",padding:"2px 8px",borderRadius:10,textTransform:"capitalize"}}>{j.type}</span>
            <span style={{fontSize:12,color:"#8b7355"}}>{isOpen?"▾":"▸"}</span>
          </button>
          {isOpen&&(<div style={{padding:"0 12px 12px",borderTop:"1px solid #ddd0bc"}}>
            {j.type==="injury"?(<div style={{marginTop:8}}>
              <Sec title="Symptoms by Severity" color="#b8860b">{Object.entries(d.sym||{}).map(([sv,arr])=><div key={sv} style={{marginBottom:6}}><P style={{fontSize:11,fontWeight:"bold",color:SV[Math.min(parseInt(sv),5)-1]?.c||"#3d2b1f"}}>{SV[Math.min(parseInt(sv),5)-1]?.l||"Sev "+sv}:</P>{arr.map((s,i)=><P key={i} style={{fontSize:12,paddingLeft:8}}>• {s}</P>)}</div>)}</Sec>
              <Sec title="Example /do Lines" color="#6b8f3c">{Object.values(d.doEx||{}).flat().map((x,i)=><Code key={i}>{x}</Code>)}<P style={{fontStyle:"italic",fontSize:10.5,color:"#8b7355"}}>Replace {"{z}"} with your injury location. Add your character's voice.</P></Sec>
              <Sec title="Recovery" color="#cd6600">{(d.rec||[]).map((r,i)=><P key={i}>• {r}</P>)}</Sec>
              <Sec title="Drugs & Addiction" color="#b22222">{(d.drugs||[]).map((x,i)=><P key={i}>• {x}</P>)}</Sec>
            </div>):(<div style={{marginTop:8}}>
              <Sec title="Symptoms" color="#b8860b">{(d.sym||[]).map((s,i)=><P key={i}>• {s}</P>)}</Sec>
              <Sec title="Example /do Lines" color="#6b8f3c">{(d.doEx||[]).map((x,i)=><Code key={i}>{x}</Code>)}</Sec>
              <Sec title="Recovery" color="#cd6600"><P>{d.rec}</P>{(d.fol||[]).map((f,i)=><P key={i}>• {f}</P>)}</Sec>
              <Sec title="Drugs & Addiction" color="#b22222">{(d.drugs||[]).map((x,i)=><P key={i}>• {x}</P>)}</Sec>
            </div>)}
          </div>)}
        </div>);
      })}
      {!filtered.length&&<P style={{textAlign:"center",color:"#8b7355",fontStyle:"italic",padding:20}}>No results found for "{search}"</P>}
    </div>
  </div>);
}

// ── QUICK REFERENCE TAB ──
const QREF = [
  { title:"🩸 Bleeding Types", items:[
    {name:"Arterial Bleed", desc:"Bright red blood, spurts in rhythm with heartbeat. Life-threatening. Needs immediate pressure.", doHint:'/do Bright red blood spurts from the wound in rhythmic pulses.'},
    {name:"Venous Bleed", desc:"Dark red blood, flows steadily (doesn't spurt). Serious but slower than arterial.", doHint:'/do Dark red blood oozes steadily from the wound, pooling beneath them.'},
    {name:"Capillary Bleed", desc:"Slow seeping from scrapes and shallow cuts. Blood wells up rather than flows. Minor.", doHint:'/do Blood wells up slowly from the scrape, beading along the surface.'},
  ]},
  { title:"💓 Pulse Types", items:[
    {name:"Strong / Normal", desc:"Steady, easy to find, regular rhythm. Patient is stable."},
    {name:"Weak / Thready", desc:"Hard to find, faint, feels like a thread under the fingers. Sign of blood loss or shock.", doHint:'/do Pulse is barely there — faint and fluttering. Hard to find.'},
    {name:"Rapid (Tachycardia)", desc:"Heart racing — over 100 beats per minute. Body is compensating for blood loss, pain, or fever.", doHint:'/do Heart hammering fast. Pulse racing under the fingers.'},
    {name:"Slow (Bradycardia)", desc:"Heart beating too slowly. Can indicate head injury, hypothermia, or severe shock.", doHint:'/do Pulse is slow and sluggish. Worryingly so.'},
    {name:"Irregular", desc:"Skipping beats or uneven rhythm. Could indicate heart trauma or drug effects.", doHint:'/do Pulse is uneven — skipping, pausing, then racing to catch up.'},
    {name:"Absent", desc:"No pulse. The patient is dead or dying.", doHint:'/do No pulse. Nothing.'},
  ]},
  { title:"😰 Signs of Shock", items:[
    {name:"Early Shock", desc:"Pale, cool, clammy skin. Rapid pulse. Anxious, restless. Thirsty.", doHint:'/do Skin pale and cold to the touch. Clammy with sweat. Eyes darting, restless. Asking for water.'},
    {name:"Progressive Shock", desc:"Confused, disoriented. Rapid shallow breathing. Weak pulse. Skin turning grayish.", doHint:"/do Confused, can't focus. Breathing fast and shallow. Skin going gray. Barely tracking what's happening."},
    {name:"Late Shock", desc:"Unresponsive. Bluish lips and fingertips. Pulse barely detectable. Near death.", doHint:'/do Unresponsive. Lips blue. Skin cold and waxy. Pulse almost gone.'},
  ]},
  { title:"🤢 Signs of Infection", items:[
    {name:"Early Infection", desc:"Redness around the wound. Warm to touch. Slight swelling. Mild pain increasing.", doHint:'/do The wound is red around the edges, warm to the touch. More painful than it should be.'},
    {name:"Moderate Infection", desc:"Yellowish discharge or pus. Fever. Swollen lymph nodes. Red streaks spreading from wound.", doHint:"/do Yellowish pus oozing from the wound. Feverish. Red streaks spreading from the site."},
    {name:"Severe / Sepsis", desc:"Dark tissue, foul smell, blackening skin. High fever or sudden cold. Confusion. Necrosis or gangrene.", doHint:"/do The wound is black and rotting. Smells foul. Feverish one minute, ice cold the next. Delirious."},
  ]},
  { title:"🫁 Breathing Patterns", items:[
    {name:"Normal", desc:"12–20 breaths per minute. Steady, even, quiet."},
    {name:"Rapid / Shallow", desc:"Fast, barely filling the lungs. Sign of pain, shock, lung injury, or anxiety.", doHint:'/do Breathing fast and shallow — barely getting air. Each breath catches.'},
    {name:"Labored", desc:"Visible effort. Using neck and shoulder muscles to breathe. Flaring nostrils. Gasping.", doHint:"/do Every breath is a fight. Shoulders heaving, nostrils flaring. Struggling for air."},
    {name:"Gurgling / Wet", desc:"Wet, bubbling sounds. Fluid in the lungs or airway — blood, water, or mucus.", doHint:'/do A wet gurgling with every breath. Something is in their lungs.'},
    {name:"Wheezing", desc:"High-pitched whistling on exhale. Airway narrowing from swelling, asthma, or smoke.", doHint:'/do A thin whistling wheeze with every exhale. Airway tightening.'},
    {name:"Absent / Agonal", desc:"Gasping, fish-out-of-water breaths with long pauses, or no breathing at all. Dying.", doHint:"/do Gasping — long pauses between breaths. Each one could be the last."},
  ]},
  { title:"🧠 Consciousness Levels", items:[
    {name:"Alert", desc:"Awake, oriented, knows who/where/when they are. Responds normally."},
    {name:"Verbal", desc:"Eyes closed but responds to voice. May be confused or slow to answer.", doHint:"/do Eyes flutter open when spoken to. Mumbles a response. Drifts off again."},
    {name:"Pain", desc:"Only responds to physical stimulus — pinching, shaking. No verbal response.", doHint:"/do No response to voice. Flinches when pinched but eyes don't open. Groans."},
    {name:"Unresponsive", desc:"No response to anything. Completely unconscious.", doHint:"/do Nothing. No response to voice, touch, or pain. Limp."},
  ]},
  { title:"📏 Pain Scale Descriptors", items:[
    {name:"1–2: Mild", desc:"Noticeable but not distracting. Can carry on conversation normally.", doHint:"/do Winces slightly but waves it off. 'It's nothing.'"},
    {name:"3–4: Moderate", desc:"Distracting. Hard to ignore. Affects concentration.", doHint:"/do Gritting teeth. Trying to focus but the pain keeps pulling their attention."},
    {name:"5–6: Severe", desc:"Hard to do anything else. Groaning, guarding the injury. Conversation is difficult.", doHint:"/do Can barely speak through the pain. Groaning. Holding the wound protectively."},
    {name:"7–8: Intense", desc:"Overwhelms most other thoughts. Crying out. May hyperventilate.", doHint:"/do Crying out. Can't hold still. Pain is overwhelming everything else."},
    {name:"9–10: Unbearable", desc:"Screaming, incoherent, or going silent from shock. May lose consciousness.", doHint:"/do Screaming — or worse, gone silent. Eyes rolling back. Body shutting down from pain."},
  ]},
  { title:"🎨 Skin Color Quick Reference", items:[
    {name:"Pale / Ashen", desc:"Blood loss, shock, fear, or cold. Blood leaving the surface."},
    {name:"Flushed / Red", desc:"Fever, heat stroke, exertion, or alcohol. Blood rushing to the surface."},
    {name:"Bluish (Cyanosis)", desc:"Not enough oxygen. Lips, fingertips, around the eyes. Choking, lung failure, or heart failure."},
    {name:"Yellow (Jaundice)", desc:"Liver damage. Eyes and skin take on a yellowish tint."},
    {name:"Gray / Waxy", desc:"Severe shock, near death. Body is shutting down."},
    {name:"Mottled / Blotchy", desc:"Uneven patches of pale and dark. Late-stage shock or hypothermia."},
  ]},
];

function QuickRefTab(){
  const[open,setOpen]=useState(null);
  return(<div>
    <P style={{fontSize:11,color:"#8b7355",fontStyle:"italic",marginBottom:10}}>Quick-lookup cards for describing injuries in /do and /me. Tap a category to expand.</P>
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      {QREF.map((cat,ci)=>{
        const isOpen=open===ci;
        return(<div key={ci} style={{border:`1px solid ${isOpen?"#cd853f":"#ddd0bc"}`,borderRadius:8,background:isOpen?"rgba(205,133,63,.05)":"rgba(61,43,31,.02)",overflow:"hidden"}}>
          <button onClick={()=>setOpen(isOpen?null:ci)} style={{width:"100%",padding:"10px 12px",background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",textAlign:"left"}}>
            <span style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:14,fontWeight:"bold",color:"#3d2b1f"}}>{cat.title}</span>
            <span style={{fontSize:11,color:"#8b7355"}}>{isOpen?"▾":"▸"}</span>
          </button>
          {isOpen&&<div style={{padding:"0 12px 12px",borderTop:"1px solid #ddd0bc"}}>
            {cat.items.map((item,ii)=>(
              <div key={ii} style={{padding:"8px 0",borderBottom:ii<cat.items.length-1?"1px solid rgba(196,168,130,.3)":"none"}}>
                <P style={{fontWeight:"bold",fontSize:12.5,marginBottom:2}}>{item.name}</P>
                <P style={{fontSize:11.5,color:"#5c4033"}}>{item.desc}</P>
                {item.doHint&&<Code>{item.doHint}</Code>}
              </div>
            ))}
          </div>}
        </div>);
      })}
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App(){
  const[injs,setInjs]=useState([]);
  const[act,setAct]=useState(0);
  const[ill,setIll]=useState("");
  const[oSv,setOSv]=useState(null);
  const[bk,setBk]=useState(false);
  const[tab,setTab]=useState("injuries");

  const val=injs.filter(i=>i.zid&&i.type);
  const sug=cSev(val);
  const eff=oSv||sug;

  const bClick=useCallback((zone,cx,cy)=>{setInjs(p=>{if(p.length<3){const n=[...p,{zid:zone.id,type:"",cx,cy}];setAct(n.length-1);return n;}return p.map((x,i)=>i===act?{zid:zone.id,type:"",cx,cy}:x);});},[act]);

  const sel={width:"100%",padding:"7px 9px",borderRadius:6,border:"1px solid #c4a882",background:"#faf3e8",fontFamily:"Georgia,serif",fontSize:12.5,color:"#3d2b1f",appearance:"auto"};
  const has=val.length>0||ill;

  return(<div style={{minHeight:"100vh",background:"#faf3e8",fontFamily:"Georgia,serif",color:"#3d2b1f"}}>
    <div style={{background:"linear-gradient(180deg,#3d2b1f,#5c4033)",padding:"18px 12px 14px",textAlign:"center",borderBottom:"4px solid #c4a882",position:"relative"}}>
      <div style={{position:"absolute",inset:0,opacity:.05,backgroundImage:"repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,255,255,.1) 10px,rgba(255,255,255,.1) 11px)"}}/>
      <h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:21,color:"#f4e8d1",margin:0,letterSpacing:2,textTransform:"uppercase",fontWeight:900}}>⚕ Casualty's Field Guide ⚕</h1>
      <p style={{color:"#c4a882",fontSize:10,margin:"3px 0 0",letterSpacing:3,textTransform:"uppercase"}}>Ranch Roleplay — State of Monroe</p>
      <p style={{color:"#a08968",fontSize:10.5,margin:"5px auto 0",fontStyle:"italic",maxWidth:440,lineHeight:1.5}}>Click where you're hurt. See what's underneath. Get RP guidance. Your starting point — not a script.</p>
    </div>

    <div style={{display:"flex",background:"#efe3d0",borderBottom:"2px solid #c4a882"}}>
      {[["injuries","🩸 Injuries"],["illness","🤒 Illness"],["journal","📖 Journal"],["quickref","🔍 Quick Ref"]].map(([k,l])=>
        <button key={k} onClick={()=>setTab(k)} style={{flex:1,padding:"8px 0",background:tab===k?"#faf3e8":"transparent",border:"none",borderBottom:tab===k?"3px solid #cd853f":"3px solid transparent",color:tab===k?"#3d2b1f":"#8b7355",fontFamily:"Georgia,serif",fontSize:12.5,fontWeight:tab===k?"bold":"normal",cursor:"pointer"}}>{l}</button>
      )}
    </div>

    <div style={{padding:"12px 10px 80px"}}>
      {tab==="injuries"?(<>
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
          <div style={{flex:"0 0 auto",display:"flex",flexDirection:"column",alignItems:"center",background:"rgba(61,43,31,.03)",borderRadius:12,padding:"8px 4px",border:"1px solid #ddd0bc"}}>
            <div style={{display:"flex",gap:3,marginBottom:5}}>{[["Front",false],["Back",true]].map(([l,v])=><button key={l} onClick={()=>setBk(v)} style={{padding:"3px 10px",borderRadius:10,border:"1px solid #c4a882",background:bk===v?"#3d2b1f":"transparent",color:bk===v?"#f4e8d1":"#8b7355",fontSize:10,fontWeight:"bold",cursor:"pointer",fontFamily:"Georgia,serif"}}>{l}</button>)}</div>
            <Body back={bk} markers={injs.filter(i=>i.zid)} act={act} onClick={bClick}/>
          </div>
          <div style={{flex:1,minWidth:220,display:"flex",flexDirection:"column",gap:6}}>
            {!injs.length&&<div style={{textAlign:"center",padding:"24px 12px",color:"#8b7355"}}><p style={{fontSize:24,margin:"0 0 5px"}}>👆</p><P style={{fontStyle:"italic",color:"#8b7355"}}>Click anywhere on the body to place an injury.</P><P style={{fontSize:10,color:"#a08968"}}>Up to 3.</P></div>}
            {injs.map((inj,i)=>{const zone=Z.find(z=>z.id===inj.zid);const avail=zone?gzi(zone):[];const isA=act===i;
              return(<div key={i} onClick={()=>setAct(i)} style={{background:isA?"rgba(205,133,63,.08)":"rgba(61,43,31,.02)",border:`2px solid ${isA?"#cd853f":"#ddd0bc"}`,borderRadius:9,padding:"9px 10px",cursor:"pointer",transition:"all .15s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                  <span style={{fontFamily:"'Playfair Display',Georgia,serif",fontWeight:"bold",fontSize:12.5}}><span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:17,height:17,borderRadius:"50%",background:"#b22222",color:"#fff",fontSize:9.5,fontWeight:"bold",marginRight:4}}>{i+1}</span>{zone?.label||"—"}</span>
                  <button onClick={e=>{e.stopPropagation();setInjs(p=>p.filter((_,j)=>j!==i));setAct(a=>Math.max(0,a>=i?a-1:a));}} style={{background:"none",border:"none",color:"#b22222",cursor:"pointer",fontSize:15,fontWeight:"bold",lineHeight:1}}>×</button>
                </div>
                {zone&&<AnatP zone={zone}/>}
                {zone&&<select value={inj.type||""} onChange={e=>{setInjs(p=>p.map((x,j)=>j===i?{...x,type:e.target.value}:x));}} onClick={e=>e.stopPropagation()} style={sel}><option value="">— What happened here? —</option>{avail.map(k=><option key={k} value={k}>{IT[k]?.i} {IT[k]?.l}</option>)}</select>}
                {inj.type&&IT[inj.type]&&(()=>{const t=IT[inj.type];const sv=Math.min(5,Math.max(1,t.bs+(zone?.sev||0)));const si=SV[sv-1];return<div style={{marginTop:5,display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:9.5,color:"#8b7355"}}>Severity:</span><span style={{background:si.c,color:"#fff",padding:"1px 6px",borderRadius:10,fontSize:9.5,fontWeight:"bold"}}>{si.l}</span><span style={{fontSize:8.5,color:"#a08968"}}>({si.t})</span></div>;})()}
              </div>);
            })}
            {injs.length>0&&injs.length<3&&<P style={{fontSize:9.5,color:"#8b7355",fontStyle:"italic",textAlign:"center"}}>Click body to add another ({injs.length}/3)</P>}
          </div>
        </div>
        {val.length>0&&<div style={{marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}><span style={{fontSize:11.5,fontWeight:"bold"}}>Overall Severity:</span><span style={{background:SV[eff-1].c,color:"#fff",padding:"1px 8px",borderRadius:10,fontSize:10,fontWeight:"bold"}}>{SV[eff-1].l}</span>{oSv&&<button onClick={()=>setOSv(null)} style={{background:"none",border:"none",color:"#8b7355",cursor:"pointer",fontSize:9.5,fontStyle:"italic",textDecoration:"underline"}}>Reset</button>}</div>
          <div style={{display:"flex",gap:2}}>{SV.map(s=><button key={s.v} onClick={()=>setOSv(s.v===sug?null:s.v)} style={{flex:1,padding:"3px 0",border:`2px solid ${s.v===eff?s.c:"transparent"}`,borderRadius:5,background:s.v<=eff?s.c:"rgba(61,43,31,.05)",color:s.v<=eff?"#fff":"#8b7355",cursor:"pointer",fontSize:9,fontWeight:"bold",fontFamily:"Georgia,serif",opacity:s.v<=eff?1:.4}}>{s.l}</button>)}</div>
          <P style={{fontSize:9,color:"#a08968",fontStyle:"italic"}}>Suggested: {SV[sug-1].l}. Click to adjust.</P>
        </div>}
      </>):tab==="illness"?(<div style={{marginBottom:14}}>
        <select value={ill} onChange={e=>setIll(e.target.value)} style={{...sel,fontSize:13.5,padding:"9px 11px"}}><option value="">— Pick an illness or condition —</option>{Object.entries(ILL).map(([k,v])=><option key={k} value={k}>{v.i} {v.l}</option>)}</select>
      </div>):tab==="quickref"?(<QuickRefTab/>):(<JournalTab/>)}

      {/* OUTPUT */}
      {has&&tab!=="journal"&&tab!=="quickref"&&(<div style={{background:"#fff9f0",border:"2px solid #c4a882",borderRadius:12,padding:"14px 11px",boxShadow:"0 2px 8px rgba(61,43,31,.06)"}}>
        <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:17,margin:"0 0 10px",paddingBottom:8,borderBottom:"2px solid #c4a882"}}>📋 Your RP Guide</h2>
        {val.length>1&&<div style={{background:"rgba(178,34,34,.04)",borderRadius:7,padding:"7px 9px",marginBottom:10,border:"1px solid rgba(178,34,34,.1)"}}><P style={{fontWeight:"bold",color:SV[eff-1].c}}>Multiple Injuries — {SV[eff-1].l}</P><P style={{fontSize:11,fontStyle:"italic",color:"#5c4033"}}>With {val.length} injuries, compound effects add depth. Doc will likely triage the most dangerous first.</P></div>}

        {val.map((inj,i)=>{const zone=Z.find(z=>z.id===inj.zid);const data=OD[inj.type];if(!data||!zone)return null;
          const sv=oSv||Math.min(5,Math.max(1,(IT[inj.type]?.bs||1)+zone.sev));const si=SV[Math.min(sv,5)-1];
          const syms=gfs(data.sym,sv);const dos=gfs(data.doEx,sv).map(x=>x.replace(/\{z\}/g,zone.label.toLowerCase()));
          return(<div key={i} style={{marginBottom:14,paddingBottom:14,borderBottom:"1px dashed #c4a882"}}>
            <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:7,flexWrap:"wrap"}}><span style={{fontSize:15}}>{IT[inj.type]?.i}</span><span style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:14,fontWeight:"bold"}}>{IT[inj.type]?.l}</span><span style={{fontSize:10.5,color:"#8b7355"}}>— {zone.label}</span><span style={{background:si.c,color:"#fff",padding:"1px 6px",borderRadius:10,fontSize:9,fontWeight:"bold"}}>{si.l}</span></div>
            <div style={{background:"rgba(85,107,47,.05)",borderRadius:5,padding:"6px 9px",marginBottom:7}}><P style={{fontSize:10,fontWeight:"bold",color:"#556b2f"}}>Under the skin:</P><P style={{fontSize:11}}>{zone.anat.join(" · ")}</P><P style={{fontSize:10,fontStyle:"italic",color:"#8b7355"}}>{zone.desc}</P></div>
            <Sec title="Symptoms to Roleplay" color="#b8860b">{syms.map((s,j)=><P key={j}>• {s}</P>)}</Sec>
            <Sec title="Example /do Responses" color="#6b8f3c">{dos.map((x,j)=><Code key={j}>{x}</Code>)}<P style={{fontStyle:"italic",fontSize:10.5,color:"#8b7355"}}>Starting points — add your character's voice.</P></Sec>
            <Sec title="Recovery & Follow-Up" color="#cd6600"><P style={{fontWeight:"bold"}}>Recovery: {si.t}</P><P>{si.d}</P>{data.rec?.map((r,j)=><P key={j}>• {r}</P>)}</Sec>
            <Sec title="Drugs & Addiction" color="#b22222">{data.drugs?.map((d,j)=><P key={j}>• {d}</P>)}</Sec>
          </div>);
        })}

        {ill&&ILL[ill]&&(()=>{const il=ILL[ill];return(<div style={{marginBottom:14,paddingBottom:14,borderBottom:"1px dashed #c4a882"}}><div style={{display:"flex",alignItems:"center",gap:5,marginBottom:7}}><span style={{fontSize:15}}>{il.i}</span><span style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:14,fontWeight:"bold"}}>{il.l}</span></div>
          <Sec title="Symptoms" color="#b8860b">{il.sym.map((s,i)=><P key={i}>• {s}</P>)}</Sec>
          <Sec title="Example /do" color="#6b8f3c">{il.doEx.map((x,i)=><Code key={i}>{x}</Code>)}</Sec>
          <Sec title="Recovery" color="#cd6600"><P>{il.rec}</P>{(il.fol||[]).map((f,i)=><P key={i}>• {f}</P>)}</Sec>
          <Sec title="Drugs & Addiction" color="#b22222">{(il.drugs||[]).map((x,i)=><P key={i}>• {x}</P>)}</Sec>
        </div>);})()}

        <div style={{background:"rgba(61,43,31,.04)",borderRadius:7,padding:"9px 11px",marginTop:10,border:"1px solid #ddd0bc"}}>
          <h3 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:12.5,margin:"0 0 5px",color:"#5c4033"}}>💡 Tips & Ideas</h3>
          <P style={{fontSize:11}}>• <strong>Let the doc lead.</strong> Use /do to describe what they'd see — not what they should do.</P>
          <P style={{fontSize:11}}>• <strong>Small reactions go a long way.</strong> A flinch, gritting teeth, going quiet — try what feels right for your character.</P>
          <P style={{fontSize:11}}>• <strong>Recovery is RP gold.</strong> A limp, a sling, wincing when you reach — these details create follow-up scenes.</P>
          <P style={{fontSize:11}}>• <strong>The game tracks addiction.</strong> Laudanum, morphine, cocaine — in-game addiction may kick in. Could open interesting storylines if that appeals to you.</P>
          <P style={{fontSize:11}}>• <strong>Infection is a story.</strong> Skip follow-ups or keep wounds dirty? That's your next doc visit waiting to happen.</P>
          <P style={{fontSize:11}}>• <strong>The doc decides recovery time.</strong> Times here are SOP guidelines. Trust their call.</P>
          <P style={{fontSize:11}}>• <strong>None of this is mandatory.</strong> Use what works, ignore the rest. Your style is what makes it good RP.</P>
        </div>
      </div>)}

      {!has&&tab==="injuries"&&!injs.length&&<div style={{textAlign:"center",padding:"28px 14px",color:"#8b7355"}}><p style={{fontSize:26,margin:"0 0 6px"}}>⚕</p><P style={{fontSize:13,fontStyle:"italic",color:"#8b7355"}}>Click anywhere on the figure to get started.</P><P style={{fontSize:10.5,color:"#a08968"}}>A starting point for casualty RP — not a rulebook.</P></div>}
      {!ill&&tab==="illness"&&<div style={{textAlign:"center",padding:"28px 14px",color:"#8b7355"}}><p style={{fontSize:26,margin:"0 0 6px"}}>🤒</p><P style={{fontSize:13,fontStyle:"italic",color:"#8b7355"}}>Select an illness above to see symptoms, /do examples, and RP guidance.</P></div>}
    </div>
  </div>);
}
