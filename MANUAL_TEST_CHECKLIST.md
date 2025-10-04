# Manual Test Checklist - Cotizaciones Generator

## 🔍 Tests Manuales para Validar Funcionalidad

### 1. Dashboard (http://localhost:5173/)
- [ ] ✅ Página carga sin errores de consola
- [ ] ✅ Se muestran estadísticas (Total, Aprobadas, Pendientes, Clientes)
- [ ] ✅ Botón "Nueva Cotización" es visible y clickeable
- [ ] ✅ Se muestran cotizaciones recientes (o mensaje de vacío)
- [ ] ✅ Link "Ver todas" navega a /quotations

### 2. Modal Nueva Cotización
- [ ] ✅ Al hacer click en "Nueva Cotización" se abre el modal
- [ ] ✅ Modal muestra título "Nueva Cotización"
- [ ] ✅ Dropdown de clientes se llena con datos
- [ ] ✅ Al seleccionar cliente y hacer click en "Crear Cotización":
  - [ ] Se crea la cotización
  - [ ] Se navega a la vista detalle
  - [ ] Modal se cierra
- [ ] ✅ Botón "Cancelar" cierra el modal
- [ ] ✅ Click en backdrop cierra el modal

### 3. Lista de Cotizaciones (http://localhost:5173/quotations)
- [ ] ✅ Página carga sin errores
- [ ] ✅ Se muestran estadísticas por estado (Borradores, Pendientes, etc.)
- [ ] ✅ Se muestra lista de cotizaciones o mensaje de vacío
- [ ] ✅ Cada cotización muestra:
  - [ ] Número de cotización
  - [ ] Nombre del cliente
  - [ ] Email del cliente
  - [ ] Estado con badge de color
  - [ ] Fecha de creación
- [ ] ✅ Click en cotización navega a vista detalle

### 4. Vista Detalle de Cotización (http://localhost:5173/quotations/:id)
- [ ] ✅ Página carga sin errores
- [ ] ✅ Se muestra información completa de la cotización
- [ ] ✅ Se muestra información del cliente
- [ ] ✅ Botones de acción funcionan:
  - [ ] Editar
  - [ ] Exportar PDF
  - [ ] Duplicar
  - [ ] Eliminar

### 5. Gestión de Clientes (http://localhost:5173/clients)
- [ ] ✅ Página carga sin errores
- [ ] ✅ Se muestra lista de clientes
- [ ] ✅ Botón "Nuevo Cliente" funciona
- [ ] ✅ Se pueden exportar clientes

### 6. CRUD Operations
- [ ] ✅ **Crear**: Nueva cotización se crea correctamente
- [ ] ✅ **Leer**: Cotizaciones se muestran en lista y detalle
- [ ] ✅ **Actualizar**: Se puede editar una cotización
- [ ] ✅ **Eliminar**: Se puede eliminar una cotización

### 7. Persistencia de Datos
- [ ] ✅ Datos se guardan en localStorage
- [ ] ✅ Datos persisten después de refresh
- [ ] ✅ Nuevas cotizaciones aparecen en estadísticas

## 🚨 Errores Encontrados

### Errores de Consola:
```
[Anotar aquí cualquier error de JavaScript/Vue que aparezca en la consola]
```

### Errores de Funcionalidad:
```
[Anotar aquí cualquier funcionalidad que no trabaje como se espera]
```

### Errores de UI/UX:
```
[Anotar aquí cualquier problema visual o de experiencia de usuario]
```

## 📝 Notas de Testing

- **Navegador usado**: Chrome/Firefox/Safari
- **Fecha de test**: [Fecha]
- **Versión**: [Commit hash o versión]

## 🔧 Acciones Correctivas Necesarias

1. **Prioridad Alta**:
   - [ ] [Describir problema crítico]
   - [ ] [Describir problema crítico]

2. **Prioridad Media**:
   - [ ] [Describir problema moderado]
   - [ ] [Describir problema moderado]

3. **Prioridad Baja**:
   - [ ] [Describir mejora menor]
   - [ ] [Describir mejora menor]
