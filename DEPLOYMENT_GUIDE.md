# Guía de Despliegue Automatizado: Improved365 (Astro + Google Cloud Storage + Cloudflare + GitHub Actions)

Este documento detalla la arquitectura y el procedimiento paso a paso implementado para desplegar automáticamente el sitio web **improved365.com** desde GitHub a **Google Cloud Storage (GCS)**, sirviéndolo globalmente a través de la CDN y protección SSL de **Cloudflare**.

---

## 🏗️ Arquitectura General

```
[ Desarrollador ] 
       │ (git push origin main)
       ▼
[ GitHub Repository ] 
       │ (GitHub Actions Pipeline: .github/workflows/deploy.yml)
       ▼
[ Google Cloud Storage (Bucket: gs://improved365.com) ]
       │ (Caché CDN + SSL Gratuito + CNAME Flattening)
       ▼
[ Cloudflare Edge ] ────► [ Usuario Final (https://improved365.com) ]
```

---

## 📋 Resumen de Pasos Realizados

### 1. Identificación y Limpieza de Marca
- Se eliminaron las referencias al competidor y se adaptó la redacción para **Improved365**.
- Se optimizaron las palabras clave para potenciar el SEO On-Page.
- Se actualizó el logotipo (`public/improved_365_logo.webp`), favicon (`favicon.ico`, `favicon.svg`, `favicon.webp`) y la paleta de colores corporativa (Cyan `#0097ad` y Naranja `#f06a31`).

### 2. Configuración de Seguridad Git
- Se creó el archivo `.gitignore` para excluir carpetas de construcción y dependencias (`node_modules/`, `.astro/`, `dist/`).

### 3. Creación de Service Account en Google Cloud (IAM)
- Se creó un Service Account dedicado para GitHub: `github-deployer@enfermera-en-usa-backend.iam.gserviceaccount.com`.
- Se le asignó el rol de `Storage Admin` (`roles/storage.admin`) para gestionar los buckets de Google Cloud Storage.
- Se generó una llave de autenticación en formato JSON (`gcp-github-key.json`).

### 4. Configuración del Secreto en GitHub
- Se añadió la llave JSON en **GitHub > Repository Settings > Secrets and variables > Actions** con el nombre:
  - **`GCP_SA_KEY`**

### 5. Automatización de Despliegue (GitHub Actions)
- Se creó la plantilla de flujo en `.github/workflows/deploy.yml` que:
  1. Detecta cambios enviados a la rama `main`.
  2. Compila la aplicación Astro (`npm run build`).
  3. Autentica contra GCP con el secreto `GCP_SA_KEY`.
  4. Sincroniza la carpeta compilada `dist/` hacia el bucket `gs://improved365.com`.
  5. Configura `index.html` y `404.html` como páginas de inicio y error.

---

## 🔧 Pasos Pendientes por Ejecutar en Proveedores Externos

### Paso A: Creación y Verificación del Bucket en GCP
1. Verificar la propiedad del dominio `improved365.com` en [Google Search Console](https://search.google.com/search-console).
2. Crear el Bucket en Google Cloud Storage con el nombre exacto: `improved365.com`.
3. Ejecutar los comandos de permisos públicos:
   ```bash
   gcloud storage buckets update gs://improved365.com --no-public-access-prevention
   gcloud storage buckets add-iam-policy-binding gs://improved365.com --member=allUsers --role=roles/storage.objectViewer
   gcloud storage buckets update gs://improved365.com --web-main-page-suffix=index.html --web-error-page=404.html
   ```

### Paso B: Configuración de DNS en Cloudflare
En el panel de **Cloudflare** para `improved365.com`:

| Tipo | Nombre | Destino | Estado Proxy |
| :--- | :--- | :--- | :--- |
| **CNAME** | `@` | `c.storage.googleapis.com` | 🟠 Proxied |
| **CNAME** | `www` | `c.storage.googleapis.com` | 🟠 Proxied |

- En **SSL/TLS**, asegurar que la encriptación esté configurada en **Full** o **Flexible**.

---

## 🚀 Despliegues Futuros

Cualquier cambio realizado en la web se desplegará en producción automáticamente al ejecutar:
```bash
git add .
git commit -m "feat: actualización de contenido"
git push origin main
```
