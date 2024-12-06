"use client"; // Cette ligne rend le composant côté client
import { useState, useEffect } from "react";

export default function DevinerAnniversaire({ onDateSelect }) {
  const aujourdHui = new Date();
  const [date, setDate] = useState(aujourdHui);
  const [superieur, setSuperieur] = useState(aujourdHui);
  const [inferieur, setInferieur] = useState(new Date(0, 0, 1));
  const [nombreEssais, setNombreEssais] = useState(1);

  const obtenirDateString = () => date.toLocaleDateString();

  const plusTot = () => {
    setSuperieur(date); // Met à jour la borne supérieure
    setNombreEssais((prev) => prev + 1);
  };

  const plusTard = () => {
    setInferieur(date); // Met à jour la borne inférieure
    setNombreEssais((prev) => prev + 1);
  };

  // Recalculer la date devinée dès que `inferieur` ou `superieur` change
  useEffect(() => {
    const delta = superieur.getTime() - inferieur.getTime();
    const devine = inferieur.getTime() + delta / 2; // Calcul du point médian
    setDate(new Date(devine));
  }, [inferieur, superieur]); // Recalcule uniquement lorsque `inferieur` ou `superieur` change

  // Transmettre la date sélectionnée au composant parent chaque fois que la devinette change
  useEffect(() => {
    if (typeof onDateSelect === "function") {
      onDateSelect(date); // Invoque seulement si `onDateSelect` est une fonction valide
    }
  }, [date]); // Supprime `onDateSelect` des dépendances

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h2 className="text-lg font-semibold text-gray-800">
        Est-ce votre anniversaire ?
      </h2>

      <div id="dates" className="flex items-center space-x-4">
        <button
          type="button" // Assure que c'est un bouton, pas un bouton de soumission
          id="plusTot"
          onClick={plusTot}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Plus tôt
        </button>
        <div id="date" className="text-lg font-bold text-gray-800">
          {obtenirDateString()}
        </div>
        <button
          type="button" // Assure que c'est un bouton, pas un bouton de soumission
          id="plusTard"
          onClick={plusTard}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Plus tard
        </button>
      </div>

      <div id="nombreEssais" className="text-gray-700">
        {nombreEssais} Essai{nombreEssais > 1 ? "s" : ""}
      </div>
    </div>
  );
}
