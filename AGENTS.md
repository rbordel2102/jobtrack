# JobTrack

JobTrack es una plataforma moderna para gestionar candidaturas de empleo.

El objetivo de este repositorio es demostrar buenas prácticas de desarrollo
web full-stack orientadas a entornos profesionales, manteniendo el código
comprensible, organizado y mantenible.

## Stack tecnológico

- Next.js con App Router
- React
- TypeScript
- Tailwind CSS
- ESLint

Se añadirán nuevas tecnologías progresivamente.

No añadas nuevas dependencias salvo que sean necesarias para la tarea solicitada.

## Principios de desarrollo

- Utilizar TypeScript de forma estricta.
- Evitar el uso de `any`.
- Utilizar tipos e interfaces claros.
- Preferir componentes pequeños y reutilizables.
- Utilizar Server Components por defecto.
- Crear Client Components únicamente cuando sea necesaria interactividad en el cliente.
- Separar la lógica de negocio de la presentación cuando sea apropiado.
- Utilizar HTML semántico y accesible.
- Todas las interfaces deben ser responsive.
- Preferir soluciones sencillas antes que abstracciones innecesarias.
- No implementar funcionalidades que no hayan sido solicitadas.
- No instalar librerías pensando en funcionalidades futuras.

## Estructura del proyecto

Utilizar estas carpetas cuando sean necesarias:

- `app/` para rutas, páginas y layouts.
- `components/` para componentes reutilizables.
- `lib/` para utilidades y lógica de la aplicación.
- `types/` para tipos compartidos de TypeScript.

No crear carpetas hasta que realmente sean necesarias.

## Calidad

Antes de considerar una tarea terminada:

1. Ejecutar `npm run lint`.
2. Ejecutar `npm run build`.
3. Corregir los errores causados por los cambios realizados.
4. Revisar el diff final y eliminar cambios innecesarios.

## Git

- No realizar commits salvo que se solicite expresamente.
- No desarrollar nuevas funcionalidades directamente sobre `main`.
- Realizar cambios pequeños y centrados en una única tarea.
- Utilizar Conventional Commits al proponer mensajes de commit.

Ejemplos:

- `feat: add applications dashboard`
- `fix: validate empty company names`
- `refactor: extract status badge component`
- `test: add application form tests`
- `docs: update project setup`