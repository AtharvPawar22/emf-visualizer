let scene, camera, renderer, controls;

let currentVisualization = null;
let isPlaying = true;
let currentUnit = "electrostatics";
let chargeValue = 1;
let currentValue = 1;
let showLabels = true;
let showEquipotential = false;
let showVectors = false;

const visualizationOptions = {
  electrostatics: [{
    value: "coordinates-cartesian",
    label: "Cartesian Coordinates",
    description: "Basic 3D coordinate system with x, y, z axes.",
    equation: "\\( \\mathbf{r} = x\\mathbf{\\hat{i}} + y\\mathbf{\\hat{j}} + z\\mathbf{\\hat{k}} \\)",
  }, {
    value: "coordinates-cylindrical",
    label: "Cylindrical Coordinates",
    description: "Cylindrical coordinate system (ρ, φ, z).",
    equation: "\\( \\mathbf{r} = \\rho\\mathbf{\\hat{\\rho}} + z\\mathbf{\\hat{z}} \\)",
  }, {
    value: "coordinates-spherical",
    label: "Spherical Coordinates",
    description: "Spherical coordinate system (r, θ, φ).",
    equation: "\\( \\mathbf{r} = r\\mathbf{\\hat{r}} \\)",
  }, {
    value: "vector-calculus-gradient",
    label: "Gradient (Scalar to Vector)",
    description: "Visualizes the gradient of a scalar field, showing the direction of the greatest rate of increase.",
    equation: "\\( \\nabla f = \\frac{\\partial f}{\\partial x}\\mathbf{\\hat{i}} + \\frac{\\partial f}{\\partial y}\\mathbf{\\hat{j}} + \\frac{\\partial f}{\\partial z}\\mathbf{\\hat{k}} \\)",
  }, {
    value: "vector-calculus-divergence",
    label: "Divergence (Vector Field Flow)",
    description: "Visualizes the divergence of a vector field, indicating the outward flux from a point.",
    equation: "\\( \\nabla \\cdot \\mathbf{F} = \\frac{\\partial F_x}{\\partial x} + \\frac{\\partial F_y}{\\partial y} + \\frac{\\partial F_z}{\\partial z} \\)",
  }, {
    value: "vector-calculus-curl",
    label: "Curl (Vector Field Rotation)",
    description: "Visualizes the curl of a vector field, indicating the rotation or circulation at a point.",
    equation: "\\( \\nabla \\times \\mathbf{F} = \\left( \\frac{\\partial F_z}{\\partial y} - \\frac{\\partial F_y}{\\partial z} \\right)\\mathbf{\\hat{i}} + \\left( \\frac{\\partial F_x}{\\partial z} - \\frac{\\partial F_z}{\\partial x} \\right)\\mathbf{\\hat{j}} + \\left( \\frac{\\partial F_y}{\\partial x} - \\frac{\\partial F_x}{\\partial y} \\right)\\mathbf{\\hat{k}} \\)",
  }, {
    value: "electric-field-point",
    label: "Point Charge Electric Field (E)",
    description: "Electric field intensity (E) around a point charge. Field lines originate from positive charges and terminate on negative charges.",
    equation: "\\( \\mathbf{E} = \\frac{1}{4\\pi\\epsilon_0} \\frac{Q}{r^2} \\mathbf{\\hat{r}} \\)",
  }, {
    value: "electric-field-dipole",
    label: "Electric Dipole Field",
    description: "Electric field of two opposite charges (a dipole).",
    equation: "\\( \\mathbf{E}_{dipole} = \\frac{1}{4\\pi\\epsilon_0} \\frac{p}{r^3} [2\\cos\\theta\\mathbf{\\hat{r}} + \\sin\\theta\\mathbf{\\hat{\\theta}}] \\)",
  }, {
    value: "electric-field-line",
    label: "Line Charge Electric Field (E)",
    description: "Electric field intensity (E) around an infinite line charge.",
    equation: "\\( \\mathbf{E} = \\frac{\\lambda}{2\\pi\\epsilon_0 \\rho} \\mathbf{\\hat{\\rho}} \\)",
  }, {
    value: "electric-field-plane",
    label: "Plane Charge Electric Field (E)",
    description: "Electric field intensity (E) from an infinite plane charge.",
    equation: "\\( \\mathbf{E} = \\frac{\\sigma}{2\\epsilon_0} \\mathbf{\\hat{n}} \\)",
  }, {
    value: "displacement-flux-density",
    label: "Electric Displacement Flux Density (D)",
    description: "Visualizes the Electric Displacement Flux Density (D) for a point charge, showing how D lines are independent of the medium.",
    equation: "\\( \\mathbf{D} = \\epsilon_0 \\epsilon_r \\mathbf{E} = \\epsilon \\mathbf{E} \\)",
  }, {
    value: "gauss-law",
    label: "Gauss's Law",
    description: "Illustrates Gauss's Law for electrostatics, relating electric flux through a closed surface to the enclosed charge.",
    equation: "\\( \\oint_S \\mathbf{D} \\cdot d\\mathbf{S} = Q_{enc} \\)",
  }],
  magnetostatics: [{
    value: "lorentz-force",
    label: "Lorentz Force",
    description: "Visualizes the Lorentz force on a moving charge in combined electric and magnetic fields.",
    equation: "\\( \\mathbf{F} = q(\\mathbf{E} + \\mathbf{v} \\times \\mathbf{B}) \\)",
  }, {
    value: "magnetic-straight",
    label: "Magnetic Field Intensity (H) - Straight Conductor",
    description: "Magnetic field intensity (H) around a straight conductor carrying current. Uses Ampère's Law principles.",
    equation: "\\( \\mathbf{H} = \\frac{I}{2\\pi r} \\mathbf{\\hat{\\phi}} \\)",
  }, {
    value: "magnetic-loop",
    label: "Magnetic Field Intensity (H) - Current Loop",
    description: "Magnetic field intensity (H) through a current loop. Uses Biot-Savart's Law principles.",
    equation: "\\( \\mathbf{H}_{center} = \\frac{I}{2R} \\mathbf{\\hat{z}} \\)",
  }, {
    value: "magnetic-solenoid",
    label: "Magnetic Field Intensity (H) - Solenoid",
    description: "Magnetic field intensity (H) inside a solenoid.",
    equation: "\\( \\mathbf{H} = nI \\mathbf{\\hat{z}} \\)",
  }, {
    value: "magnetic-plane-sheet",
    label: "Magnetic Field Intensity (H) - Infinite Sheet",
    description: "Magnetic field intensity (H) due to an infinite sheet of current.",
    equation: "\\( \\mathbf{H} = \\frac{1}{2} \\mathbf{K} \\times \\mathbf{\\hat{n}} \\)",
  }, {
    value: "magnetic-flux-density",
    label: "Magnetic Flux Density (B)",
    description: "Visualizes Magnetic Flux Density (B) for a straight conductor, showing its relation to H.",
    equation: "\\( \\mathbf{B} = \\mu_0 \\mu_r \\mathbf{H} = \\mu \\mathbf{H} \\)",
  }, {
    value: "biot-savart-law",
    label: "Biot-Savart's Law",
    description: "Conceptual visualization of Biot-Savart's Law, showing how current elements contribute to magnetic fields.",
    equation: "\\( d\\mathbf{H} = \\frac{I d\\mathbf{L} \\times \\mathbf{\\hat{R}}}{4\\pi R^2} \\)",
  }, {
    value: "ampere-circuit-law",
    label: "Ampère's Circuit Law",
    description: "Illustrates Ampère's Circuit Law, relating the circulation of magnetic field intensity around a closed path to the enclosed current.",
    equation: "\\( \\oint_L \\mathbf{H} \\cdot d\\mathbf{L} = I_{enc} \\)",
  }, {
    value: "maxwell-magnetostatics",
    label: "Maxwell's Equations for Magnetostatics",
    description: "Conceptual visualization of Maxwell's Equations specific to magnetostatics (Ampère's Law and Gauss's Law for Magnetism).",
    equation: "\\( \\nabla \\times \\mathbf{H} = \\mathbf{J} \\quad \\text{and} \\quad \\nabla \\cdot \\mathbf{B} = 0 \\)",
  }]
};

