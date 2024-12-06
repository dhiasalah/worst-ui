"use client";

import { useSearchParams } from "next/navigation";

export default function ResultPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const birthdate = searchParams.get("birthdate");
  const shower = searchParams.get("shower");

  return (
    <div className="flex flex-col  p-8">
      <h1 className="text-2xl font-bold">Résultats</h1>
      <p>
        <strong>Nom complet:</strong> {name}
      </p>
      <p>
        <strong>Date de naissance:</strong>{" "}
        {birthdate ? new Date(birthdate).toDateString() : "Non spécifié"}
      </p>
      <p>
        <strong>Temps sous la douche:</strong> {shower} minutes
      </p>

      {parseInt(shower) > 15 ? (
        <p className="text-sm text-gray-500 italic mb-2">
          Vous avez dépassé les 15 minutes sous la douche. Vous consommez
          beaucoup de l'eau il faut diminuer !!!!
        </p>
      ) : (
        <p className="text-sm text-gray-500 italic mb-2">
          Vous avez respecté les 15 minutes sous la douche. Vous pouvez aller
          boire un peu plus de l'eau!
        </p>
      )}
    </div>
  );
}
