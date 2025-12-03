Instrucciones para OneToOne bidireccional (Master <-> Detail):
- Colocar la línea indicada justo después de asignar el objeto Detail al Master y antes de persistir (repository.save).
- Si el lado "owner" tiene la @JoinColumn (p. ej. Detail), la asignación importante para la FK es detail.setMaster(master).
- Evitar NPE comprobando null si el detalle puede ser nulo.

1) Entidad maestra (dentro de setDetail(Detail detail) o método assign):
  - Novato (claro, explícito — evita NPE):
      if (detail != null) detail.setMaster(this);
    // Coloca esto dentro del setter de Master, justo cuando asignes this.detail = detail;
  - Senior (conciso, idiomático — usa Optional):
      Optional.ofNullable(detail).ifPresent(d -> d.setMaster(this));
    // Requiere import java.util.Optional

2) Mapper DTO -> Entity (después de mapear detailDTO -> detailEntity y asignarlo a masterEntity):
  - Novato:
      if (masterEntity.getDetail() != null) masterEntity.getDetail().setMaster(masterEntity);
    // Añadir justo después de masterEntity.setDetail(detailEntity);
  - Senior:
      Optional.ofNullable(masterEntity.getDetail()).ifPresent(d -> d.setMaster(masterEntity));

3) DTO de Master (si incluyes el detail dentro del MasterDTO):
  - Novato:
      private DetailDTO detail; // añadir la propiedad si no existe
    // DTO simple, explícito y fácil de entender
  - Senior:
      @NotNull
      private DetailDTO detail; // marca como requerido (import javax.validation.constraints.NotNull)
    // Solo si quieres forzar validación; no uses Optional en DTOs generalmente

4) Service.create (antes de repository.save(masterEntity)):
  - Novato:
      if (masterEntity.getDetail() != null) masterEntity.getDetail().setMaster(masterEntity);
    // Garantiza consistencia en memoria antes de persistir
  - Senior:
      Optional.ofNullable(masterEntity.getDetail()).ifPresent(d -> d.setMaster(masterEntity));

5) Service.update (después de aplicar cambios al masterEntity y antes de repository.save(updatedMaster)):
  - Novato:
      if (masterEntity.getDetail() != null) masterEntity.getDetail().setMaster(masterEntity);
    // Si reemplazas o actualizas el detail, vuelve a ligar la referencia inversa
  - Senior:
      Optional.ofNullable(masterEntity.getDetail()).ifPresent(d -> d.setMaster(masterEntity));

Notas rápidas:
- Donde uses las variantes "Senior" importa java.util.Optional.
- Si Detail es el owner (contiene @JoinColumn), la línea esencial es detail.setMaster(master) — las versiones muestran eso indirectamente.
- Siempre coloca la asignación justo antes de llamar a repository.save(...) para asegurar que JPA vea la relación consistente.
- Ejemplo seguro completo (patrón recomendado):
    if (masterEntity.getDetail() != null) {
        masterEntity.getDetail().setMaster(masterEntity);
    }