const THREE = window.THREE;

function init() {
  setupThreeJS();
  setupEventListeners();
  populateVisualizationOptions();
  updateControlVisibility();
  onWindowResize();
  animate();
}

function setupThreeJS() {
  const container = document.getElementById("threeContainer");

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0f172a);

  camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(8, 8, 8);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 1.0;
  controls.maxDistance = 20;
  controls.minDistance = 2;

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0xffffff, 1.2, 100);
  pointLight1.position.set(15, 15, 15);
  pointLight1.castShadow = true;
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xffffff, 0.8, 100);
  pointLight2.position.set(-15, -15, -15);
  scene.add(pointLight2);

  const spotLight = new THREE.SpotLight(0xffffff, 0.5);
  spotLight.position.set(0, 20, 0);
  spotLight.angle = 0.3;
  spotLight.penumbra = 1;
  scene.add(spotLight);

  const gridHelper = new THREE.GridHelper(20, 20, 0x333333, 0x111111);
  scene.add(gridHelper);

  window.addEventListener("resize", onWindowResize);
}

function createTextLabel(message, position, color = 0xffffff) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = 'Bold 40px Arial';
  context.fillStyle = `rgba(${Math.floor(new THREE.Color(color).r * 255)}, ${Math.floor(new THREE.Color(color).g * 255)}, ${Math.floor(new THREE.Color(color).b * 255)}, 1)`;
  context.fillText(message, 0, 40);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({
    map: texture
  });
  const sprite = new THREE.Sprite(material);
  sprite.position.copy(position);
  sprite.scale.set(2, 1, 1);
  return sprite;
}

function createCoordinateSystem(type) {
  const group = new THREE.Group();
  const axesHelper = new THREE.AxesHelper(4);
  group.add(axesHelper);

  if (showLabels) {
    group.add(createTextLabel('X', new THREE.Vector3(4.5, 0, 0), 0xff0000));
    group.add(createTextLabel('Y', new THREE.Vector3(0, 4.5, 0), 0x00ff00));
    group.add(createTextLabel('Z', new THREE.Vector3(0, 0, 4.5), 0x0000ff));
  }

  if (type === "cylindrical") {
    // Create concentric circles for ρ coordinate
    for (let r = 1; r <= 3; r++) {
      const ringGeometry = new THREE.TorusGeometry(r, 0.02, 16, 100);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x888888
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    }
    
    // Create radial lines for φ coordinate
    for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 8) {
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(4 * Math.cos(angle), 0, 4 * Math.sin(angle))
      ]);
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x666666
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      group.add(line);
    }
    
    if (showLabels) {
      group.add(createTextLabel('ρ', new THREE.Vector3(2.2, 0.3, 0), 0xffaa00));
      group.add(createTextLabel('φ', new THREE.Vector3(-0.3, 2.2, 0), 0xffaa00));
      group.add(createTextLabel('z', new THREE.Vector3(0.3, 0, 3.5), 0xffaa00));
    }
  } else if (type === "spherical") {
    // Create concentric spheres for r coordinate
    for (let r = 1; r <= 4; r++) {
      const sphereGeometry = new THREE.SphereGeometry(r, 32, 16);
      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0x666666,
        wireframe: true,
        transparent: true,
        opacity: 0.2,
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      group.add(sphere);
    }
    
    // Add meridians for θ coordinate
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const curve = new THREE.EllipseCurve(0, 0, 4, 4, 0, Math.PI * 2, false, 0);
      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x * Math.cos(angle), p.y, p.x * Math.sin(angle))));
      const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x444444 }));
      group.add(line);
    }
    
    if (showLabels) {
      group.add(createTextLabel('r', new THREE.Vector3(3, 3, 3), 0xffaa00));
      group.add(createTextLabel('θ', new THREE.Vector3(0, 4.2, 0), 0xffaa00));
      group.add(createTextLabel('φ', new THREE.Vector3(4.2, 0, 0), 0xffaa00));
    }
  }
  return group;
}

