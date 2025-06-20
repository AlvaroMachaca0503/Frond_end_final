const BACK_URL = import.meta.env.VITE_BACK_URL;
const OAUTH_URL = import.meta.env.VITE_OAUTH_URL;

export const UNIVERSIDADES_API = {
  LIST: `${BACK_URL}/universidades/`,
  DETAIL: (id) => `${BACK_URL}/universidades/${id}/`
};

export const ACTIVIDADES_API = {
  LIST: `${BACK_URL}/actividades/`,
  DETAIL: (id) => `${BACK_URL}/actividades/${id}/`
};

export const ESTUDIANTES_API = {
  LIST: `${BACK_URL}/estudiantes/`,
  DETAIL: (id) => `${BACK_URL}/estudiantes/${id}/`
};

export const TOKEN_API = {
    GET_TOKEN: `${OAUTH_URL}/token/`
};

export const FACULTADES_API = {
  LIST: `${BACK_URL}/facultades/`,
  DETAIL: (id) => `${BACK_URL}/facultades/${id}/`
}

export const DEPARTAMENTOS_API = {
  LIST: `${BACK_URL}/departamentos/`,
  DETAIL: (id) => `${BACK_URL}/departamentos/${id}/`
}

export const CARRERAS_API = {
  LIST: `${BACK_URL}/carreras/`,
  DETAIL: (id) => `${BACK_URL}/carreras/${id}/`
}

export const COMPETENCIA_API = {
  LIST: `${BACK_URL}/competencias/`,
  DETAIL: (id) => `${BACK_URL}/competencias/${id}/`
}

export const CRITERIO_API = {
  LIST: `${BACK_URL}/criterios/`,
  DETAIL: (id) => `${BACK_URL}/criterios/${id}/`
}

export const AREA_API = {
  LIST: `${BACK_URL}/areas/`,
  DETAIL: (id) => `${BACK_URL}/areas/${id}/`
}

export const PLAN_CURRICULAR_API = {
  LIST: `${BACK_URL}/planes/`,
  DETAIL: (id) => `${BACK_URL}/planes/${id}/`
}

export const SEMESTRE_PLAN_API = {
  LIST: `${BACK_URL}/semestres-plan/`,
  DETAIL: (id) => `${BACK_URL}/semestres-plan/${id}/`
}

export const CURSO_API = {
  LIST: `${BACK_URL}/cursos/`,
  DETAIL: (id) => `${BACK_URL}/cursos/${id}/`
}


export const PERFIL_API = {
  LIST: `${BACK_URL}/perfiles/`,
  DETAIL: (id) => `${BACK_URL}/perfiles/${id}/`
}