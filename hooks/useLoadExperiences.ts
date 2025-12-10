
/**
 * Hook para cargar experiencias paginadas desde el servicio `experienciaService`.
 *
 * Este hook:
 * - Utiliza internamente `usePaginatedFetch` para manejar la paginación automáticamente.
 * - Permite definir el tamaño de página (`pageSize`) al instanciar el hook.
 * - Carga las experiencias iniciales automáticamente al montarse.
 * - Expone funciones y estados para cargar más experiencias, revisar si hay más y conocer el estado de carga.
 *
 * Comportamiento:
 * - Realiza la carga inicial de experiencias al montarse el hook.
 * - `loadExperiencias(true)` recarga desde la primera página.
 * - `hasMore` indica si existen más experiencias por cargar.
 *
 * @param {number} [pageSize=5] - Número de experiencias a cargar por página.
 * @returns {object} Contiene la lista de experiencias, funciones de carga y estados de control.
 * @property {ExperienciasResponse[]} experiencias - Lista de experiencias cargadas.
 * @property {() => Promise<void>} loadExperiencias - Función para cargar más experiencias (paginación).
 * @property {boolean} loading - Indica si la carga de experiencias está en curso.
 * @property {boolean} hasMore - Indica si hay más experiencias por cargar.
 */
export const useLoadExperiences = (pageSize: number = 5) => {


};
