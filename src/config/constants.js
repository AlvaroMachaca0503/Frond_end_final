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