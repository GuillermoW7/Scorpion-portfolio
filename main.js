// Importa Three.js
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


let modelo;

document.addEventListener('DOMContentLoaded', () => {
  // Configuración básica de Three.js
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(111, window.innerWidth / window.innerHeight, 0.1, 1000);
  const myCanvas = document.createElement('canvas');
  document.body.appendChild(myCanvas);
  const renderer = new THREE.WebGLRenderer({ canvas: myCanvas, context: myCanvas.getContext('webgl2') });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Configuración del fondo degradado
  const gradientColors = [0x000900, 0x000000]; // Colores de gradiente 
  const gradientTexture = new THREE.CanvasTexture(createGradientTexture(gradientColors));
  scene.background = gradientTexture; 
 // Añadir una imagen a la escena
 const imagenTexture = new THREE.TextureLoader().load('g.png');
 const imagenMaterial = new THREE.MeshBasicMaterial({ map: imagenTexture, transparent: true, side: THREE.DoubleSide });
 const imagenGeometry = new THREE.PlaneGeometry(555, 35); // Ajusta el tamaño según tus necesidades
 const imagen = new THREE.Mesh(imagenGeometry, imagenMaterial);
 imagen.position.y = 28;
 imagen.position.x = 9;
 imagen.position.z = 8.5;
 scene.add(imagen); 
 // Animación de la img
 const animate1 = function () {
   requestAnimationFrame(animate1);
   // Rotación de la imagen
   imagen.rotation.x += 0.00;
   imagen.rotation.y += 0.00;
   renderer.render(scene, camera);
 };
 animate1();

  // Configuración de la cámara
  camera.position.z = 37;

// ciudad de fondo
  const loader = new GLTFLoader();
  const modeloURL1 = 'city.glb';
  let mixer1;
  loader.load(modeloURL1, (gltf) => {
    const modelo1 = gltf.scene;
    modelo1.position.set(0, -2, 1);
    modelo1.scale.set(1, 1, 0.1);
    mixer1 = new THREE.AnimationMixer(modelo1);
    // Reproduce todas las animaciones disponibles en el modelo ciudad (son 5)
    gltf.animations.forEach((clip) => {
      const action = mixer1.clipAction(clip);
      action.play();
    });
    scene.add(modelo1);
  });
  // Función de animación
  const animate = function () {
    requestAnimationFrame(animate);
    // Actualiza el AnimationMixer para que las animaciones se reproduzcan
    if (mixer1) {
      mixer1.update(0.01); // Ajusta el valor del tiempo delta 
    }
  };
  animate();


  //escorpion
  const modeloURL = 'scorpion.glb';
  let mixer;
  loader.load(modeloURL, (gltf) => {
    modelo = gltf.scene;
    modelo.position.set(-211, 1, 7); 
    modelo.scale.set(0.48, 1.3, 1.3);
    modelo.rotation.y = THREE.MathUtils.degToRad(90); // Gira 45 grados
    mixer = new THREE.AnimationMixer(modelo);
  
    const actions = {}; 
    gltf.animations.forEach((clip) => {
      const action = mixer.clipAction(clip);
      actions[clip.name] = action;
    });
    actions['relax'].play(); // animación de reposo
    scene.add(modelo);



    //iconos / objetivos
    const icon = 'icon.glb';
    let icon1, icon2, icon3, icon4;     
    loader.load(icon, (gltf) => {
      icon1 = gltf.scene;
      icon1.position.set(-54, 27.5, 8.3);
      icon1.scale.set(0.7, 8, 8);
      icon1.rotation.y = THREE.MathUtils.degToRad(90); // Gira 45 grados   
      scene.add(icon1);
    });
    loader.load(icon, (gltf) => {
      icon2 = gltf.scene;
      icon2.position.set(12.5, 27.5, 8.3);
      icon2.scale.set(0.6, 7, 7);
      icon2.rotation.y = THREE.MathUtils.degToRad(90); // Gira 45 grados
      scene.add(icon2);
    });
    loader.load(icon, (gltf) => {
      icon3 = gltf.scene;
      icon3.position.set(77, 28.5, 8.3);
      icon3.scale.set(0.6, 7, 7);
      icon3.rotation.y = THREE.MathUtils.degToRad(90); // Gira 45 grados
      scene.add(icon3);
    });
    loader.load(icon, (gltf) => {
      icon4 = gltf.scene;
      icon4.position.set(148, 28.5, 8.3);
      icon4.scale.set(0.6, 7, 7);
      icon4.rotation.y = THREE.MathUtils.degToRad(90); // Gira 45 grados
      scene.add(icon4);
    });
    
    //disparo
    const shootProjectile = () => {
      const projectileURL = 'ball.glb';
      loader.load(projectileURL, (gltf) => {
        const projectile = gltf.scene;
        projectile.position.copy(modelo.position); // El proyectil comienza en la posición del modelo
        projectile.position.y += 10; 
        projectile.position.x -= 2;
        projectile.position.z = 8.3;
        projectile.scale.set(2.3, 2.3, 0.23);    
        scene.add(projectile);

        const projectileSpeed = 3; // Ajustar la velocidad del proyectil
        const projectileDirection = new THREE.Vector3(1, 0, 0); // Dirección inicial del proyectil
    
        // Mover el proyectil
        const moveProjectile = () => {
          projectile.position.addScaledVector(projectileDirection, projectileSpeed);

          // Verificar colisión con los iconos
          const icons = [icon1, icon2, icon3, icon4];
          for (let i = 0; i < icons.length; i++) {
            if (icons[i]) { // Verificar si el icono está definido
              const iconBox = new THREE.Box3().setFromObject(icons[i]);
              const projectileBox = new THREE.Box3().setFromObject(projectile);
    
              if (iconBox.intersectsBox(projectileBox)) {
                if (i !== 0) { // Redirigir solo si el ícono no es icon1
                  // Abre el enlace en una nueva ventana cuando hay colisión
                  let link = '';
                  switch (i) {
                    case 1:
                      link = 'https://github.com/GuillermoW7/Documentation/blob/main/CV.pdf';
                      break;
                    case 2:
                      link = 'https://github.com/GuillermoW7';
                      break;
                    case 3:
                      link = 'https://pointed-soldier-1b1.notion.site/Maquinas-virtuales-y-retos-ciberseguridad-documentaci-n-16ceba1743f6484aa3a4a33801cbcf79';
                      break;
                  }
                  window.open(link, '_blank');
                }
                // Calcula la nueva dirección de rebote
                const normal = new THREE.Vector3();
                iconBox.getCenter(normal);
                normal.sub(projectileBox.getCenter(new THREE.Vector3())).normalize();
                const dot = projectileDirection.dot(normal);
                projectileDirection.sub(normal.multiplyScalar(2 * dot));
              }
            }
          }
    
          // Verificar si el proyectil está fuera del campo de visión
          if (projectile.position.x > 290) { 
            // Remover el proyectil de la escena
            scene.remove(projectile);
            // Detener la función de mover el proyectil
            clearInterval(projectileInterval);
          }
        };
        // Llamar a moveProjectile cada cierto intervalo de tiempo
        const projectileInterval = setInterval(moveProjectile, 50); 
      });
    };
    // Llamar a la función para disparar el proyectil
    shootProjectile();
    


//funciones interactivas
    const gravity = -0.1;
    let velocity = { x: 0, y: 0 };
    let isJumping = false;
    let jumpCount = 0;
    const maxJumpCount = 7; // número máximo de saltos permitidos
    let playAnimation = false;
  
    const handleKeyDown = (event) => {
      const speed = 1.5;
  
      switch (event.key) {
        case 'x':
          actions['atack'].play();
          shootProjectile();
        break;
        case 'ArrowLeft':
          velocity.x = -speed;
          playAnimation = true; // Activar la animación al presionar ArrowLeft
          actions['relax'].stop(); // Detener la animación de reposo
          actions['walkB'].play(); // Reproducir la animación de caminar
          break;
        case 'ArrowRight':
          velocity.x = speed;
          playAnimation = true; // Activar la animación al presionar ArrowRight
          actions['relax'].stop(); // Detener la animación de reposo
          actions['walkA'].play(); // Reproducir la animación de caminar
          break;
        case 'ArrowUp':
          // Salto con flecha arriba
          if (!isJumping && jumpCount < maxJumpCount) {
            velocity.y = 1.3; 
            isJumping = true;
            jumpCount++;
           actions['jump'].stop(); // Detener la animación de salto antes de reproducirla
           actions['jump'].reset(); // Reiniciar la animación de salto antes de reproducirla
           actions['jump'].play(); // Reproducir la animación de salto
          }
          break;
      }
    };
  
    const handleKeyUp = (event) => {
      switch (event.key) {
        case 'x':
          actions['atack'].stop();
          break;
        case 'ArrowLeft':
        case 'ArrowRight':
          velocity.x = 0;
          playAnimation = false; // Desactivar la animación al soltar ArrowLeft o ArrowRight
          actions['walkA'].stop(); // Detener la animación de caminar al soltar la tecla
          actions['walkB'].stop(); // Detener la animación de caminar al soltar la tecla
          actions['relax'].play(); // Reproducir la animación de reposo al soltar la tecla
          break;
          case 'ArrowUp':
        isJumping = false;
        if (isJumping < 1) {
           actions['jump'].stop();
        }
        break;
      }
    };
  
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    const clock = new THREE.Clock();
  
    const animate = function () {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();
  mixer.update(delta);

      // Verificar si se debe reproducir la animación antes de actualizarla
      if (playAnimation) {
        mixer.update(delta);
      }

      // Aplicar gravedad al salto
      if (modelo.position.y > 0 || isJumping) {
        velocity.y += gravity;
        modelo.position.y += velocity.y;
  
        // Detener el salto al tocar el suelo
        if (modelo.position.y <= 0) {
          modelo.position.y = 0;
          velocity.y = 0;
          isJumping = false;
          jumpCount = 0; 
          actions['jump'].stop(); 
          actions['relax'].play();
        }
      }
      // Aplicar movimiento horizontal
      modelo.position.x += velocity.x;
      // Mover la cámara junto con el modelo en el eje x
      camera.position.x += (modelo.position.x - camera.position.x) + 8;
      camera.position.y += (modelo.position.y - camera.position.y) + 35;
      renderer.render(scene, camera);
    };
    animate();
  });

// luces 
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(30, 1, 1).normalize();
scene.add(directionalLight);

  // Función para crear un fondo degradado
  function createGradientTexture(colors) {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, window.innerHeight, 0, 0);

    // Utiliza template literals
    gradient.addColorStop(0, `#${colors[0].toString(16).padStart(6, '0')}`);
    gradient.addColorStop(1, `#${colors[1].toString(16).padStart(6, '0')}`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    return canvas;
  }
});