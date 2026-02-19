# 🛡️ Auth System - Identity & Access Management (IAM)

![Version](https://img.shields.io/badge/Versión-1.0.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)
![Security](https://img.shields.io/badge/Security-Advanced_RBAC-success.svg)

**Administrator Auth** es un sistema avanzado de autenticación y autorización Frontend diseñado como una prueba de concepto (Mock Environment) de alta seguridad. Demuestra la implementación de flujos complejos de sesión, persistencia de datos, auditoría en tiempo real y jerarquías de roles estables sin dependencia de un backend real.

---

## 📑 Tabla de Contenidos

1. [✨ Características Principales](#-características-principales)
2. [🏗️ Arquitectura y Seguridad](#-arquitectura-y-seguridad)
3. [🚀 Instalación y Despliegue (Setup)](#-instalación-y-despliegue-setup)
4. [📖 Manual de Usuario (Roles y Accesos)](#-manual-de-usuario-roles-y-accesos)
5. [🖥️ Guía del Panel de Control](#-guía-del-panel-de-control-dashboard)

---

## ✨ Características Principales

* **Autenticación Robusta:** Flujos de Login y Registro con validación en tiempo real (RegEx) y simulación de JWT.
* **MFA Condicional (2FA):** Sistema de Autenticación de Dos Factores. Solo se solicita si las credenciales base son correctas, evitando enumeración de usuarios.
* **Control de Acceso Basado en Roles (RBAC):** Jerarquía de permisos estricta (`Root`, `Admin`, `Special Perms`, `User`).
* **Registro de Auditoría (Audit Trail):** Trazabilidad infinita de eventos de seguridad (inicios de sesión, cambios de rol, eliminaciones) visible solo para personal autorizado.
* **Gestor de Perfil Dinámico:** Actualización de avatar en Base64, cambio de credenciales y gestión de preferencias.
* **UI/UX Premium:** Modo Oscuro nativo, transiciones fluidas, *Layout Guards* para evitar parpadeos en rutas protegidas y diseño 100% responsivo.

---

## 🏗️ Arquitectura y Seguridad

El sistema está construido bajo los siguientes paradigmas técnicos:

> **Nota de Arquitectura:** Al carecer de una base de datos real, el sistema utiliza `localStorage` como motor de persistencia, encriptando conceptualmente los flujos a través de un `mockAuthService` y un estado global predecible.

* **Motor de Estado:** React Context API potenciado con `useReducer` para evitar renderizados innecesarios y mantener la fuente de la verdad inmutable.
* **Protección de Rutas (Guards):** Implementación de Layouts de Next.js que interceptan la navegación del lado del cliente, expulsando instantáneamente tokens inválidos.
* **Defensa contra Escalada de Privilegios:** La UI oculta y bloquea funciones administrativas a nivel de componente (`disabled={!canDelete}`), respaldado por verificaciones de rol en la renderización condicional.

---

## 🚀 Instalación y Despliegue (Setup)

Sigue estos pasos para levantar el entorno de desarrollo en tu máquina local.

### Prerrequisitos

* **Node.js:** v18.0.0 o superior.
* **Gestor de paquetes:** `npm` (v9+), `yarn` o `pnpm`.

### 📦 Módulos y Dependencias Requeridas

El proyecto depende de los siguientes módulos para asegurar que el diseño, las animaciones y el entorno de pruebas funcionen correctamente:

**Core del Framework:**
* `next`
* `react`
* `react-dom`
* `typescript`

**UI, Estilos y Animaciones:**
* `framer-motion` *(Para transiciones fluidas en los modales y páginas)*
* `lucide-react` *(Sistema de iconografía del panel)*
* `clsx` y `tailwind-merge` *(Utilidades para concatenación dinámica de clases de Tailwind)*

**Entorno de Testing (Desarrollo):**
* `jest`
* `@testing-library/react`
* `@testing-library/jest-dom`
* `jest-environment-jsdom`
* `ts-node`
* `@types/jest`

---

### 🛠️ Pasos de Instalación

**1. Clonar el repositorio:**

git clone [https://github.com/tu-usuario/zeryux-auth-system.git](https://github.com/tu-usuario/zeryux-auth-system.git)
cd administrator-auth-system

---

2. **Instalar dependencias:**
Si el archivo package.json ya está configurado, simplemente ejecuta:

npm install

**Nota: Si estás configurando el proyecto desde cero, puedes instalar los módulos manualmente con:**

npm install framer-motion lucide-react clsx tailwind-merge
npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom ts-node @types/jest```

3. **Iniciar el servidor de desarrollo:**

npm run dev

4. **Acceso al sistema:**

Abre tu navegador y navega a http://localhost:3000.


## 📖 Manual de Usuario (Roles y Accesos)

El sistema opera bajo una estricta jerarquía de roles para garantizar que solo el personal autorizado pueda realizar acciones destructivas o de configuración global.

### 🛡️ Matriz de Permisos (RBAC)

| Rol | Descripción | Eliminar Usuarios | Cambiar Roles | Ver Auditoría | Intocable por otros |
| --- | --- | --- | --- | --- | --- |
| **Root Admin** | Super administrador principal (`admin@indaptados.com`). | ✅ Todo | ✅ Todo | ✅ | ✅ Sí |
| **Admin** | Administrador secundario del sistema. | ✅ (Solo Users) | ✅ (A Special/User) | ✅ | ❌ No |
| **Special Perms** | Auditor / Moderador. | ✅ (Solo Users) | ❌ | ✅ | ❌ No |
| **User** | Usuario base del sistema. | ❌ | ❌ | ❌ | ❌ No |

### 🔑 Cuentas de Prueba Pre-configuradas

Para evaluar el sistema recién instalado, puedes utilizar las siguientes credenciales:

* **Cuenta Root (Nivel Máximo):**
* Email: `admin@indaptados.com`
* Contraseña: `Admin123`



---

## 🖥️ Guía del Panel de Control (Dashboard)

Una vez autenticado, el sistema adapta su interfaz según el rol del usuario.

### 1. Gestión de Usuarios (Admins & Special Perms)

Desde el panel central, los administradores pueden gestionar identidades:

* **Asignación de Roles:** Utiliza el menú desplegable en la columna "Rol". El color de la etiqueta cambiará en tiempo real (Púrpura = Admin, Cyan = Special, Verde = User).
* **Eliminación:** Los administradores pueden purgar cuentas del sistema. Esta acción es **irreversible** y queda registrada en la auditoría.
* **Seguridad Cruzada:** El sistema deshabilitará automáticamente el botón "Eliminar" y el menú de "Roles" si intentas modificar tu propia cuenta o la cuenta `Root`.

### 2. Registro de Auditoría (Audit Log)

El motor de trazabilidad registra actividades críticas de forma silenciosa.

* **Live View:** Muestra los 5 eventos más recientes directamente en el Dashboard.
* **Historial Completo:** Al hacer clic en *"Ver Historial Completo"*, se abrirá un Modal con *scroll* infinito que contiene toda la vida del sistema.
* *Restricción:* Este panel es completamente invisible para cuentas con el rol `User`.

### 3. Ajustes de Seguridad Personal (`/settings`)

Accesible desde la barra lateral izquierda o el menú desplegable del perfil superior derecho.

* **Autenticación 2FA:** Activa esta capa extra. En tu próximo inicio de sesión, el sistema te exigirá el código de seguridad (Mock Pin: `123456`) después de validar tu contraseña.
* **Gestión de Identidad:** Permite cambiar el nombre público, correo electrónico y subir un Avatar personalizado.
* **Modo Oscuro:** Conmutador global para cambiar la paleta de colores de toda la aplicación.
* **Zona de Peligro:** Permite la auto-eliminación de la cuenta, la cual también disparará un evento final en el Audit Log antes de destruir la sesión.
---
