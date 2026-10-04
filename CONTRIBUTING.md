# Contribuir a RecargaMundial

¡Gracias por tu interés en colaborar con **RecargaMundial**! Nuestra meta es mantener un sistema de recargas telefónicas y cobros electrónicos transparente, seguro y de alta disponibilidad.

## 🧭 Directrices de Desarrollo

1. **Autenticidad de Pagos y Telecomunicaciones**:
   - Todo cambio en las pasarelas debe respetar el estándar oficial de **PayPal REST v2** y **Reloadly Airtime API**.
   - No se permiten simulaciones en flujos marcados como producción (`live`). Las respuestas deben reflejar los códigos y estados devueltos por los operadores celulares.

2. **Código y Estilo**:
   - TypeScript estricto.
   - Componentes funcionales en React 19 con Tailwind CSS.
   - No almacenar secretos o claves de API en el código fuente del cliente. Todo secreto vive exclusivamente en variables de entorno del servidor.

3. **Flujo de Trabajo (Git Flow)**:
   - Crea ramas descriptivas: `feature/nueva-pasarela`, `fix/deteccion-operador`.
   - Haz commits claros y atómicos.
   - Abre un Pull Request describiendo los cambios y las pruebas realizadas.

4. **Reporte de Errores**:
   - Utiliza las plantillas de incidencias de GitHub para bugs o nuevas funciones.
