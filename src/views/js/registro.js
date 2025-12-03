// Script ligero para manejar registro de usuario
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");
  const loginLink = document.getElementById("loginLink");

  loginLink.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "/";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const contraseña = document.getElementById("contraseña").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!nombre || !apellido || !correo || !contraseña) {
      return alert("Por favor completa todos los campos.");
    }
    if (contraseña.length < 6)
      return alert("La contraseña debe tener al menos 6 caracteres.");
    if (contraseña !== confirmPassword)
      return alert("Las contraseñas no coinciden.");

    try {
      const resp = await fetch("/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, apellido, correo, contraseña }),
      });
      const data = await resp.json();
      if (resp.ok) {
        // Guardar token y redirigir al dashboard
        if (data.token) localStorage.setItem("token", data.token);
        window.location.href = "/dashboard";
      } else {
        alert(data.message || "Error en el registro");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor.");
    }
  });
});
