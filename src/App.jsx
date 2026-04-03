import React, { useState, useCallback, useRef, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// ZONES
// ═══════════════════════════════════════════════════════════════════════════════
const Z = [
  {id:"crown",label:"Top of Head",x:150,y:9,r:14,anat:["Parietal bone (top of skull)","Brain (parietal lobe)"],sev:2,desc:"Thick bone but blunt force causes concussions. Scalp bleeds heavily — very vascular.",reg:"head",g:"Head"},
  {id:"forehead",label:"Forehead",x:148,y:24,r:11,anat:["Frontal bone (forehead plate) (thick)","Brain (frontal lobe)"],sev:2,desc:"Relatively thick bone offering decent protection, but hard hits fracture it or concuss the brain beneath.",reg:"head",g:"Head"},
  {id:"l_temple",label:"Left Temple",x:128,y:26,r:8,anat:["Temporal bone (side of skull) (thin)","Temporal artery","Brain (temporal lobe)"],sev:3,desc:"One of the thinnest skull areas. The temporal artery is just beneath. Trauma here is extremely dangerous.",reg:"head",g:"Head"},
  {id:"r_temple",label:"Right Temple",x:168,y:26,r:8,anat:["Temporal bone (side of skull) (thin)","Temporal artery","Brain (temporal lobe)"],sev:3,desc:"Thinnest skull area. Temporal artery beneath. Extremely dangerous to trauma.",reg:"head",g:"Head"},
  {id:"l_eye",label:"Left Eye",x:136,y:33,r:6,anat:["Eyeball","Optic nerve (carries vision to brain)","Orbital bone (eye socket ring)"],sev:2,desc:"The eye socket provides some bony protection, but the eye itself is extremely fragile. Damage can cause partial or total blindness.",reg:"head",g:"Head"},
  {id:"r_eye",label:"Right Eye",x:158,y:33,r:6,anat:["Eyeball","Optic nerve (carries vision to brain)","Orbital bone (eye socket ring)"],sev:2,desc:"The orbital bone shields the eye but direct trauma risks blindness.",reg:"head",g:"Head"},
  {id:"l_ear",label:"Left Ear",x:121,y:33,r:7,anat:["Ear canal","Eardrum","Inner ear (balance)"],sev:1,desc:"Outer ear tears easily and bleeds heavily. Eardrum damage from blasts or blows causes deafness or vertigo.",reg:"head",g:"Head"},
  {id:"r_ear",label:"Right Ear",x:172,y:33,r:7,anat:["Ear canal","Eardrum","Inner ear (balance)"],sev:1,desc:"Outer ear bleeds heavily when torn. Eardrum damage causes hearing loss and balance issues.",reg:"head",g:"Head"},
  {id:"nose",label:"Nose",x:147,y:43,r:7,anat:["Nasal bone (thin)","Nose cartilage (flexible part)","Sinuses","Blood vessels (rich supply)"],sev:1,desc:"The nasal bone breaks easily — one of the most common facial fractures. Bleeds heavily due to rich blood supply.",reg:"head",g:"Head"},
  {id:"mouth",label:"Mouth / Jaw",x:146,y:53,r:7,anat:["Jawbone","Teeth","Tongue","Oral blood vessels"],sev:1,desc:"The jaw can fracture or dislocate. Teeth can be knocked out or shattered.",reg:"head",g:"Head"},
  {id:"chin",label:"Chin",x:146,y:62,r:6,anat:["Mandible (jawbone tip)","Chin muscle"],sev:1,desc:"A hard hit to the chin transmits force into the jaw joint and skull, causing a knockout or concussion.",reg:"head",g:"Head"},
  {id:"l_neck",label:"Left Neck",x:133,y:78,r:7,anat:["Left carotid artery","Left jugular vein","Neck vertebrae (spine)"],sev:4,desc:"Carotid carries blood to the brain — severing it means death in minutes.",reg:"neck",g:"Neck"},
  {id:"r_neck",label:"Right Neck",x:158,y:78,r:7,anat:["Right carotid artery","Right jugular vein","Neck vertebrae (spine)"],sev:4,desc:"Carotid and jugular critically exposed. Spinal damage at this level can mean paralysis or death.",reg:"neck",g:"Neck"},
  {id:"throat",label:"Throat",x:145,y:82,r:6,anat:["Windpipe","Food pipe","Thyroid"],sev:3,desc:"Windpipe sits right at the surface with almost no protection.",reg:"neck",g:"Neck"},
  {id:"heart_area",label:"Upper Left Chest",x:111,y:118,r:14,anat:["Heart","Aorta","Left lung (upper)","Ribs 2-4"],sev:4,desc:"The heart and aorta. Damage to either is almost always fatal without immediate expert intervention.",reg:"chest",g:"Chest"},
  {id:"sternum",label:"Breastbone",x:145,y:120,r:10,anat:["Breastbone","Heart (behind)","Major vessels"],sev:3,desc:"Flat bone shielding the heart. A bullet punches through into the heart.",reg:"chest",g:"Chest"},
  {id:"ur_chest",label:"Upper Right Chest",x:179,y:118,r:14,anat:["Right lung (upper)","Collarbone blood vessels","Ribs 2-4"],sev:3,desc:"Right lung fills this space. Puncture causes lung collapse.",reg:"chest",g:"Chest"},
  {id:"lm_chest",label:"Left Mid Chest",x:102,y:158,r:12,anat:["Left lung (lower)","Ribs 5-8","Diaphragm (breathing muscle) edge"],sev:2,desc:"Lower left lung. Diaphragm begins here — damage affects breathing.",reg:"chest",g:"Chest"},
  {id:"rm_chest",label:"Right Mid Chest",x:188,y:158,r:12,anat:["Right lung (lower)","Ribs 5-8","Liver edge"],sev:2,desc:"Lower right lung. Liver peeks up under the ribs.",reg:"chest",g:"Chest"},
  {id:"ll_ribs",label:"Left Lower Ribs",x:98,y:194,r:11,anat:["Floating ribs 9-12","Spleen (behind)","Diaphragm (breathing muscle)"],sev:2,desc:"Floating ribs offer less protection. Spleen sits behind — blood-rich, ruptures easily.",reg:"chest",g:"Chest"},
  {id:"rl_ribs",label:"Right Lower Ribs",x:193,y:194,r:11,anat:["Floating ribs 9-12","Liver (behind)","Diaphragm (breathing muscle)"],sev:2,desc:"Liver behind the right lower ribs. Bleeds profusely when damaged.",reg:"chest",g:"Chest"},
  {id:"ul_abd",label:"Upper Left Abdomen",x:113,y:218,r:12,anat:["Spleen","Stomach","Pancreas (tail)","Left kidney (deep)"],sev:3,desc:"Spleen is fragile and blood-rich. Kidney tucked deep.",reg:"abdomen",g:"Abdomen"},
  {id:"ur_abd",label:"Upper Right Abdomen",x:177,y:218,r:12,anat:["Liver","Gallbladder","Right kidney (deep)","First section of small intestine"],sev:3,desc:"Dominated by the liver — massive and blood-filled.",reg:"abdomen",g:"Abdomen"},
  {id:"c_abd",label:"Center Abdomen",x:145,y:240,r:12,anat:["Small intestine","Main artery from the heart (deep)","Main vein to the heart"],sev:2,desc:"Intestines up front. Deep behind them, the aorta and vena cava.",reg:"abdomen",g:"Abdomen"},
  {id:"ll_abd",label:"Lower Left Abdomen",x:124,y:267,r:11,anat:["Large intestine (left side)","Bladder (lower)","Left hip blood vessels"],sev:1,desc:"Mostly large intestine. Contents leaking causes deadly infection.",reg:"abdomen",g:"Abdomen"},
  {id:"lr_abd",label:"Lower Right Abdomen",x:166,y:267,r:11,anat:["Appendix","Large intestine (right side)","Right hip blood vessels"],sev:1,desc:"Appendix sits here. Intestinal damage is the main concern.",reg:"abdomen",g:"Abdomen"},
  {id:"groin",label:"Groin / Pelvis",x:145,y:294,r:10,anat:["Thigh artery (femoral) origin","Pelvic bones","Bladder","Nerves"],sev:3,desc:"Femoral arteries branch off here. Pelvic fractures bleed internally.",reg:"abdomen",g:"Abdomen"},
  {id:"l_shoulder",label:"Left Shoulder",x:84,y:95,r:12,anat:["Shoulder joint","Collarbone","Shoulder muscle","Shoulder tendons"],sev:1,desc:"Ball-and-socket joint, prone to dislocation. Collarbone fractures easily.",reg:"leftArm",g:"Left Arm"},
  {id:"r_shoulder",label:"Right Shoulder",x:209,y:95,r:12,anat:["Shoulder joint","Collarbone","Shoulder muscle","Shoulder tendons"],sev:1,desc:"Ball-and-socket joint. Collarbone fractures easily.",reg:"rightArm",g:"Right Arm"},
  {id:"l_uarm",label:"Left Upper Arm",x:73,y:147,r:12,anat:["Upper arm bone","Inner arm artery","Upper arm muscles"],sev:1,desc:"Inner arm artery runs along the inside. Arterial damage here can be serious.",reg:"leftArm",g:"Left Arm"},
  {id:"l_elbow",label:"Left Elbow",x:62,y:180,r:9,anat:["Elbow joint","Funny bone nerve","Inner arm artery"],sev:1,desc:"Hinge joint. Funny bone nerve at the surface. Dislocation possible.",reg:"leftArm",g:"Left Arm"},
  {id:"l_farm",label:"Left Forearm",x:51,y:213,r:11,anat:["Forearm bones (radius & ulna)","Wrist artery","Tendons"],sev:0,desc:"Two parallel bones. Tendon damage affects hand function.",reg:"leftArm",g:"Left Arm"},
  {id:"l_hand",label:"Left Hand (Palm)",x:46,y:250,r:12,anat:["Hand bones","Palm tendons","Palm blood vessels"],sev:0,desc:"Complex bone and tendon structure. Defensive wounds common here.",reg:"leftArm",g:"Left Arm"},
  {id:"l_fingers",label:"Left Fingers",x:40,y:275,r:12,anat:["Finger bones","Finger tendons","Small nerves","Nail bed"],sev:0,desc:"Tiny bones connected by tendons. Loss affects dexterity permanently.",reg:"leftArm",g:"Left Arm"},
  {id:"r_uarm",label:"Right Upper Arm",x:226,y:147,r:12,anat:["Upper arm bone","Inner arm artery","Upper arm muscles"],sev:1,desc:"Inner arm artery inside. Fractures painful but survivable.",reg:"rightArm",g:"Right Arm"},
  {id:"r_elbow",label:"Right Elbow",x:237,y:180,r:9,anat:["Elbow joint","Funny bone nerve","Inner arm artery"],sev:1,desc:"Hinge joint. Funny bone nerve exposed. Dislocation possible.",reg:"rightArm",g:"Right Arm"},
  {id:"r_farm",label:"Right Forearm",x:248,y:213,r:11,anat:["Forearm bones (radius & ulna)","Wrist artery","Tendons"],sev:0,desc:"Two bones. Tendon cuts affect grip.",reg:"rightArm",g:"Right Arm"},
  {id:"r_hand",label:"Right Hand (Palm)",x:246,y:250,r:12,anat:["Hand bones","Palm tendons","Palm blood vessels"],sev:0,desc:"Defensive wound location. Tendon/bone damage affects grip permanently.",reg:"rightArm",g:"Right Arm"},
  {id:"r_fingers",label:"Right Fingers",x:253,y:275,r:12,anat:["Finger bones","Finger tendons","Small nerves","Nail bed"],sev:0,desc:"Loss of trigger finger is significant for gunslingers.",reg:"rightArm",g:"Right Arm"},
  {id:"l_uthigh",label:"Left Upper Thigh",x:128,y:327,r:12,anat:["Thigh artery (femoral)","Thigh vein","Thigh bone (femur)","Front thigh muscles"],sev:3,desc:"Thigh artery (femoral) — one of the largest. Damage means death in minutes.",reg:"leftLeg",g:"Left Leg"},
  {id:"l_mthigh",label:"Left Mid Thigh",x:125,y:365,r:11,anat:["Thigh bone (femur)","Front & back thigh muscles","Deep femoral artery"],sev:1,desc:"Thick muscle around femur. GSWs can pass through without hitting bone.",reg:"leftLeg",g:"Left Leg"},
  {id:"l_knee",label:"Left Knee",x:123,y:398,r:9,anat:["Kneecap","Knee joint & ligaments","Artery behind the knee"],sev:1,desc:"Complex joint. Knee injuries severely limit mobility.",reg:"leftLeg",g:"Left Leg"},
  {id:"l_shin",label:"Left Shin / Calf",x:122,y:436,r:12,anat:["Shin bone","Outer calf bone","Back of lower leg muscles"],sev:0,desc:"Shin bone right at the surface. Common fracture site.",reg:"leftLeg",g:"Left Leg"},
  {id:"l_ankle",label:"Left Ankle",x:122,y:471,r:8,anat:["Ankle joint","Achilles tendon (heel cord)","Side ligaments"],sev:0,desc:"Ankle sprains and fractures common. Achilles tendon is vulnerable.",reg:"leftLeg",g:"Left Leg"},
  {id:"l_foot",label:"Left Foot",x:120,y:488,r:10,anat:["Foot bones","Foot arch","Sole tissue"],sev:0,desc:"Many small bones. Crushing injuries painful and slow to heal.",reg:"leftLeg",g:"Left Leg"},
  {id:"l_toes",label:"Left Toes",x:117,y:500,r:10,anat:["Toe phalanges","Toe tendons","Small nerves"],sev:0,desc:"Tiny bones that break easily. Big toe is critical for balance.",reg:"leftLeg",g:"Left Leg"},
  {id:"r_uthigh",label:"Right Upper Thigh",x:171,y:327,r:12,anat:["Thigh artery (femoral)","Thigh vein","Thigh bone (femur)","Front thigh muscles"],sev:3,desc:"Thigh artery (femoral) here can mean death in minutes.",reg:"rightLeg",g:"Right Leg"},
  {id:"r_mthigh",label:"Right Mid Thigh",x:173,y:365,r:11,anat:["Thigh bone (femur)","Front & back thigh muscles","Deep femoral artery"],sev:1,desc:"Thick muscle. Less dangerous than upper thigh.",reg:"rightLeg",g:"Right Leg"},
  {id:"r_knee",label:"Right Knee",x:172,y:398,r:9,anat:["Kneecap","Knee joint & ligaments","Artery behind the knee"],sev:1,desc:"Complex joint. Limits mobility severely.",reg:"rightLeg",g:"Right Leg"},
  {id:"r_shin",label:"Right Shin / Calf",x:173,y:436,r:12,anat:["Shin bone","Outer calf bone","Back of lower leg muscles"],sev:0,desc:"Shin bone close to surface. Fractures common.",reg:"rightLeg",g:"Right Leg"},
  {id:"r_ankle",label:"Right Ankle",x:171,y:471,r:8,anat:["Ankle joint","Achilles tendon (heel cord)","Side ligaments"],sev:0,desc:"Achilles tendon exposed at the back.",reg:"rightLeg",g:"Right Leg"},
  {id:"r_foot",label:"Right Foot",x:174,y:488,r:10,anat:["Foot bones","Foot arch","Sole tissue"],sev:0,desc:"Small bones, easily crushed.",reg:"rightLeg",g:"Right Leg"},
  {id:"r_toes",label:"Right Toes",x:177,y:500,r:10,anat:["Toe phalanges","Toe tendons","Small nerves"],sev:0,desc:"Big toe loss affects balance and gait.",reg:"rightLeg",g:"Right Leg"},
  {id:"u_back",label:"Upper Back",x:145,y:120,r:16,anat:["Upper spine","Spinal cord","Shoulder blades","Lungs (behind ribs)"],sev:3,desc:"Spinal cord here — damage means paralysis.",reg:"back",g:"Back",bo:true},
  {id:"m_back",label:"Mid Back",x:145,y:174,r:16,anat:["Upper and lower spine","Spinal cord","Kidneys (flanks)","Rear ribs"],sev:3,desc:"Kidneys on either side — blood-rich, vulnerable from behind.",reg:"back",g:"Back",bo:true},
  {id:"lo_back",label:"Lower Back",x:145,y:229,r:16,anat:["Lower spine","Spinal nerves","Major back muscles"],sev:2,desc:"Lower spine bears most body weight. Nerve damage affects legs.",reg:"back",g:"Back",bo:true},
];

// ═══════════════════════════════════════════════════════════════════════════════
// INJURY TYPES & REGION MAPPING
// ═══════════════════════════════════════════════════════════════════════════════
const IT = {
  open_wound:{l:"Open Wound",i:"🩸",bs:1},gsw_lodged:{l:"GSW — Bullet Lodged",i:"🔫",bs:3},gsw_tt:{l:"GSW — Through & Through",i:"🔫",bs:3},gsw_graze:{l:"GSW — Graze",i:"🔫",bs:1},
  stab_wound:{l:"Stab Wound / Arrow",i:"🗡️",bs:2},burn_1:{l:"Burn — 1st Degree",i:"🔥",bs:1},burn_2:{l:"Burn — 2nd Degree",i:"🔥",bs:2},burn_3:{l:"Burn — 3rd Degree",i:"🔥",bs:3},
  concussion:{l:"Concussion",i:"💫",bs:2},broken_nose:{l:"Broken Nose",i:"👃",bs:1},skull_pressure:{l:"Skull Pressure / Drain",i:"🧠",bs:4},
  deflated_lung:{l:"Collapsed Lung",i:"🫁",bs:4},rib_fracture:{l:"Rib Fracture",i:"🦴",bs:2},organ_damage:{l:"Organ Damage",i:"🫀",bs:4},
  fracture_hairline:{l:"Hairline Fracture",i:"🦴",bs:1},fracture_linear:{l:"Simple Break",i:"🦴",bs:3},fracture_comminuted:{l:"Shattered Bone (Amputation)",i:"🦴",bs:5},
  dislocation:{l:"Dislocated Joint",i:"💢",bs:2},snake_bite:{l:"Snake Bite (Venomous)",i:"🐍",bs:3},arterial_bleed:{l:"Arterial Bleed",i:"❤️‍🩹",bs:4},
  eye_injury:{l:"Eye Injury",i:"👁️",bs:2},ear_injury:{l:"Ear Injury",i:"👂",bs:1},jaw_fracture:{l:"Jaw Fracture / Dislocation",i:"🦷",bs:2},
  tooth_damage:{l:"Tooth Damage",i:"🦷",bs:0},crush_injury:{l:"Crush Injury",i:"🔨",bs:2},frostbite:{l:"Frostbite",i:"🥶",bs:1},
  strangulation:{l:"Strangulation / Choking",i:"🤚",bs:3},
  blast_shrapnel:{l:"Blast / Shrapnel (Dynamite)",i:"💥",bs:3},
};

const WEAPONS = [
  {id:"handgun",cat:"Handgun",guns:["Cattleman Revolver","Double-Action Revolver","LeMat Revolver","Navy Revolver","Volcanic Pistol","Schofield Revolver","M1899 Pistol","Mauser Pistol","Semi-Automatic Pistol"],sevMod:0,
    wound:"The most common firearm wound. Entry wound roughly pencil-sized. Moderate tissue damage along the path. Bullet may deform on impact, tumbling through tissue. Survivable in many cases depending on location. Note: Semi-automatic pistols fire a slightly smaller, faster round — the entry wound may look smaller but the higher velocity can cause more internal damage than the hole suggests.",
    wSigns:["📐 Entry wound: Small and round, ~.36-.45 caliber (semi-autos slightly smaller)","🔥 Powder burns/stippling if within a few feet","🩸 Moderate bleeding — single wound channel","🦴 Can fracture bone but less likely to shatter than a long arm","⚡ Semi-auto rounds: Higher velocity, damage may be worse than the wound looks"],
    doHint:"handgun round"},
  {id:"sawnoff",cat:"Sawed-Off Shotgun",guns:["Sawed-Off Shotgun"],sevMod:1,
    wound:"Illegal for a reason — devastating at close range. Wide cone of pellets tears through everything. At point-blank it's one massive wound. At medium range, pellets scatter across a wide area. The sawed barrel means wider spread but less focused energy than a full-length shotgun.",
    wSigns:["💥 Close range: One massive wound, tissue destroyed","📐 Medium range: Scattered pellet entry wounds across the area","🔥 Heavy powder burns and wadding fragments at close range","🦴 Multiple bone fragments likely — pellets hit everything","⚠️ Wider spread than full shotgun — more area, slightly less focused damage"],
    doHint:"sawed-off shotgun blast"},
  {id:"repeater",cat:"Repeater",guns:["Carbine Repeater","Evans Repeater","Lancaster Repeater","Henry Repeater"],sevMod:1,
    wound:"These are a step up from pistols — longer barrel means higher bullet velocity and more energy on impact. The round hits harder, penetrates deeper, and carries more consistent energy at range. More damage to tissue than a revolver and more likely to crack bone.",
    wSigns:["📐 Entry wound: Slightly larger than pistol, more defined edges","⚡ Higher velocity than handguns: More tissue damage per round","🩸 Deeper wound channel — more internal damage likely","🦴 Can crack and break bone more readily than pistol rounds","🎯 More accurate at range: wound placement is deliberate"],
    doHint:"repeater round"},
  {id:"shotgun",cat:"Shotgun",guns:["Double-Barrel Shotgun","Pump Shotgun","Repeating Shotgun","Semi-Auto Shotgun"],sevMod:2,
    wound:"A full-length shotgun delivers focused, catastrophic damage. At close range the pellet mass acts as a single devastating projectile, creating one massive wound cavity. At range, the tighter pattern (compared to sawed-off) still clusters dozens of pellets into the target. Multiple wound channels, massive blood loss, shattered bone.",
    wSigns:["💥 Close range: Catastrophic — single massive wound cavity, tissue obliterated","📐 Medium range: Dense cluster of pellet wounds — dozens of entry points","🦴 Shatters bone — pellets hitting bone from multiple angles simultaneously","🩸 Bleeding from many wound channels at once","⚠️ Pellet tracking: Some lodged deep, some shallow — dozens of small projectiles","😰 Shock onset is rapid — the sheer volume of damage overwhelms the body fast"],
    doHint:"shotgun blast"},
  {id:"rifle",cat:"Rifle (Large Caliber)",guns:["Springfield Rifle","Bolt-Action Rifle"],sevMod:3,
    wound:"Large caliber, high velocity, fired from a weapon built for precision and stopping power. These rounds carry significantly more energy than handguns or repeaters. Entry wound is notably larger than a pistol's. Exit wound (if it passes through) can be fist-sized or larger. The energy transfer destroys tissue even outside the direct wound path. Bone doesn't just break — it shatters into fragments that become secondary projectiles inside the body.",
    wSigns:["📐 Entry: Notably larger than any handgun — clearly a high-caliber hole","💥 Exit wound: Fist-sized or larger — catastrophic tissue destruction","🦴 Bone shatters — comminuted fractures are common","⚡ Energy shock wave: Tissue damaged by energy transfer even without direct bullet contact","🩸 Bleeding is extreme — the wound channel is wide and deep","😰 Shock onset is fast — the energy transfer alone can cause it","⚠️ Through-and-through is more likely — enough energy to exit most body parts"],
    doHint:"large-caliber rifle round"},
  {id:"bow",cat:"Bow & Arrow",guns:["Bow (any type)"],sevMod:-1,
    wound:"Lower velocity than firearms but the arrowhead design creates a unique wound — it cuts on entry and may barb on the way out. Arrows can remain embedded, with the shaft still visible. Broadhead arrows create a slit-shaped entry wound rather than a round hole. Barbed arrowheads resist removal and tear tissue if pulled. The wound bleeds more once the arrow is out since the shaft was plugging the hole.",
    wSigns:["🏹 Arrow may still be embedded — shaft visible, wound bleeding around it","📐 Entry: Slit-shaped from broadhead, not round like a bullet","🩸 Bleeding increases once the arrow is removed — the shaft acts as a plug","🪶 Shaft can cause further internal damage with movement","⚠️ Barbed arrowheads tear tissue on the way out","🦴 Can lodge in bone — arrowhead stuck in ribcage, pelvis, etc."],
    doHint:"arrow"},
];

var getWeapon = function(id) { if(!id) return null; var catId = id.indexOf(":") >= 0 ? id.split(":")[0] : id; return WEAPONS.find(function(w){return w.id === catId;}); };
var getGunName = function(id) { if(!id || id.indexOf(":") < 0) return ""; return id.split(":").slice(1).join(":"); };
const isGSW = (type) => ["gsw_lodged","gsw_tt","gsw_graze"].includes(type);
const isStabOrArrow = (type) => type === "stab_wound";

function getConseq(zid, sev) {
  var c = [];
  var isL = zid.startsWith("l_");
  var isR = zid.startsWith("r_");
  var s = isL ? "left" : isR ? "right" : "";
  var os = s === "left" ? "right" : "left";
  // SHOULDERS
  if (zid.indexOf("shoulder") >= 0) {
    if (sev >= 1) c.push("Buttstock recoil against that shoulder could pull at or reopen the wound");
    if (sev >= 1) c.push("Drawing a bow requires both shoulders — full draw is painful on this side");
    if (sev >= 2) c.push("Can't raise that arm to properly aim — shooting from the " + s + " side is unreliable");
    if (sev >= 3) c.push("Arm barely functional — firing weapons one-handed with the " + os + " arm only");
    if (sev >= 2) c.push("Reaching across the body (holster, saddlebag) pulls hard at the wound");
  }
  // UPPER ARM
  if (zid.indexOf("uarm") >= 0) {
    if (sev >= 1) c.push("Holding a pistol in that hand — the weight alone strains the wound");
    if (sev >= 2) c.push("Recoil from firing makes it significantly worse — each shot is a fresh jolt of pain");
    if (sev >= 2) c.push("Shouldering a long arm on that side is painful, aiming unsteady");
    if (sev >= 3) c.push("Can't lift that arm — everything one-handed with the " + os);
  }
  // ELBOW
  if (zid.indexOf("elbow") >= 0) {
    if (sev >= 1) c.push("Bending the arm to aim is stiff and painful");
    if (sev >= 2) c.push("Cocking a lever-action or pump is difficult — the motion strains the joint");
    if (sev >= 2) c.push("Reloading takes longer — can't move the arm fluidly");
    if (sev >= 3) c.push("Arm locked in position — can't bend or straighten it without help");
  }
  // FOREARM
  if (zid.indexOf("farm") >= 0) {
    if (sev >= 1) c.push("Grip strength is reduced — weapon feels heavier, reins slip");
    if (sev >= 2) c.push("Twisting the wrist (turning a doorknob, pouring a drink) sends pain up the arm");
    if (sev >= 2) c.push("Reloading is slow and clumsy — fingers don't cooperate like they should");
  }
  // HAND
  if (zid.indexOf("hand") >= 0) {
    if (sev >= 1) c.push("Grip is weak — can hold a weapon but not firmly");
    if (sev >= 2) c.push("Can't properly grip a pistol — might drop it on recoil");
    if (sev >= 2) c.push("Holding reins with that hand means constant low pain");
    if (sev >= 3) c.push("Hand is nearly useless — can't grip, can't hold, can't squeeze a trigger");
  }
  // FINGERS
  if (zid.indexOf("fingers") >= 0) {
    if (sev >= 1) c.push("Trigger pull hurts — each shot is a reminder");
    if (sev >= 1) c.push("Buttoning clothes, tying knots, rolling cigarettes — all clumsy");
    if (sev >= 2) c.push("Can't squeeze a trigger reliably on that hand — shots go wide");
    if (sev >= 3) c.push("Fingers are useless — no grip, no trigger pull, no fine motor skills on that side");
  }
  // GENERIC ARM (if nothing specific matched above)
  if ((zid.indexOf("shoulder") >= 0 || zid.indexOf("uarm") >= 0 || zid.indexOf("elbow") >= 0 || zid.indexOf("farm") >= 0 || zid.indexOf("hand") >= 0 || zid.indexOf("fingers") >= 0) && sev >= 1) {
  }
  // UPPER THIGH
  if (zid.indexOf("uthigh") >= 0) {
    if (sev >= 1) c.push("Mounting and dismounting a horse pulls hard at the wound — need the other leg to lead");
    if (sev >= 2) c.push("Walking is a visible limp — running is out of the question");
    if (sev >= 3) c.push("Can barely put weight on it — need a crutch or someone's shoulder");
    if (sev >= 2) c.push("Crouching behind cover is excruciating — getting back up is worse");
  }
  // MID THIGH
  if (zid.indexOf("mthigh") >= 0) {
    if (sev >= 1) c.push("Noticeable limp — movement is slower than usual");
    if (sev >= 1) c.push("Mounting a horse takes extra effort — swing leg over carefully");
    if (sev >= 2) c.push("Running sends a shock through the wound with each stride");
    if (sev >= 3) c.push("Walking is painful and slow — horse riding is the only reasonable way to travel");
  }
  // KNEE
  if (zid.indexOf("knee") >= 0) {
    if (sev >= 1) c.push("Can't kneel, crouch, or squat without sharp pain");
    if (sev >= 1) c.push("Stairs and uneven ground are treacherous — the knee buckles");
    if (sev >= 2) c.push("Mounting a horse means pulling yourself up one-legged");
    if (sev >= 3) c.push("Leg doesn't bend properly — walking is stiff-legged and slow");
  }
  // SHIN
  if (zid.indexOf("shin") >= 0) {
    if (sev >= 1) c.push("Walking hurts with each step — boots press against the wound");
    if (sev >= 2) c.push("Running is a bad idea — the jarring impact is intense");
    if (sev >= 2) c.push("Kicking open a door, climbing a fence — anything that impacts the shin is agony");
  }
  // ANKLE
  if (zid.indexOf("ankle") >= 0) {
    if (sev >= 1) c.push("Uneven ground is risky — the ankle rolls easily");
    if (sev >= 1) c.push("Stirrups put pressure right on the injury");
    if (sev >= 2) c.push("Walking is a hobble — running is impossible");
    if (sev >= 3) c.push("Can't bear weight on that foot — hopping or being carried");
  }
  // FOOT
  if (zid.indexOf("foot") >= 0 && zid.indexOf("toes") < 0) {
    if (sev >= 1) c.push("Every step is felt — boots make it worse");
    if (sev >= 2) c.push("Walking is slow and deliberate — can't run, can't stomp");
    if (sev >= 2) c.push("Stirrups are painful — foot placement in the saddle matters");
  }
  // TOES
  if (zid.indexOf("toes") >= 0) {
    if (sev >= 1) c.push("Balance is slightly off — the toes grip the ground for stability");
    if (sev >= 2) c.push("Big toe injury affects every step — gait is noticeably different");
    if (sev >= 2) c.push("Boots are agony to put on and take off");
  }
  // GENERIC LEG
  if ((zid.indexOf("thigh") >= 0 || zid.indexOf("knee") >= 0 || zid.indexOf("shin") >= 0 || zid.indexOf("ankle") >= 0 || zid.indexOf("foot") >= 0 || zid.indexOf("toes") >= 0) && sev >= 2) {
    c.push("Horse riding is possible but mounting and dismounting is the hard part");
  }
  // CHEST
  if (["heart_area","sternum","ur_chest","lm_chest","rm_chest","ll_ribs","rl_ribs"].indexOf(zid) >= 0) {
    if (sev >= 1) c.push("Deep breaths hurt — you catch yourself breathing shallow");
    if (sev >= 1) c.push("Coughing, laughing, or sneezing is a sharp reminder of the wound");
    if (sev >= 2) c.push("Running is limited — can't get enough air without pain");
    if (sev >= 2) c.push("Shouldering a rifle pushes the buttstock right into the injury");
    if (sev >= 3) c.push("Every breath is a conscious effort — talking is short sentences only");
    if (sev >= 3) c.push("Physical exertion of any kind leaves you gasping");
  }
  // ABDOMEN
  if (["ul_abd","ur_abd","c_abd","ll_abd","lr_abd","groin"].indexOf(zid) >= 0) {
    if (sev >= 1) c.push("Mounting a horse — swinging the leg over pulls at the wound");
    if (sev >= 1) c.push("Bending, twisting, or sitting up from lying down is painful");
    if (sev >= 2) c.push("Horse riding is rough — every bump in the saddle is felt");
    if (sev >= 2) c.push("Eating is uncomfortable — the gut needs time to settle");
    if (sev >= 3) c.push("Can barely move without help — standing upright is an achievement");
  }
  // GROIN specifically
  if (zid === "groin") {
    if (sev >= 1) c.push("Walking with legs apart — normal stride pulls at the wound");
    if (sev >= 2) c.push("Sitting in a saddle is a special kind of misery");
  }
  // NECK
  if (["l_neck","r_neck","throat"].indexOf(zid) >= 0) {
    if (sev >= 1) c.push("Turning the head to check surroundings is stiff and painful");
    if (sev >= 2) c.push("Aiming a weapon means moving the whole body, not just the head");
    if (zid === "throat" && sev >= 1) c.push("Voice is hoarse or gone — communicating is difficult");
    if (zid === "throat" && sev >= 2) c.push("Swallowing food, water, or medicine hurts");
  }
  // HEAD
  if (["crown","forehead","l_temple","r_temple","concussion"].indexOf(zid) >= 0) {
    if (sev >= 1) c.push("Headaches — worse with bright light, loud noise, or sudden movement");
    if (sev >= 2) c.push("Dizzy spells — quick movements make the world spin");
    if (sev >= 2) c.push("Can't wear a hat comfortably — pressure on the wound");
    if (sev >= 3) c.push("Confusion, memory gaps — may forget instructions or lose track of conversation");
  }
  // EYES
  if (zid.indexOf("eye") >= 0) {
    if (sev >= 1) c.push("Aim is off — depth perception compromised if one eye is swollen or damaged");
    if (sev >= 2) c.push("Blind spot on that side — can't see threats coming from the " + s);
    if (sev >= 3) c.push("Effectively half-blind — can't shoot accurately, can't judge distance");
  }
  // EARS
  if (zid.indexOf("ear") >= 0) {
    if (sev >= 1) c.push("Ringing in that ear — hard to hear conversations on the " + s + " side");
    if (sev >= 2) c.push("Can't tell where sounds come from — directional hearing is gone");
    if (sev >= 2) c.push("Balance is off — the inner ear affects equilibrium");
  }
  // JAW / MOUTH
  if (zid === "mouth" || zid === "chin" || zid === "jaw_fracture") {
    if (sev >= 1) c.push("Eating solid food is painful — liquid diet for a while");
    if (sev >= 2) c.push("Speech is slurred or limited — jaw won't cooperate");
    if (sev >= 2) c.push("Biting down on anything (leather strap, cork) is out");
  }
  // NOSE
  if (zid === "nose") {
    if (sev >= 1) c.push("Breathing through the nose is partially blocked — mouth breathing");
    if (sev >= 1) c.push("Can't smell anything — food tastes bland, can't detect smoke or danger");
  }
  // BACK
  if (["u_back","m_back","lo_back"].indexOf(zid) >= 0) {
    if (sev >= 1) c.push("Horse riding is painful — every bump travels up the spine");
    if (sev >= 1) c.push("Getting up from sitting or lying down takes a while");
    if (sev >= 2) c.push("Can't twist to look behind — whole body has to turn");
    if (sev >= 2) c.push("Carrying anything heavy (saddlebags, bodies, crates) is out");
    if (sev >= 3) c.push("Every movement is slow and deliberate — the back controls everything");
  }
  return c;
}

const RI = {
  head:["open_wound","gsw_lodged","gsw_tt","gsw_graze","burn_1","burn_2","burn_3","concussion","broken_nose","skull_pressure","eye_injury","ear_injury","jaw_fracture","tooth_damage","frostbite","blast_shrapnel"],
  neck:["open_wound","gsw_lodged","gsw_tt","gsw_graze","stab_wound","arterial_bleed","strangulation","blast_shrapnel"],
  chest:["open_wound","gsw_lodged","gsw_tt","gsw_graze","stab_wound","burn_1","burn_2","burn_3","rib_fracture","deflated_lung","organ_damage","blast_shrapnel"],
  abdomen:["open_wound","gsw_lodged","gsw_tt","gsw_graze","stab_wound","burn_1","burn_2","burn_3","organ_damage","blast_shrapnel"],
  leftArm:["open_wound","gsw_lodged","gsw_tt","gsw_graze","stab_wound","burn_1","burn_2","burn_3","fracture_hairline","fracture_linear","fracture_comminuted","dislocation","snake_bite","arterial_bleed","crush_injury","frostbite","blast_shrapnel"],
  rightArm:["open_wound","gsw_lodged","gsw_tt","gsw_graze","stab_wound","burn_1","burn_2","burn_3","fracture_hairline","fracture_linear","fracture_comminuted","dislocation","snake_bite","arterial_bleed","crush_injury","frostbite","blast_shrapnel"],
  leftLeg:["open_wound","gsw_lodged","gsw_tt","gsw_graze","stab_wound","burn_1","burn_2","burn_3","fracture_hairline","fracture_linear","fracture_comminuted","dislocation","snake_bite","arterial_bleed","crush_injury","frostbite","blast_shrapnel"],
  rightLeg:["open_wound","gsw_lodged","gsw_tt","gsw_graze","stab_wound","burn_1","burn_2","burn_3","fracture_hairline","fracture_linear","fracture_comminuted","dislocation","snake_bite","arterial_bleed","crush_injury","frostbite","blast_shrapnel"],
  back:["open_wound","gsw_lodged","gsw_tt","gsw_graze","stab_wound","burn_1","burn_2","burn_3","blast_shrapnel"],
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
    if(t==="frostbite"&&!["l_toes","r_toes","l_foot","r_foot","l_fingers","r_fingers","l_hand","r_hand","l_ear","r_ear","nose"].includes(zone.id)) return false;
    if(t==="strangulation"&&!["l_neck","r_neck","throat"].includes(zone.id)) return false;
    return true;
  });
}

