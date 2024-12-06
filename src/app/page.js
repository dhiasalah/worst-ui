"use client";
import { useState } from "react";
import Image from "next/image";
import robinet from "./robinet.png"; // Image de votre robinet
import BirthdayGuess from "@/components/BirthdayGuess";
import DiceRoller from "@/components/DiceRoller"; // Importation du composant DiceRoller
import { useRouter } from "next/navigation";

export default function PageEvaluationEau() {
  const f = 10; // Move the initialization above its usage
  console.log(f); // No more ReferenceError

  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    birthdate: null, // Stocke la date de naissance au lieu de l'âge
    shower: null, // Accepte un nombre provenant de DiceRoller
    habits: [],
  });
  console.log(formData);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false); // Suivi du bouton activé/désactivé
  const [buttonPosition, setButtonPosition] = useState("bottom-left"); // Suivi de la position du bouton
  const [clickCount, setClickCount] = useState(0); // Nombre de clics
  const [i, setI] = useState(2);
  const [lastCharacter, setLastCharacter] = useState(""); // Stocke le dernier caractère avant suppression
  const [isDeleting, setIsDeleting] = useState(false); // Indicateur de suppression en cours

  // Nouvelle logique pour la réponse
  const [answer, setAnswer] = useState(""); // Réponse de l'utilisateur
  const correctAnswer = "fermer le robinet"; // Réponse correcte
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false); // Suivi de la validité de la réponse

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value: inputValue, type, checked } = e.target;

    let updatedValue = inputValue; // Valeur potentiellement modifiée
    if (formData.name === "") {
      setI(2);
    }
    if (name === "name" && inputValue.length > i && !isDeleting) {
      const charToDelete = inputValue.slice(-1); // Dernier caractère à supprimer
      setLastCharacter(charToDelete); // Stocke ce caractère

      setIsDeleting(true); // Indique qu'une suppression est en cours

      // Attendre 50 ms avant la suppression du dernier caractère
      setTimeout(() => {
        updatedValue = inputValue.slice(0, -1); // Supprime le dernier caractère
        setI(i + 1);
        setFormData({
          ...formData,
          [name]: updatedValue,
        });
        setIsDeleting(false); // Réinitialise l'indicateur
      }, 50); // Délai de 50 ms
    }

    // Gestion des différents types d'inputs
    if (type === "checkbox" || type === "radio") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else if (type === "select-multiple") {
      const selectedOptions = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData({
        ...formData,
        [name]: selectedOptions,
      });
    } else {
      setFormData({
        ...formData,
        [name]: updatedValue,
      });
    }
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    router.push(
      `/result?name=${encodeURIComponent(formData.name)}&birthdate=${
        formData.birthdate
          ? encodeURIComponent(formData.birthdate.toISOString())
          : ""
      }&shower=${encodeURIComponent(formData.shower || 0)}`
    );
  };

  // Gestion du clic sur le bouton du robinet
  const handleFaucetClick = () => {
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    if (newClickCount === 1) {
      setButtonPosition("bottom-right"); // Déplace le bouton en bas à droite après le premier clic
      alert("Réessayez ! Vous devez d'abord arrêter l'eau.");
    } else if (newClickCount === 2) {
      alert("Bien joué ! Vous avez économisé de l'eau.");
      setIsSubmitEnabled(true); // Active le bouton de soumission après le deuxième clic
    }
  };

  // Gestion de la réponse
  const handleAnswerChange = (e) => {
    const userInput = e.target.value; // Conserve l'entrée brute
    setAnswer(userInput); // Met à jour le champ

    // Vérifie si la réponse est correcte (sans casse ni espaces)
    setIsAnswerCorrect(userInput.trim().toLowerCase() === correctAnswer);
  };

  // Vérifie si le formulaire est complet
  const isFormComplete = formData.name && formData.birthdate && formData.shower;
  const canSubmit = isFormComplete && isAnswerCorrect && clickCount >= 2;

  return (
    <div className="flex justify-center w-full px-8 py-12 bg-gradient-to-r from-red-500 via-blue-500 to-green-500">
      {/* Formulaire d'évaluation */}
      <main className="w-full max-w-[40rem] text-white">
        <form
          className="flex flex-col gap-7 max-w-[50rem]"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl text-center my-8">
            Évaluez votre consommation d&apos;eau
          </h2>

          {/* Champ Nom */}
          <div className="form-group">
            <label
              htmlFor="name"
              className="block text-lg font-bold text-[#003366]"
            >
              Nom complet
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Votre nom complet"
              required
              className="w-full p-3 mb-4 border rounded text-black border-gray-300"
            />
          </div>

          {/* Champ Date de naissance */}
          <div className="form-group">
            <label
              htmlFor="birthdate"
              className="block text-lg font-bold text-[#003366]"
            >
              Date de naissance
            </label>
            <BirthdayGuess
              onDateSelect={(selectedDate) => {
                setFormData((prev) => ({
                  ...prev,
                  birthdate: selectedDate, // Met à jour la date de naissance
                }));
              }}
            />
            {formData.birthdate && (
              <p className="text-xl mb-5 text-center font-bold text-[#003366]">
                Date sélectionnée : {formData.birthdate.toDateString()}
              </p>
            )}
          </div>

          {/* Champ Temps de douche */}
          <div className="form-group mb-5">
            <label
              htmlFor="shower"
              className="block text-lg font-bold text-[#003366]"
            >
              Combien de temps passez-vous sous la douche par jour (en minutes)
              ?
            </label>
            <DiceRoller
              onRoll={(result) => {
                setFormData((prev) => ({
                  ...prev,
                  shower: result, // Met à jour le temps estimé
                }));
              }}
            />
            {formData.shower !== null && (
              <p className="text-xl mb-5 text-center font-bold text-[#003366]">
                Temps estimé : {formData.shower} minute
                {formData.shower > 1 ? "s" : ""}
              </p>
            )}
          </div>

          {/* Champ Réponse */}
          <div className="form-group">
            <label
              htmlFor="response"
              className="block text-lg font-bold text-[#003366]"
            >
              Comment pouvez-vous économiser de l&apos;eau chez vous ?
            </label>
            <p className="text-sm text-gray-500 italic mb-2">
              Indice : Une action simple mentionnée sur ce site.
            </p>
            <input
              type="text"
              id="response"
              value={answer}
              onChange={handleAnswerChange}
              placeholder="Votre réponse ici"
              required
              className="w-full p-3 mb-4 border rounded text-black border-gray-300"
            />
            {isAnswerCorrect ? (
              <p className="text-green-500 font-semibold">
                Génial ! Bonne réponse.
              </p>
            ) : (
              answer && (
                <p className="text-red-500">
                  Ce n&apos;est pas la réponse attendue !
                </p>
              )
            )}
          </div>

          {/* Bouton Soumettre */}
          <div className="text-right relative">
            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full px-8 py-3 bg-gradient-to-r from-[#f9572a] to-[#ff9b05] text-white rounded-md cursor-pointer text-xl shadow-md hover:from-[#fd4715] hover:to-[#f9b241] focus:from-[#fd4715] focus:to-[#f9b241] ${
                !canSubmit
                  ? "disabled:bg-[#ccc] disabled:text-[#979797] disabled:cursor-not-allowed"
                  : ""
              }`}
            >
              Soumettre
            </button>
            {!canSubmit && (
              <p className="mt-2 text-sm text-center text-gray-700 italic">
                Arrêtez l&apos;eau d&apos;abord !
              </p>
            )}
          </div>
        </form>
      </main>

      {/* Bouton Robinet */}
      {clickCount <
        2(
          <div
            className={`flex justify-center items-center mt-8 fixed ${
              buttonPosition === "bottom-left"
                ? "left-8 bottom-8"
                : "right-8 bottom-8"
            }`}
          >
            <button
              onClick={handleFaucetClick}
              disabled={!isFormComplete && isAnswerCorrect} // Désactive si le formulaire est incomplet
              className="p-4 bg-blue-600 text-white rounded-full shadow-md flex items-center justify-center"
              title={
                !isFormComplete
                  ? "Vous devez remplir les champs manquants avant de continuer."
                  : ""
              }
            >
              <Image src={robinet} alt="robinet" width={30} height={30} />
            </button>
          </div>
        )}
    </div>
  );
}
