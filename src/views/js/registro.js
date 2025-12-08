class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.fields = {
      nombre: document.getElementById("nombreError"),
      apellido: document.getElementById("apellidoError"),
      email: document.getElementById("email"),
      password: document.getElementById("password"),
      confirmPassword: document.getElementById("confirmPassword"),
    };
    this.errors = {
      nombre: document.getElementById("nombreError"),
      apellido: document.getElementById("apellidoError"),
      email: document.getElementById("emailError"),
      password: document.getElementById("passwordError"),
      confirmPassword: document.getElementById("confirmPasswordError"),
    };
    this.init();
  }

  init() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    // Validación en tiempo real
    Object.keys(this.fields).forEach((fieldName) => {
      this.fields[fieldName].addEventListener("blur", () => {
        this.validateField(fieldName);
      });

      this.fields[fieldName].addEventListener("input", () => {
        if (this.errors[fieldName].classList.contains("show")) {
          this.validateField(fieldName);
        }
      });
    });

    // Toggle password visibility
    this.setupPasswordToggles();
  }

  setupPasswordToggles() {
    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirmPassword = document.getElementById(
      "toggleConfirmPassword"
    );

    togglePassword.addEventListener("click", () => {
      this.togglePasswordVisibility("password", togglePassword);
    });

    toggleConfirmPassword.addEventListener("click", () => {
      this.togglePasswordVisibility("confirmPassword", toggleConfirmPassword);
    });
  }

  togglePasswordVisibility(fieldName, button) {
    const field = this.fields[fieldName];
    const type = field.type === "password" ? "text" : "password";
    field.type = type;

    const svg = button.querySelector("svg");
    if (type === "text") {
      svg.innerHTML =
        svg.innerHTML = "<path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21\" />";
    } else {
      svg.innerHTML =
        svg.innerHTML = "<path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\" /><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z\" />";
    }
  }

  validateField(fieldName) {
    const field = this.fields[fieldName];
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = "";

    switch (fieldName) {
      case "fullName":
        if (!value) {
          errorMessage = "El nombre completo es requerido.";
          isValid = false;
        } else if (value.length < 3) {
          errorMessage = "El nombre debe tener al menos 3 caracteres.";
          isValid = false;
        }
        break;

      case "email":{
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          errorMessage = "El correo electrónico es requerido.";
          isValid = false;
        } else if (!emailRegex.test(value)) {
          errorMessage = "Por favor ingresa un correo electrónico válido.";
          isValid = false;
        }
        break;
      }
      case "password":
        if (!value) {
          errorMessage = "La contraseña es requerida.";
          isValid = false;
        } else if (value.length < 6) {
          errorMessage = "La contraseña debe tener al menos 6 caracteres.";
          isValid = false;
        }
        // Revalidar confirmación si ya tiene valor
        if (this.fields.confirmPassword.value) {
          this.validateField("confirmPassword");
        }
        break;

      case "confirmPassword":
        if (!value) {
          errorMessage = "Debes confirmar tu contraseña.";
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
      field.classList.add("error");
      error.textContent = message;
      error.classList.add("show");
    } else {
      field.classList.remove("error");
      error.classList.remove("show");
    }
  }

  validateAll() {
    let isValid = true;
    Object.keys(this.fields).forEach((fieldName) => {
      if (!this.validateField(fieldName)) {
        isValid = false;
      }
    });
    return isValid;
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.validateAll()) {
      // Aquí iría la lógica para enviar los datos al servidor
      const formData = {
        fullName: this.fields.fullName.value.trim(),
        email: this.fields.email.value.trim(),
        password: this.fields.password.value,
      };

      console.log("Datos del formulario:", formData);
      alert("¡Registro exitoso! Los datos se han enviado correctamente.");

      // Opcional: reiniciar el formulario
      // this.form.reset();
    }
  }
}

// Inicializar el validador cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  new FormValidator("registrationForm");

  // Manejar el clic en "Inicia Sesión"
  document.getElementById("loginLink").addEventListener("click", (e) => {
    e.preventDefault();
    alert("Redirigiendo a la página de inicio de sesión...");
  });
});
