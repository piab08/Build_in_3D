import * as THREE from "three";

import "./style.css";


// ----------------------------------------------------
// LOADER
// ----------------------------------------------------

window.addEventListener("load", () => {

  setTimeout(() => {

    document.querySelector("#loader").classList.add("loaded");

  }, 1200);

});


// ----------------------------------------------------
// THREE.JS SCENE
// ----------------------------------------------------

const canvas = document.querySelector("#webgl");

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x050505);


// CAMERA

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);

camera.position.set(0, 0, 8);


// RENDERER

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});

renderer.setPixelRatio(
  Math.min(window.devicePixelRatio, 2)
);

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);


// ----------------------------------------------------
// LIGHTS
// ----------------------------------------------------

const ambientLight = new THREE.AmbientLight(
  0xffffff,
  0.6
);

scene.add(ambientLight);


const pointLight = new THREE.PointLight(
  0x00ffff,
  80,
  30
);

pointLight.position.set(
  4,
  4,
  5
);

scene.add(pointLight);


const pointLight2 = new THREE.PointLight(
  0xff00cc,
  60,
  25
);

pointLight2.position.set(
  -5,
  -3,
  3
);

scene.add(pointLight2);


// ----------------------------------------------------
// MAIN 3D OBJECT
// ----------------------------------------------------

const coreGroup = new THREE.Group();

scene.add(coreGroup);


// Outer torus

const torusGeometry = new THREE.TorusGeometry(
  2.15,
  0.035,
  16,
  160
);

const torusMaterial = new THREE.MeshBasicMaterial({
  color: 0x00ffff,
  transparent: true,
  opacity: 0.8
});

const torus = new THREE.Mesh(
  torusGeometry,
  torusMaterial
);

torus.rotation.x = Math.PI / 2;

coreGroup.add(torus);


// Second torus

const torus2 = new THREE.Mesh(
  torusGeometry,
  new THREE.MeshBasicMaterial({
    color: 0xff00cc,
    transparent: true,
    opacity: 0.5
  })
);

torus2.rotation.y = Math.PI / 2;

coreGroup.add(torus2);


// ----------------------------------------------------
// INNER CORE
// ----------------------------------------------------

const coreGeometry = new THREE.IcosahedronGeometry(
  1.25,
  2
);

const coreMaterial = new THREE.MeshStandardMaterial({

  color: 0x0a0a0a,

  metalness: 0.9,

  roughness: 0.15,

  wireframe: true

});

const core = new THREE.Mesh(
  coreGeometry,
  coreMaterial
);

coreGroup.add(core);


// Solid inner sphere

const sphereGeometry =
  new THREE.SphereGeometry(
    0.7,
    32,
    32
  );

const sphereMaterial =
  new THREE.MeshStandardMaterial({

    color: 0xffffff,

    emissive: 0x00ffff,

    emissiveIntensity: 1.5,

    metalness: 0.8,

    roughness: 0.1

  });

const sphere =
  new THREE.Mesh(
    sphereGeometry,
    sphereMaterial
  );

coreGroup.add(sphere);


// ----------------------------------------------------
// PARTICLE FIELD
// ----------------------------------------------------

const particleCount = 3500;

const positions = new Float32Array(
  particleCount * 3
);

for (
  let i = 0;
  i < particleCount;
  i++
) {

  const radius =
    5 + Math.random() * 12;

  const theta =
    Math.random() * Math.PI * 2;

  const phi =
    Math.acos(
      (Math.random() * 2) - 1
    );

  positions[i * 3] =
    radius *
    Math.sin(phi) *
    Math.cos(theta);

  positions[i * 3 + 1] =
    radius *
    Math.sin(phi) *
    Math.sin(theta);

  positions[i * 3 + 2] =
    radius *
    Math.cos(phi);

}


const particleGeometry =
  new THREE.BufferGeometry();

particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(
    positions,
    3
  )
);


const particleMaterial =
  new THREE.PointsMaterial({

    color: 0xffffff,

    size: 0.025,

    transparent: true,

    opacity: 0.7

  });


const particles =
  new THREE.Points(
    particleGeometry,
    particleMaterial
  );

scene.add(particles);