function createElectricField(type) {
  const group = new THREE.Group();

  if (type === "electric-field-point") {
    // Create point charge
    const chargeGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const chargeMaterial = new THREE.MeshStandardMaterial({
      color: chargeValue > 0 ? 0xff4444 : 0x4444ff,
      emissive: chargeValue > 0 ? 0xff2222 : 0x2222ff,
      emissiveIntensity: 0.5,
    });
    const charge = new THREE.Mesh(chargeGeometry, chargeMaterial);
    group.add(charge);

    // Add charge sign label
    if (showLabels) {
      group.add(createTextLabel(chargeValue > 0 ? '+Q' : '-Q', new THREE.Vector3(0, 0.5, 0), chargeValue > 0 ? 0xff4444 : 0x4444ff));
    }

    // Create radial field lines with proper density
    const numRings = 8;
    const numLinesPerRing = 8;
    for (let ring = 0; ring < numRings; ring++) {
      const theta = (ring + 0.5) * Math.PI / numRings;
      for (let i = 0; i < numLinesPerRing; i++) {
        const phi = (i / numLinesPerRing) * 2 * Math.PI;
        const direction = new THREE.Vector3(
          Math.sin(theta) * Math.cos(phi),
          Math.cos(theta),
          Math.sin(theta) * Math.sin(phi)
        );
        
        const start = direction.clone().multiplyScalar(0.3);
        const end = direction.clone().multiplyScalar(5);
        
        if (chargeValue < 0) {
          direction.multiplyScalar(-1);
        }
        
        const arrow = new THREE.ArrowHelper(
          direction.normalize(), 
          start, 
          4.7, 
          chargeValue > 0 ? 0x00ff88 : 0xff4444, 
          0.3, 
          0.15
        );
        group.add(arrow);
      }
    }

    // Equipotential surfaces
    if (showEquipotential) {
      for (let r = 1; r <= 4; r += 0.8) {
        const sphereGeometry = new THREE.SphereGeometry(r, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({
          color: 0xffaa00,
          wireframe: true,
          transparent: true,
          opacity: 0.3,
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        group.add(sphere);
      }
    }

    // Field vectors at discrete points
    if (showVectors) {
      const fieldColor = 0x00ffff;
      for (let x = -3; x <= 3; x += 1.5) {
        for (let y = -3; y <= 3; y += 1.5) {
          for (let z = -3; z <= 3; z += 1.5) {
            if (x === 0 && y === 0 && z === 0) continue;
            const origin = new THREE.Vector3(x, y, z);
            const r = origin.length();
            const direction = origin.clone().normalize();
            if (chargeValue < 0) direction.multiplyScalar(-1);
            const magnitude = Math.min(1.0 / (r * r), 0.8);
            
            const arrow = new THREE.ArrowHelper(direction, origin, magnitude, fieldColor, 0.2, 0.1);
            group.add(arrow);
          }
        }
      }
    }

  } else if (type === "electric-field-dipole") {
    // Create positive and negative charges
    const posCharge = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), 
      new THREE.MeshStandardMaterial({ color: 0xff4444, emissive: 0xff2222, emissiveIntensity: 0.3 }));
    posCharge.position.set(1, 0, 0);
    group.add(posCharge);

    const negCharge = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), 
      new THREE.MeshStandardMaterial({ color: 0x4444ff, emissive: 0x2222ff, emissiveIntensity: 0.3 }));
    negCharge.position.set(-1, 0, 0);
    group.add(negCharge);

    if (showLabels) {
      group.add(createTextLabel('+Q', new THREE.Vector3(1.3, 0.3, 0), 0xff4444));
      group.add(createTextLabel('-Q', new THREE.Vector3(-1.3, 0.3, 0), 0x4444ff));
    }

    // Accurate dipole field lines
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI;
      
      // Create curved field lines from + to -
      const points = [];
      for (let t = 0; t <= 1; t += 0.02) {
        const theta = angle;
        const r = 2 * Math.sin(theta) * Math.sin(theta) / (1 + Math.cos(theta));
        const x = 1 - r * Math.cos(theta + Math.PI) * t;
        const y = r * Math.sin(theta + Math.PI) * t;
        points.push(new THREE.Vector3(x, y, 0));
      }
      
      if (points.length > 1) {
        const curve = new THREE.CatmullRomCurve3(points);
        const geometry = new THREE.TubeGeometry(curve, 50, 0.02, 8, false);
        const material = new THREE.MeshBasicMaterial({ color: 0x00aaff });
        const tube = new THREE.Mesh(geometry, material);
        group.add(tube);
        
        // Mirror for 3D effect
        const tube2 = tube.clone();
        tube2.rotation.z = Math.PI;
        group.add(tube2);
      }
    }

  } else if (type === "electric-field-line") {
    // Infinite line charge along z-axis
    const lineGeometry = new THREE.CylinderGeometry(0.05, 0.05, 8, 16);
    const lineMaterial = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0xaa6600,
      emissiveIntensity: 0.3
    });
    const line = new THREE.Mesh(lineGeometry, lineMaterial);
    group.add(line);

    if (showLabels) {
      group.add(createTextLabel('λ', new THREE.Vector3(0.3, 4.2, 0), 0xffaa00));
    }

    // Radial field lines in cylindrical symmetry
    for (let z = -3; z <= 3; z += 1.5) {
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const origin = new THREE.Vector3(0.1 * Math.cos(angle), 0.1 * Math.sin(angle), z);
        const direction = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
        
        const arrow = new THREE.ArrowHelper(direction, origin, 3.5, 0x00aaff, 0.3, 0.15);
        group.add(arrow);
      }
    }

    // Equipotential cylinders
    if (showEquipotential) {
      for (let r = 1; r <= 3; r += 0.5) {
        const cylinderGeometry = new THREE.CylinderGeometry(r, r, 8, 32, 1, true);
        const cylinderMaterial = new THREE.MeshBasicMaterial({
          color: 0xff6600,
          wireframe: true,
          transparent: true,
          opacity: 0.3
        });
        const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        group.add(cylinder);
      }
    }

  } else if (type === "electric-field-plane") {
    // Infinite plane sheet
    const planeGeometry = new THREE.PlaneGeometry(8, 8);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: 0x666666,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    group.add(plane);

    if (showLabels) {
      group.add(createTextLabel('σ', new THREE.Vector3(0, 0, 0.5), 0x666666));
    }

    // Uniform field on both sides
    for (let x = -3; x <= 3; x += 1) {
      for (let y = -3; y <= 3; y += 1) {
        // Field above plane
        const arrow1 = new THREE.ArrowHelper(
          new THREE.Vector3(0, 0, 1), 
          new THREE.Vector3(x, y, 0.1), 
          2.5, 
          0xff00aa, 
          0.3, 
          0.15
        );
        group.add(arrow1);
        
        // Field below plane
        const arrow2 = new THREE.ArrowHelper(
          new THREE.Vector3(0, 0, -1), 
          new THREE.Vector3(x, y, -0.1), 
          2.5, 
          0xff00aa, 
          0.3, 
          0.15
        );
        group.add(arrow2);
      }
    }

  } else if (type === "displacement-flux-density") {
    // Similar to point charge but representing D field
    const pointChargeGroup = createElectricField("electric-field-point");
    group.add(pointChargeGroup);
    
    if (showLabels) {
      group.add(createTextLabel('D = εE', new THREE.Vector3(0, -5, 0), 0x00ffff));
    }

  } else if (type === "gauss-law") {
    // Point charge at center
    const charge = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), 
      new THREE.MeshStandardMaterial({ color: 0xff4444, emissive: 0xff2222, emissiveIntensity: 0.5 }));
    group.add(charge);

    // Gaussian surface (sphere)
    const gaussianSurface = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), 
      new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      }));
    group.add(gaussianSurface);

    if (showLabels) {
      group.add(createTextLabel('Q', new THREE.Vector3(0.5, 0.5, 0), 0xff4444));
      group.add(createTextLabel('Gaussian Surface', new THREE.Vector3(0, -4, 0), 0x00ff00));
    }

    // D field vectors through surface
    for (let i = 0; i < 40; i++) {
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * 2 * Math.PI;
      
      const origin = new THREE.Vector3(
        3 * Math.sin(theta) * Math.cos(phi),
        3 * Math.sin(theta) * Math.sin(phi),
        3 * Math.cos(theta)
      );
      
      const direction = origin.clone().normalize();
      const arrow = new THREE.ArrowHelper(direction, origin, 0.8, 0x00ff00, 0.2, 0.1);
      group.add(arrow);
    }

  } else if (type === "vector-calculus-gradient") {
    // Scalar field: f = -(x² + y² + z²) - paraboloid
    const gridSize = 2;
    const spacing = 1;
    
    for (let x = -gridSize; x <= gridSize; x += spacing) {
      for (let y = -gridSize; y <= gridSize; y += spacing) {
        for (let z = -gridSize; z <= gridSize; z += spacing) {
          const pos = new THREE.Vector3(x, y, z);
          // Gradient of -(x² + y² + z²) is -2(xi + yj + zk)
          const grad = new THREE.Vector3(-2 * x, -2 * y, -2 * z);
          const magnitude = Math.min(grad.length() * 0.1, 0.8);
          
          if (magnitude > 0.1) {
            const arrow = new THREE.ArrowHelper(
              grad.clone().normalize(), 
              pos, 
              magnitude, 
              0x00ffff, 
              0.15, 
              0.1
            );
            group.add(arrow);
          }
        }
      }
    }
    
    if (showLabels) {
      group.add(createTextLabel('∇f', new THREE.Vector3(0, 3, 0), 0x00ffff));
    }

  } else if (type === "vector-calculus-divergence") {
    // Vector field with positive divergence: F = r (expanding field)
    const gridSize = 2;
    const spacing = 0.8;
    
    for (let x = -gridSize; x <= gridSize; x += spacing) {
      for (let y = -gridSize; y <= gridSize; y += spacing) {
        for (let z = -gridSize; z <= gridSize; z += spacing) {
          if (x === 0 && y === 0 && z === 0) continue;
          const pos = new THREE.Vector3(x, y, z);
          const magnitude = Math.min(pos.length() * 0.2, 0.8);
          
          const arrow = new THREE.ArrowHelper(
            pos.clone().normalize(), 
            pos, 
            magnitude, 
            0xff00ff, 
            0.15, 
            0.1
          );
          group.add(arrow);
        }
      }
    }
    
    if (showLabels) {
      group.add(createTextLabel('∇·F > 0', new THREE.Vector3(0, 3, 0), 0xff00ff));
      group.add(createTextLabel('Source', new THREE.Vector3(0, -3, 0), 0xff00ff));
    }

  } else if (type === "vector-calculus-curl") {
    // Vector field with curl: F = (-y, x, 0) - rotation around z
    const gridSize = 2;
    const spacing = 0.6;
    
    for (let x = -gridSize; x <= gridSize; x += spacing) {
      for (let y = -gridSize; y <= gridSize; y += spacing) {
        if (x === 0 && y === 0) continue;
        const pos = new THREE.Vector3(x, y, 0);
        const field = new THREE.Vector3(-y, x, 0);
        const magnitude = Math.min(field.length() * 0.3, 0.8);
        
        const arrow = new THREE.ArrowHelper(
          field.clone().normalize(), 
          pos, 
          magnitude, 
          0x00ff00, 
          0.15, 
          0.1
        );
        group.add(arrow);
      }
    }
    
    // Curl vector (pointing along z-axis)
    const curlArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 1), 
      new THREE.Vector3(0, 0, 0), 
      2, 
      0xff0000, 
      0.4, 
      0.2
    );
    group.add(curlArrow);
    
    if (showLabels) {
      group.add(createTextLabel('∇×F', new THREE.Vector3(0.3, 0, 2.5), 0xff0000));
      group.add(createTextLabel('Circulation', new THREE.Vector3(0, -3, 0), 0x00ff00));
    }
  }
  
  return group;
}

