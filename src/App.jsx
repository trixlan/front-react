import { useState, useEffect } from 'react'
import './App.css'


function App() {
  const [formData, setFormData] = useState({ nombre: '', edad: '' });
  const [personas, setPersonas] = useState([]);
  const [status, setStatus] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;

  // Cargar lista de personas al inicio
  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = async () => {
    try {
      const response = await fetch(`${API_URL}/personas`);
      const data = await response.json();
      setPersonas(data);
    } catch (error) {
      console.error('Error al cargar personas:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Enviando...');

    try {
      const response = await fetch(`${API_URL}/personas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('Datos enviados correctamente ✅');
        fetchPersonas();
      } else {
        setStatus(`Error del servidor ❌: ${response.status}`);
      }
    } catch (error) {
      setStatus(`Error de red ❌: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto space-y-8">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <h2 className="text-xl font-semibold">Agregar Persona</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Edad</label>
            <input
              type="number"
              name="edad"
              value={formData.edad}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-indigo-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Enviar
          </button>

          {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
        </form>

        {/* Tabla de personas */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Personas Registradas</h2>
          {personas.length > 0 ? (
            <table className="min-w-full table-auto">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Nombre</th>
                  <th className="px-4 py-2 text-left">Edad</th>
                </tr>
              </thead>
              <tbody>
                {personas.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-2">{p.nombre}</td>
                    <td className="px-4 py-2">{p.edad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No hay personas registradas.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
