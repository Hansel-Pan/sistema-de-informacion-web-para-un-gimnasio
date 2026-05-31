const API = "http://localhost:3001/api";

async function peticion(url, options = {}) {
  
  const res = await fetch(`${API}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error en la petición");
  return data;
}

export const clientesApi = {
  listar: () => peticion("/clientes"),
  obtener: (id) => peticion(`/clientes/${id}`),
  crear: (data) => peticion("/clientes", { method: "POST", body: JSON.stringify(data) }),
  actualizar: (id, data) => peticion(`/clientes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  eliminar: (id) => peticion(`/clientes/${id}`, { method: "DELETE" }),
};

export const pagosApi = {
  listar: () => peticion("/pagos"),
  crear: (data) =>
    peticion("/pagos", { method: "POST", body: JSON.stringify(data) }),
};

export const accesoApi = {
  entrada: (cliente_id) =>
    peticion("/acceso/entrada", {
      method: "POST",
      body: JSON.stringify({ cliente_id }),
    }),

  salida: (cliente_id) =>
    peticion("/acceso/salida", {
      method: "POST",
      body: JSON.stringify({ cliente_id }),
    }),

  ocupacion: () => peticion("/acceso/ocupacion"),
  
  historial: (cliente_id) => peticion(`/acceso/historial/${cliente_id}`),
};
