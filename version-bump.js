import { execSync } from 'child_process';
import fs from 'fs';

// Obtener el tipo de versión desde los argumentos del script
const versionType = process.argv[2];

if (!versionType) {
  console.error('❌ Error: Debes especificar el tipo de versión (e.g., minor, major, patch, feature)');
  process.exit(1);
}

// Leer el archivo package.json
const packageJsonPath = './package.json';
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Incrementar la versión según el tipo
const currentVersion = packageJson.version.split('.');
let [major, minor, patch] = currentVersion.map(Number);

if (versionType === 'major') {
  major += 1;
  minor = 0;
  patch = 0;
} else if (versionType === 'minor') {
  minor += 1;
  patch = 0;
} else if (versionType === 'patch') {
  patch += 1;
} else {
  console.error(`❌ Error: Tipo de versión desconocido "${versionType}". Usa: major, minor, patch, feature.`);
  process.exit(1);
}

// Actualizar la versión en package.json
const newVersion = `${major}.${minor}.${patch}`;
packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log(`✅ Versión actualizada a ${newVersion}`);

// Ejecutar el build del proyecto
console.log('⚙️ Ejecutando build...');
execSync('npm run build', { stdio: 'inherit' });

// Publicar en npm
console.log('🚀 Publicando en npm...');
execSync('npm publish', { stdio: 'inherit' });

console.log(`🎉 Publicación completada: versión ${newVersion}`);