const SV = [
  {v:1,l:"Minor",c:"#6b8f3c",ic:"No IC downtime needed",ooc:"No OOC wait",d:"A scratch in the grand scheme. Keep it clean, get back to it."},
  {v:2,l:"Moderate",c:"#b8860b",ic:"A few hours rest IC",ooc:"1-2 hours OOC",d:"Take it easy for a bit. Light duty after, ease back in."},
  {v:3,l:"Serious",c:"#cd6600",ic:"About 1 day IC",ooc:"6-12 hours OOC",d:"You're hurt bad. Bed rest, follow-up visit with the doc before full duty."},
  {v:4,l:"Severe",c:"#b22222",ic:"2-3 days IC",ooc:"24-48 hours OOC",d:"Your survival was in question. Extended bed rest, multiple follow-ups."},
  {v:5,l:"Critical",c:"#4a0000",ic:"3+ days IC",ooc:"Up to 72 hours OOC",d:"You were at death's door. Life-altering consequences possible. Recovery is a story arc, not a scene."},
];
function cSev(injs){if(!injs.length)return 1;var mx=0;injs.forEach(function(i){var t=IT[i.type],z=Z.find(function(zn){return zn.id===i.zid;}),wm=getWeapon(i.weapon);if(!t||!z)return;var wmMod=wm?wm.sevMod:0;mx=Math.max(mx,t.bs+z.sev+(wmMod||0));});var multi=injs.length>=3?1:(injs.length>=2?0.5:0);return Math.min(5,Math.max(1,Math.round(mx+multi)));}