function createMagneticField(type) {
  const group = new THREE.Group();
  const fieldColor = 0xffa500;
  const currentColor = 0x00aaff;

  if (type === "magnetic-straight" || type === "magnetic-flux-density") {
    // Current-carrying conductor along y-axis
    const lineGeometry = new THREE.CylinderGeometry(0.1, 0.1, 8, 16);
    const lineMaterial = new THREE.MeshStandardMaterial({ 
      color: currentColor,
      emissive: currentColor,
      emissiveIntensity: 0.3
    });
    const line = new THREE.Mesh(lineGeometry, lineMaterial);
    group.add(line);

    if (showLabels) {
      group.add(createTextLabel('I', new THREE.Vector3(0.3, 4.2, 0), currentColor));
    }

    // Concentric circular field lines
    for (let y = -3; y <= 3; y += 1.5) {
      for (let r = 1; r <= 3; r += 0.5) {
        const circleGeometry = new THREE.TorusGeometry(r, 0.02, 16, 100);
        const circleMaterial = new THREE.MeshBasicMaterial({ color: fieldColor });
        const circle = new THREE.Mesh(circleGeometry, circleMaterial);
        circle.rotation.x = Math.PI / 2;
        circle.position.y = y;
        group.add(circle);
      }
    }

    // H field vectors using right-hand rule
    if (showVectors) {
      for (let r = 1; r <= 3; r += 1) {
        for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 6) {
          for (let y = -2; y <= 2; y += 2) {
            const origin = new THREE.Vector3(r * Math.cos(angle), y, r * Math.sin(angle));
            // Right-hand rule: thumb along I, fingers curl in direction of H
            const direction = new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle));
            const magnitude = currentValue / r; // H ∝ I/r
            
            const arrow = new THREE.ArrowHelper(
              direction, 
              origin, 
              Math.min(magnitude * 0.5, 1.0), 
              fieldColor, 
              0.2, 
              0.1
            );
            group.add(arrow);
          }
        }
      }
    }

  } else if (type === "magnetic-loop") {
    // Current loop in xy-plane
    const loopGeometry = new THREE.TorusGeometry(2, 0.1, 16, 100);
    const loopMaterial = new THREE.MeshStandardMaterial({ 
      color: currentColor,
      emissive: currentColor,
      emissiveIntensity: 0.3
    });
    const loop = new THREE.Mesh(loopGeometry, loopMaterial);
    group.add(loop);

    if (showLabels) {
      group.add(createTextLabel('I', new THREE.Vector3(2.3, 0, 0), currentColor));
    }

    // Magnetic field lines through and around the loop
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * 2 * Math.PI;
      
      // Field lines inside the loop (uniform)
      const innerPoints = [
        new THREE.Vector3(0, 0, -3),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 3)
      ];
      
      // Field lines outside the loop (dipole-like)
      const outerPoints = [];
      for (let t = 0; t <= 1; t += 0.1) {
        const r = 2 + t * 3;
        const z = Math.sin(t * Math.PI) * 4;
        outerPoints.push(new THREE.Vector3(
          r * Math.cos(angle), 
          r * Math.sin(angle), 
          z
        ));
      }
      
      // Create field line geometry
      if (i < 4) {
        const innerCurve = new THREE.CatmullRomCurve3(innerPoints);
        const innerGeometry = new THREE.TubeGeometry(innerCurve, 20, 0.02, 8, false);
        const innerLine = new THREE.Mesh(innerGeometry, new THREE.MeshBasicMaterial({ color: fieldColor }));
        group.add(innerLine);
      }
      
      const outerCurve = new THREE.CatmullRomCurve3(outerPoints);
      const outerGeometry = new THREE.TubeGeometry(outerCurve, 20, 0.02, 8, false);
      const outerLine = new THREE.Mesh(outerGeometry, new THREE.MeshBasicMaterial({ color: fieldColor }));
      group.add(outerLine);
    }

  } else if (type === "magnetic-solenoid") {
    // Helical coil representing solenoid
    const points = [];
    const turns = 10;
    const length = 8;
    const radius = 1.5;
    
    for (let i = 0; i <= turns * 50; i++) {
      const angle = (i / 50) * 2 * Math.PI;
      const y = (i / (turns * 50)) * length - length/2;
      points.push(new THREE.Vector3(
        radius * Math.cos(angle),
        y,
        radius * Math.sin(angle)
      ));
    }
    
    const solenoidCurve = new THREE.CatmullRomCurve3(points);
    const solenoidGeometry = new THREE.TubeGeometry(solenoidCurve, points.length, 0.08, 8, false);
    const solenoidMaterial = new THREE.MeshStandardMaterial({ 
      color: currentColor,
      emissive: currentColor,
      emissiveIntensity: 0.2
    });
    const solenoid = new THREE.Mesh(solenoidGeometry, solenoidMaterial);
    group.add(solenoid);

    if (showLabels) {
      group.add(createTextLabel('n turns/m', new THREE.Vector3(0, 4.5, 0), currentColor));
    }

    // Uniform field inside solenoid
    for (let x = -1; x <= 1; x += 0.4) {
      for (let z = -1; z <= 1; z += 0.4) {
        if (x*x + z*z <= radius*radius) {
          const arrow = new THREE.ArrowHelper(
            new THREE.Vector3(0, 1, 0), 
            new THREE.Vector3(x, -3, z), 
            6, 
            fieldColor, 
            0.2, 
            0.1
          );
          group.add(arrow);
        }
      }
    }
    
    // Fringing field outside
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * 2 * Math.PI;
      const r = radius + 1;
      
      // Field lines curving back outside
      const exteriorPoints = [
        new THREE.Vector3(r * Math.cos(angle), 4, r * Math.sin(angle)),
        new THREE.Vector3((r + 2) * Math.cos(angle), 0, (r + 2) * Math.sin(angle)),
        new THREE.Vector3(r * Math.cos(angle), -4, r * Math.sin(angle))
      ];
      
      const exteriorCurve = new THREE.CatmullRomCurve3(exteriorPoints);
      const exteriorGeometry = new THREE.TubeGeometry(exteriorCurve, 20, 0.02, 8, false);
      const exteriorLine = new THREE.Mesh(exteriorGeometry, new THREE.MeshBasicMaterial({ color: fieldColor }));
      group.add(exteriorLine);
    }

  } else if (type === "ampere-circuit-law") {
    // Central conductor
    const conductor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 8, 16), 
      new THREE.MeshStandardMaterial({ color: currentColor, emissive: currentColor, emissiveIntensity: 0.3 })
    );
    group.add(conductor);

    if (showLabels) {
      group.add(createTextLabel('I', new THREE.Vector3(0.3, 4.2, 0), currentColor));
    }

    // Amperian loop (circular path)
    const r = 2.5;
    const loopGeometry = new THREE.TorusGeometry(r, 0.05, 16, 100);
    const loopMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const amperianLoop = new THREE.Mesh(loopGeometry, loopMaterial);
    amperianLoop.rotation.x = Math.PI / 2;
    group.add(amperianLoop);

    // H field vectors along the loop
    for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 8) {
      const origin = new THREE.Vector3(r * Math.cos(angle), 0, r * Math.sin(angle));
      const direction = new THREE.Vector3(-Math.sin(angle), 0, Math.cos(angle));
      
      const arrow = new THREE.ArrowHelper(
        direction, 
        origin, 
        0.8, 
        fieldColor, 
        0.2, 
        0.1
      );
      group.add(arrow);
    }

    if (showLabels) {
      group.add(createTextLabel('∮H·dl = I', new THREE.Vector3(0, -4, 0), 0x00ff00));
    }

  } else if (type === "biot-savart-law") {
    // Current element IdL
    const currentElement = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0), 
      new THREE.Vector3(0, -0.5, 0), 
      1, 
      currentColor, 
      0.3, 
      0.2
    );
    group.add(currentElement);

    if (showLabels) {
      group.add(createTextLabel('IdL', new THREE.Vector3(0.3, 0.8, 0), currentColor));
    }

    // Observation point P
    const P = new THREE.Vector3(3, 1, 2);
    const pointGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const pointMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const point = new THREE.Mesh(pointGeometry, pointMaterial);
    point.position.copy(P);
    group.add(point);

    if (showLabels) {
      group.add(createTextLabel('P', P.clone().add(new THREE.Vector3(0.2, 0.2, 0.2)), 0xffffff));
    }

    // Position vector R from current element to P
    const R_vec = P.clone().sub(new THREE.Vector3(0, 0, 0));
    const R_arrow = new THREE.ArrowHelper(
      R_vec.clone().normalize(), 
      new THREE.Vector3(0, 0, 0), 
      R_vec.length(), 
      0xcccccc, 
      0.2, 
      0.1
    );
    group.add(R_arrow);

    if (showLabels) {
      group.add(createTextLabel('R', R_vec.clone().multiplyScalar(0.5), 0xcccccc));
    }

    // dH vector (perpendicular to both IdL and R)
    const IdL_vec = new THREE.Vector3(0, 1, 0);
    const dH_direction = new THREE.Vector3().crossVectors(IdL_vec, R_vec).normalize();
    const dH_arrow = new THREE.ArrowHelper(
      dH_direction, 
      P, 
      1.5, 
      fieldColor, 
      0.3, 
      0.2
    );
    group.add(dH_arrow);

    if (showLabels) {
      group.add(createTextLabel('dH', P.clone().add(dH_direction.clone().multiplyScalar(1.8)), fieldColor));
      group.add(createTextLabel('dH ∝ IdL×R/R³', new THREE.Vector3(0, -4, 0), fieldColor));
    }

  } else if (type === "lorentz-force") {
    // Uniform magnetic field B (into the page, represented by crosses)
    const bFieldDir = new THREE.Vector3(0, 0, -1);
    
    // Create field representation with arrows
    for (let x = -3; x <= 3; x += 1) {
      for (let y = -3; y <= 3; y += 1) {
        const arrow = new THREE.ArrowHelper(
          bFieldDir, 
          new THREE.Vector3(x, y, 1), 
          2, 
          0x00ffff, 
          0.2, 
          0.1
        );
        group.add(arrow);
      }
    }

    if (showLabels) {
      group.add(createTextLabel('B (into page)', new THREE.Vector3(0, 4, 0), 0x00ffff));
    }

    // Moving charge (positive)
    const chargeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const chargeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      emissive: 0xaaaa00,
      emissiveIntensity: 0.3
    });
    const charge = new THREE.Mesh(chargeGeometry, chargeMaterial);
    charge.position.set(0, 0, 0);
    group.add(charge);

    // Velocity vector
    const vVec = new THREE.Vector3(2, 0, 0);
    const vArrow = new THREE.ArrowHelper(
      vVec.clone().normalize(), 
      new THREE.Vector3(-1, 0, 0), 
      vVec.length(), 
      0xff0000, 
      0.3, 
      0.2
    );
    group.add(vArrow);

    // Lorentz force F = q(v × B)
    const fVec = new THREE.Vector3().crossVectors(vVec, bFieldDir).normalize();
    const fArrow = new THREE.ArrowHelper(
      fVec, 
      new THREE.Vector3(0, 0, 0), 
      2, 
      0x00ff00, 
      0.4, 
      0.2
    );
    group.add(fArrow);

    if (showLabels) {
      group.add(createTextLabel('v', new THREE.Vector3(1, 0.5, 0), 0xff0000));
      group.add(createTextLabel('F = q(v×B)', new THREE.Vector3(0, 2.5, 0), 0x00ff00));
      group.add(createTextLabel('+q', new THREE.Vector3(0.3, -0.3, 0), 0xffff00));
    }

    // Show circular trajectory
    const trajectoryGeometry = new THREE.TorusGeometry(2, 0.02, 16, 100);
    const trajectoryMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xff00ff,
      transparent: true,
      opacity: 0.6
    });
    const trajectory = new THREE.Mesh(trajectoryGeometry, trajectoryMaterial);
    trajectory.rotation.z = Math.PI / 2;
    group.add(trajectory);

  } else if (type === "magnetic-plane-sheet") {
    // Infinite current sheet in yz-plane
    const sheetGeometry = new THREE.PlaneGeometry(8, 8);
    const sheetMaterial = new THREE.MeshStandardMaterial({ 
      color: currentColor, 
      opacity: 0.3, 
      transparent: true, 
      side: THREE.DoubleSide 
    });
    const sheet = new THREE.Mesh(sheetGeometry, sheetMaterial);
    sheet.rotation.y = Math.PI / 2;
    group.add(sheet);

    if (showLabels) {
      group.add(createTextLabel('K (surface current)', new THREE.Vector3(0, 4.5, 0), currentColor));
    }

    // Uniform field on both sides (opposite directions)
    for (let y = -3; y <= 3; y += 1) {
      for (let z = -3; z <= 3; z += 1) {
        // Field on positive x side
        const arrow1 = new THREE.ArrowHelper(
          new THREE.Vector3(0, 0, 1), 
          new THREE.Vector3(0.5, y, z), 
          1.5, 
          fieldColor,
          0.2,
          0.1
        );
        group.add(arrow1);
        
        // Field on negative x side
        const arrow2 = new THREE.ArrowHelper(
          new THREE.Vector3(0, 0, -1), 
          new THREE.Vector3(-0.5, y, z), 
          1.5, 
          fieldColor,
          0.2,
          0.1
        );
        group.add(arrow2);
      }
    }

  } else if (type === "maxwell-magnetostatics") {
    // Current density J (represented by cylinder)
    const cylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(0.8, 0.8, 6, 32), 
      new THREE.MeshStandardMaterial({ 
        color: currentColor, 
        opacity: 0.6, 
        transparent: true,
        emissive: currentColor,
        emissiveIntensity: 0.2
      })
    );
    group.add(cylinder);

    if (showLabels) {
      group.add(createTextLabel('J', new THREE.Vector3(0, 3.5, 0), currentColor));
    }

    // Circular H field lines around current
    for (let r = 1.2; r <= 2.5; r += 0.4) {
      const circleGeometry = new THREE.TorusGeometry(r, 0.03, 16, 100);
      const circleMaterial = new THREE.MeshBasicMaterial({ color: fieldColor });
      const circle = new THREE.Mesh(circleGeometry, circleMaterial);
      circle.rotation.x = Math.PI / 2;
      group.add(circle);
    }

    // Maxwell's equations labels
    if (showLabels) {
      group.add(createTextLabel('∇ × H = J', new THREE.Vector3(0, -3.5, 0), 0x00ff00));
      group.add(createTextLabel('∇ · B = 0', new THREE.Vector3(0, -4.2, 0), 0x00ff00));
    }

    // Show some B field lines (solenoidal - no sources or sinks)
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * 2 * Math.PI;
      const points = [];
      
      for (let t = 0; t <= 2 * Math.PI; t += 0.2) {
        const r = 3 + Math.sin(t) * 0.5;
        points.push(new THREE.Vector3(
          r * Math.cos(angle + t * 0.1),
          Math.sin(t * 2) * 2,
          r * Math.sin(angle + t * 0.1)
        ));
      }
      
      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.TubeGeometry(curve, 50, 0.02, 8, true);
      const material = new THREE.MeshBasicMaterial({ color: 0xff6600 });
      const fieldLine = new THREE.Mesh(geometry, material);
      group.add(fieldLine);
    }
  }

  return group;
}