// ----------------------------------------------------
// FLOATING RINGS
// ----------------------------------------------------

const rings = [];

for (let i = 0; i < 6; i++) {

  const geometry =
    new THREE.TorusGeometry(
      2.7 + i * 0.45,
      0.008,
      8,
      100
    );

  const material =
    new THREE.MeshBasicMaterial({

      color:
        i % 2 === 0
          ? 0x00ffff
          : 0xff00cc,

      transparent: true,

      opacity: 0.25

    });

  const ring =
    new THREE.Mesh(
      geometry,
      material
    );

  ring.rotation.x =
    Math.random() * Math.PI;

  ring.rotation.y =
    Math.random() * Math.PI;

  rings.push(ring);

  scene.add(ring);

}


// ----------------------------------------------------
// MOUSE INTERACTION
// ----------------------------------------------------

const mouse = {
  x: 0,
  y: 0
};

window.addEventListener(
  "mousemove",
  (event) => {

    mouse.x =
      (event.clientX /
        window.innerWidth) *
        2 - 1;

    mouse.y =
      -(event.clientY /
        window.innerHeight) *
        2 + 1;

  }
);


// ----------------------------------------------------
// SCROLL
// ----------------------------------------------------

let scrollY = 0;

window.addEventListener(
  "scroll",
  () => {

    scrollY =
      window.scrollY /
      (document.body.scrollHeight -
        window.innerHeight);

  }
);


// ----------------------------------------------------
// ANIMATION
// ----------------------------------------------------

const clock = new THREE.Clock();

function animate() {

  requestAnimationFrame(animate);

  const elapsed =
    clock.getElapsedTime();


  // Core rotation

  core.rotation.x =
    elapsed * 0.25;

  core.rotation.y =
    elapsed * 0.45;


  sphere.scale.setScalar(
    1 +
    Math.sin(elapsed * 2) * 0.08
  );


  torus.rotation.z =
    elapsed * 0.3;

  torus2.rotation.x =
    elapsed * 0.25;


  // Particle rotation

  particles.rotation.y =
    elapsed * 0.015;

  particles.rotation.x =
    elapsed * 0.008;


  // Rings

  rings.forEach(
    (ring, index) => {

      ring.rotation.x +=
        0.0005 *
        (index + 1);

      ring.rotation.y +=
        0.0008 *
        (index + 1);

    }
  );


  // Mouse movement

  coreGroup.rotation.x +=
    (mouse.y * 0.25 -
      coreGroup.rotation.x) *
    0.025;

  coreGroup.rotation.y +=
    (mouse.x * 0.35 -
      coreGroup.rotation.y) *
    0.025;


  // Scroll camera

  const targetCameraX =
    mouse.x * 0.5;

  const targetCameraY =
    mouse.y * 0.3;

  camera.position.x +=
    (targetCameraX -
      camera.position.x) *
    0.02;

  camera.position.y +=
    (targetCameraY -
      camera.position.y) *
    0.02;


  // Zoom out while scrolling

  const targetZ =
    8 + scrollY * 5;

  camera.position.z +=
    (targetZ -
      camera.position.z) *
    0.03;


  // Move 3D core vertically

  coreGroup.position.y =
    scrollY * -3;


  coreGroup.rotation.z =
    scrollY * Math.PI;


  renderer.render(
    scene,
    camera
  );

}

animate();


// ----------------------------------------------------
// RESIZE
// ----------------------------------------------------

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );

  }
);


// ----------------------------------------------------
// EVENT CARD INTERACTION
// ----------------------------------------------------

const cards =
  document.querySelectorAll(
    ".event-card"
  );

cards.forEach((card) => {

  card.addEventListener(
    "mousemove",
    (event) => {

      const rect =
        card.getBoundingClientRect();

      const x =
        event.clientX -
        rect.left;

      const y =
        event.clientY -
        rect.top;

      const rotateX =
        ((y -
          rect.height / 2) /
          rect.height) *
        -12;

      const rotateY =
        ((x -
          rect.width / 2) /
          rect.width) *
        12;

      card.style.transform =
        `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-8px)
        `;

    }
  );


  card.addEventListener(
    "mouseleave",
    () => {

      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0)";

    }
  );

});