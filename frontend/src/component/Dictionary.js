import React, { useState } from "react";

const Dictionary = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="mt-4 bg-gray-700 p-4 rounded-md">
      <h3 className="text-lg font-semibold mb-2">Dicionário de Libras</h3>
      <input
        type="text"
        placeholder="Buscar termo..."
        className="p-2 rounded bg-gray-600 text-white w-full mb-2"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <iframe
        src={`https://www.libras.com.br/${searchTerm}`}
        title="Dicionário de Libras"
        className="w-full h-64 mt-2 rounded"
      />
    </div>
  );
};

export default Dictionary;
