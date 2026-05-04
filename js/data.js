const initialServices = [
  { 
    id: 1, 
    title: 'Escuela de Tenis Junior', 
    category: 'deportes', 
    age: '6-16 años', 
    img: 'https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?auto=format&fit=crop&q=80&w=600', 
    description: 'Clases técnicas y tácticas para todos los niveles en el Club Deportivo Local.' 
  },
  { 
    id: 2, 
    title: 'Alemán desde Cero', 
    category: 'idiomas', 
    age: 'Adultos y Niños', 
    img: 'https://images.unsplash.com/photo-1527176930608-09cb256ab504?auto=format&fit=crop&q=80&w=600', 
    description: 'Aprende el idioma de Goethe con profesores nativos y grupos reducidos.' 
  },
  { 
    id: 3, 
    title: 'Creación de Videojuegos Unity', 
    category: 'tecnologia', 
    age: '12-18 años', 
    img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600', 
    description: 'Diseña y programa tu propio juego en 3D usando C# y Unity Engine.' 
  },
  { 
    id: 4, 
    title: 'Repostería Creativa', 
    category: 'cocina', 
    age: '8-14 años', 
    img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600', 
    description: 'Aprende a decorar cupcakes y tartas como un profesional.' 
  },
  { 
    id: 5, 
    title: 'Física Entretenida', 
    category: 'ciencia', 
    age: '10-15 años', 
    img: 'https://images.unsplash.com/photo-1532634896-26909d0d4b89?auto=format&fit=crop&q=80&w=600', 
    description: 'Entiende el mundo a través de experimentos prácticos sobre gravedad y magnetismo.' 
  },
  { 
    id: 6, 
    title: 'Refuerzo de Lengua y Literatura', 
    category: 'refuerzo', 
    age: 'Bachillerato', 
    img: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600', 
    description: 'Preparación específica para Selectividad y análisis de textos.' 
  },
  { 
    id: 7, 
    title: 'Hip Hop & Street Dance', 
    category: 'baile', 
    age: '7-20 años', 
    img: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?auto=format&fit=crop&q=80&w=600', 
    description: 'Ritmo, coordinación y mucha energía en nuestras clases de danza urbana.' 
  },
  { 
    id: 8, 
    title: 'Club de Ajedrez de los Sábados', 
    category: 'ajedrez', 
    age: 'Todas las edades', 
    img: 'https://images.unsplash.com/photo-1529692236671-f1f6e9460272?auto=format&fit=crop&q=80&w=600', 
    description: 'Torneos amistosos y análisis de grandes partidas clásicas.' 
  },
  { 
    id: 9, 
    title: 'Taller de Acuarela Moderna', 
    category: 'arte', 
    age: '15+ años', 
    img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600', 
    description: 'Técnicas de ilustración botánica y paisajes con acuarela.' 
  },
  { 
    id: 10, 
    title: 'Baloncesto Femenino', 
    category: 'deportes', 
    age: '10-14 años', 
    img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=600', 
    description: 'Entrenamiento de equipo enfocado en la técnica individual y el juego colectivo.' 
  }
];

// Initialize global services array if not exists
if (!window.servicesData) {
  window.servicesData = [...initialServices];
}
