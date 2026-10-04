# Política de Seguridad — RecargaMundial

La seguridad de las transacciones y la privacidad de los fondos de nuestros usuarios son primordiales.

## 🔐 Manejo de Claves de API y Secretos

- **Nunca** compartas o subas archivos `.env` a repositorios públicos de GitHub/GitLab.
- Las variables `RELOADLY_CLIENT_SECRET` y `PAYPAL_CLIENT_SECRET` otorgan acceso directo al saldo y cobros. Deben configurarse únicamente mediante gestores de secretos o variables de entorno del servidor.
- Mantén activada la autenticación en dos pasos (2FA) en tus paneles de Reloadly y PayPal.

## 🚨 Reporte de Vulnerabilidades

Si descubres una posible vulnerabilidad de seguridad en esta plataforma:
1. No abras una incidencia pública en GitHub.
2. Envía un correo con los detalles técnicos a `security@recargamundial.com` o contacta al administrador del repositorio.
3. Se acusará recibo en menos de 24 horas y se desplegará una corrección prioritaria.
