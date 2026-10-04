# 🌐 RecargaMundial — Plataforma de Recargas Móviles y Pagos Reales

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.0-cyan.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Reloadly Airtime API](https://img.shields.io/badge/Reloadly-Airtime%20API-00d084.svg)](https://www.reloadly.com/)
[![PayPal REST API](https://img.shields.io/badge/PayPal-Orders%20v2-00457c.svg)](https://developer.paypal.com/)

---

## 📌 Descripción del Proyecto

**RecargaMundial** es una plataforma web completa de grado de producción diseñada para enviar saldo telefónico **100% real e instantáneo** a líneas móviles en más de **140 países y 800+ operadores de telecomunicaciones** (Claro, Altice, T-Mobile, AT&T, Movistar, Telcel, Digicel, Viva, Orange, etc.) con procesamiento oficial de pagos a través de **PayPal REST API v2**.

### 🛡️ Compromiso de Cero Engaños / Cero Estafas:
- **Pagos Auténticos**: Procesados directamente a través de las APIs bancarias oficiales de PayPal (sin pasarelas intermedias opacas ni cobros fantasmas).
- **Despacho Celular Directo**: Conexión nativa con la infraestructura de telecomunicaciones de **Reloadly Airtime**, entregando el saldo en tiempo real a la antena y chip SIM del destinatario con ID oficial de transacción del operador.
- **Transparencia Total**: Los usuarios y administradores pueden auditar el estado de conexión de la API en vivo, el saldo disponible del proveedor y descargar recibos oficiales con código de referencia único.

---

## 🚀 Arquitectura del Sistema

```
                      ┌────────────────────────────────────────┐
                      │          Cliente Web (SPA)             │
                      │   React 19 + TypeScript + Vite         │
                      │   Tailwind CSS v4 + Lucide Icons       │
                      └──────────────────┬─────────────────────┘
                                         │  HTTPS / REST
                                         ▼
                      ┌────────────────────────────────────────┐
                      │          Backend Express (Node)        │
                      │  - Detección de Operador               │
                      │  - Creación & Captura de Órdenes       │
                      │  - Control de Saldo y Auditoría        │
                      └──────────┬───────────────────┬─────────┘
                                 │                   │
                  Token OAuth v2 │                   │ Token OAuth v2
                                 ▼                   ▼
       ┌───────────────────────────────┐   ┌───────────────────────────────┐
       │   PayPal Orders v2 REST API   │   │  Reloadly Mobile Airtime API  │
       │   - Cobro seguro con tarjeta  │   │  - Red celular internacional  │
       │   - Pagos de cuenta PayPal    │   │  - Acreditación en segundos   │
       └───────────────────────────────┘   └───────────────────────────────┘
```

---

## ⚙️ Configuración de Claves y Variables de Entorno

Copia el archivo de ejemplo para configurar tus claves secretas:

```bash
cp .env.example .env
```

Edita `.env` con tus credenciales reales:

| Variable | Descripción | Modo Ejemplo |
| :--- | :--- | :--- |
| `PORT` | Puerto de escucha del servidor | `3000` |
| `APP_URL` | URL pública de tu aplicación | `https://tu-dominio.com` |
| `RELOADLY_CLIENT_ID` | Tu Client ID de [Reloadly](https://www.reloadly.com) | `tu_client_id_real` |
| `RELOADLY_CLIENT_SECRET` | Tu Client Secret de Reloadly | `tu_client_secret_real` |
| `RELOADLY_ENVIRONMENT` | Entorno de Reloadly (`live` o `sandbox`) | `live` para saldo real |
| `PAYPAL_CLIENT_ID` | Tu Client ID de [PayPal Developer](https://developer.paypal.com) | `tu_paypal_client_id` |
| `PAYPAL_CLIENT_SECRET` | Tu Client Secret de PayPal | `tu_paypal_secret` |
| `PAYPAL_ENVIRONMENT` | Entorno PayPal (`live` o `sandbox`) | `live` para cobro real |
| `PAYPAL_ME_USERNAME` | Tu usuario de PayPal.Me (método alterno) | `tu_usuario_paypal` |

---

## 🛠️ Cómo Obtener Credenciales para Envíos y Pagos Reales

### 1. Activar Recargas Telefónicas Reales (Reloadly):
1. Regístrate en [Reloadly.com](https://www.reloadly.com).
2. Ve a **Developers > API Settings** y genera tus credenciales (**Client ID** y **Client Secret**).
3. Añade fondos a tu billetera Reloadly (vía transferencia bancaria, tarjeta o cripto).
4. Configura `RELOADLY_ENVIRONMENT=live` en tu archivo `.env`.
5. ¡Listo! Cualquier recarga enviada desde la interfaz se acreditará inmediatamente en la línea telefónica del destinatario en cualquier país del mundo.

### 2. Activar Pagos Reales (PayPal):
1. Ingresa en [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/applications).
2. Crea una aplicación bajo la pestaña **Live**.
3. Copia el **Client ID** y **Secret Key** a tu `.env`.
4. Establece `PAYPAL_ENVIRONMENT=live`.
5. Los pagos completados por los clientes se depositarán instantáneamente en tu saldo de PayPal empresarial.

---

## 💻 Instalación y Ejecución Local

### Prerrequisitos:
- Node.js v20 o superior
- npm o bun

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/recargamundial.git
cd recargamundial

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# (Edita .env con tus claves)

# 4. Iniciar servidor en modo desarrollo
npm run dev
```

La aplicación estará disponible de inmediato en `http://localhost:3000`.

---

## 🐳 Despliegue con Docker

El proyecto incluye un contenedor Docker multi-fase optimizado para producción:

```bash
# Construir la imagen
docker build -t recargamundial:latest .

# Ejecutar el contenedor
docker run -d -p 3000:3000 --env-file .env --name recargamundial-app recargamundial:latest
```

---

## 🌐 Endpoints de la API

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/api/status` | Verifica el estado de conexión con Reloadly y PayPal |
| `GET` | `/api/reloadly/account-balance` | Consulta el saldo disponible en cuenta Reloadly |
| `POST` | `/api/reloadly/auto-detect` | Detecta el operador móvil en base al número telefónico |
| `POST` | `/api/paypal/create-order` | Genera una orden de cobro en PayPal v2 |
| `POST` | `/api/paypal/capture-order` | Captura el pago en PayPal y envía la recarga con Reloadly |
| `POST` | `/api/recharge/dispatch` | Despacho directo de saldo a red celular |

---

## 📱 Lanzamiento PWA (Progressive Web App)

La aplicación incluye soporte completo para instalación en teléfonos Android y iPhone (iOS):
- Manifiesto: `/public/manifest.json`
- Iconos vectoriales y adaptativos: `/public/icon.svg` y `/public/favicon.svg`
- Pantalla de inicio personalizada sin barras de navegación del explorador.

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles.
