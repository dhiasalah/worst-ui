"use client"; // Cette ligne assure que c'est un composant côté client
import { useState } from "react";

export default function DiceRoller({ onRoll }) {
  const [nombreDeDes, setNombreDeDes] = useState(2); // État pour le nombre de dés
  const [resultatsDes, setResultatsDes] = useState([]); // État pour les résultats des dés

  const secouerDes = () => {
    const resultats = [];
    for (let i = 0; i < nombreDeDes; i++) {
      const lancer = Math.floor(Math.random() * 6) + 1; // Nombre aléatoire entre 1 et 6
      resultats.push(lancer);
    }
    setResultatsDes(resultats);

    // Calcule la somme des dés et notifie le composant parent
    const total = resultats.reduce((somme, lancer) => somme + lancer, 0);
    if (onRoll) onRoll(total);

    // Réinitialise l'animation
    setTimeout(() => {
      setResultatsDes((resultatsPrecedents) => [...resultatsPrecedents]); // Force un re-render
    }, 500);
  };

  return (
    <div className="bg-black flex flex-col items-center justify-center p-6">
      <h1 className="text-xl font-semibold mb-4">Secouer les dés</h1>
      <p className="text-sm mb-4">Choisissez le nombre de dés à lancer :</p>

      {/* Entrée pour le nombre de dés */}
      <div className="flex items-center space-x-4 mb-6">
        <label htmlFor="nombreDeDes" className="text-sm font-medium ">
          Nombre de dés :
        </label>
        <input
          type="number"
          id="nombreDeDes"
          value={nombreDeDes}
          onChange={
            (e) =>
              setNombreDeDes(Math.max(1, Math.min(6, Number(e.target.value)))) // Limite à 1-6
          }
          min="1"
          max="6"
          className="w-16 text-center p-2 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Affichage des dés */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
        {resultatsDes.map((lancer, index) => (
          <div
            key={index}
            className={`w-16 h-16 text-black text-center mx-auto bg-white border border-black rounded-lg shadow-md flex items-center justify-center text-xl font-bold transform transition-transform duration-500 ${
              resultatsDes.length > 0 ? "animate-rotate" : ""
            }`}
          >
            {lancer}
          </div>
        ))}
      </div>

      {/* Bouton pour lancer les dés */}
      <button
        type="button"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={secouerDes}
      >
        Lancer les dés
      </button>

      {/* Animation personnalisée Tailwind */}
      <style jsx>{`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;

        @keyframes rotateDice {
          0% {
            transform: rotateX(0deg) rotateY(0deg);
          }
          100% {
            transform: rotateX(360deg) rotateY(360deg);
          }
        }
        .animate-rotate {
          animation: rotateDice 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
