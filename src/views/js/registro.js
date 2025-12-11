console.log("Registro.js cargado 🎉");
class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);

    this.fields = {
      nombre: document.getElementById("nombre"),
      apellido: document.getElementById("apellidos"),
      email: document.getElementById("email"),
      password: document.getElementById("password"),
      confirmPassword: document.getElementById("confirmPassword"),
    };

    this.errors = {
      nombre: document.getElementById("nombreError"),
      apellido: document.getElementById("apellidosError"),
      email: document.getElementById("emailError"),
      password: document.getElementById("passwordError"),
      confirmPassword: document.getElementById("confirmPasswordError"),
    };

    this.init();
  }

  init() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    Object.keys(this.fields).forEach((fieldName) => {
      this.fields[fieldName].addEventListener("blur", () =>
        this.validateField(fieldName)
      );

      this.fields[fieldName].addEventListener("input", () => {
        if (this.errors[fieldName].classList.contains("show")) {
          this.validateField(fieldName);
        }
      });
    });

    this.setupPasswordToggles();
  }

  setupPasswordToggles() {
    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

    togglePassword.addEventListener("click", () =>
      this.togglePasswordVisibility("password", togglePassword)
    );
    toggleConfirmPassword.addEventListener("click", () =>
      this.togglePasswordVisibility("confirmPassword", toggleConfirmPassword)
    );
  }

  togglePasswordVisibility(fieldName, button) {
    const field = this.fields[fieldName];
    field.type = field.type === "password" ? "text" : "password";
  }

  validateField(fieldName) {
    const value = this.fields[fieldName].value.trim();
    let errorMessage = "";
    let isValid = true;

    switch (fieldName) {
      case "nombre":
        if (!value) {
          errorMessage = "El nombre es requerido.";
          isValid = false;
        } else if (value.length < 2) {
          errorMessage = "Debe tener al menos 2 caracteres.";
          isValid = false;
        }
        break;

      case "apellido":
        if (!value) {
          errorMessage = "El apellido es requerido.";
          isValid = false;
        } else if (value.length < 2) {
          errorMessage = "Debe tener al menos 2 caracteres.";
          isValid = false;
        }
        break;

      case "email":
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          errorMessage = "El correo es requerido.";
          isValid = false;
        } else if (!regex.test(value)) {
          errorMessage = "Correo inválido.";
          isValid = false;
        }
        break;

      case "password":
        if (!value) {
          errorMessage = "La contraseña es requerida.";
          isValid = false;
        } else if (value.length < 6) {
          errorMessage = "Debe tener mínimo 6 caracteres.";
          isValid = false;
        }
        break;

      case "confirmPassword":
        if (!value) {
          errorMessage = "Debe confirmar la contraseña.";
          isValid = false;
        } else if (value !== this.fields.password.value) {
          errorMessage = "Las contraseñas no coinciden.";
          isValid = false;
        }
        break;
    }

    this.showError(fieldName, errorMessage, !isValid);
    return isValid;
  }

  showError(fieldName, message, show) {
    const field = this.fields[fieldName];
    const error = this.errors[fieldName];

    if (show) {
      error.textContent = message;
      error.classList.add("show");
    } else {
      error.classList.remove("show");
    }
  }

  validateAll() {
    return Object.keys(this.fields).every((f) => this.validateField(f));
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validateAll()) return;

    const userData = {
      nombre: this.fields.nombre.value.trim(),
      apellido: this.fields.apellido.value.trim(),
      correo: this.fields.email.value.trim(),
      contraseña: this.fields.password.value,
    };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("¡Registro exitoso!");
        window.location.href = "/";
      } else {
        alert(data.message || "Error al registrarse");
      }
    } catch (error) {
      alert("Error al conectar con el servidor");
      console.error(error);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new FormValidator("registrationForm");
});
