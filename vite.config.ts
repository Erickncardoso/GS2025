import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Configurações para PWA e Vercel
    outDir: "dist",
    sourcemap: mode === "development",
    minify: "terser",
    target: "esnext",
    rollupOptions: {
      output: {
        // Service Worker deve estar na raiz
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "sw.js") {
            return "sw.js";
          }
          const extType = assetInfo.name?.split(".").at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType ?? "")) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(extType ?? "")) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        // Manual chunks para melhor cache e performance
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "lucide-react",
          ],
          motion: ["motion"],
          supabase: ["@supabase/supabase-js"],
          router: ["react-router-dom"],
          maps: ["leaflet", "react-leaflet"],
        },
      },
    },
    // Aumentar limite de chunk para remover warnings
    chunkSizeWarningLimit: 1000,
    terserOptions: {
      compress: {
        drop_console: mode === "production",
        drop_debugger: mode === "production",
      },
    },
  },
  // Configurações para desenvolvimento PWA
  define: {
    "process.env.NODE_ENV": JSON.stringify(mode),
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  // Configurar assets públicos
  publicDir: "public",
  // Otimizações para Vercel
  esbuild: {
    target: "esnext",
    platform: "browser",
    treeShaking: true,
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@supabase/supabase-js",
      "motion",
      "lucide-react",
    ],
  },
}));
