# Guía de colaboración — Equipo de Sistemas de Pachamole

**Destinatarios:** Maycol, Fernando y Omar.  
**Objetivo:** que cualquier integrante pueda obtener el código, ejecutar el proyecto, completar una tarea, probarla y entregarla **sin mandar archivos ZIP ni exigir que otro copie su código**.

> Esta guía está basada en el árbol compartido del repositorio, no en una inspección directa de su contenido. Si un script, nombre de rama, permiso o URL no coincide con tu GitHub real, consulta el archivo/configuración correspondiente y avisa en el Issue.

## 1. Antes de empezar: qué usa cada uno

| Herramienta | ¿Quién la necesita? | ¿Para qué sirve? |
| --- | --- | --- |
| Git | Los tres | Descargar, versionar y subir cambios |
| Cuenta de GitHub | Los tres | Acceso al repositorio, Issues y Pull Requests |
| Node.js | Quienes ejecuten frontend o backend; recomendable los tres | Ejecutar JavaScript y herramientas de desarrollo |
| pnpm | Quienes ejecuten frontend o backend; recomendable los tres | Instalar dependencias desde el workspace |
| Editor de código | Los tres | Editar archivos (p. ej., VS Code) |
| Python + entorno virtual | Omar; quien revise ML | Ejecutar notebooks/scripts de ML |
| PostgreSQL/Supabase | Más adelante, según módulo | Almacenamiento real; **no hace falta para Sprint 0** |

**pnpm sí es compatible con el proyecto.** Para evitar diferencias, usar todos pnpm y mantener **un solo lockfile raíz** cuando el workspace esté normalizado. No hacer `npm install` dentro de los paquetes si el equipo ya acordó pnpm.

**Tailwind:** no es requisito para trabajar ahora. Diseño entregará CSS; se conservará al convertir HTML/JS a componentes React. Antes de instalar o migrar a Tailwind, crear un Issue y acordar qué estilos conservar.

### Comprobar herramientas

```bash
git --version
node --version
pnpm --version
```

Si `pnpm` no existe, pedir a coordinación la versión acordada e instalarla por un método documentado (por ejemplo Corepack si está disponible, o el instalador oficial). **No usar `sudo npm install -g` por costumbre.** Si Vite falla, revisar la versión de Node requerida por la versión instalada del proyecto.

## 2. Cómo obtener el proyecto por primera vez

1. Aceptar la invitación de colaboración a GitHub.
2. Abrir la página del repositorio y copiar la URL desde el botón **Code** (HTTPS o SSH, según el acceso configurado).
3. Abrir una terminal **fuera** de cualquier carpeta `pachamole` ya existente.
4. Ejecutar:

```bash
git clone URL_REAL_DEL_REPOSITORIO
cd pachamole
pnpm install
```

Si usas HTTPS, GitHub puede pedir credenciales mediante un gestor de credenciales/token; no se utiliza la contraseña de la cuenta como contraseña Git. Si usas SSH, la clave debe estar configurada en tu cuenta.

**No ejecutar `git init` otra vez:** el proyecto clonado ya incluye su historial Git y su remoto `origin`.

## 3. Cómo ejecutar en tu computadora

Abrir **dos terminales**, ambas en la raíz `pachamole/`.

Terminal A:

```bash
pnpm --dir frontend dev
```

Terminal B:

```bash
pnpm --dir backend dev
```

**Si falla el segundo comando:** comprobar el script `dev` con `cat backend/package.json`. El árbol inicial muestra `backend/src/index.js`, pero no demuestra que exista `scripts.dev`. Avisar al coordinador o esperar el PR de arranque del backend; no inventar una configuración incompatible.

Si se necesita iniciar el archivo directamente y está preparado para ello, desde la raíz se puede probar:

```bash
node backend/src/index.js
```

Las URLs/puertos reales aparecerán en las terminales o en la configuración. No afirmar que el frontend ya consume la API ni que la base de datos está operativa si aún no se integraron.

Para parar un proceso de desarrollo: `Ctrl+C` en su terminal.

## 4. Antes de escribir código: buscar tu tarea

Cada trabajo debe tener un **Issue** en GitHub:

- **Título:** verbo + resultado, por ejemplo `Crear GET /api/products`.
- **Contexto:** qué necesita Pachamole y qué está fuera del alcance.
- **Responsable:** asignado en GitHub.
- **Criterios de aceptación:** qué se probará para aprobarlo.
- **Dependencias:** otros Issues o contratos que deben existir antes.
- **Área:** `frontend`, `backend`, `ml`, `docs`, etc.