// --- EVENT HANDLING & DOM MANIPULATION ---

function setupEventListeners() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");
      currentUnit = e.target.dataset.unit;
      document.getElementById("unitBadge").textContent = currentUnit === "electrostatics" ? "Unit I" : "Unit II";
      populateVisualizationOptions();
      updateControlVisibility();
      clearVisualization();
      if (document.getElementById("welcomeScreen")) {
        document.getElementById("welcomeScreen").style.display = "flex";
      }
      updateDescription("");
    });
  });

  document.getElementById("visualizationSelect").addEventListener("change", (e) => {
    const value = e.target.value;
    if (value) {
      loadVisualization(value);
      if (document.getElementById("welcomeScreen")) {
        document.getElementById("welcomeScreen").style.display = "none";
      }
    } else {
      clearVisualization();
      if (document.getElementById("welcomeScreen")) {
        document.getElementById("welcomeScreen").style.display = "flex";  
      }
    }
    updateDescription(value);
  });

  document.getElementById("playPauseBtn").addEventListener("click", () => {
    isPlaying = !isPlaying;
    controls.autoRotate = isPlaying;
    document.getElementById("playPauseIcon").textContent = isPlaying ? "⏸️" : "▶️";
    document.getElementById("playPauseText").textContent = isPlaying ? "Pause" : "Play";
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    controls.reset();
  });

  const chargeValueElement = document.getElementById("chargeValue");
  if (chargeValueElement) {
    chargeValueElement.addEventListener("input", (e) => {
      chargeValue = Number.parseFloat(e.target.value);
      const displayElement = document.getElementById("chargeValueDisplay");
      if (displayElement) {
        displayElement.textContent = chargeValue.toFixed(1);
      }
      if (currentVisualization && currentUnit === "electrostatics") {
        loadVisualization(document.getElementById("visualizationSelect").value);
      }
    });
  }

  const currentValueElement = document.getElementById("currentValue");
  if (currentValueElement) {
    currentValueElement.addEventListener("input", (e) => {
      currentValue = Number.parseFloat(e.target.value);
      const displayElement = document.getElementById("currentValueDisplay");
      if (displayElement) {
        displayElement.textContent = currentValue.toFixed(1);
      }
      if (currentVisualization && currentUnit === "magnetostatics") {
        loadVisualization(document.getElementById("visualizationSelect").value);
      }
    });
  }

  const showLabelsElement = document.getElementById("showLabels");
  if (showLabelsElement) {
    showLabelsElement.addEventListener("change", (e) => {
      showLabels = e.target.checked;
      if (currentVisualization) {
        loadVisualization(document.getElementById("visualizationSelect").value);
      }
    });
  }

  const showEquipotentialElement = document.getElementById("showEquipotential");
  if (showEquipotentialElement) {
    showEquipotentialElement.addEventListener("change", (e) => {
      showEquipotential = e.target.checked;
      if (currentVisualization && currentUnit === "electrostatics") {
        loadVisualization(document.getElementById("visualizationSelect").value);
      }
    });
  }

  const showVectorsElement = document.getElementById("showVectors");
  if (showVectorsElement) {
    showVectorsElement.addEventListener("change", (e) => {
      showVectors = e.target.checked;
      if (currentVisualization) {
        loadVisualization(document.getElementById("visualizationSelect").value);
      }
    });
  }
}