// ═══════════════════════════════════════════════════════════════════════════════
// OUTPUT DATA
// ═══════════════════════════════════════════════════════════════════════════════
const gfs=(o,s)=>{if(o[s])return o[s];for(let d=1;d<=5;d++){if(o[s-d])return o[s-d];if(o[s+d])return o[s+d];}return Object.values(o)[0]||[];};


const OD = {
  open_wound:{sym:{1:["Shallow cut, bleeding, stings"],2:["Deep laceration, steady bleeding, possible muscle visible"],3:["Gaping wound, heavy blood flow, pale skin"],4:["Devastating wound, blood pooling, barely conscious"]},
    signs:["🩸 Bleeding type: Capillary (slow seep) for shallow, venous (dark steady ooze) for deep, arterial (bright spurting) if artery hit","👁️ Wound edges: Clean/straight = sharp object, ragged/torn = blunt force or shrapnel","🤒 Infection signs (later): Redness spreading, warmth, swelling, pus, red streaks, foul smell","🫀 Pulse: Normal unless heavy blood loss — then thready/rapid","🌡️ Skin: Warm/pink = healthy, cool/pale = blood loss starting"],
    doEx:{1:["/do A shallow gash across their {z}, bleeding lightly. Capillary bleed — seeping, not flowing."],2:["/do Deep laceration on their {z}. Dark blood oozing steadily — venous. Edges ragged."],3:["/do Gaping wound on their {z}. Blood flowing freely. Pale and clammy. Pulse rapid."]},rec:["Keep bandages clean — change daily","Watch for infection: redness, pus, dark tissue","Return for suture removal if stitched"],drugs:["Cocaine paste might numb for sutures","If stronger meds used, in-game addiction may kick in"]},
  gsw_graze:{sym:{1:["Bullet skimmed the surface — long shallow furrow, lots of blood but no penetration","Burns along the graze from bullet heat"],2:["Deep graze carving a channel through skin and muscle","Heavy bleeding, raw and exposed","Possible bone chip if over bone"]},
    signs:["🩸 Bleeding: Usually capillary or venous — no spurting unless it nicked something","📐 Pattern: Long shallow channel — not a hole, more like a furrow","🔥 Powder burns: If close range, blackened/stippled skin around the graze","🦴 Bone: If over skull, shin, ribs — may have chipped the bone underneath","👁️ Debris: Fabric, dirt, or bullet fragments may be embedded in the furrow"],
    doEx:{1:["/do A long furrow across their {z} where the bullet skimmed. Bleeding and raw, but didn't go in."],2:["/do Deep graze carving a channel through {z}. Muscle visible in the furrow. Bleeding heavy."]},rec:["Treat like a bad open wound — clean, disinfect, bandage","Watch for embedded debris or fabric","Powder burns if close range — stinging, blackened skin","Less severe than lodged bullet but needs proper care"],drugs:["Cocaine paste for numbing during cleaning","Aspirin usually enough unless deep"]},
  gsw_lodged:{sym:{1:["Small caliber, lodged shallow"],2:["Significant bleeding, numbness spreading"],3:["Bullet deep, internal damage likely, cold sweats"],4:["Possible fragmentation, fading in and out"]},
    signs:["🩸 Bleeding type: Arterial (bright spurting), venous (dark steady), or minimal if bullet plugs its own hole","📍 Entry wound: Small, round, may have powder burns if close range","🦴 Deformity: Near bone? Check for fracture — bullet may have shattered it","👐 Sensation: Numbness/tingling below = nerve damage","🫀 Pulse below wound: Weak or absent = arterial damage","😰 Shock: Pale, clammy, rapid pulse, confused = blood loss","💜 Swelling: Rapid swelling = internal bleeding collecting"],
    doEx:{1:["/do Small entry wound on their {z}. No exit. Bleeding controlled."],2:["/do Entry wound on {z}, no exit. Swelling fast. Numbness spreading below."],3:["/do Bullet wound on {z}. Blood pooling. Ashen. Pulse thready and rapid."]},rec:["Expect bed rest","Multiple follow-ups","Bullet path may have caused internal damage"],drugs:["Morphine likely — addictive in-game","Ether if surgery — groggy after","In-game addiction tracks opioid use"]},
  gsw_tt:{sym:{1:["Clean pass, entry small, exit bigger"],2:["Entry clean, exit messy, internal damage along path"],3:["Massive exit wound, shock"],4:["Exit devastating, barely responsive"]},
    signs:["🩸 Entry vs exit: Entry is small/round; exit is larger, blown-out, ragged","🩸 Bleeding: Often arterial AND venous — bright and dark blood mixing","📍 Internal damage: Bullet went through everything in its path","😰 Shock: Two wounds = double blood loss. Pale, rapid weak pulse, confusion","🫁 Breathing: If chest/back, check for sucking wound — air pulled into chest","🦴 Bone: May be shattered along the path"],
    doEx:{1:["/do Small entry on front of {z}, larger exit wound back. Bleeding both sides."],2:["/do Entry clean. Exit torn open on {z}. Bright and dark blood mixing."],3:["/do Through-and-through on {z}. Exit devastating. Ashen, pulse barely there."]},rec:["Extended bed rest","Daily bandage changes both wounds","Infection biggest secondary risk"],drugs:["Morphine or laudanum — addictive","Cocaine might maintain heart rate via IV","Opioid use adds 24h drug recovery"]},
  stab_wound:{sym:{1:["Shallow puncture, sharp pain"],2:["Deep puncture, steady bleeding"],3:["Deep stab, internal damage, heavy bleeding"]},
    signs:["🩸 Bleeding: External may be minimal even with deep internal damage","🗡️ Object still in: The blade or arrow acts as a plug — removing it increases bleeding","📐 Wound shape: Narrow slit = knife, round = arrow/spike, irregular = glass","🫀 Pulse: Abdominal stab + rapid pulse + rigid belly = internal bleeding","😰 Shock: Develops fast — internal bleeding isn't visible","🌡️ Later signs: Redness/warmth developing = infection starting"],
    doEx:{1:["/do Puncture wound on {z}, couple inches deep."],2:["/do Deep stab in {z}. Blood wells up. {OPTIONAL: Blade still embedded.}"],3:["/do Deep stab in {z}. Blood dark, flowing. Abdomen rigid. Skin cold."]},rec:["Keep wound covered and clean","Infection risk high — stabbing instruments rarely clean","Limit movement of affected area"],drugs:["Morphine for severe, cocaine paste for sutures","A blade left in is acting as a plug for the wound"]},
  burn_1:{sym:{1:["Red tender skin, like bad sunburn"],2:["Bright red, swollen, painful"]},signs:["🔥 Skin: Red, dry, intact — no blisters","👆 Touch: Painful, flinches from contact","📏 Area: Note how large — palm-sized or larger is noteworthy"],doEx:{1:["/do Skin on {z} bright red and tender. Intact but painful to touch."]},rec:["Bandage change once daily","Heals in days, some peeling"],drugs:["Aspirin usually enough","Aloe gel for the burn"]},
  burn_2:{sym:{1:["Blistering, raw skin underneath"],2:["Blisters bursting, weeping fluid, intense pain"]},signs:["🔥 Skin: Blistered — some intact, some burst, weeping clear fluid","👆 Touch: EXTREMELY painful — nerves intact, more painful than 3rd degree","💧 Fluid: Clear = normal; cloudy/yellow = infection developing","📏 Area: Larger burns = more fluid loss = dehydration risk"],doEx:{1:["/do Blistered skin on {z}. Some burst, weeping clear fluid. Screams at contact."],2:["/do Extensive second-degree burns on {z}. Raw, weeping, agonizing."]},rec:["Bandage change TWICE daily","Scarring possible","Infection on burned skin dangerous"],drugs:["Laudanum or morphine may be needed","In-game addiction system applies"]},
  burn_3:{sym:{2:["Charred/waxy skin, center numb, edges hurt intensely"],3:["Skin destroyed, blackened, tissue visible"]},signs:["🔥 Skin: Charred, white/waxy, leathery — destroyed","👆 Touch: CENTER has no pain (nerves dead), EDGES agonizing","⚠️ Key: No pain at center + edge pain = 3rd degree","🖤 Necrosis: Dead tissue needs removal (maggots or cutting)","💧 No blisters: Skin too destroyed to blister, unlike 2nd degree"],doEx:{2:["/do Charred skin on {z}. Blackened patches. No feeling center — screams at edges."]},rec:["Bandage change THREE times daily","Permanent scarring almost certain","Maggots may remove dead tissue","Defining character trait"],drugs:["Strong pain meds — prolonged exposure","Addiction mechanic very relevant"]},
  concussion:{sym:{1:["Slight headache, dizzy, seeing stars"],2:["Confusion, nausea, balance problems, light sensitivity"],3:["Severe disorientation, vomiting, may black out"]},
    signs:["👁️ Pupils: Uneven (one larger) = serious. Both dilated/sluggish = severe","🧠 Memory: Can't recall event, keeps asking same question","⚖️ Balance: Stumbles, can't walk straight, sways standing","🗣️ Speech: Slurred, slow, wrong words","🤮 Vomiting: Repeated = severe","💤 Consciousness: Drowsy but rousable = moderate. Can't wake = emergency","🔦 Light: Flinches from brightness — photosensitivity"],
    doEx:{1:["/do Eyes unfocused. Dazed but knows name and location."],2:["/do Pupils uneven. Stumbles. Asks same question twice. Light hurts."],3:["/do Barely conscious. Vomiting. Pupils dilated. Slurred speech."]},rec:["Minor: take it easy","Moderate/Severe: watch them — avoid sleeping","Memory gaps, irritability, fog are natural to play"],drugs:["Aspirin for headache","Docs avoid opioids — masks brain symptoms"]},
  broken_nose:{sym:{1:["Crooked, swelling, bloody nose"],2:["Badly displaced, heavy swelling, mouth-breathing"]},signs:["👃 Alignment: Visibly crooked or shifted","🩸 Bleeding: Heavy from both nostrils","😤 Breathing: Blocked, mouth-breathing","👁️ Raccoon eyes: Bruising under eyes may develop","🦴 Crepitus (bone grinding): Grinding feel when touched = fragments"],doEx:{1:["/do Nose crooked, swelling. Blood from nostrils. Already bruising under eyes."]},rec:["Don't touch it","Swelling for days","Flinch if someone gets near your face"],drugs:["Cocaine paste before reset","Leather to bite during"]},
  skull_pressure:{sym:{3:["Intense headache, soft bump, fluid from nose/ears"],4:["Life-threatening pressure, unconscious"]},
    signs:["🧠 Soft bump: Spongy area on skull = fracture with fluid underneath","💧 CSF leak (brain fluid): Clear watery fluid from nose/ears — brain and spinal fluid","👁️ Pupils: Fixed, dilated, or uneven = brain under pressure","🤮 Projectile vomiting: Without nausea beforehand = pressure sign","⚡ Temples: Firmer than normal when pressed","🫀 Pulse: Slow and irregular as pressure builds (Cushing's response (brain pressure sign))","😵 Consciousness: Declining alertness -> unresponsive"],
    doEx:{3:["/do Soft spongy bump on skull. Clear fluid from ear — brain fluid (CSF) leaking. Pupils uneven. Confused."],4:["/do Unconscious. Soft depression on skull. Fluid from nose and ears. Pupils fixed/dilated. Pulse slowing."]},rec:["Extended bed rest — pressure change affects balance","Dizziness, light/sound sensitivity for days"],drugs:["Ether for procedure, morphine after — both addictive","24h drug recovery"]},
  deflated_lung:{sym:{3:["Shortness of breath, one-sided chest pain, gurgling"],4:["Extreme difficulty breathing, blue lips, gasping"]},
    signs:["🫁 Chest movement: One side barely moves, other rises normally","🔊 Sounds: Gurgling/wet, or ABSENT breath sounds on one side","💙 Cyanosis (oxygen-starved skin): Blue lips, fingertips, around eyes = not enough oxygen","😰 Windpipe shift: Windpipe visually shifting away from collapsed side","🫀 Pulse: Rapid, weak — heart compensating","🗣️ Speech: Barely gets words out between gasps"],
    doEx:{3:["/do Struggling to breathe. One side barely moves. Gurgling. Speaking in broken gasps."],4:["/do Gasping. Lips blue. Gurgling. One side sunken. Trachea shifting."]},rec:["Bed rest","No running, shouting, heavy lifting","Shortness of breath for days"],drugs:["Ether and morphine — both addictive, 24h recovery"]},
  rib_fracture:{sym:{1:["Hurts to breathe deep, cough, laugh"],2:["Sharp pain every breath, heavy bruising"],3:["Multiple breaks, rapid shallow breathing, maybe blood"]},
    signs:["🦴 Crepitus (bone grinding): Grinding/crackling when touched = fragments","💜 Bruising: Deep purple over fracture site","😤 Breathing: Shallow, guarded — won't take full breath","🩸 Coughing blood: If present = rib punctured a lung","🫁 Flail chest (broken rib section): Section moves OPPOSITE to breathing = multiple breaks","👆 Point tenderness: Sharp pain at exact spot when pressed"],
    doEx:{1:["/do Winces breathing deep. Bruising. Sharp pain at one specific spot."],2:["/do Shallow breaths. Purple bruising. Grinding when touched. Guards the area."],3:["/do Multiple breaks. Rapid shallow breathing. Coughing blood. Chest section moves wrong."]},rec:["No heavy lifting, running, fighting","Deep breaths hurt for days","Compression bandage stays on"],drugs:["Laudanum or morphine beyond hairline"]},
  organ_damage:{sym:{3:["Deep internal pain, rigid abdomen, nausea"],4:["Abdomen swollen, internal bleeding, fading"]},
    signs:["🤰 Rigid abdomen: Hard as board when pressed = guarding reflex","💜 Bruising: Appearing on abdomen without external wound = internal bleeding","🤮 Vomiting: Persistent, may include blood","🫀 Pulse: Rapid/weak despite small wound = blood collecting inside","😰 Shock: Pale, clammy, confused — worsening over time","🌡️ Fever: Later sign of intestinal contents leaking"],
    doEx:{3:["/do Abdomen rigid. Bruising appearing on belly despite no external wound. Nauseous."],4:["/do Abdomen swollen, hard. Pulse rapid but weak. Getting worse."]},rec:["48-72h minimum bed rest","Soft food diet","Multiple follow-ups"],drugs:["Ether for surgery, morphine after — both addictive"]},
  fracture_hairline:{sym:{1:["Aching, swelling, bruising — can move but hurts"],2:["Significant swelling, sharp pain with movement"]},signs:["🦴 Point tenderness: One specific painful spot","💜 Swelling: Localized over bone","🏃 Activity: Gets worse with use","👆 Vibration: Tapping nearby sends jolt through bone"],doEx:{1:["/do Swelling and bruising on {z}. Can move but grimaces. One spot sharply tender."]},rec:["Keep splint/cast on","No heavy use","Tender for a while"],drugs:["Aspirin or phenacetin","Medicinal mota for pain/sleep"]},
  fracture_linear:{sym:{2:["Clear break, intense pain, can't use limb"],3:["Bone visibly displaced, wrong angle"],4:["Bone through skin, shock"]},
    signs:["🦴 Deformity: Limb bent wrong, or shortened one side","🦴 Crepitus (bone grinding): Crunching when moved — bone ends rubbing","💜 Swelling: Rapid, massive at fracture site","⚡ Nerve: Numbness/tingling, can't move fingers/toes below break","🫀 Pulse below: Weak/absent = bone pressing on vessel","🩸 Open fracture: Bone through skin, white bone visible"],
    doEx:{2:["/do Their {z} bent wrong. Massive swelling. Grinding when moved. Can't feel below it."],3:["/do Bone displaced under skin. Limb shortened. No pulse below."]},rec:["Splint stays on","No use of limb extended period","Limp, sling — natural to play out","Follow-ups for plates"],drugs:["Morphine almost certainly","Ether if surgery","24h drug recovery"]},
  fracture_comminuted:{sym:{4:["Bone shattered — limb unsalvageable"],5:["Catastrophic limb destruction, shock"]},signs:["🦴 Destruction: Bone in multiple pieces — structurally gone","🩸 Bleeding: Massive — fragments shred vessels from inside","😰 Shock: Immediate — pale, cold, rapid thready pulse","⚡ No sensation: Complete loss below injury","💀 Tissue death: Color changing, limb going cold — blood supply destroyed"],doEx:{4:["/do Their {z} destroyed. Bone fragments through flesh. No feeling below. Limb cold. Shock."]},rec:["Losing a limb — permanent","Extended recovery, daily bandages","Phantom pain to explore","Character-defining moment"],drugs:["Ether — must be unconscious","Morphine post-op — highly addictive","Prolonged exposure — addiction mechanic kicks in"]},
  dislocation:{sym:{1:["Joint out of place, limited movement"],2:["Major joint displaced, visible deformity"]},signs:["💢 Deformity: Bone bulging at joint","🔒 Locked: Can't bend or straighten normally","💜 Swelling: Rapid around joint","⚡ Nerve: Tingling/numbness beyond joint","🫀 Pulse: Check below — dislocation can pinch vessels"],doEx:{1:["/do Their {z} out of socket. Joint locked. Can't straighten."],2:["/do Joint dislocated. Bone bulging wrong. No feeling past it."]},rec:["Sling or splint after","Pops out easier next time","Sore with limited range days"],drugs:["Cocaine paste before reset","Leather to bite during","Aspirin after"]},
  snake_bite:{sym:{1:["Two puncture marks, local swelling, mild nausea"],2:["Rapid swelling, dizziness, vomiting"],3:["Venom spreading, breathing difficulty, darkening tissue"]},signs:["🐍 Fang marks: Two punctures spaced apart","💜 Swelling: Rapidly spreading — track the border","🖤 Discoloration: Skin darkening = tissue dying from venom","🫀 Pulse: Rapid/irregular as venom affects heart","🤮 Systemic: Nausea, metallic taste, blurred vision = venom in blood","😵 Breathing: Difficulty = venom affecting respiratory system"],doEx:{1:["/do Two puncture marks on {z}. Red, swelling outward. Mild nausea."],2:["/do Fang marks on {z}, swelling past the joint. Skin darkening. Dizzy, vomiting."]},rec:["Watch for tissue death","Tourniquet area monitored","Black skin = necrosis"],drugs:["Aspirin mild, morphine if severe","Treatment mostly venom extraction"]},
  arterial_bleed:{sym:{3:["Bright red spurting with heartbeat, going pale"],4:["Massive spray, minutes from death"]},
    signs:["🩸 KEY: Bright cherry-red blood SPURTING in pulses matching heartbeat = arterial","🩸 vs Venous: Venous is DARK red, flows steadily, no spurting","🫀 Pulse: Rapid, weakening fast","😰 Shock: Fast — pale, cold, clammy, confused within minutes","💙 Downstream: Limb beyond bleed going pale/cold/numb","⏱️ Time: MINUTES not hours — every second of pressure counts"],
    doEx:{3:["/do Bright red blood spurts from {z} matching heartbeat. Going pale. Pulse weakening."],4:["/do Arterial spray from {z}. Cherry-red, rhythmic. Limb beyond going cold. Going limp."]},rec:["Extended bed rest","IV fluids for blood volume","Close to death — weakness, fear, slow rebuild"],drugs:["Ether if surgery, morphine after — both addictive"]},
  eye_injury:{sym:{1:["Eye watering, swollen, blurred vision, light sensitivity"],2:["Blood in eye, severe pain, vision impaired, swelling shut"],3:["Eye lacerated/ruptured, total vision loss that side"]},
    signs:["👁️ Pupils: Fixed/dilated = severe. No light response = optic nerve damage","👁️ Hyphema (blood in the eye): Blood pooling in front of the colored part of the eye = blunt trauma","💧 Fluid leaking: Clear fluid from eye = possible globe rupture","🔦 Light response: No pupil change = damage","👁️ Vision: Blurry, double, tunnel, or complete black that side","💜 Raccoon eyes: Bruising around both eyes after head trauma = skull fracture"],
    doEx:{1:["/do Eye swollen, watering. Pupil sluggish to light."],2:["/do Blood pooling in the eye. Pupil won't react. Vision gone that side."],3:["/do Eye ruptured. Clear fluid and blood leaking. Blind that side."]},rec:["Blindness possible — could be permanent","Depth perception affected with one eye","Bandage during recovery"],drugs:["Cocaine solution to numb","Morphine for severe"]},
  ear_injury:{sym:{1:["Ear torn or bleeding, ringing, muffled hearing"],2:["Eardrum burst — sharp pain, hearing loss, vertigo"],3:["Inner ear destroyed, permanent hearing loss, extreme vertigo"]},
    signs:["👂 Blood from canal: After head trauma = possible skull fracture","💧 Clear fluid: brain fluid (CSF) leaking = skull fracture","🌀 Vertigo: Room spinning, can't stand, nausea = inner ear","🔊 Hearing test: Snap fingers by each ear — no response = that ear","⚖️ Balance: Falling to one side = inner ear affecting balance"],
    doEx:{1:["/do Ear torn, bleeding. Ringing. Can't hear fingers snapping that side."],2:["/do Blood from ear canal. World spinning — can't stand. Nauseous from vertigo."]},rec:["Hearing loss may be temporary or permanent","Balance problems from inner ear","Tinnitus can be ongoing"],drugs:["Aspirin for mild","Morphine if severe"]},
  jaw_fracture:{sym:{1:["Jaw misaligned, painful, swelling"],2:["Can't close mouth, drooling, slurred speech"],3:["Jaw shattered, teeth loose, severe swelling"]},signs:["🦷 Alignment: Teeth don't line up","🗣️ Speech: Slurred — jaw won't form words","💧 Drooling: Can't close mouth = can't swallow","🦴 Crepitus (bone grinding): Grinding at jaw joint","💜 Swelling: Rapid, may compromise airway if severe"],doEx:{1:["/do Jaw swollen, off-center. Teeth don't line up. Speech painful."],2:["/do Jaw hanging wrong. Can't close mouth. Drooling. Grinding sound."]},rec:["Liquids and soft foods only","Speech affected","May need wiring or splinting"],drugs:["Cocaine paste externally","Laudanum drops under tongue"]},
  tooth_damage:{sym:{1:["Tooth chipped/cracked, sharp pain with cold air, blood in mouth"],2:["Tooth knocked out, socket bleeding, gap visible"]},signs:["🦷 Socket: Bleeding from empty socket = fully knocked completely out","🩸 Blood: Steady with saliva","😬 Alignment: Remaining teeth loosened/shifted","⚡ Nerve: Sharp shooting pain with cold/touch = exposed nerve"],doEx:{1:["/do Spits blood. Tonguing cracked tooth. Sharp pain in cold air."],2:["/do Spits out a tooth. Socket bleeding. Jaw tender."]},rec:["Missing teeth permanent — no implants","Affects eating, speech, appearance","Gap-toothed grin tells a story"],drugs:["Clove oil or cocaine paste","Laudanum if multiple teeth"]},
  crush_injury:{sym:{1:["Severe bruising, swelling, throbbing"],2:["Bones cracked, skin split, blood blisters, can't use it"],3:["Tissue destroyed, bones pulverized, amputation possible"]},signs:["💜 Swelling: Rapid, massive — tissue filling with blood","🖤 Blood blisters: Large dark blisters = deep damage","⚡ Sensation: Numbness = nerves crushed. Tingling = partial","🫀 Capillary refill (blood flow test): Press nail — should pink in 2 seconds. Slow = blood supply damaged","🦴 Crepitus (bone grinding): Grinding = multiple small bones shattered"],doEx:{1:["/do Their {z} badly swollen, deep purple. Throbbing."],2:["/do Their {z} crushed — skin split, blood blisters. Bones grinding. Can't move it."]},rec:["Crushed digits may need amputation","Permanent dexterity/balance loss possible","Healing slow — deep damage"],drugs:["Morphine for severe","Ether if amputation"]},
  frostbite:{sym:{1:["White/gray skin, numb, waxy, tingling then burning as warming begins"],2:["Darkening, blisters forming, hard/frozen, no feeling"],3:["Tissue black and dead — gangrene, amputation likely"]},signs:["🥶 Color: White/gray = frostbitten. Darkening = dying. Black = dead","👆 Sensation: Numb/waxy frozen. BURNING during rewarm","🧊 Texture: Hard, wooden when frozen. Blisters during thaw","⚠️ Key: Do NOT apply direct heat — gradual only","🖤 Gangrene: Black, foul-smelling = dead, needs removal"],doEx:{1:["/do Their {z} white and waxy. Numb. Burning pain building as warmth returns."],2:["/do Their {z} darkening, blistered, hard. No feeling. Tissue dying."]},rec:["Gradual rewarming — NO direct heat","Don't pop blisters","Black tissue = gangrene = amputation","Nerve damage may be permanent"],drugs:["Aspirin for rewarming pain","Morphine if tissue dying — thaw pain is severe"]},
  strangulation:{sym:{1:["Sore throat, hoarse voice, red marks on neck, coughing"],2:["Bruising around throat, raspy/whispery voice, difficulty breathing","Bloodshot eyes, petechiae (tiny red dots from burst blood vessels on face/eyes)"],3:["Crushed windpipe — can barely or can't breathe at all","Face dark red/purple, eyes bulging, losing consciousness"]},
    signs:["🔴 Petechiae (burst blood vessels): Tiny red dots on face, eyelids, whites of eyes = burst vessels from pressure","💜 Marks: Bruising pattern tells the story — rope vs hands vs arm look different","👁️ Bloodshot: Burst vessels in whites of eyes","🗣️ Voice: Hoarse -> whispery -> gone = increasing windpipe damage","😤 Stridor (airway wheeze): High-pitched wheeze on inhale = swollen/narrowed airway","🫀 Pulse: May be irregular — carotid pressure causes rhythm problems","🧠 Memory: May have gap around the event from brief unconsciousness","⚠️ Delayed danger: Swelling can worsen HOURS later and close the airway"],
    doEx:{1:["/do Red marks across throat. Voice hoarse. Coughing. Tender to touch."],2:["/do Bruising around throat — finger-shaped marks. Voice barely a whisper. Tiny red dots on face and in whites of eyes. Struggling to breathe."],3:["/do Throat crushed. Can barely get air. Face dark red. Eyes bloodshot, bulging. Fading."]},rec:["Even 'minor' strangulation can swell hours later and close airway","Voice may take days to weeks to return","Swallowing painful for days","This is an assault — lawman component here"],drugs:["Aspirin for swelling","Morphine if windpipe damage severe","Belladonna may help airway inflammation"]},
  blast_shrapnel:{sym:{1:["Peppered with small fragments, stinging, bleeding from multiple small wounds","Ringing ears, disoriented from the blast concussion"],2:["Multiple shrapnel embedded deep, heavy bleeding from several points","Burns on exposed skin, clothes singed or shredded","Temporary deafness, severe disorientation, knocked off feet"],3:["Large shrapnel fragments embedded in the body, catastrophic bleeding","Blast burns across exposed areas, clothing fused to skin in places","Completely deaf, severe concussion, may have been thrown by the blast"],4:["Devastating fragmentation injuries, tissue shredded","Organs perforated by shrapnel, bones shattered","Massive burns, unconscious from blast force"],5:["Catastrophic blast injuries, barely recognizable wound pattern","Body riddled with fragments, massive blood loss from everywhere","Near-fatal concussive damage, may not survive"]},
    signs:["💥 Blast pattern: Injuries on the SIDE FACING the explosion are worst — the other side may be untouched","🩸 Multiple bleed points: Dozens of small wounds all bleeding at once — hard to prioritize","🔥 Blast burns: Flash burns on exposed skin, may be mixed with embedded debris and soot","👂 Hearing: Likely temporary or permanent deafness — eardrums may be ruptured from pressure wave","🧠 Concussion: The pressure wave itself causes brain injury even without head contact","🫁 Blast lung: Pressure wave can damage lungs internally — watch for coughing blood, difficulty breathing with no visible chest wound","👁️ Eyes: Flash blindness, debris in eyes, possible corneal damage from fragments","🦴 Shrapnel in bone: Fragments can lodge in bone — fragments may be lodged deep in bone","📐 Fragment types: Wood splinters, metal shards, rocks, nails — each creates its own wound track","⚠️ Embedded debris: Dirt, fabric, wood all blasted into the wounds — infection risk is VERY high","😰 Shock: Multiple bleeding points + burns + concussion = shock develops fast"],
    doEx:{1:["/do Peppered with small cuts and fragments across their {z}. Ears ringing. Dazed. Soot and blood. Small pieces of metal and wood embedded in the skin."],2:["/do Shrapnel embedded deep in their {z}. Bleeding from multiple points. Burns across exposed skin. Clothes torn and singed. Can barely hear. Staggering, disoriented."],3:["/do Their {z} is shredded — large fragments of metal embedded in the flesh. Burns and blood everywhere. Completely deaf. Knocked senseless by the blast."],4:["/do Devastating blast injuries to their {z}. Tissue torn apart by shrapnel. Burns fused with clothing. Unconscious. Bleeding from everywhere."]},
    rec:["Every single wound needs to be cleaned — blast debris causes terrible infections","Dozens of fragments may need to be extracted over multiple visits","Burns and shrapnel wounds together make treatment complex and painful","Hearing may take days to weeks to return, or may be permanent loss","The concussive effect lingers — headaches, confusion, sensitivity to noise","PTSD from explosions is real — flinching at loud noises, flashbacks, nightmares are all natural to explore"],
    drugs:["Morphine almost certainly — multiple wounds plus burns is overwhelming pain","Ether if surgery needed to extract deep fragments","Cocaine paste for individual wound cleaning","The sheer number of wounds means prolonged drug exposure — addiction risk is high"]},
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
  chickenpox:{l:"Chickenpox",i:"🔴",sym:["Fever, fatigue","Rash: bumps->blisters->scabs","SEVERE itching","Adults worse than kids"],doEx:["/do Covered in spots. Miserable. Scratching."],rec:"~2 weeks. Immune after. Scarring possible.",drugs:["Topical only"],fol:["DO NOT SCRATCH","Immune for life"]},
  smallpox:{l:"Smallpox",i:"⚠️",sym:["Fever, vomiting","Mouth ulcers","Dimpled blisters->scabs->scars","~30% fatal","Can blind"],doEx:["/do Dimpled blisters. Feverish, vomiting. Terrified."],rec:"~3 in 10 die. Permanent scars. Possible blindness.",drugs:["No treatment — rest and isolation"],fol:["Permanent scars","Possible blindness","Prevention: variolation/vaccination"]},
  measles:{l:"Measles",i:"🔴",sym:["Fever, body aches","Dry cough","Red swollen eyes","Light sensitivity","Red-brown rash"],doEx:["/do Blotchy rash. Red watering eyes. Shielding from light."],rec:"Keep warm. Immune after.",drugs:["Phenacetin (excess = dizziness/seizures)","Belladonna for cough"],fol:["Stay warm","Light sensitivity, coughing"]},
  rabies:{l:"Rabies",i:"🐺",sym:["Fever","Excess drooling","Confusion->aggression","Can't drink despite thirst","Loss of balance"],doEx:["/do Drooling, wild-eyed. Snapping. Can't drink. Feral."],rec:"NO recovery. 100% fatal once symptomatic. Get vaccine BEFORE symptoms.",drugs:["Vaccine prevents — can't cure","Morphine for euthanasia"],fol:["End-of-life once symptomatic","If bitten: GET VACCINE NOW"]},
  poisoning:{l:"Poisoning",i:"☠️",sym:["Nausea, vomiting","Hallucinations possible","Unconsciousness or seizures"],doEx:["/do Violently ill, vomiting, disoriented."],rec:"Depends on poison. Hours to days.",drugs:["Charcoal, fluids — no addiction risk"],fol:["Stay hydrated","Someone may have poisoned you"]},
  hypothermia:{l:"Hypothermia",i:"🥶",sym:["Shivering (stops when severe)","Slurred speech","Slow breathing","Confusion->unconsciousness"],doEx:["/do Shivering, lips blue, slurring. Stumbling."],rec:"Gradual rewarming over hours.",drugs:["Warmth and fluids only"],fol:["Stay warm and dry"]},
  hyperthermia:{l:"Heat Stroke",i:"🥵",sym:["Heavy sweating","Red hot skin","Erratic pulse","Nausea, headache, confusion"],doEx:["/do Flushed, burning hot. Barely coherent."],rec:"Hours to stabilize.",drugs:["Cooling and hydration only"],fol:["Small sips — not all at once"]},
};

// ═══════════════════════════════════════════════════════════════════════════════
// JOURNAL DATA — all injuries + illnesses as flat searchable list
// ═══════════════════════════════════════════════════════════════════════════════
const JOURNAL = [
  ...Object.entries(OD).map(([k,v])=>({id:k,type:"injury",label:IT[k]&&IT[k].l||k,icon:IT[k]&&IT[k].i||"",data:v,cat:"Injuries"})),
  ...Object.entries(ILL).map(([k,v])=>({id:k,type:"illness",label:v.l,icon:v.i,data:v,cat:"Illnesses"})),
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════
function Body({back,markers,act,onClick}){
  var ref=useRef(null);
  var vis=Z.filter(function(z){return back?(z.bo||!["chest","abdomen"].includes(z.reg)):!z.bo;});
  var hnd=function(e){var svg=ref.current;if(!svg)return;var pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;var sp=pt.matrixTransform(svg.getScreenCTM().inverse());var b=null,bd=99;vis.forEach(function(z){var d=Math.hypot(sp.x-z.x,sp.y-z.y);if(d<z.r+18&&d<bd){b=z;bd=d;}});if(b)onClick(b,sp.x,sp.y);};
  return(
    <svg ref={ref} viewBox="0 0 300 510" onClick={hnd} style={{width:"100%",maxWidth:260,height:"auto",cursor:"crosshair",userSelect:"none"}}>
      <defs>
        <radialGradient id="hg"><stop offset="0%" stopColor="#b22222" stopOpacity=".4"/><stop offset="100%" stopColor="#b22222" stopOpacity="0"/></radialGradient>
        <filter id="gl"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <g transform="translate(24,0) scale(1.09)">
        {back
          ? <path d="M 111.620 1.233 C 106.487 2.592, 100.686 8.538, 98.643 14.536 C 95.007 25.206, 98.201 48.068, 104.436 56 C 105.154 56.913, 105.458 59.756, 105.214 63.262 L 104.814 69.024 97.876 73.512 C 93.333 76.450, 89.826 78.003, 87.719 78.008 C 81.434 78.022, 71.516 80.144, 67.696 82.291 C 63.763 84.502, 58.597 91.953, 56.182 98.899 C 55.532 100.769, 55 106.237, 55 111.050 C 55 115.863, 54.100 125.066, 53 131.500 C 51.900 137.934, 51 145.682, 51 148.717 C 51 153.010, 50.110 156.213, 46.991 163.139 C 42.056 174.100, 39.451 183.618, 38.013 195.951 C 37.406 201.149, 35.905 208.333, 34.675 211.916 C 32.609 217.939, 32.179 218.482, 28.970 219.123 C 26.496 219.616, 24.352 221.198, 21.500 224.633 C 19.300 227.282, 15.548 231.353, 13.162 233.678 C 10.776 236.003, 9.115 238.377, 9.471 238.953 C 10.693 240.930, 16.246 240.049, 19.839 237.309 L 23.366 234.619 18.646 243.492 C 16.050 248.372, 14.154 252.958, 14.432 253.682 C 15.441 256.312, 18.020 254.887, 22 249.500 C 24.235 246.475, 26.253 244, 26.485 244 C 26.716 244, 25.698 247.360, 24.220 251.467 C 22.060 257.473, 21.781 259.181, 22.795 260.195 C 24.793 262.193, 27.069 260.043, 29.409 253.949 L 31.500 248.500 31.801 254.301 C 32.015 258.416, 32.553 260.275, 33.652 260.697 C 35.742 261.499, 36.946 259.324, 37.084 254.500 C 37.148 252.300, 37.597 249.375, 38.083 248 C 38.770 246.058, 38.875 246.492, 38.553 249.945 C 38.145 254.318, 39.235 258, 40.937 258 C 42.297 258, 44 252.129, 44 247.440 C 44 245.096, 44.894 240.326, 45.987 236.839 C 47.080 233.353, 47.980 228.750, 47.987 226.611 C 47.996 223.795, 50.019 218.688, 55.313 208.111 C 65.451 187.855, 67.560 182.470, 71.414 167 C 73.263 159.575, 75.336 152.150, 76.020 150.500 L 77.264 147.500 79.057 153.345 C 81.581 161.567, 81.915 193.345, 79.628 207.500 C 75.717 231.698, 78.726 272.375, 86.691 303 C 90.870 319.065, 91.172 327.179, 88.096 340.739 C 85.624 351.637, 85.428 362.936, 87.554 372 C 88.393 375.575, 92.509 389.909, 96.701 403.854 L 104.324 429.208 102.127 435.314 C 99.512 442.581, 97.769 444.739, 94.746 444.451 C 93.511 444.333, 91.503 444.858, 90.285 445.618 C 89.067 446.378, 87.449 447, 86.690 447 C 85.931 447, 84.594 447.792, 83.718 448.759 C 82.251 450.380, 82.309 450.695, 84.455 452.761 C 86.599 454.824, 86.845 454.863, 87.530 453.251 C 88.173 451.740, 88.380 451.842, 89.038 454 C 89.668 456.066, 89.820 456.153, 89.915 454.500 C 90.017 452.717, 90.166 452.770, 91.286 454.983 C 91.977 456.349, 93.658 457.772, 95.021 458.144 C 106.214 461.204, 114.569 461.836, 118.191 459.898 C 119.714 459.083, 120.833 459.108, 122.488 459.994 C 126.069 461.910, 144.160 459.772, 147.447 457.044 C 148.723 455.985, 149.003 456, 149.015 457.128 C 149.025 458.020, 149.287 458.125, 149.765 457.427 C 150.169 456.837, 151.316 456.053, 152.313 455.684 C 153.311 455.316, 153.874 454.605, 153.565 454.104 C 153.255 453.604, 154.432 452.697, 156.179 452.088 C 159.220 451.027, 159.273 450.918, 157.428 449.522 C 156.367 448.720, 154.862 448.049, 154.083 448.032 C 153.304 448.014, 152.989 447.678, 153.383 447.284 C 153.777 446.890, 152.389 446.076, 150.299 445.474 C 148.210 444.872, 146.242 444.754, 145.928 445.211 C 144.913 446.686, 141.128 442.462, 138.939 437.412 C 135.991 430.609, 136.600 426.621, 144.498 401 C 148.143 389.175, 151.831 376.575, 152.695 373 C 154.944 363.687, 154.721 350.317, 152.141 339.671 C 149.349 328.157, 149.421 319.691, 152.405 308.500 C 159.261 282.788, 162 261.114, 162 232.564 C 162 218.181, 161.556 211.785, 160.003 203.785 C 157.083 188.746, 157.158 164.320, 160.155 154.208 C 161.344 150.198, 162.655 147.273, 163.069 147.708 C 164.022 148.710, 168.328 163.245, 170.480 172.726 C 172.579 181.971, 175.034 187.945, 185.002 208.066 C 190.563 219.290, 192.935 225.121, 192.556 226.632 C 192.252 227.843, 192.893 231.684, 193.979 235.167 C 195.065 238.650, 196.251 244.759, 196.614 248.741 C 197.013 253.117, 197.844 256.455, 198.713 257.177 C 200.875 258.971, 202.116 256.409, 201.781 250.844 C 201.626 248.283, 201.838 246.397, 202.250 246.653 C 202.662 246.909, 203 249.087, 203 251.494 C 203 256.892, 204.473 261, 206.408 261 C 208.450 261, 209.225 257.841, 208.550 252.263 C 207.933 247.160, 208.178 247.453, 211.886 256.250 C 213.351 259.728, 214.438 261, 215.944 261 C 218.628 261, 218.632 258.164, 215.957 251.127 C 213.058 243.500, 213.963 242.864, 218.338 249.455 C 220.846 253.232, 222.668 255.018, 223.791 254.802 C 226.707 254.240, 226.249 251.377, 222.059 243.984 C 217.197 235.404, 216.982 233.966, 221.077 237.411 C 224.182 240.024, 229.333 240.888, 230.505 238.992 C 231.535 237.326, 215.024 220.063, 211.546 219.168 C 206.757 217.936, 204.004 210.436, 201.974 193.088 C 200.751 182.640, 196.340 167.995, 192.371 161.203 C 190.321 157.693, 189.699 154.850, 188.984 145.703 C 188.502 139.541, 187.606 132.025, 186.992 129 C 186.379 125.975, 185.759 118.325, 185.615 112 C 185.380 101.659, 185.071 99.946, 182.548 95 C 176.332 82.811, 172.970 80.548, 158.158 78.585 C 149.834 77.482, 147.644 76.766, 142.303 73.404 L 136.106 69.503 135.447 63.354 C 134.883 58.079, 135.083 56.799, 136.857 54.352 C 140.230 49.701, 143.390 36.582, 143.446 27 C 143.507 16.521, 141.417 10.513, 136.012 5.630 C 130.089 0.279, 121.249 -1.315, 111.620 1.233 M 114.340 2.903 C 104.695 5.367, 99.943 12.264, 99.214 24.860 C 98.696 33.806, 101.794 48.599, 105.182 53.355 C 106.962 55.855, 107.131 57.113, 106.535 63.468 L 105.855 70.725 99.178 75.018 C 93.232 78.841, 91.439 79.452, 82.827 80.590 C 71.196 82.128, 67.877 83.697, 63.689 89.639 C 58.302 97.281, 57.122 101.410, 57.012 113 C 56.958 118.775, 56.507 125.525, 56.012 128 C 55.516 130.475, 54.590 138.101, 53.953 144.946 C 52.963 155.588, 52.375 158.138, 49.893 162.536 C 45.429 170.446, 42.145 181.251, 40.031 194.989 C 37.216 213.277, 34.110 221, 29.571 221 C 27.855 221, 25.061 223.343, 19.594 229.365 C 15.417 233.965, 12 238.046, 12 238.432 C 12 239.730, 16.475 237.799, 19.055 235.388 C 20.460 234.074, 22.121 233, 22.746 233 C 25.416 233, 24.878 235.560, 20.514 243.632 C 17.963 248.350, 16.154 252.487, 16.493 252.826 C 16.831 253.165, 17.422 252.983, 17.804 252.423 C 23.095 244.672, 25.337 242, 26.548 242 C 28.523 242, 28.372 244.604, 26 251.500 C 22.075 262.908, 24.370 262.912, 28.531 251.505 C 32.178 241.504, 34.305 241.277, 33.859 250.936 C 33.461 259.544, 34.519 261.125, 35.438 253.296 C 36.347 245.554, 36.870 244, 38.567 244 C 40.202 244, 40.325 244.610, 40.081 251.500 C 39.949 255.203, 40.171 256.111, 40.936 255 C 41.504 254.175, 41.976 251.686, 41.985 249.468 C 41.993 247.250, 42.690 242.975, 43.534 239.968 C 44.377 236.961, 45.438 231.575, 45.892 228 C 46.531 222.961, 48.627 217.453, 55.214 203.500 C 64.330 184.188, 65.660 180.665, 69.367 166 C 70.688 160.775, 72.877 153.780, 74.230 150.456 C 76.362 145.224, 76.594 143.546, 75.964 137.956 C 74.024 120.754, 73.950 119.551, 74.892 120.513 C 75.422 121.056, 76.602 127.125, 77.513 134 C 78.425 140.875, 80.236 150.100, 81.538 154.500 C 83.541 161.268, 83.927 164.886, 84.046 178 C 84.133 187.708, 83.597 197.424, 82.611 204 C 79.952 221.733, 80.874 257.302, 84.567 279.500 C 85.390 284.450, 87.583 294.575, 89.439 302 C 94.405 321.863, 94.503 323.540, 91.556 338.331 C 87.233 360.032, 87.742 364.576, 98.522 400.500 C 102.153 412.600, 105.364 424.525, 105.658 427 C 106.370 433.011, 102.955 442.009, 97.865 447.531 C 93.961 451.766, 92.957 454.785, 95.250 455.395 C 95.937 455.578, 98.525 456.259, 101 456.908 C 103.475 457.556, 106.400 458.344, 107.500 458.658 C 109.292 459.169, 109.266 459.054, 107.250 457.557 C 104.349 455.403, 104.270 449.257, 107.016 439.500 C 108.678 433.595, 108.909 433.204, 108.493 437 C 106.786 452.575, 106.747 453.990, 107.980 455.476 C 109.654 457.493, 113.443 457.414, 115.540 455.318 C 116.851 454.006, 117.080 452.628, 116.577 449.068 C 114.572 434.873, 114.965 432.632, 117.451 444.091 L 118.841 450.500 118.888 435.500 C 118.914 427.250, 118.497 417.350, 117.962 413.500 C 117.427 409.650, 116.996 393.900, 117.003 378.500 C 117.011 363.100, 116.565 346.941, 116.013 342.591 C 115.278 336.805, 115.327 333.583, 116.196 330.591 C 116.849 328.341, 117.488 322.450, 117.617 317.500 C 118.741 274.231, 119.121 246, 118.579 246 C 118.222 246, 116.806 246.736, 115.433 247.636 C 112.261 249.714, 100.392 250.617, 95.891 249.122 C 91.760 247.750, 86.220 243.462, 87.244 242.429 C 87.653 242.017, 88.778 242.384, 89.744 243.246 C 95.771 248.626, 116.116 247.353, 118.379 241.455 C 118.720 240.565, 119.053 236.161, 119.118 231.668 C 119.287 220.019, 120.728 215.069, 120.882 225.610 C 120.947 230.071, 121.293 235.860, 121.652 238.475 C 122.236 242.737, 122.675 243.388, 125.902 244.773 C 128.059 245.699, 132.703 246.354, 137.500 246.409 C 144.107 246.484, 146.163 246.108, 149.307 244.250 C 154.066 241.437, 154.834 241.410, 152.405 244.141 C 147.263 249.921, 134.524 251.782, 126.141 247.978 C 123.743 246.890, 121.542 246, 121.249 246 C 120.511 246, 121.911 299.419, 123.097 316.500 C 124.255 333.188, 124.258 333.513, 123.666 375.500 C 123.409 393.650, 122.708 412.550, 122.108 417.500 C 121.142 425.465, 120.703 458.302, 121.647 452 C 122.697 444.987, 124.391 437.333, 125.188 436 C 125.733 435.088, 125.779 436.263, 125.306 439 C 124.877 441.475, 124.521 446.148, 124.514 449.384 C 124.498 456.002, 125.897 457.745, 130.330 456.632 C 133.961 455.721, 134.488 452.651, 132.589 443.470 C 130.126 431.560, 130.874 429.298, 133.572 440.500 C 136.192 451.381, 135.996 455.189, 132.698 457.499 C 129.944 459.428, 132.039 459.428, 136.654 457.500 C 138.629 456.675, 141.259 456, 142.500 456 C 143.740 456, 145.315 455.325, 146 454.500 C 147.392 452.823, 147.029 452.151, 141.411 446 C 139.652 444.075, 137.215 439.713, 135.993 436.307 C 133.346 428.921, 133.183 429.858, 142.657 398 C 148.755 377.495, 152 363.189, 152 356.805 C 152 355.192, 150.875 348.443, 149.500 341.806 C 146.219 325.970, 146.313 319.790, 150.056 305.318 C 156.002 282.325, 158.411 264.671, 159.515 236 C 160.068 221.620, 159.872 217.958, 157.985 207.500 C 156.579 199.711, 155.671 189.817, 155.396 179.304 C 154.986 163.582, 155.060 162.834, 157.910 153.804 C 159.525 148.687, 161.621 139.550, 162.568 133.500 C 164.333 122.222, 165.971 116.822, 165.904 122.500 C 165.884 124.150, 165.289 129.550, 164.580 134.500 C 163.296 143.474, 163.301 143.521, 166.192 150.780 C 167.786 154.784, 170.432 163.334, 172.070 169.780 C 173.709 176.226, 177.115 186, 179.640 191.500 C 193.257 221.160, 194.059 223.149, 194.465 228.260 C 194.694 231.142, 195.583 235.469, 196.440 237.876 C 197.298 240.282, 198.045 244.332, 198.100 246.876 C 198.155 249.419, 198.560 252.625, 199 254 C 199.593 255.851, 199.827 254.859, 199.900 250.177 C 199.985 244.784, 200.251 243.902, 201.706 244.182 C 203.743 244.574, 204.765 247.795, 204.900 254.250 C 204.957 256.974, 205.469 259, 206.099 259 C 206.828 259, 207.080 256.562, 206.849 251.750 C 206.395 242.317, 208.278 242.022, 211.652 250.997 C 212.995 254.571, 214.523 257.923, 215.047 258.447 C 216.673 260.073, 216.134 255.856, 213.999 250.239 C 212.900 247.346, 212 244.308, 212 243.489 C 212 240.421, 215.070 242.180, 219 247.500 C 221.235 250.525, 223.501 253, 224.037 253 C 224.572 253, 222.983 249.251, 220.505 244.668 C 218.027 240.085, 216 235.585, 216 234.668 C 216 232.526, 218.356 232.518, 220.128 234.655 C 221.729 236.586, 227.952 239.381, 228.788 238.545 C 229.103 238.230, 227.803 236.516, 225.898 234.736 C 223.994 232.956, 220.737 229.397, 218.660 226.827 C 216.117 223.679, 213.558 221.721, 210.820 220.827 C 207.095 219.611, 206.559 218.975, 204.416 213.229 C 203.129 209.780, 201.367 202.130, 200.501 196.229 C 198.361 181.653, 196.487 175.086, 191.449 164.500 C 187.690 156.603, 187.096 154.397, 186.596 146.500 C 186.283 141.550, 185.346 133.675, 184.515 129 C 183.683 124.325, 183.002 116.212, 183.001 110.972 C 183 102.200, 182.731 100.882, 179.609 94.367 C 174.763 84.255, 170.414 81.657, 156.210 80.387 C 149.193 79.759, 147.862 79.268, 141.401 74.920 L 134.303 70.143 133.677 63.440 C 133.148 57.780, 133.350 56.317, 134.976 54.033 C 139.945 47.055, 142.809 24.702, 139.862 15.899 C 138.300 11.235, 134.467 6.293, 131.034 4.518 C 127.493 2.686, 118.569 1.823, 114.340 2.903 M 114.500 53.895 C 113.054 54.518, 114.440 54.869, 119.500 55.160 C 123.350 55.381, 126.688 55.436, 126.917 55.281 C 129.118 53.795, 117.690 52.519, 114.500 53.895 M 111.723 108.232 C 112.266 116.559, 112.147 117.260, 109.155 123.337 C 107.314 127.076, 103.965 131.630, 101.052 134.355 C 95.909 139.165, 95.602 139.788, 99.316 137.875 C 103.021 135.967, 106.009 132.746, 109.677 126.709 C 113.893 119.769, 114.887 112.256, 112.617 104.500 L 111.154 99.500 111.723 108.232 M 126.991 107.545 C 125.534 114.563, 126.330 119.251, 130.103 125.856 C 133.605 131.989, 140.293 139, 142.641 139 C 143.675 139, 142.585 137.506, 139.691 134.959 C 137.166 132.736, 133.615 128.349, 131.800 125.209 C 128.700 119.846, 128.510 118.970, 128.660 110.750 C 128.747 105.938, 128.667 102, 128.480 102 C 128.294 102, 127.624 104.495, 126.991 107.545 M 119.636 145.640 C 118.738 152.194, 118.952 178.713, 119.943 183.500 C 120.480 186.100, 120.810 179.360, 120.885 164.250 C 120.948 151.463, 120.836 141, 120.636 141 C 120.436 141, 119.986 143.088, 119.636 145.640 M 62.091 170.390 C 61.356 171.276, 59.348 172.007, 57.628 172.015 C 55.240 172.027, 54.855 172.260, 56 173 C 56.825 173.533, 58.201 173.976, 59.059 173.985 C 61.329 174.007, 64.344 171.533, 63.851 170.053 C 63.534 169.103, 63.088 169.189, 62.091 170.390 M 176 169.723 C 176 170.255, 176.882 171.488, 177.960 172.464 C 179.406 173.772, 180.651 174.037, 182.710 173.472 L 185.500 172.708 182.256 171.982 C 180.472 171.582, 178.335 170.693, 177.506 170.005 C 176.678 169.318, 176 169.190, 176 169.723 M 119.499 311.250 C 119.144 314.141, 119.308 317.624, 119.864 319 C 120.677 321.013, 120.886 319.990, 120.937 313.750 C 120.971 309.488, 120.807 306, 120.572 306 C 120.337 306, 119.854 308.363, 119.499 311.250 M 100.650 323.267 C 99.182 324.340, 99.838 324.533, 104.959 324.533 C 111.132 324.533, 112.775 323.709, 108.750 322.630 C 105.213 321.682, 102.528 321.893, 100.650 323.267 M 130.650 323.267 C 129.182 324.340, 129.838 324.533, 134.959 324.533 C 141.132 324.533, 142.775 323.709, 138.750 322.630 C 135.213 321.682, 132.528 321.893, 130.650 323.267 M 119.077 328.267 C 118.144 331.094, 118.092 336.493, 118.855 351.231 C 119.404 361.829, 119.598 378.190, 119.285 387.589 C 118.973 396.989, 119.098 406.439, 119.564 408.589 C 120.386 412.385, 120.429 412.294, 121.041 405.500 C 121.387 401.650, 121.456 388.600, 121.194 376.500 C 120.913 363.552, 121.174 350.386, 121.829 344.500 C 122.710 336.567, 122.667 333.474, 121.618 329.535 L 120.297 324.571 119.077 328.267 M 118 454.005 C 118 454.740, 117.238 456.185, 116.306 457.214 C 114.759 458.924, 114.756 459.031, 116.268 458.451 C 118.018 457.779, 119.593 454.259, 118.591 453.258 C 118.266 452.933, 118 453.269, 118 454.005 M 149 454.559 C 149 455.416, 149.457 455.835, 150.016 455.490 C 150.575 455.144, 150.774 454.443, 150.457 453.931 C 149.600 452.544, 149 452.802, 149 454.559 M 122 455.941 C 122 456.459, 122.445 457.157, 122.989 457.493 C 123.555 457.843, 123.723 457.442, 123.382 456.552 C 122.717 454.820, 122 454.503, 122 455.941" fill="#edf0f3" fillRule="evenodd" stroke="#333" strokeWidth="0.7"/>
          : <path d="M 101.259 1.659 C 95.944 3.541, 90.685 9.539, 88.868 15.792 C 85.964 25.785, 88.879 47.093, 94.143 54.352 C 95.918 56.800, 96.118 58.078, 95.552 63.361 L 94.892 69.518 88.196 73.626 C 82.672 77.015, 80.275 77.851, 74.500 78.408 C 59.323 79.871, 55.195 82.306, 49.464 93.177 C 45.711 100.295, 45.598 100.808, 45.435 111.500 C 45.343 117.550, 44.570 126.550, 43.717 131.500 C 42.863 136.450, 41.863 144.313, 41.494 148.972 C 41.010 155.095, 40.182 158.562, 38.510 161.472 C 34.932 167.699, 31.329 178.735, 30.004 187.523 C 26.231 212.544, 24.435 217.937, 19.454 219.187 C 15.979 220.059, -0.541 237.316, 0.495 238.992 C 1.564 240.722, 6.607 240.097, 9.418 237.886 C 10.896 236.723, 12.319 235.986, 12.581 236.247 C 12.842 236.509, 11.217 239.968, 8.969 243.935 C 4.753 251.375, 4.289 254.239, 7.209 254.802 C 8.332 255.018, 10.154 253.232, 12.662 249.455 C 17.012 242.902, 17.963 243.482, 15.038 250.902 C 12.345 257.736, 12.351 261, 15.056 261 C 16.562 261, 17.649 259.728, 19.114 256.250 C 22.826 247.443, 23.086 247.128, 22.568 252.063 C 21.990 257.578, 22.760 261, 24.581 261 C 26.687 261, 28 257.592, 28 252.125 C 28 249.371, 28.394 246.875, 28.875 246.577 C 29.356 246.280, 29.523 248.050, 29.246 250.510 C 28.928 253.334, 29.207 255.544, 30.004 256.504 C 32.165 259.108, 33.669 256.469, 34.379 248.827 C 34.746 244.885, 35.981 238.581, 37.124 234.816 C 38.268 231.052, 38.922 227.239, 38.578 226.342 C 38.196 225.347, 41.862 216.635, 47.999 203.954 C 55.341 188.782, 58.599 180.814, 60.103 174.347 C 63.252 160.812, 67.257 147.845, 68.019 148.718 C 72.015 153.290, 73.585 186.761, 70.612 204 C 69.485 210.535, 68.974 219.433, 68.973 232.512 C 68.973 260.882, 71.056 278.272, 77.562 304.199 C 81.419 319.569, 81.885 327.795, 79.435 337.250 C 76.989 346.689, 76.116 357.376, 77.126 365.511 C 77.631 369.580, 81.635 384.881, 86.022 399.513 C 90.410 414.145, 94 427.463, 94 429.108 C 94 432.412, 92.002 436.792, 88.233 441.750 C 85.950 444.753, 82.976 446.467, 84.595 443.845 C 85.428 442.498, 83.439 443.500, 80.813 445.750 C 79.885 446.545, 78.716 446.942, 78.214 446.633 C 77.280 446.055, 73 449.489, 73 450.817 C 73 451.837, 76.726 454.941, 77.282 454.384 C 77.530 454.136, 79.706 454.600, 82.117 455.414 C 89.548 457.925, 103.104 459.468, 114.500 459.099 C 117.250 459.011, 120.989 458.968, 122.809 459.004 C 124.628 459.041, 128.678 458.402, 131.809 457.586 C 134.939 456.769, 139.233 455.824, 141.352 455.486 C 143.471 455.148, 144.926 454.593, 144.586 454.252 C 144.245 453.912, 145.378 453.040, 147.104 452.314 C 149.732 451.209, 150.039 450.752, 148.998 449.498 C 148.314 448.674, 147.415 448, 147 448 C 146.584 448, 144.502 447.245, 142.372 446.321 C 140.242 445.398, 137.834 444.610, 137.021 444.571 C 136.207 444.532, 133.733 441.872, 131.523 438.660 C 128.239 433.886, 127.542 432.062, 127.703 428.660 C 127.811 426.372, 130.872 414.863, 134.505 403.084 C 145.931 366.034, 146.939 358.560, 142.912 340.739 C 139.909 327.448, 140.114 319.815, 143.865 305.294 C 148.082 288.974, 150.620 273.598, 152.063 255.631 C 153.509 237.619, 152.770 212.179, 150.519 202.500 C 149.314 197.319, 148.910 190.823, 148.967 177.500 C 149.033 161.899, 149.330 158.634, 151.192 153 L 153.341 146.500 154.797 150 C 155.598 151.925, 157.715 159.350, 159.500 166.500 C 163.586 182.860, 165.878 188.809, 175.367 207.683 C 181.018 218.924, 183 223.889, 183 226.807 C 183 228.975, 183.725 232.718, 184.611 235.124 C 185.496 237.531, 186.553 242.972, 186.959 247.215 C 187.770 255.690, 189.311 258.816, 191.702 256.833 C 192.751 255.962, 192.994 254.272, 192.605 250.570 C 192.231 247.024, 192.331 246.252, 192.936 248 C 193.411 249.375, 193.852 252.300, 193.916 254.500 C 194.054 259.324, 195.258 261.499, 197.348 260.697 C 198.447 260.275, 198.985 258.416, 199.199 254.301 L 199.500 248.500 201.591 253.949 C 203.930 260.040, 206.207 262.193, 208.203 260.197 C 209.213 259.187, 209.022 257.716, 207.230 252.720 C 204.062 243.885, 204.459 242.724, 208.564 248.819 C 212.405 254.522, 214.466 255.934, 216.291 254.109 C 217.167 253.233, 216.282 250.771, 212.652 243.976 C 210.014 239.039, 208.090 235, 208.376 235 C 208.663 235, 210.111 236.125, 211.595 237.500 C 214.400 240.100, 220.288 240.961, 221.529 238.953 C 221.885 238.377, 220.221 236.014, 217.830 233.703 C 215.440 231.391, 211.688 227.323, 209.492 224.662 C 206.641 221.207, 204.509 219.625, 202.034 219.128 C 198.811 218.481, 198.411 217.963, 196.341 211.760 C 195.116 208.090, 193.443 199.934, 192.622 193.635 C 191.041 181.496, 186.347 165.700, 182.870 160.818 C 181.261 158.557, 180.593 155.472, 179.923 147.198 C 179.446 141.314, 178.540 134.025, 177.909 131 C 177.278 127.975, 176.477 119.650, 176.128 112.500 C 175.560 100.846, 175.195 98.910, 172.607 93.797 C 167.121 82.958, 161.711 79.692, 147.030 78.353 C 140.670 77.773, 138.663 77.093, 133.530 73.775 C 130.213 71.631, 127.200 69.068, 126.834 68.079 C 125.363 64.105, 125.625 57.374, 127.346 54.940 C 131.209 49.476, 133.500 39.073, 133.500 27 C 133.500 17.002, 133.207 14.952, 131.259 11.308 C 126.013 1.494, 113.288 -2.599, 101.259 1.659 M 103.500 3.476 C 97.686 5.035, 92.994 9.739, 91.166 15.841 C 88.323 25.330, 91.254 47.239, 96.210 53.540 C 98.813 56.849, 107.096 61, 111.095 61 C 114.800 61, 124.454 55.763, 126.498 52.644 C 127.278 51.453, 128.831 46.659, 129.951 41.990 C 134.948 21.145, 130.245 6.314, 117.632 3.137 C 112.031 1.727, 109.824 1.780, 103.500 3.476 M 97.581 60.439 C 97.276 61.572, 97.021 64.171, 97.014 66.213 C 97.001 69.642, 96.523 70.249, 90.752 74.168 C 84.909 78.136, 84.666 78.450, 87.002 79.021 C 88.413 79.366, 84.932 79.916, 79 80.285 C 60.887 81.412, 57.236 83.251, 51.687 94.038 C 48.194 100.828, 47.999 101.714, 47.982 110.853 C 47.971 116.159, 47.317 124.151, 46.528 128.613 C 45.738 133.075, 44.811 140.950, 44.466 146.113 C 43.913 154.415, 43.345 156.540, 39.554 164.500 C 34.502 175.107, 32.641 181.645, 30.478 196.370 C 29.601 202.348, 27.953 209.724, 26.817 212.760 C 24.923 217.823, 24.888 218.358, 26.397 219.202 C 28.952 220.632, 27.267 222.079, 24.509 220.822 C 20.762 219.115, 16.690 221.395, 11.025 228.371 C 8.288 231.742, 5.137 235.066, 4.024 235.758 C 2.911 236.451, 2 237.472, 2 238.028 C 2 239.688, 7.280 237.947, 10.055 235.371 C 16.209 229.659, 16.451 234.472, 10.536 244.936 C 5.796 253.322, 6.540 254.891, 11.849 247.704 C 18.275 239.006, 21.238 240.614, 17 250.500 C 15.900 253.066, 15.014 256.366, 15.030 257.833 C 15.059 260.346, 15.128 260.385, 16.234 258.500 C 16.880 257.400, 18.391 253.800, 19.593 250.500 C 22.719 241.915, 24.598 242.483, 24.142 251.876 C 23.889 257.093, 24.109 259.051, 24.892 258.567 C 25.502 258.190, 26.045 255.996, 26.100 253.691 C 26.241 247.762, 27.315 244.563, 29.294 244.182 C 30.747 243.902, 31.018 244.790, 31.118 250.177 C 31.212 255.187, 31.395 255.877, 32 253.500 C 32.420 251.850, 32.817 248.475, 32.882 246 C 32.948 243.525, 33.901 239.133, 35.001 236.239 C 37.246 230.332, 37.526 226.926, 35.900 225.300 C 35.100 224.500, 35.373 223.627, 36.900 222.100 C 38.055 220.945, 39 219.516, 39 218.924 C 39 218.332, 42.575 210.345, 46.943 201.174 C 51.638 191.319, 55.930 180.615, 57.437 175 C 58.840 169.775, 61.391 161.450, 63.106 156.500 C 67.115 144.931, 67.569 141.807, 65.670 138.862 C 64.833 137.563, 63.832 134.775, 63.447 132.666 C 62.666 128.393, 64.856 113.443, 66.079 114.700 C 66.507 115.140, 66.418 117.750, 65.882 120.500 C 64.858 125.749, 65.433 132.662, 67.219 136.582 C 68.720 139.876, 73.218 141.666, 83 142.863 L 91.500 143.904 97.315 140.350 C 100.514 138.396, 103.349 137.016, 103.616 137.283 C 103.884 137.550, 101.492 139.654, 98.301 141.958 L 92.500 146.147 85 145.567 C 80.875 145.247, 75.770 144.506, 73.656 143.920 C 71.542 143.334, 69.679 143, 69.516 143.177 C 69.353 143.355, 70.121 146.650, 71.222 150.500 C 74.248 161.081, 75.335 190.267, 73.178 203 C 72.055 209.629, 71.604 218.116, 71.686 231.086 C 71.866 259.662, 74.113 278.118, 80.492 303.413 C 84.618 319.776, 84.929 327.564, 81.954 339.977 C 77.521 358.468, 78.099 363.444, 88.879 399.565 C 98.158 430.659, 97.999 429.307, 93.403 438.053 C 91.337 441.985, 88.376 446.141, 86.823 447.289 C 85.270 448.437, 84 449.695, 84 450.085 C 84 450.659, 94.729 453, 97.357 453 C 97.738 453, 98.477 451.875, 99 450.500 C 100.330 447.001, 102.083 447.337, 101.360 450.952 C 100.839 453.555, 101.098 453.986, 103.553 454.603 C 105.752 455.155, 106.723 454.826, 108.169 453.040 C 109.752 451.085, 109.999 448.861, 109.992 436.639 C 109.988 428.863, 109.477 419.575, 108.855 416 C 108.234 412.425, 107.557 394.650, 107.352 376.500 C 107.146 358.350, 106.946 340.800, 106.906 337.500 C 106.867 334.200, 107.314 324.975, 107.901 317 C 108.487 309.025, 109.256 289.376, 109.608 273.336 L 110.249 244.172 107.975 243.836 C 105.662 243.494, 101.158 238.509, 102.211 237.456 C 102.528 237.138, 103.940 238.031, 105.348 239.439 C 108.748 242.839, 113.252 242.839, 116.652 239.439 C 118.060 238.031, 119.450 237.117, 119.742 237.408 C 120.805 238.472, 116.902 242.987, 114.368 243.622 L 111.762 244.277 112.495 275.888 C 112.899 293.275, 113.290 311.550, 113.366 316.500 C 113.441 321.450, 114.095 328.081, 114.819 331.236 C 115.543 334.390, 115.789 337.532, 115.365 338.218 C 114.942 338.903, 114.220 356.572, 113.761 377.482 C 113.302 398.392, 112.678 423.075, 112.376 432.333 C 112.073 441.592, 112.090 450.224, 112.415 451.517 C 113.083 454.178, 115.984 455.457, 119.105 454.467 C 120.810 453.925, 121.100 453.248, 120.630 450.899 C 119.989 447.696, 121.509 446.878, 122.471 449.908 C 123.329 452.613, 125.429 453.131, 130.809 451.965 C 138.355 450.329, 138.391 450.282, 134.707 447.048 C 130.556 443.403, 125 433.261, 125 429.328 C 125 426.435, 129.140 411.179, 135.536 390.500 C 142.571 367.754, 143.538 356.649, 139.869 340.739 C 137.141 328.908, 137.157 317.911, 139.917 308 C 146.589 284.042, 148.893 267.483, 149.656 238 C 150.179 217.835, 150.019 214.285, 148.120 203.797 C 146.560 195.187, 146 188.035, 146 176.735 C 146 162.314, 146.183 160.834, 148.995 152.516 C 150.642 147.643, 151.790 143.456, 151.546 143.212 C 151.302 142.968, 149.681 143.264, 147.943 143.870 C 146.206 144.476, 141.245 145.266, 136.920 145.627 L 129.056 146.283 123.452 142.051 C 116.713 136.964, 116.900 135.424, 123.693 140.067 C 127.822 142.889, 129.275 143.329, 134 143.185 C 152.744 142.618, 156.541 139.204, 155.795 123.590 C 155.412 115.577, 155.509 114.870, 156.636 117.511 C 158.769 122.515, 158.356 134.595, 155.901 138.962 L 153.803 142.696 157.412 152.332 C 159.397 157.632, 161.676 165.013, 162.476 168.734 C 164.915 180.077, 167.786 187.586, 175.933 203.930 C 178.556 209.194, 181.506 215.637, 182.487 218.250 C 183.469 220.863, 184.886 223, 185.636 223 C 187.223 223, 187.456 224.600, 186 225.500 C 184.508 226.422, 184.792 231.570, 186.567 235.782 C 187.429 237.827, 188.389 242.650, 188.700 246.500 C 189.012 250.350, 189.679 254.175, 190.184 255 C 190.785 255.981, 190.967 254.478, 190.711 250.657 C 190.415 246.225, 190.668 244.681, 191.761 244.261 C 193.832 243.467, 194.707 245.439, 195.479 252.646 C 196.435 261.575, 197.967 260.600, 197.279 251.500 C 196.804 245.227, 196.958 244, 198.222 244 C 199.191 244, 200.711 246.684, 202.468 251.500 C 203.972 255.625, 205.607 259, 206.101 259 C 207.388 259, 207.244 258.023, 205 251.500 C 202.628 244.604, 202.477 242, 204.452 242 C 205.663 242, 207.905 244.672, 213.196 252.423 C 213.578 252.983, 214.169 253.165, 214.507 252.826 C 214.846 252.487, 213.037 248.350, 210.486 243.632 C 207.935 238.915, 206.134 234.592, 206.483 234.027 C 207.523 232.346, 209.508 232.848, 211.905 235.399 C 213.883 237.504, 218.354 239.313, 219.283 238.383 C 219.465 238.202, 215.905 234.103, 211.373 229.276 C 203.219 220.593, 203.084 220.502, 198.566 220.674 C 196.055 220.769, 194 220.432, 194 219.924 C 194 219.416, 194.675 219, 195.500 219 C 197.343 219, 197.392 219.534, 194.959 213.133 C 193.837 210.182, 192.036 201.999, 190.955 194.950 C 188.908 181.592, 184.502 167.301, 180.524 161.113 C 178.700 158.276, 178.055 155.459, 177.520 148 C 177.145 142.775, 176.152 134.675, 175.312 130 C 174.472 125.325, 173.855 117.208, 173.941 111.962 C 174.093 102.665, 173.994 102.220, 170.015 94.270 C 166.267 86.782, 165.506 85.905, 160.717 83.562 C 156.355 81.428, 153.451 80.892, 143 80.289 C 135.559 79.860, 131.916 79.350, 134 79.028 L 137.500 78.489 131.358 74.669 L 125.217 70.850 124.532 64.455 L 123.847 58.061 119.174 60.474 C 111.700 64.333, 110.100 64.413, 103.805 61.237 C 98.245 58.433, 98.124 58.417, 97.581 60.439 M 109 188.309 C 109 189.789, 109.423 191, 109.941 191 C 111.643 191, 111.846 189.510, 110.411 187.548 C 109.068 185.710, 109 185.747, 109 188.309 M 26.369 226.480 C 26.057 227.294, 24.248 228.920, 22.348 230.094 C 18.349 232.566, 18.617 233.815, 22.777 232.092 C 25.676 230.892, 30.035 225, 28.025 225 C 27.427 225, 26.682 225.666, 26.369 226.480 M 194.420 227.844 C 195.380 229.701, 197.526 231.739, 199.315 232.491 C 202.794 233.955, 204.581 233.464, 201.682 231.842 C 200.691 231.287, 198.267 229.417, 196.295 227.686 L 192.710 224.538 194.420 227.844 M 110.100 314.691 C 110.169 320.131, 110.442 321.742, 111 320 C 112.165 316.361, 112.165 308.220, 111 307.500 C 110.363 307.106, 110.036 309.716, 110.100 314.691 M 86.136 324.010 C 85.953 330.080, 89.372 334, 94.849 334 C 96.922 334, 99.491 333.339, 100.559 332.532 C 102.846 330.802, 102.141 330.616, 98.517 331.993 C 92.997 334.092, 87.971 329.849, 86.683 322 C 86.455 320.611, 86.212 321.505, 86.136 324.010 M 134.596 324.340 C 133.436 330.523, 128.063 333.602, 122.008 331.554 C 119.772 330.798, 119.656 330.881, 120.880 332.356 C 121.725 333.374, 123.750 334, 126.199 334 C 131.554 334, 136 329.725, 136 324.577 C 136 320.091, 135.412 319.991, 134.596 324.340 M 109.270 329.592 C 108.396 333.914, 108.351 337.513, 109.104 343 C 109.670 347.125, 110.025 361.300, 109.894 374.500 C 109.576 406.623, 109.811 413.267, 111.154 410 C 111.791 408.450, 112.003 400.657, 111.711 389.500 C 111.453 379.600, 111.656 362.725, 112.164 352 C 112.890 336.662, 112.807 331.559, 111.776 328.092 L 110.465 323.684 109.270 329.592" fill="#edf0f3" fillRule="evenodd" stroke="#333" strokeWidth="0.7"/>
        }
      </g>
      {back && <text x="150" y="8" textAnchor="middle" fontSize="9" fill="#bbb" fontFamily="Georgia,serif" fontWeight="bold">BACK</text>}
      {!back && <text x="150" y="8" textAnchor="middle" fontSize="9" fill="#bbb" fontFamily="Georgia,serif" fontWeight="bold">FRONT</text>}
      {vis.map(function(z){return React.createElement("circle",{key:z.id,cx:z.x,cy:z.y,r:z.r,fill:"transparent",stroke:"none"});})}
      {markers.map(function(m,i){var z=Z.find(function(zn){return zn.id===m.zid;});if(!z)return null;var cx=m.cx||z.x,cy=m.cy||z.y;return React.createElement("g",{key:i},React.createElement("circle",{cx:cx,cy:cy,r:18,fill:"url(#hg)"},React.createElement("animate",{attributeName:"r",values:"16;22;16",dur:"2s",repeatCount:"indefinite"})),React.createElement("circle",{cx:cx,cy:cy,r:9,fill:i===act?"#cd853f":"#b22222",stroke:"#fff",strokeWidth:"2",filter:"url(#gl)"}),React.createElement("text",{x:cx,y:cy+3.5,textAnchor:"middle",fontSize:"10",fontWeight:"bold",fill:"#fff",fontFamily:"Georgia"},i+1));})}
      {!markers.length&&<text x={150} y={505} textAnchor="middle" fontSize="10" fill="#8b7355" fontStyle="italic" fontFamily="Georgia">Click anywhere on the body</text>}
    </svg>
  );
}
const P=({children,style:s,...p})=><p style={{margin:"3px 0",fontSize:13,lineHeight:1.55,color:"#3d2b1f",fontFamily:"Georgia,serif",...(s||{})}} {...p}>{children}</p>;
const Code=({children})=><div style={{background:"rgba(107,143,60,0.08)",borderRadius:6,padding:"7px 11px",marginBottom:4,fontFamily:"'Courier New',monospace",fontSize:12,color:"#3d2b1f",lineHeight:1.45,whiteSpace:"pre-wrap"}}>{children}</div>;
function Sec({title,color,children,open:init=true}){const[o,sO]=useState(init);return(<div style={{marginBottom:11}}><button onClick={()=>sO(!o)} style={{background:"none",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:5,padding:0,width:"100%",textAlign:"left"}}><span style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:13.5,fontWeight:"bold",color:color||"#3d2b1f"}}>{o?"▾":"▸"} {title}</span></button>{o&&<div style={{marginTop:4,paddingLeft:9,borderLeft:`3px solid ${color||"#c4a882"}`}}>{children}</div>}</div>);}
function AnatP({zone}){if(!zone)return null;const s=zone.sev,c=s>=4?"#b22222":s>=3?"#cd6600":s>=2?"#b8860b":"#6b8f3c";return(<div style={{background:"rgba(61,43,31,0.04)",border:"1px solid #ddd0bc",borderRadius:7,padding:"8px 10px",marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}><h4 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:13,margin:0}}>{zone.label}</h4><span style={{background:c,color:"#fff",padding:"1px 7px",borderRadius:10,fontSize:9,fontWeight:"bold",whiteSpace:"nowrap"}}>Danger: {s>=4?"Critical":s>=3?"High":s>=2?"Moderate":"Low"}</span></div><P style={{fontSize:11,fontStyle:"italic",color:"#5c4033",marginBottom:3}}>{zone.desc}</P><div style={{display:"flex",flexWrap:"wrap",gap:2}}>{zone.anat.map((a,i)=><span key={i} style={{background:"rgba(178,34,34,0.06)",border:"1px solid rgba(178,34,34,0.1)",borderRadius:10,padding:"1px 6px",fontSize:10,color:"#5c4033"}}>{a}</span>)}</div></div>);}

function SevBadge({type,zone,weapon}){
  if(!type||!IT[type]) return null;
  var t=IT[type];
  var wm=getWeapon(weapon);
  var sv=Math.min(5,Math.max(1,t.bs+(zone&&zone.sev||0)+(wm&&wm.sevMod||0)));
  var si=SV[sv-1];
  if(!si) return null;
  return React.createElement("div",{style:{marginTop:5,display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}},
    React.createElement("span",{style:{fontSize:9.5,color:"#8b7355"}},"Severity:"),
    React.createElement("span",{style:{background:si.c,color:"#fff",padding:"1px 6px",borderRadius:10,fontSize:9.5,fontWeight:"bold"}},si.l),
    React.createElement("span",{style:{fontSize:8.5,color:"#a08968"}},si.ic),
    wm?React.createElement("span",{style:{fontSize:8.5,color:"#556b2f",fontStyle:"italic"}},"| "+wm.cat):null
  );
}

function IllOut({illKey}){
  var il=ILL[illKey];
  if(!il) return null;
  return React.createElement("div",{style:{marginBottom:14,paddingBottom:14,borderBottom:"1px dashed #c4a882"}},
    React.createElement("div",{style:{display:"flex",alignItems:"center",gap:5,marginBottom:7}},
      React.createElement("span",{style:{fontSize:15}},il.i),
      React.createElement("span",{style:{fontFamily:"'Playfair Display',Georgia,serif",fontSize:14,fontWeight:"bold"}},il.l)
    ),
    React.createElement(Sec,{title:"Symptoms",color:"#b8860b"},il.sym.map(function(s,i){return React.createElement(P,{key:i},"• "+s);})),
    React.createElement(Sec,{title:"Example /do",color:"#6b8f3c"},il.doEx.map(function(x,i){return React.createElement(Code,{key:i},x);})),
    React.createElement(Sec,{title:"Recovery",color:"#cd6600"},React.createElement(P,null,il.rec),(il.fol||[]).map(function(f,i){return React.createElement(P,{key:i},"• "+f);})),
    React.createElement(Sec,{title:"Drugs & Addiction",color:"#b22222"},(il.drugs||[]).map(function(x,i){return React.createElement(P,{key:i},"• "+x);}))
  );
}

function ConseqOut({zid,sev}){
  var cq=getConseq(zid,sev);
  if(!cq||cq.length===0) return null;
  return React.createElement(Sec,{title:"\uD83E\uDD20 Living With It — Practical Consequences",color:"#8b6914"},
    cq.map(function(item,j){return React.createElement(P,{key:j},"\u2022 "+item);}),
    React.createElement(P,{style:{fontStyle:"italic",fontSize:10.5,color:"#a08968"}},"Suggestions, not rules — pick what fits your character and the moment.")
  );
}

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
              <Sec title="Symptoms by Severity" color="#b8860b">{Object.entries(d.sym||{}).map(([sv,arr])=><div key={sv} style={{marginBottom:6}}><P style={{fontSize:11,fontWeight:"bold",color:SV[Math.min(parseInt(sv),5)-1]&&SV[Math.min(parseInt(sv),5)-1].c||"#3d2b1f"}}>{SV[Math.min(parseInt(sv),5)-1]&&SV[Math.min(parseInt(sv),5)-1].l||"Sev "+sv}:</P>{arr.map((s,i)=><P key={i} style={{fontSize:12,paddingLeft:8}}>• {s}</P>)}</div>)}</Sec>
              {d.signs&&<Sec title="🔍 Clinical Signs — What Docs Ask About" color="#556b2f">{(d.signs||[]).map((s,i)=><P key={i} style={{fontSize:11.5}}>{s}</P>)}</Sec>}
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
    {name:"Rapid (Tachycardia (fast heart))", desc:"Heart racing — over 100 beats per minute. Body is compensating for blood loss, pain, or fever.", doHint:'/do Heart hammering fast. Pulse racing under the fingers.'},
    {name:"Slow (Bradycardia (slow heart))", desc:"Heart beating too slowly. Can indicate head injury, hypothermia, or severe shock.", doHint:'/do Pulse is slow and sluggish. Worryingly so.'},
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
    {name:"Absent / Last-gasp (agonal)", desc:"Gasping, fish-out-of-water breaths with long pauses, or no breathing at all. Dying.", doHint:"/do Gasping — long pauses between breaths. Each one could be the last."},
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
    {name:"Yellow (Jaundice (liver damage))", desc:"Liver damage. Eyes and skin take on a yellowish tint."},
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

  const bClick=useCallback((zone,cx,cy)=>{setInjs(p=>{if(p.length<3){const n=[...p,{zid:zone.id,type:"",weapon:"",cx,cy}];setAct(n.length-1);return n;}return p.map((x,i)=>i===act?{zid:zone.id,type:"",weapon:"",cx,cy}:x);});},[act]);

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
      {tab==="injuries"?(<div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-start"}}>
        <div style={{flex:"0 0 auto",width:280,display:"flex",flexDirection:"column",gap:8}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",background:"rgba(61,43,31,.03)",borderRadius:12,padding:"8px 4px",border:"1px solid #ddd0bc"}}>
            <div style={{display:"flex",gap:3,marginBottom:5}}>{[["Front",false],["Back",true]].map(([l,v])=><button key={l} onClick={()=>setBk(v)} style={{padding:"3px 10px",borderRadius:10,border:"1px solid #c4a882",background:bk===v?"#3d2b1f":"transparent",color:bk===v?"#f4e8d1":"#8b7355",fontSize:10,fontWeight:"bold",cursor:"pointer",fontFamily:"Georgia,serif"}}>{l}</button>)}</div>
            <Body back={bk} markers={injs.filter(i=>i.zid)} act={act} onClick={bClick}/>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {!injs.length&&<div style={{textAlign:"center",padding:"24px 12px",color:"#8b7355"}}><p style={{fontSize:24,margin:"0 0 5px"}}>👆</p><P style={{fontStyle:"italic",color:"#8b7355"}}>Click anywhere on the body to place an injury.</P><P style={{fontSize:10,color:"#a08968"}}>Up to 3.</P></div>}
            {injs.map((inj,i)=>{const zone=Z.find(z=>z.id===inj.zid);const avail=zone?gzi(zone):[];const isA=act===i;
              return(<div key={i} onClick={()=>setAct(i)} style={{background:isA?"rgba(205,133,63,.08)":"rgba(61,43,31,.02)",border:`2px solid ${isA?"#cd853f":"#ddd0bc"}`,borderRadius:9,padding:"9px 10px",cursor:"pointer",transition:"all .15s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                  <span style={{fontFamily:"'Playfair Display',Georgia,serif",fontWeight:"bold",fontSize:12.5}}><span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:17,height:17,borderRadius:"50%",background:"#b22222",color:"#fff",fontSize:9.5,fontWeight:"bold",marginRight:4}}>{i+1}</span>{zone&&zone.label||"—"}</span>
                  <button onClick={e=>{e.stopPropagation();setInjs(p=>p.filter((_,j)=>j!==i));setAct(a=>Math.max(0,a>=i?a-1:a));}} style={{background:"none",border:"none",color:"#b22222",cursor:"pointer",fontSize:15,fontWeight:"bold",lineHeight:1}}>×</button>
                </div>
                {zone&&<AnatP zone={zone}/>}
                {zone&&<select value={inj.type||""} onChange={e=>{setInjs(p=>p.map((x,j)=>j===i?{...x,type:e.target.value,weapon:""}:x));}} onClick={e=>e.stopPropagation()} style={sel}><option value="">— What happened here? —</option>{avail.map(k=><option key={k} value={k}>{IT[k]&&IT[k].i} {IT[k]&&IT[k].l}</option>)}</select>}
                {inj.type&&(isGSW(inj.type)||isStabOrArrow(inj.type))&&(
                  <select value={inj.weapon||""} onChange={e=>{setInjs(p=>p.map((x,j)=>j===i?{...x,weapon:e.target.value}:x));}} onClick={e=>e.stopPropagation()} style={{...sel,marginTop:4,borderColor:inj.weapon?"#6b8f3c":"#c4a882"}}>
                    <option value="">— What weapon? (optional) —</option>
                    {(isStabOrArrow(inj.type)?WEAPONS.filter(w=>w.id==="bow"):WEAPONS).map(w=>(
                      <optgroup key={w.id} label={w.cat}>{w.guns.map(g=><option key={g} value={w.id+":"+g}>{g}</option>)}</optgroup>
                    ))}
                  </select>
                )}
                {inj.type&&IT[inj.type]&&<SevBadge type={inj.type} zone={zone} weapon={inj.weapon}/>}
              </div>);
            })}
            {injs.length>0&&injs.length<3&&<P style={{fontSize:9.5,color:"#8b7355",fontStyle:"italic",textAlign:"center"}}>Click body to add another ({injs.length}/3)</P>}
          </div>
        </div>
        <div style={{flex:"1 1 400px",minWidth:300}}>
        {val.length>0&&<div style={{marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}><span style={{fontSize:11.5,fontWeight:"bold"}}>Overall Severity:</span><span style={{background:SV[eff-1].c,color:"#fff",padding:"1px 8px",borderRadius:10,fontSize:10,fontWeight:"bold"}}>{SV[eff-1].l}</span>{oSv&&<button onClick={()=>setOSv(null)} style={{background:"none",border:"none",color:"#8b7355",cursor:"pointer",fontSize:9.5,fontStyle:"italic",textDecoration:"underline"}}>Reset</button>}</div>
          <div style={{display:"flex",gap:2}}>{SV.map(s=><button key={s.v} onClick={()=>setOSv(s.v===sug?null:s.v)} style={{flex:1,padding:"3px 0",border:`2px solid ${s.v===eff?s.c:"transparent"}`,borderRadius:5,background:s.v<=eff?s.c:"rgba(61,43,31,.05)",color:s.v<=eff?"#fff":"#8b7355",cursor:"pointer",fontSize:9,fontWeight:"bold",fontFamily:"Georgia,serif",opacity:s.v<=eff?1:.4}}>{s.l}</button>)}</div>
          <P style={{fontSize:9,color:"#a08968",fontStyle:"italic"}}>Suggested: {SV[sug-1].l}. Click to adjust.</P>
        </div>}
      {has&&tab==="injuries"&&(<div style={{background:"#fff9f0",border:"2px solid #c4a882",borderRadius:12,padding:"14px 11px",boxShadow:"0 2px 8px rgba(61,43,31,.06)"}}>
        <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:17,margin:"0 0 10px",paddingBottom:8,borderBottom:"2px solid #c4a882"}}>📋 Your RP Guide</h2>
        {val.length>1&&<div style={{background:"rgba(178,34,34,.04)",borderRadius:7,padding:"7px 9px",marginBottom:10,border:"1px solid rgba(178,34,34,.1)"}}><P style={{fontWeight:"bold",color:SV[eff-1].c}}>Multiple Injuries — {SV[eff-1].l}</P><P style={{fontSize:11,fontStyle:"italic",color:"#5c4033"}}>With {val.length} injuries, compound effects add depth. Doc will likely triage the most dangerous first.</P></div>}

        {val.map((inj,i)=>{const zone=Z.find(z=>z.id===inj.zid);const data=OD[inj.type];if(!data||!zone)return null;
          const wm=getWeapon(inj.weapon);
          const sv=oSv||Math.min(5,Math.max(1,(IT[inj.type]&&IT[inj.type].bs||1)+(zone.sev||0)+(wm&&wm.sevMod||0)));const si=SV[Math.min(Math.max(sv,1),5)-1]||SV[0];
          const syms=gfs(data.sym||{},sv)||[];const dos=(gfs(data.doEx||{},sv)||[]).map(x=>(x||"").replace(/\{z\}/g,zone.label.toLowerCase()));
          return(<div key={i} style={{marginBottom:14,paddingBottom:14,borderBottom:"1px dashed #c4a882"}}>
            <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:7,flexWrap:"wrap"}}><span style={{fontSize:15}}>{IT[inj.type]&&IT[inj.type].i}</span><span style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:14,fontWeight:"bold"}}>{IT[inj.type]&&IT[inj.type].l}</span>{wm&&<span style={{fontSize:12,color:"#556b2f",fontWeight:"bold"}}>({getGunName(inj.weapon)||wm.cat})</span>}<span style={{fontSize:10.5,color:"#8b7355"}}>— {zone.label}</span><span style={{background:si.c,color:"#fff",padding:"1px 6px",borderRadius:10,fontSize:9,fontWeight:"bold"}}>{si.l}</span></div>
            <div style={{background:"rgba(85,107,47,.05)",borderRadius:5,padding:"6px 9px",marginBottom:7}}><P style={{fontSize:10,fontWeight:"bold",color:"#556b2f"}}>Under the skin:</P><P style={{fontSize:11}}>{zone.anat.join(" · ")}</P><P style={{fontSize:10,fontStyle:"italic",color:"#8b7355"}}>{zone.desc}</P></div>
            {wm&&<div style={{background:"rgba(92,64,51,.05)",borderRadius:5,padding:"6px 9px",marginBottom:7,border:"1px solid rgba(92,64,51,.12)"}}>
              <P style={{fontSize:10.5,fontWeight:"bold",color:"#5c4033"}}>🔫 {getGunName(inj.weapon)||wm.cat} ({wm.cat})</P>
              <P style={{fontSize:11,fontStyle:"italic",color:"#5c4033"}}>{wm.wound}</P>
              {wm.wSigns.map((s,j)=><P key={j} style={{fontSize:11}}>{s}</P>)}
            </div>}
            <Sec title="Symptoms to Roleplay" color="#b8860b">{(syms||[]).map((s,j)=><P key={j}>• {s}</P>)}</Sec>
            {data.signs&&data.signs.length>0&&<Sec title="🔍 Clinical Signs — What Docs Will Ask About" color="#556b2f">{data.signs.map((s,j)=><P key={j} style={{fontSize:11.5}}>{s}</P>)}</Sec>}
            <Sec title="Example /do Responses" color="#6b8f3c">{(dos||[]).map((x,j)=><Code key={j}>{x}</Code>)}<P style={{fontStyle:"italic",fontSize:10.5,color:"#8b7355"}}>Starting points — add your character's voice.</P></Sec>
            <ConseqOut zid={inj.zid} sev={sv}/>
            <P style={{fontSize:11.5,fontStyle:"italic",color:"#5c4033",marginBottom:4}}>These are just suggestive, follow your Doctor's advice and roleplay how you want.</P>
            <Sec title="Recovery & Follow-Up" color="#cd6600"><div style={{display:"flex",gap:10,marginBottom:4,flexWrap:"wrap"}}><P style={{fontWeight:"bold",color:"#cd6600"}}>IC: {si.ic}</P><P style={{fontWeight:"bold",color:"#000",textDecoration:"underline"}}>OOC: {si.ooc}</P></div><P>{si.d}</P>{data.rec&&data.rec.map((r,j)=><P key={j}>• {r}</P>)}</Sec>
            <Sec title="Drugs & Addiction" color="#b22222">{data.drugs&&data.drugs.map((d,j)=><P key={j}>• {d}</P>)}</Sec>
          </div>);
        })}

        {ill&&ILL[ill]&&<IllOut illKey={ill}/>}

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
      </div>
      </div>):tab==="illness"?(<div>
        <div style={{marginBottom:14}}><select value={ill} onChange={e=>setIll(e.target.value)} style={{...sel,fontSize:13.5,padding:"9px 11px"}}><option value="">— Pick an illness or condition —</option>{Object.entries(ILL).map(([k,v])=><option key={k} value={k}>{v.i} {v.l}</option>)}</select></div>
        {ill&&ILL[ill]&&<IllOut illKey={ill}/>}
        {!ill&&<div style={{textAlign:"center",padding:"28px 14px",color:"#8b7355"}}><p style={{fontSize:26,margin:"0 0 6px"}}>🤒</p><P style={{fontSize:13,fontStyle:"italic",color:"#8b7355"}}>Select an illness above to see symptoms, /do examples, and RP guidance.</P></div>}
      </div>):tab==="quickref"?(<QuickRefTab/>):(<JournalTab/>)}
    </div>
  </div>);
}
