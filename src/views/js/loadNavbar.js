async function loadNavbar() {
  try {
    const response = await fetch("/components/Navbar.html");
    const navbarHTML = await response.text();

    document.getElementById("navbar-placeholder").innerHTML = navbarHTML;

    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      const profile = document.getElementById("userProfile");
      profile.innerHTML = `
        <img src="${userData.photo || 'https://via.placeholder.com/40'}" 
             alt="Perfil de ${userData.name}" title="${userData.name}">
      `;
    }
  } catch (error) {
    console.error("Error al cargar el navbar:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadNavbar);