function populateVisualizationOptions() {
  const select = document.getElementById("visualizationSelect");
  if (!select) return;
  
  select.innerHTML = '<option value="">Choose a concept to visualize</option>';
  visualizationOptions[currentUnit].forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option.value;
    optionElement.textContent = option.label;
    select.appendChild(optionElement);
  });
  
  if (window.MathJax) {
    window.MathJax.typesetPromise();
  }
}

function updateControlVisibility() {
  const chargeControl = document.getElementById("chargeControl");
  const currentControl = document.getElementById("currentControl");
  const equipotentialToggle = document.getElementById("equipotentialToggle");
  const vectorToggle = document.getElementById("vectorToggle");

  if (chargeControl) {
    chargeControl.style.display = currentUnit === "electrostatics" ? "block" : "none";
  }
  if (currentControl) {
    currentControl.style.display = currentUnit === "magnetostatics" ? "block" : "none";
  }
  if (equipotentialToggle) {
    equipotentialToggle.style.display = currentUnit === "electrostatics" ? "flex" : "none";
  }
  if (vectorToggle) {
    vectorToggle.style.display = "flex";
  }
}

function loadVisualization(type) {
  clearVisualization();
  currentVisualization = type;
  let visualization;

  if (type.startsWith("coordinates-")) {
    visualization = createCoordinateSystem(type.replace("coordinates-", ""));
  } else if (visualizationOptions.electrostatics.some(opt => opt.value === type)) {
    visualization = createElectricField(type);
  } else if (visualizationOptions.magnetostatics.some(opt => opt.value === type)) {
    visualization = createMagneticField(type);
  }

  if (visualization) {
    visualization.name = "currentVisualization";
    scene.add(visualization);
  }
}

