async function loadNavbar() {
  try {
    const response = await fetch("/components/navbar.html");
    const navbarHTML = await response.text();

    const navbarPlaceholder = document.getElementById("navbar-placeholder");
    if (navbarPlaceholder) {
      navbarPlaceholder.innerHTML = navbarHTML;
    }

    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      const profile = document.getElementById("userProfile");

      if (profile) {
        const photo = userData.photo || "https://via.placeholder.com/40";
        const name = userData.name || "Usuario";

        profile.innerHTML = `
          <img 
            src="${photo}" 
            alt="Perfil de ${name}" 
            title="${name}"
          >
        `;
      }
    }
  } catch (error) {
    console.error("Error al cargar el navbar:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadNavbar);