// Ported from Ad Agent src/app/globe.ts (main, commit c91abe8, 2026-10-26), compiled to JavaScript with tsc and
// otherwise unchanged: Monochrome's glyphs as a globe, the Ad Agent A or a horizon. Never edited here; to take a newer
// one, compile it again and move this commit.
//
// The blank view's background (the owner, 2026-10-24: "Use Monochrome 'glyphs', use them in a globe shape … animate
// like a liquid blob that is alive, slow, organic"; then "instead of a sphere, lets try the 'A' shape from my Ad Agent
// logo"; then "a rounded horizon line … zooming in on the top section of the sphere, make it more accurately round like
// earth would be. sit 1/3 approx from bottom"): Monochrome's glyphs, white on black, in WebGL, as a globe, the logo's A
// or a planet's horizon.
// Glyphs from monocode.campaign-manager bloom/src/ui/overviewHero.js `_paintOvDots` (the Creatives widget's dot field,
// 58f89e2c): a 1 px dot, a hollow circle r 1.4, a cross and a slash ±1.4, 0.75 px strokes, each glyph gathering into
// its own drifts (smooth noise banded, 18 % grain), drawn here as distance fields on GL points.
// The A: Catalogue Producer media/Ad-Agent.svg (the owner's, not yet committed, 2026-10-24), its upright A (the
// second path), corners' 0.4-unit roundings kept as vertices.
// Simplex noise: Ian McEwan and Stefan Gustavson's webgl-noise (MIT), 3-D.
//
// The globe: about 26,000 glyphs on latitude rings (a sphere that still reads as a grid), seen from a little above.
// Four octaves of noise push the surface in and out and a fifth slides the glyphs along it, all drifting slowly, so
// the outline wobbles and the grid bends like liquid. One turn in about 3.5 minutes.
// The A: the letter as a slab, glyphs on its faces (a grid) and its walls, the same noise warping it as a whole (so
// faces and walls never part at the corners) and pushing it in and out along its normals. It sways, never turns away.
// The horizon: the top of a sphere far wider than the window, its pole toward you, so the ground's rows run along the
// horizon and crowd into a bright limb. Exactly round: nothing pushes it in or out. It turns slowly along the horizon,
// brightness drifts over the ground like cloud, and glyphs rise off the limb like an atmosphere.
// Both: dim where the surface faces you, white where it turns away (the globe's rim, the A's walls), the far side at
// half strength through the near side, glyphs adding up where they overlap. Glyphs lift off the bulges and fade as
// they drift out, which keeps the edge ragged; a few glint; a breath of about 1 %.
//
// One draw call a frame, every vertex moved in the shader: the CPU only sets uniforms. 30 fps (the motion is too slow
// for more to show), the low-power GPU, nothing while the page is hidden, a still frame under Reduce motion. The canvas
// fills its parent, which needs a real size; it stops by itself once the canvas leaves the page.
export const GLOBE_DEFAULTS = {
    form: "globe",
    radius: 0.31,
    center: [0.5, 0.5],
    points: 26000,
    spray: 0.35,
    glyphMix: [0.5, 0.22, 0.16, 0.12],
    glyphScale: 1,
    speed: 1,
    wobble: 0.075,
    grain: 0.035,
    flow: 0.1,
    spin: 0.03,
    sway: 0.3,
    depth: 0.22,
    tilt: 0.38,
    breathe: 0.012,
    rim: 2.6,
    interior: 0.22,
    back: 0.55,
    brightness: 1,
    colour: [1, 1, 1],
    fps: 30,
    maxDpr: 2,
    time: 0,
    seed: 1,
    reducedMotion: true,
};
/** The A's own, over the globe's: a letter's strokes are thin (a sixth of its half height), so it moves less. */
const A_DEFAULTS = { radius: 0.35, wobble: 0.026, flow: 0.03, grain: 0.01, tilt: 0.06, rim: 1.6, back: 0.5 };
/** The horizon's: wide enough that the window shows a gentle arc, its top a third up from the bottom; round, so no
 *  wobble and no breath; a slow turn (9 px a second at a 1,330 px window). */
const HORIZON_DEFAULTS = { radius: 1.3, center: [0.5, 0.667], spin: 0.004, wobble: 0, flow: 0.004, grain: 0.0015, breathe: 0, spray: 0.06, interior: 0.18, rim: 3.2 };
const FORM_DEFAULTS = { globe: {}, a: A_DEFAULTS, horizon: HORIZON_DEFAULTS };
/** Every option's default for a form. */
export const globeDefaults = (form = "globe") => ({ ...GLOBE_DEFAULTS, ...FORM_DEFAULTS[form], form });
const REBUILD = ["form", "points", "spray", "glyphMix", "depth", "seed"];
const NOISE = `
vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g  = step(x0.yzx, x0.xyz);
  vec3 l  = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j  = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x  = x_ * ns.x + ns.yyyy;
  vec4 y  = y_ * ns.x + ns.yyyy;
  vec4 h  = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
// Dave Hoskins' hash, no sine: stable on every GPU at large inputs.
vec2 hash22(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}
`;
const VERT = `
precision highp float;
attribute vec3 aPos;   // the glyph's place: on the unit sphere, on the A (units of its half height), or the horizon's longitude, latitude
attribute vec3 aNrm;   // its surface's normal (the sphere's is its place)
attribute vec4 aA;     // glyph (0 dot, 1 circle, 2 cross, 3 slash), grain, phase (a surface glyph's glint, or -1), kind (0 surface, 1 spray)
attribute vec3 aB;     // spray: life in seconds, lift (a fraction of the radius), hash id; surface: -, scatter -1..1, -
uniform vec2  uSize, uCenter;   // css px
uniform float uR, uCam, uT, uForm, uDepth, uSpin, uLamMin, uSpan, uNoise;
uniform mat3  uRot;
uniform float uWobble, uGrain, uFlow, uRimPow, uInterior, uBack, uBright, uGlyph, uDpr;
varying float vB, vGlyph, vPx;
const float SPRITE = 4.55;      // the sprite's side in glyph units: 2 x (1.4 radius + 0.375 half stroke) + 1 for AA
${NOISE}
// A slowly turning noise vector: the globe's glyphs slide along it, the whole A is warped by it.
vec3 noiseVec(vec3 d){
  return vec3(
    snoise(d*1.2 + vec3(uT*0.065, 11.3, 0.0)),
    snoise(d*1.2 + vec3(23.1, uT*0.060, 7.7)),
    snoise(d*1.2 + vec3(5.9, 41.2, uT*0.075)));
}
// In and out, about -1..1: a slow lumpy blob, a ripple, a finer ripple, a faint quick shiver (the last two make the
// edge ragged).
float height(vec3 d){
  return 0.50 * snoise(d*0.75 + vec3(0.0, uT*0.050, uT*0.030))
       + 0.28 * snoise(d*1.60 + vec3(uT*0.090, 17.0, -uT*0.070))
       + 0.14 * snoise(d*3.40 + vec3(-uT*0.130, uT*0.120, 41.0))
       + 0.08 * snoise(d*7.00 + vec3(uT*0.180, 63.0, uT*0.150));
}
void main(){
  bool spray = aA.w > 0.5;
  float age = 0.0;
  vec2 hv = vec2(0.0);
  if(spray){
    // A spray glyph lives aB.x seconds, then is born again: somewhere else on the sphere, at another depth on the A.
    float cyc = uT / aB.x + aA.z;
    float n = floor(cyc);
    age = cyc - n;
    hv = hash22(vec2(aB.z, n));
  }
  float lift = spray ? aB.y * (1.0 - (1.0 - age) * (1.0 - age)) : uGrain * aB.y;
  float h, side;
  vec3 nv, p;                     // view space (x right, y up, z toward the viewer), in units of uR
  if(uForm < 0.5){
    vec3 d = aPos;
    if(spray){
      float z = hv.x * 2.0 - 1.0;
      float th = hv.y * 6.2831853;
      float s = sqrt(max(0.0, 1.0 - z*z));
      d = vec3(s * cos(th), z, s * sin(th));
    }
    vec3 fd = normalize(d + uFlow * noiseVec(d));
    h = height(fd);
    nv = uRot * fd;
    p = nv * (1.0 + uWobble * h + lift);
    side = mix(uBack, 1.0, smoothstep(-0.25, 0.25, nv.z));
  } else if(uForm < 1.5){
    vec3 ap = aPos;
    if(spray) ap.z = (hv.x - 0.5) * uDepth;
    h = height(ap);
    nv = uRot * aNrm;
    p = uRot * (ap + uFlow * noiseVec(ap) + aNrm * (uWobble * h + lift));
    side = mix(uBack, 1.0, smoothstep(-1.0, 1.0, ap.z / (0.5 * uDepth)));
  } else {
    // The horizon: longitude runs along it (pi/2 at its top), latitude from the limb toward the pole facing you. The
    // ground turns by wrapping each glyph's longitude inside a band wider than the window; its noise rides with it.
    float lam, phi;
    if(spray){ lam = 1.5707963 + (hv.y - 0.5) * uSpan * 0.8; phi = hv.x * 0.04; }
    else { lam = uLamMin + mod(aPos.x - uLamMin + uT * uSpin, uSpan); phi = aPos.y; }
    float lamS = lam - uT * uSpin;
    vec3 dS = vec3(cos(phi) * cos(lamS), cos(phi) * sin(lamS), sin(phi)) * uNoise;
    vec3 d = vec3(cos(phi) * cos(lam), cos(phi) * sin(lam), sin(phi));
    vec3 fd = normalize(d + uFlow * noiseVec(dS));
    h = height(dS);
    nv = fd;
    p = fd * (1.0 + uWobble * h + lift);
    side = 1.0;
  }
  p *= uR;
  float k = uCam / (uCam - p.z);  // a mild perspective: the near side a touch larger
  vec2 sp = uCenter + vec2(p.x, -p.y) * k;

  float rim = pow(1.0 - abs(nv.z), uRimPow);
  float b;
  if(spray){
    float fade  = smoothstep(0.0, 0.08, age) * pow(1.0 - age, 1.2);
    float crest = 0.45 + 0.55 * smoothstep(-0.2, 0.35, h);   // most of it comes off the bulges
    b = (0.25 + 0.75 * rim) * side * aA.y * fade * crest;
  } else {
    b = (uInterior + (1.0 - uInterior) * rim) * side * aA.y;
    b *= 1.0 + 0.6 * max(h, 0.0);                             // the crests catch a little more light
    if(aA.z >= 0.0) b += 0.9 * side * pow(max(0.0, sin(uT*0.35 + aA.z*6.2831853)), 24.0);
  }
  vB = b * uBright;
  vGlyph = aA.x;
  float g = uGlyph * mix(1.0, k, 0.5);
  vPx = 1.0 / (g * uDpr);         // one device pixel, in glyph units
  if(vB < 0.004){ gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 1.0; return; }
  gl_Position = vec4(sp.x / uSize.x * 2.0 - 1.0, 1.0 - sp.y / uSize.y * 2.0, 0.0, 1.0);
  gl_PointSize = SPRITE * g * uDpr;
}
`;
// The glyphs as distance fields in the Creatives widget's own units (css px at scale 1): the dot a 1 x 1 square, the
// circle r 1.4, the cross and the slash ±1.4, strokes 0.75 wide.
const FRAG = `
precision mediump float;
uniform vec3 uColour;
varying float vB, vGlyph, vPx;
const float SPRITE = 4.55;
const float RAD = 1.4;
const float HW = 0.375;
float seg(vec2 p, vec2 a, vec2 b){
  vec2 pa = p - a, ba = b - a;
  return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0));
}
void main(){
  vec2 q = (gl_PointCoord - 0.5) * SPRITE;   // y down, as on the canvas
  float d;
  if(vGlyph < 0.5){ vec2 a = abs(q) - 0.5; d = max(a.x, a.y); }
  else if(vGlyph < 1.5) d = abs(length(q) - RAD) - HW;
  else if(vGlyph < 2.5) d = min(seg(q, vec2(-RAD), vec2(RAD)), seg(q, vec2(-RAD, RAD), vec2(RAD, -RAD))) - HW;
  else d = seg(q, vec2(-RAD), vec2(RAD)) - HW;
  float cov = clamp(0.5 - d / vPx, 0.0, 1.0);
  if(cov <= 0.0) discard;
  float a = vB * cov;
  gl_FragColor = vec4(uColour * a, a);        // premultiplied, added
}
`;
// ── the A: Ad-Agent.svg's upright A (its second path), in the SVG's units ──
const A_OUTER = [[38.05, 48.37], [38.49, 48.02], [40.87, 48.02], [41.36, 48.37], [50.54, 79.01], [50.27, 79.36], [47.75, 79.36], [47.35, 79.05],
    [45.58, 73.13], [33.75, 73.13], [32.03, 79.05], [31.63, 79.36], [29.11, 79.36], [28.85, 79.01]];
const A_COUNTER = [[44.8, 70.31], [39.68, 53.05], [34.6, 70.31]];
// Centred on its box and scaled to a half height of 1, y up.
const toA = ([x, y]) => [(x - 39.695) * (2 / 31.34), -(y - 63.69) * (2 / 31.34)];
const A_LOOPS = [A_OUTER.map(toA), A_COUNTER.map(toA)];
/** Even-odd: inside the outer loop and outside the counter. */
function inA(x, y) {
    let inside = false;
    for (const loop of A_LOOPS) {
        for (let i = 0, j = loop.length - 1; i < loop.length; j = i++) {
            const [xi, yi] = loop[i], [xj, yj] = loop[j];
            if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
                inside = !inside;
        }
    }
    return inside;
}
/** The A's glyph places and normals: a grid on its two faces, rows along its walls. `step` in units of its half height. */
function aSurface(step, depth) {
    const pos = [], nrm = [], walls = [];
    const hd = depth / 2;
    for (let y = -1 + step / 2; y < 1; y += step) {
        for (let x = -0.72 + step / 2; x < 0.72; x += step) {
            if (!inA(x, y))
                continue;
            pos.push(x, y, hd, x, y, -hd);
            nrm.push(0, 0, 1, 0, 0, -1);
        }
    }
    for (const loop of A_LOOPS) {
        for (let i = 0; i < loop.length; i++) {
            const [ax, ay] = loop[i], [bx, by] = loop[(i + 1) % loop.length];
            const len = Math.hypot(bx - ax, by - ay);
            let nx = (by - ay) / len, ny = -(bx - ax) / len;
            if (inA((ax + bx) / 2 + nx * 1e-3, (ay + by) / 2 + ny * 1e-3)) {
                nx = -nx;
                ny = -ny;
            } // point out of the letter
            const along = Math.max(1, Math.round(len / step));
            for (let a = 0; a < along; a++) {
                const t = (a + 0.5) / along, x = ax + (bx - ax) * t, y = ay + (by - ay) * t;
                for (let z = -hd + step / 2; z < hd; z += step) {
                    walls.push(pos.length / 3);
                    pos.push(x, y, z);
                    nrm.push(nx, ny, 0);
                }
            }
        }
    }
    return { pos, nrm, walls };
}
function mulberry32(a) {
    return () => {
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
/** Smooth 3-D value noise, two octaves, in [0, 1]: `_valueNoise2D` (monocode src/ui/shared/math.js) with a third axis,
 *  so the glyph drifts lie on the surface without a seam. */
function valueNoise3D(seed) {
    const hash = (ix, iy, iz) => {
        let n = (Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(iz, 1440662683) + Math.imul(seed, 1013904223)) >>> 0;
        n = (n ^ (n >>> 13)) >>> 0;
        n = Math.imul(n, 1274126177) >>> 0;
        return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
    };
    const sm = (t) => t * t * (3 - 2 * t);
    const lp = (a, b, t) => a + (b - a) * t;
    const oct = (x, y, z) => {
        const x0 = Math.floor(x), y0 = Math.floor(y), z0 = Math.floor(z);
        const tx = sm(x - x0), ty = sm(y - y0), tz = sm(z - z0);
        const face = (zz) => lp(lp(hash(x0, y0, zz), hash(x0 + 1, y0, zz), tx), lp(hash(x0, y0 + 1, zz), hash(x0 + 1, y0 + 1, zz), tx), ty);
        return lp(face(z0), face(z0 + 1), tz);
    };
    return (x, y, z) => 0.65 * oct(x, y, z) + 0.35 * oct(x * 2.3 + 11.7, y * 2.3 + 5.1, z * 2.3 + 3.3);
}
// The horizon's band of the sphere: longitudes pi/2 ± 0.48 (the window shows ± 0.4 at any aspect, the radius going
// with the longer side), latitudes 0 to 0.75 down from the limb (the window's bottom shows at most 0.73).
const H_SPAN = 0.96, H_LAM_MIN = Math.PI / 2 - H_SPAN / 2, H_PHI = 0.75;
/** The horizon's glyphs, as longitude, latitude: rows along the horizon, each as long as its latitude allows. At the
 *  limb they keep the ground's own spacing and crowd into one bright line; below it they sit an even height apart on
 *  screen (a row's drop is 1 - cos(latitude)), because at the ground's own spacing the tilt packs them closer than a
 *  glyph is wide and the band under the horizon turns to noise. */
function horizonSurface(step) {
    const pos = [];
    let row = 0;
    const addRow = (phi) => {
        const n = Math.max(1, Math.round((H_SPAN * Math.cos(phi)) / step));
        for (let j = 0; j < n; j++)
            pos.push(H_LAM_MIN + ((j + (row & 1) * 0.5) * H_SPAN) / n, phi, 0);
        row++;
    };
    const dy = step * 0.8, limb = Math.acos(1 - dy / 2);
    for (let phi = step / 2; phi < limb; phi += step)
        addRow(phi);
    for (let y = dy / 2;; y += dy) {
        const phi = Math.acos(1 - y);
        if (phi >= H_PHI)
            break;
        addRow(phi);
    }
    return pos;
}
const band = (k, th) => (k < th[0] ? 0 : k < th[1] ? 1 : k < th[2] ? 2 : 3);
const FLOATS = 13; // aPos (3), aNrm (3), aA (4), aB (3)
/** The glyphs, interleaved. */
function buildPoints(o) {
    const rand = mulberry32(o.seed | 0 || 1);
    // The globe's angular step; the A keeps the same spacing on screen (its half height is 0.35 of the shorter side to
    // the globe's 0.31).
    const step = Math.sqrt((4 * Math.PI) / Math.max(500, Math.round(o.points)));
    let pos, nrm, walls = null;
    const hz = o.form === "horizon";
    if (o.form === "a")
        ({ pos, nrm, walls } = aSurface(step * (0.31 / 0.35), o.depth));
    // The horizon keeps the globe's spacing on screen too: its radius is 1.3 of the longer side to the globe's 0.31 of
    // the shorter, at a 1.55 window.
    else if (hz) {
        pos = horizonSurface(step * (0.31 / (1.3 * 1.55)));
        nrm = pos.map(() => 0);
    }
    else {
        // Latitude rings at an even angular step, each as long as its circumference allows: the reference's parallels and pole.
        pos = [];
        const rings = Math.max(2, Math.round(Math.PI / step));
        for (let i = 0; i < rings; i++) {
            const lat = -Math.PI / 2 + ((i + 0.5) * Math.PI) / rings;
            const c = Math.cos(lat), y = Math.sin(lat);
            const n = Math.max(1, Math.round((2 * Math.PI * c) / step));
            for (let j = 0; j < n; j++) {
                const lon = ((j + (i & 1) * 0.5) * 2 * Math.PI) / n;
                pos.push(c * Math.cos(lon), y, c * Math.sin(lon));
            }
        }
        nrm = pos;
    }
    const nSurf = pos.length / 3;
    const nSpray = Math.max(0, Math.round(nSurf * o.spray));
    // The glyph: smooth noise banded at the asked shares (quantiles), 18 % grain — the Creatives widget's recipe.
    const mix = o.glyphMix;
    const total = mix[0] + mix[1] + mix[2] + mix[3] || 1;
    const vn = valueNoise3D((o.seed | 0) * 7919 + 17);
    const keys = new Float32Array(nSurf);
    // The horizon's drifts wrap with its longitude (a ring of noise), so no seam shows when a glyph wraps round.
    const ring = (H_SPAN * 12) / (2 * Math.PI);
    const key = (i) => {
        if (!hz)
            return vn(pos[i * 3] * 2.2 + 4, pos[i * 3 + 1] * 2.2 + 4, pos[i * 3 + 2] * 2.2 + 4);
        const th = (2 * Math.PI * (pos[i * 3] - H_LAM_MIN)) / H_SPAN;
        return vn(ring * Math.cos(th) + 50, ring * Math.sin(th) + 50, pos[i * 3 + 1] * 12 + 4);
    };
    for (let i = 0; i < nSurf; i++)
        keys[i] = key(i) * 0.82 + rand() * 0.18;
    const sorted = Float32Array.from(keys).sort();
    const at = (f) => sorted[Math.min(nSurf - 1, Math.floor(f * nSurf))];
    const th = [at(mix[0] / total), at((mix[0] + mix[1]) / total), at((mix[0] + mix[1] + mix[2]) / total)];
    const sprayTh = [0.62, 0.7, 0.8]; // spray: mostly dots and slashes
    const data = new Float32Array((nSurf + nSpray) * FLOATS);
    for (let i = 0; i < nSurf; i++) {
        const b = i * FLOATS;
        for (let c = 0; c < 3; c++) {
            data[b + c] = pos[i * 3 + c];
            data[b + 3 + c] = nrm[i * 3 + c];
        }
        data[b + 6] = band(keys[i], th);
        data[b + 7] = 0.45 + 0.55 * rand(); // grain
        data[b + 8] = rand() < 0.008 ? rand() : -1; // the few that glint
        data[b + 11] = (rand() + rand() + rand()) / 1.5 - 1; // in and out, bunched toward 0
    }
    for (let i = 0; i < nSpray; i++) {
        const b = (nSurf + i) * FLOATS;
        // The A's spray leaves its walls, the outline you see; it keeps its spot and changes depth each life.
        if (walls) {
            const w = walls[Math.floor(rand() * walls.length)] * 3;
            for (let c = 0; c < 3; c++) {
                data[b + c] = pos[w + c];
                data[b + 3 + c] = nrm[w + c];
            }
        }
        data[b + 6] = band(rand(), sprayTh);
        data[b + 7] = 0.5 + 0.5 * rand();
        data[b + 8] = rand(); // where in its life it starts
        data[b + 9] = 1;
        data[b + 10] = 14 + 12 * rand(); // life, seconds
        const u = rand();
        data[b + 11] = walls ? 0.01 + 0.12 * u * u : hz ? 0.004 + 0.05 * u * u : 0.02 + 0.28 * u * u; // most stay close, a few drift far
        data[b + 12] = i + 0.5;
    }
    return { data, count: nSurf + nSpray };
}
function link(gl) {
    const shader = (type, src) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
            throw new Error(`globe: shader: ${gl.getShaderInfoLog(s)}`);
        return s;
    };
    const p = gl.createProgram();
    const vs = shader(gl.VERTEX_SHADER, VERT), fs = shader(gl.FRAGMENT_SHADER, FRAG);
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS))
        throw new Error(`globe: link: ${gl.getProgramInfoLog(p)}`);
    return p;
}
/** Rx(tilt) · Ry(yaw), by columns for uniformMatrix3fv. */
function viewMatrix(yaw, tilt) {
    const cs = Math.cos(yaw), ss = Math.sin(yaw), ct = Math.cos(tilt), st = Math.sin(tilt);
    return new Float32Array([cs, st * ss, -ct * ss, 0, ct, st, ss, -st * cs, ct * cs]);
}
const UNIFORMS = ["uSize", "uCenter", "uR", "uCam", "uT", "uForm", "uDepth", "uSpin", "uLamMin", "uSpan", "uNoise", "uRot", "uWobble", "uGrain", "uFlow", "uRimPow", "uInterior", "uBack", "uBright", "uGlyph", "uDpr", "uColour"];
/** Starts the form on `cv`, which fills its parent. Options not given take the form's defaults (`globeDefaults`).
 *  Without WebGL it draws nothing and says so once. */
export function startGlyphGlobe(cv, opts = {}) {
    const o = { ...globeDefaults(opts.form), ...opts };
    const none = { stop() { }, set() { } };
    const gl = cv.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: "low-power" });
    if (!gl) {
        console.warn("globe: no WebGL, the background stays plain");
        return none;
    }
    let prog = null, buf = null, count = 0;
    let U = {};
    let W = 0, H = 0, dpr = 0, sizeStale = true, dirty = true, lost = false, stopped = false;
    let raf = 0, last = -1e9, prev = -1, clock = o.time;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const upload = () => {
        const pts = buildPoints(o);
        count = pts.count;
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, pts.data, gl.STATIC_DRAW);
        dirty = true;
    };
    const init = () => {
        prog = link(gl);
        gl.useProgram(prog);
        U = {};
        for (const n of UNIFORMS)
            U[n] = gl.getUniformLocation(prog, n);
        buf = gl.createBuffer();
        upload();
        for (const [name, size, offset] of [["aPos", 3, 0], ["aNrm", 3, 12], ["aA", 4, 24], ["aB", 3, 40]]) {
            const l = gl.getAttribLocation(prog, name);
            gl.enableVertexAttribArray(l);
            gl.vertexAttribPointer(l, size, gl.FLOAT, false, FLOATS * 4, offset);
        }
        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE);
        gl.clearColor(0, 0, 0, 0);
    };
    const resize = () => {
        sizeStale = false;
        const par = cv.parentElement;
        const w = par ? par.clientWidth : 0, h = par ? par.clientHeight : 0;
        const d = Math.min(devicePixelRatio || 1, o.maxDpr);
        if (w === W && h === H && d === dpr)
            return;
        W = w;
        H = h;
        dpr = d;
        cv.width = Math.round(W * dpr);
        cv.height = Math.round(H * dpr);
        cv.style.width = `${W}px`;
        cv.style.height = `${H}px`;
        dirty = true; // a resize clears the canvas: paint this frame, whatever the fps
    };
    const draw = () => {
        gl.viewport(0, 0, cv.width, cv.height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (!W || !H || !count)
            return;
        const t = clock, a = o.form === "a", hz = o.form === "horizon";
        const short = Math.min(W, H);
        const R = o.radius * (hz ? Math.max(W, H) : short) * (1 + o.breathe * (0.7 * Math.sin(t * 0.63) + 0.3 * Math.sin(t * 0.29 + 1)));
        // The globe turns; the A sways either side of facing you, two slow periods so it never quite repeats.
        const yaw = a ? o.sway * (0.85 * Math.sin(t * 0.11) + 0.15 * Math.sin(t * 0.23 + 1)) : t * o.spin;
        gl.useProgram(prog);
        gl.uniform2f(U.uSize, W, H);
        // The horizon's centre is its top: the sphere's own centre is a radius below. Seen from 30 radii, so its limb is
        // the sphere's true edge (from 4.5, a band of the far side would show inside it).
        gl.uniform2f(U.uCenter, o.center[0] * W, o.center[1] * H + (hz ? R : 0));
        gl.uniform1f(U.uR, R);
        gl.uniform1f(U.uCam, R * (hz ? 30 : 4.5));
        gl.uniform1f(U.uT, t);
        gl.uniform1f(U.uForm, hz ? 2 : a ? 1 : 0);
        gl.uniform1f(U.uSpin, o.spin);
        gl.uniform1f(U.uLamMin, H_LAM_MIN);
        gl.uniform1f(U.uSpan, H_SPAN);
        gl.uniform1f(U.uNoise, hz ? 6 : 1);
        gl.uniform1f(U.uDepth, o.depth);
        gl.uniformMatrix3fv(U.uRot, false, viewMatrix(yaw, o.tilt + 0.05 * Math.sin(t * 0.045)));
        gl.uniform1f(U.uWobble, o.wobble);
        gl.uniform1f(U.uGrain, o.grain);
        gl.uniform1f(U.uFlow, o.flow);
        gl.uniform1f(U.uRimPow, o.rim);
        gl.uniform1f(U.uInterior, o.interior);
        gl.uniform1f(U.uBack, o.back);
        gl.uniform1f(U.uBright, o.brightness);
        gl.uniform1f(U.uGlyph, o.glyphScale * Math.max(0.75, Math.min(1.5, (0.31 * short) / 270)));
        gl.uniform1f(U.uDpr, dpr);
        gl.uniform3f(U.uColour, o.colour[0], o.colour[1], o.colour[2]);
        gl.drawArrays(gl.POINTS, 0, count);
    };
    const frame = (now) => {
        raf = 0;
        if (stopped)
            return;
        if (!cv.isConnected) {
            stop();
            return;
        }
        raf = requestAnimationFrame(frame);
        const still = o.reducedMotion && reduce.matches;
        const dt = prev < 0 ? 0 : Math.min(now - prev, 100); // a long gap (hidden, asleep) is not motion
        prev = now;
        if (!still && !document.hidden)
            clock += (dt / 1000) * o.speed;
        if (sizeStale || Math.min(devicePixelRatio || 1, o.maxDpr) !== dpr)
            resize();
        if (lost || document.hidden)
            return;
        if (!dirty && (still || now - last < 1000 / o.fps - 4))
            return;
        last = now;
        dirty = false;
        draw();
    };
    // Both: the observer sees the parent change size by itself, the window event a window resize even when the
    // observer's delivery is late.
    const onStale = () => { sizeStale = true; };
    const ro = cv.parentElement ? new ResizeObserver(onStale) : null;
    ro?.observe(cv.parentElement);
    addEventListener("resize", onStale);
    const onLost = (e) => { e.preventDefault(); lost = true; };
    const onRestored = () => { lost = false; init(); };
    cv.addEventListener("webglcontextlost", onLost);
    cv.addEventListener("webglcontextrestored", onRestored);
    const onReduce = () => { dirty = true; };
    reduce.addEventListener("change", onReduce);
    function stop() {
        if (stopped)
            return;
        stopped = true;
        if (raf)
            cancelAnimationFrame(raf);
        raf = 0;
        ro?.disconnect();
        removeEventListener("resize", onStale);
        cv.removeEventListener("webglcontextlost", onLost);
        cv.removeEventListener("webglcontextrestored", onRestored);
        reduce.removeEventListener("change", onReduce);
        if (!gl.isContextLost()) {
            gl.deleteBuffer(buf);
            gl.deleteProgram(prog);
        }
    }
    init();
    raf = requestAnimationFrame(frame);
    return {
        stop,
        set(next) {
            Object.assign(o, next);
            if ("time" in next)
                clock = o.time;
            if (!lost && REBUILD.some((k) => k in next))
                upload();
            dirty = true;
        },
    };
}
