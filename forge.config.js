module.exports = {
  packagerConfig: {
    asar: true,
    icon: './assets/icon', // Opcional: ruta a tu icono (sin extensión)
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
        // Configuración para crear accesos directos
        setupIcon: './assets/icon.ico', // Icono del instalador
        iconUrl: 'https://raw.githubusercontent.com/JuanCruzGonzalez/AplicacionCOA/main/assets/icon.ico', // URL del icono
        loadingGif: './assets/loading.gif', // Opcional: GIF de carga
        
        // Crear accesos directos
        setupExe: 'AplicacionCOA-Setup.exe',
        
        // Configuración de accesos directos
        shortcutName: 'AplicacionCOA',
        
        // Metadatos adicionales
        authors: 'Juan Cruz Gonzalez',
        description: 'Aplicación COA para gestión de operaciones',
        
        // Crear acceso directo en escritorio y menú inicio
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
        
        // Carpeta en menú inicio
        setupMsi: 'AplicacionCOA'
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