En **GitHub Projects**, moverlo desde **Por hacer** a **En progreso** al comenzar. No hace falta crear una tarea por cada línea; sí una por resultado comprobable.

**Regla:** si una API o estructura todavía no está acordada, preguntar en el Issue **antes** de inventarla.

## 5. Crear una rama de trabajo

Antes de crearla:

```bash
git switch main
git pull --ff-only origin main
git switch -c feature/12-catalogo-productos
```

Reemplaza `12` por el número real de Issue y usa un nombre descriptivo. Ejemplos:

- `feature/12-catalogo-productos`
- `feature/18-generador-datos-sinteticos`
- `docs/21-guia-endpoints`
- `fix/24-validacion-cantidad`

**No trabajar directamente en `main`**, aunque GitHub lo permita. No reutilizar una rama antigua para una tarea distinta.

## 6. Desarrollar, comprobar y documentar

### Fernando — backend

Trabajar en los módulos asignados de `backend/`. Antes de entregar:

- Ejecutar la API y mostrar las rutas implementadas.
- Explicar qué datos recibe, valida y devuelve cada endpoint.
- Probar un caso correcto y al menos un error (por ejemplo, producto inexistente).
- Documentar endpoints en `docs/api/` o en `README.md` del módulo.
- No asumir que QR equivale a pago verificado: la verificación bancaria será manual.
- No cambiar el esquema global de pedidos sin acordarlo con coordinación.

### Omar — ML y analítica

Trabajar en `ml/`. Antes de entregar:

- Proveer script reproducible para generar datos **sintéticos**.
- Documentar variables, supuestos y semilla.
- Incluir instrucciones para crear un entorno Python e instalar dependencias.
- Mostrar entrenamiento, comparación con modelo base y métricas.
- Distinguir resultados académicos simulados de desempeño real.
- No guardar bases enormes, entornos virtuales ni datos personales en Git.

### Maycol — coordinación e integración

- Mantener contrato API, arquitectura y requisitos comunes.
- Configurar el arranque inicial y la futura base de datos.
- Revisar PR de los compañeros, pedir pruebas y evitar romper `main`.
- Coordinar el ingreso de HTML, CSS y JS originales desde Diseño.
- Acordar cambios transversales antes de tocar módulos de otra persona.

### Todos — documentación mínima de módulo

Un `README.md` de módulo puede incluir:

```markdown
# Nombre del módulo
Responsable y propósito.

## Cómo ejecutar/probar
Comandos exactos y precondiciones.

## Archivos principales
Qué hace cada uno.

## Entradas y salidas
Endpoints o funciones, con ejemplo.

## Decisiones y limitaciones
Qué no hace y por qué.

## Cambios relevantes
Enlaces a Issues/PR.
```

El README explica el funcionamiento **actual**; no se debe llenar con funcionalidades que todavía son deseos.

## 7. Guardar y subir cambios

Primero inspeccionar:

```bash
git status
git diff
```

Comprobar que no haya secretos, `.env`, `node_modules`, capturas bancarias ni carpetas de salida. Después:

```bash
git add RUTA_DE_TUS_ARCHIVOS
git commit -m "feat(products): agregar listado de productos"
git push -u origin feature/12-catalogo-productos
```

**Preferir `git add RUTA_DE_TUS_ARCHIVOS` a `git add .`** cuando todavía se está aprendiendo, para reducir subidas accidentales. `git status` debe quedar limpio después del commit.

Los commits describen cambios concretos. Ejemplos de prefijos: `feat`, `fix`, `docs`, `test`, `chore`.

## 8. Crear un Pull Request (PR)

1. Abrir el repositorio en GitHub.
2. GitHub suele mostrar **Compare & pull request** para la rama recién subida; si no, entrar a **Pull requests → New pull request**.
3. Elegir **base: `main`** y **compare: tu rama**.
4. Vincular el Issue, p. ej. `Closes #12`, si el PR realmente completa toda la tarea.
5. Rellenar la descripción:

```markdown
## Qué hice
- ...

## Cómo probar
1. ...
2. ...

## Evidencia
- Salida de pruebas / captura sin datos privados.

## Archivos afectados
- ...

## Limitaciones o pendientes
- ...

Closes #12
```

6. Solicitar revisión de otro integrante y mover el Issue a **En revisión**.
7. Responder comentarios, corregir y subir nuevos commits a **la misma rama**.
8. Solo fusionar cuando funcione, se pueda explicar y cumpla los criterios.

