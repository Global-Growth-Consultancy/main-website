const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "src", "components", "hero", "Student3D.jsx");
let content = fs.readFileSync(filePath, "utf-8");

// 1. Fix legs: legLRef is at [-0.13, 0.02, 0.07], legRRef is at [0.13, 0.02, -0.05]
// We want them symmetrical at Z=0.0
content = content.replace(
  '<group ref={legLRef} position={[-0.13, 0.02, 0.07]}>',
  '<group ref={legLRef} position={[-0.13, 0.02, 0.0]}>'
);
content = content.replace(
  '<group ref={legRRef} position={[0.13, 0.02, -0.05]}>',
  '<group ref={legRRef} position={[0.13, 0.02, 0.0]}>'
);

// 2. Replace Face: Find "eyes (glossy eyeballs" and replace until "layered modern hair"
const startStr = "{/* ---- eyes (glossy eyeballs recessed in the socket) ---- */}";
const endStr = "{/* ---- layered modern hair (side-part + textured fringe) ---- */}";

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `{/* ---- Stylized Pixar/Premium Face (No creepy realistic features) ---- */}
              <group position={[0, 0.045, 0.17]}>
                {/* Glossy Black Pill Eyes (Funko / Spline style) */}
                <group ref={lidLRef}>
                  <mesh position={[-0.07, 0, 0]}>
                    <capsuleGeometry args={[0.015, 0.035, 4, 12]} />
                    <meshPhysicalMaterial color="#0A0A0A" roughness={0.1} clearcoat={1.0} />
                  </mesh>
                </group>
                <group ref={lidRRef}>
                  <mesh position={[0.07, 0, 0]}>
                    <capsuleGeometry args={[0.015, 0.035, 4, 12]} />
                    <meshPhysicalMaterial color="#0A0A0A" roughness={0.1} clearcoat={1.0} />
                  </mesh>
                </group>

                {/* Minimalist Cute Nose */}
                <mesh position={[0, -0.04, 0.015]}>
                  <sphereGeometry args={[0.02, 16, 12]} />
                  <primitive object={skinMat} />
                </mesh>

                {/* Simple Friendly Smile */}
                <mesh position={[0, -0.09, 0.01]} rotation={[0, 0, Math.PI]}>
                  <torusGeometry args={[0.035, 0.006, 8, 20, Math.PI * 0.6]} />
                  <meshStandardMaterial color="#4A2A22" roughness={0.8} />
                </mesh>
                
                {/* Cute Blush */}
                <mesh position={[-0.1, -0.05, 0.015]}>
                  <circleGeometry args={[0.025, 16]} />
                  <meshBasicMaterial color="#FF8A8A" transparent opacity={0.4} />
                </mesh>
                <mesh position={[0.1, -0.05, 0.015]}>
                  <circleGeometry args={[0.025, 16]} />
                  <meshBasicMaterial color="#FF8A8A" transparent opacity={0.4} />
                </mesh>
              </group>
              
              {/* Dummy refs to prevent undefined errors in StudentRig animation */}
              <group ref={jawRef} />
              <group ref={cornerLRef} />
              <group ref={cornerRRef} />
              <group ref={irisLRef} />
              <group ref={irisRRef} />

              `;

  content = content.slice(0, startIndex) + replacement + content.slice(endIndex);
}

fs.writeFileSync(filePath, content, "utf-8");
console.log("Successfully patched Student3D.jsx");
