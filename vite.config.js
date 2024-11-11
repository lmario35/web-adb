import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        port: process.env.PORT || 3000, // Utilise le port de Render ou 3000 par défaut
        host: '0.0.0.0' // Écoute sur toutes les interfaces réseau
    }
}); 