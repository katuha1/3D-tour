// Указываем canvas
const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({canvas: canvas});
renderer.setSize(window.innerWidth, window.innerHeight);

// Обработчик события resize на объекте window
window.addEventListener('resize', function() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Параметры / Переменные
// Определение текущей позиции (панорамы)
let currentSphereIndex = 0;

// Массив панорам
// const spheres = [{ texture: 'path/to/texture1.jpg', cameraPosition: new THREE.Vector3(0, 0, 0) }];
let spheres = [
    createSphere('path/jevL9av.jpg'),
    createSphere('path/GFLxXVV.jpg')
];

// Создаение сцены
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 0, 0);
scene.add(camera);

// Обновление текстуры сферы
function updateSphere() {
    console.log("Текстура №" + currentSphereIndex);
    if (currentSphereIndex > 0) {
        spheres[currentSphereIndex].visible = false;
        currentSphereIndex--;
        spheres[currentSphereIndex].visible = true;
        camera.fov = THREE.Math.clamp(100, 10, 75);
        camera.updateProjectionMatrix();
    } else if (currentSphereIndex < spheres.length - 1) {
        spheres[currentSphereIndex].visible = false;
        currentSphereIndex++;
        spheres[currentSphereIndex].visible = true;
        camera.fov = THREE.Math.clamp(100, 10, 75);
        camera.updateProjectionMatrix();
    }
};

function createSphere(texturePath) {
    let geometry = new THREE.SphereGeometry(500, 60, 40);
    let material = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(texturePath),
      side: THREE.DoubleSide,
      transparent: true,
    });
    return new THREE.Mesh(geometry, material);
};

// Добавляем все сферы
scene.add(spheres[0]);
for (let i = 1; i < spheres.length; i++) {
    spheres[i].visible = false; 
    scene.add(spheres[i]);
}

// Функция для обновления сцены в каждом кадре
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();

/*----------- Управление ------------*/

// Перемещение между панорамами
document.addEventListener('keydown', function(event) {
    if (event.code === 'ArrowRight') {
        updateSphere();
    } else if (event.code === 'ArrowLeft') {
        updateSphere();
    }
});

// Параметры для движения камерой
var isDragging = false;
var previousMousePosition = {
  x: 0,
  y: 0
};
// Вспомогательная функция для перемещения камеры
function toRadians(angle) {
  return angle * (Math.PI / 180);
}

// Приближении при скролле
canvas.addEventListener('wheel', function(event) {
    let fov = camera.fov + event.deltaY * 0.02;
    camera.fov = THREE.Math.clamp(fov, 10, 75);
    camera.updateProjectionMatrix();
});
// Передвижение мыши / Камеры
canvas.addEventListener('mousemove', function(event) {
    if (isDragging) {
      let deltaMove = {
        x: event.clientX - previousMousePosition.x,
        y: event.clientY - previousMousePosition.y
      };
      spheres[currentSphereIndex].rotation.y -= toRadians(deltaMove.x * 0.1);
      spheres[currentSphereIndex].rotation.x -= toRadians(deltaMove.y * 0.1);
    }
    previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
});
// Отслеживаем нажатие мыши
canvas.addEventListener('mousedown', function(event) {
    isDragging = true;
    previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
});
// Если кнопку мыши отпустили
canvas.addEventListener('mouseup', function(event) { isDragging = false; });

