/** @format */

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.setClearColor(0xb7c3f3, 1);

const light = new THREE.AmbientLight(0xffffff); // soft white light
scene.add(light);

const startPosition = 5;
const endPosition = -startPosition;

function createCube(size, positionX, rotY = 0, color = 0x654f6f) {
  const geometry = new THREE.BoxGeometry(size.w, size.h, size.d);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.x = positionX;
  cube.rotation.y = rotY;
  scene.add(cube);
  return cube;
}

camera.position.z = 5;

const loader = new THREE.GLTFLoader();

class Doll {
  constructor() {
    loader.load("../models/scene.gltf", (gltf) => {
      scene.add(gltf.scene);
      gltf.scene.scale.set(0.4, 0.4, 0.4);
      gltf.scene.position.set(0, -1, 0);
      this.doll = gltf.scene;
    });
  }
  lookBackward() {
    // this.doll.rotation.y = -3.15;
    gsap.to(this.doll.rotation, { y: -3.15, duration: 0.45 });
  }
  lookForward() {
    gsap.to(this.doll.rotation, { y: 0, duration: 0.45 });
  }
}

function createTrack() {
  createCube(
    { w: startPosition * 2 + 0.5, h: 1.5, d: 1 },
    0,
    0,
    0x537a5a
  ).position.z = -0.9;
  createCube({ w: 0.2, h: 1.5, d: 1 }, startPosition, -0.3);
  createCube({ w: 0.2, h: 1.5, d: 1 }, endPosition, 0.3);
}
createTrack();

class Player {
  constructor() {
    const geometry = new THREE.SphereGeometry(0.3, 32, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x070707 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.x = startPosition;
    scene.add(sphere);
    this.player = sphere;
    this.playerInfo = {
      positionX: startPosition + 1,
      velocity: 0,
    };
  }
  run() {}
  update() {
    this.playerInfo.positionX -= this.playerInfo.velocity;
    this.player.position.x = this.playerInfo.positionX;
  }
}
const player = new Player();
let doll = new Doll();
setTimeout(() => {
  doll.lookBackward();
}, 1000);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  player.update();
}
animate();
window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
