import { ApiClient, fromCatalog } from "@opendatasoft/api-client";

const client = new ApiClient({ domain: "opendata.paris.fr" });

const formEl = document.getElementById("input-rue");

formEl.addEventListener("submit", (event) => {
  event.preventDefault(); // Empêche le comportement par défaut du formulaire

  // Récupère la valeur de l'input
  const rue = document.getElementById("rue").value;

  // Crée la requête avec la valeur de la rue
  const query = fromCatalog()
    .dataset("eclairage-public")
    .aggregates()
    .select("count(lib_voie) as lampadaires")
    .groupBy("lib_voie as rue")
    .where(`lib_voie like '${rue}'`)
    .toString();

  // Exécute la requête
  client
    .get(query)
    .then(({ aggregations }) => {
      console.log(aggregations);
      // Affiche les résultats
      const lampadairesEl = document.getElementById("lampadaires");
      if (aggregations.length === 0) {
        lampadairesEl.innerHTML = "Aucune voie trouvée dans Paris.";
      } else {
        const nombreLampadaires = aggregations[0].lampadaires;
        const nomRue = aggregations[0].rue;
        lampadairesEl.innerHTML = `Selon les informations fournies par la ville de Paris, il y a <span style="color:#1de9b6; font-weight:600">${nombreLampadaires}</span> lampadaires à <span style="color:#1de9b6; font-weight:600">${nomRue}</span>.`;
      }
    })

    .catch((error) => {
      console.error(error);
    });
});
