module.exports = {
  packagerConfig: {
    asar: true,
    win32metadata: {
      CompanyName: "Juan Cruz Gonzalez",
      ProductName: "AplicacionCOA",
      FileDescription: "Aplicación COA para gestión de operaciones",
      OriginalFilename: "AplicacionCOA.exe"
    }
  },
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'JuanCruzGonzalez',
          name: 'AplicacionCOA'
        },
        prerelease: true,
        draft: false
      }
    }
  ],
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        // Crear accesos directos sin icono personalizado
        setupExe: 'AplicacionCOA-Setup.exe',
        
        // Configuración de accesos directos
        name: 'AplicacionCOA',
        
        // Metadatos adicionales
        authors: 'Juan Cruz Gonzalez',
        description: 'Aplicación COA para gestión de operaciones'
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};