export async function getSpeakers() {

  const response = await fetch(
    "http://localhost:5000/api/speakers"
  );

  if (!response.ok) {
    throw new Error("Erreur lors du chargement");
  }

  return response.json();
}