No se acepta como prueba únicamente «me funcionó con IA». La IA puede ayudar a desarrollar, pero quien entrega debe entender el resultado.

## 9. Cómo actualizar tu trabajo con los cambios de otros

Antes de una tarea nueva:

```bash
git switch main
git pull --ff-only origin main
```

Si trabajas en una rama activa y necesitas cambios recientes, **guarda primero tu trabajo**. Después, consulta con coordinación si conviene fusionar `main` en tu rama:

```bash
git switch feature/12-catalogo-productos
git merge main
```

Si aparecen conflictos: abrir los archivos señalados, decidir qué contenido conservar, probar y completar el merge. **No usar `git push --force` ni `git reset --hard` sin entender el efecto y coordinarlo.**

## 10. GitHub Projects: cómo se usa

**Issue = tarea; Project = tablero; PR = entrega revisable.**

Estados recomendados:

1. **Backlog:** ideas o tareas no priorizadas.
2. **Por hacer:** aprobadas y listas para iniciar.
3. **En progreso:** alguien las está implementando.
4. **En revisión:** hay un PR o entregable listo para evaluar.
5. **Terminado:** se cumplieron los criterios y el cambio quedó integrado.

Usar **Assignee** para el responsable real, no solo colores. Las etiquetas pueden indicar área y prioridad. Si estás bloqueado, comentarlo en el Issue y dejar escrito qué necesitas.

No se medirán contribuciones solo por número de commits. La evidencia incluye resultado, pruebas, documentación y explicación.

## 11. Qué NO deben hacer

- No subir ZIP como entrega habitual de programación.
- No subir `node_modules/`, `.env`, credenciales ni comprobantes bancarios.
- No cambiar automáticamente toda la hoja de estilos de Diseño a Tailwind.
- No crear endpoints con nombres diferentes al contrato acordado.
- No mezclar `npm install` y `pnpm install` dentro del mismo workspace.
- No fusionar código que no se pueda ejecutar o explicar.
- No presentar un dataset sintético como si fuera historial real de ventas.
- No cancelar/eliminar pedidos de la base de datos sin preservar trazabilidad.

## 12. Problemas frecuentes

**`pnpm: command not found`** → instalar/activar pnpm de la versión acordada.

**`Unsupported engine` o error de Vite** → revisar la versión de Node compatible con Vite del proyecto.

**`Missing script: dev` en backend** → falta el script en `backend/package.json`; coordinar Sprint 0. No copiar scripts a ciegas.

**`Permission denied` al hacer push** → aceptar invitación y revisar acceso HTTPS/SSH, remoto y permisos. Comprobar `git remote -v`.

**`nothing to commit`** → revisar `git status`; quizá no hay cambios o el archivo está ignorado.

**`non-fast-forward` al hacer push** → alguien cambió esa rama; verificar antes de integrar y evitar `--force`.

**Falla `pnpm install` por lockfiles** → el árbol inicial contiene `pnpm-lock.yaml` en la raíz **y dentro de `frontend/` y `backend/`**. Un workspace normal suele conservar únicamente el lockfile de la raíz. **Coordinación debe revisar y normalizar esta situación en una tarea separada** antes de eliminar archivos: comprobar qué depende de ellos y regenerar el lockfile raíz con pnpm.

**No aparece una carpeta vacía tras clonar** → Git no almacena directorios vacíos; incorporar un `.gitkeep` o un README cuando la carpeta sea necesaria.

## 13. Primera tarea de práctica de los tres

Para confirmar que saben trabajar sin alterar código sensible:

1. Cada compañero clona el proyecto e instala dependencias.
2. Crea un Issue de práctica asignado.
3. Abre una rama `docs/NUMERO-prueba-colaboracion`.
4. Agrega en `docs/` una pequeña nota indicando qué comandos probó, sin información personal o secretos.
5. Hace commit, push y abre PR.
6. Otro compañero revisa; se fusiona.

Solo después de completar esto empiezan las tareas de productos, pedidos y ML.

## 14. Lista de verificación antes de pedir revisión

- [ ] Trabajé en la rama del Issue, no en `main`.
- [ ] Puedo explicar los archivos cambiados.
- [ ] Probé el caso principal y uno incorrecto.
- [ ] Documenté cómo ejecutar y probar.
- [ ] No añadí secretos ni dependencias innecesarias.
- [ ] El PR describe el cambio y enlaza el Issue.
- [ ] Avisé de limitaciones o tareas pendientes.

**Nuestro objetivo es una versión de Pachamole que cualquiera del equipo pueda clonar, ejecutar, comprender y defender.**