function clearVisualization() {
  const existing = scene.getObjectByName("currentVisualization");
  if (existing) {
    scene.remove(existing);
    // Properly dispose of geometries, materials, textures
    existing.traverse(object => {
      if (object.isMesh) {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      }
    });
  }
  currentVisualization = null;
}

function updateDescription(value) {
  const allOptions = [...visualizationOptions.electrostatics, ...visualizationOptions.magnetostatics];
  const option = allOptions.find((opt) => opt.value === value);
  const descriptionText = document.getElementById("descriptionText");
  const equationBox = document.getElementById("equationBox");
  const equationText = document.getElementById("equationText");

  if (option && descriptionText && equationText) {
    descriptionText.textContent = option.description;
    equationText.innerHTML = option.equation;
    if (equationBox) {
      equationBox.style.display = "block";
    }
  } else {
    if (descriptionText) {
      descriptionText.textContent = "Select a visualization to see its description and governing equation.";
    }
    if (equationText) {
      equationText.textContent = "";
    }
    if (equationBox) {
      equationBox.style.display = "none";
    }
  }
  
  if (window.MathJax) {
    window.MathJax.typesetPromise();
  }
}

function onWindowResize() {
  const container = document.getElementById("threeContainer");
  if (container && container.clientWidth > 0 && container.clientHeight > 0) {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
}

function animate() {
  requestAnimationFrame(animate);
  if (controls) {
    controls.update();
  }
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}


window.addEventListener("load", init);
