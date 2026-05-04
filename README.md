# 🚀 Extraescolar.com - Marketplace Educativo 2026

Plataforma premium diseñada para conectar a profesionales de la educación y el deporte con familias. Un marketplace dinámico, rápido y elegante para gestionar actividades extraescolares.

![Thumbnail](https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200)

## ✨ Características Principales

### 👤 Gestión de Usuarios y Perfiles
- **Autenticación Real**: Sistema de registro e inicio de sesión mediante **Firebase Auth**.
- **Perfil Personalizable**: Los usuarios pueden editar su biografía y gestionar su información pública.
- **Gestor de Servicios**: Interfaz para que los profesionales publiquen, editen y eliminen sus propios anuncios.

### 🌟 Comunidad y Valoraciones
- **Estadísticas en Tiempo Real**: Los contadores de la Home (Actividades, Usuarios, Valoración) se calculan dinámicamente desde Firestore.
- **Comentarios con Estrellas**: Sistema de reseñas real donde los usuarios pueden calificar servicios del 1 al 5.
- **Moderación de Propios**: Los usuarios tienen control total para eliminar sus propios comentarios.

### 💖 Sistema de Favoritos
- **Cloud Favorites**: Lista de deseos guardada en Firestore, persistente entre dispositivos.
- **Acceso Rápido**: Sección dedicada en el perfil para acceder a las actividades guardadas.

### 🎨 Interfaz de Usuario (UI/UX)
- **Tema Inteligente**: Detección automática del modo del sistema (Light/Dark) con opción de forzado manual en ajustes.
- **Navegación Móvil**: Menú lateral dinámico y optimizado para smartphones.
- **Notificaciones Premium**: Sistema propio de *Toasts* y *Modales de Confirmación* que reemplazan a los avisos genéricos del navegador.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5 Semántico, CSS3 (Variables, Grid, Flexbox), JavaScript Moderno (ES6+).
- **Backend/Base de Datos**: 
    - **Firebase Firestore**: Base de datos NoSQL en tiempo real.
    - **Firebase Authentication**: Seguridad y gestión de sesiones.
- **Iconografía**: [Lucide Icons](https://lucide.dev/).
- **Efectos**: AOS-like scroll reveals y transiciones personalizadas.

## 📂 Estructura del Proyecto

```text
├── index.html          # Página principal y buscador
├── assets/             # Recursos estáticos y lógica
│   ├── css/
│   │   └── styles.css  # Sistema de diseño y variables
│   ├── js/
│   │   ├── main.js     # Lógica central (Auth, Stats, UI)
│   │   ├── data.js     # Datos semilla
│   │   └── modules/
│   │       └── firebase.js # Configuración de Firebase
│   └── img/            # Recursos visuales
├── pages/              # Vistas secundarias
│   ├── actividades.html
│   ├── perfil.html
│   └── ...
└── README.md
```

## 🚀 Instalación y Uso

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/TuUsuario/Web-Extraescolar.git
   ```
2. **Configurar Firebase**:
   Asegúrate de tener un proyecto en Firebase y actualiza las credenciales en `js/firebase-config.js`.
3. **Ejecutar**:
   Abre `Index.html` directamente en tu navegador o usa un servidor local como *Live Server*.

---
Desarrollado con ❤️ para mejorar la educación extraescolar.
