/* global refreshSidebar, loadLesson */
import { courseData } from "./courseData.js";

function findLesson(id) {
  for (let module of courseData) {
    const lesson = module.lessons.find((l) => l.id === id);
    if (lesson) return lesson;
  }
  return null;
}

export function loadLesson(lessonId) {
  const lesson = findLesson(lessonId);
  const container = document.getElementById("lesson-content");

  if (
    localStorage.getItem("intro-python_completed") === "true" &&
    localStorage.getItem("install_completed") === "true" &&
    localStorage.getItem("hola-mundo_completed") === "true" &&
    localStorage.getItem("variables_completed") === "true" &&
    localStorage.getItem("tipos-imagen_completed") === "true" &&
    localStorage.getItem("quiz1_completed") === "true" &&
    localStorage.getItem("final-exam_completed") === "true"
  ) {
    document.getElementById("lesson-content").innerHTML =
      renderModuleCompleted();
    return;
  }

  if (lessonId === "overview") {
    document.getElementById("lesson-content").innerHTML = renderOverview();
    return;
  }

  if (!lesson) {
    container.innerHTML = "<p>Error: Lección no encontrada.</p>";
    return;
  }

  if (lesson.type === "text") {
    container.innerHTML = renderTextLesson(lessonId);
  }

  if (lesson.type === "image") {
    container.innerHTML = renderImageLesson();
  }

  if (lesson.type === "quiz") {
    container.innerHTML = renderQuiz(lessonId);
  }

  if (lesson.type === "exam") {
    container.innerHTML = renderFinalExam();
  }
}


function renderTextLesson(id) {
  if (id === "intro-python") {
    return `
      <section class="section">
        <div class="section-header"><h1>¿Qué es Python?</h1></div>

        <div class="content-block">
          <h2>Un lenguaje moderno y poderoso</h2>
          <p>
            <strong>Python</strong> es un lenguaje de programación <em>interpretado, multiplataforma y de alto nivel</em>,
            creado por <strong>Guido van Rossum</strong> y lanzado en 1991.
            Su principal característica es que prioriza la legibilidad del código y su facilidad de uso.
          </p>
          <p>
            A diferencia de otros lenguajes, Python permite escribir programas de forma clara,
            usando una sintaxis simple basada en indentación, lo que lo convierte en uno de los lenguajes
            más amigables para aprender a programar.
          </p>

          <h2>¿Por qué es tan popular hoy?</h2>
          <ul>
            <li>Sintaxis simple (ideal para principiantes)</li>
            <li>Gran comunidad y miles de librerías</li>
            <li>Útil para IA, web, automatización, análisis de datos, videojuegos y más</li>
            <li>Funciona en Windows, Linux y macOS sin cambios en el código</li>
          </ul>

          <h2>El Zen de Python</h2>
          <p>Python tiene una filosofía interna llamada <em>“The Zen of Python”</em>, que incluye principios como:</p>
          <ul>
            <li><strong>Simple es mejor que complejo.</strong></li>
            <li><strong>Explícito es mejor que implícito.</strong></li>
            <li><strong>La legibilidad importa.</strong></li>
          </ul>

          <h2>Áreas donde Python domina</h2>
          <ul>
            <li>Inteligencia Artificial y Machine Learning</li>
            <li>Automatización</li>
            <li>Aplicaciones web</li>
            <li>Ciencia de datos</li>
            <li>Ciberseguridad</li>
          </ul>
        </div>

        <!-- QUIZ DE ESTA LECCIÓN -->
        <div class="content-block">
          <h2>Quiz: Refuerzo de conocimientos</h2>

          <p><strong>1. ¿Qué tipo de lenguaje es Python?</strong></p>
          <label><input type="radio" name="q1" value="a"> Compilado</label><br>
          <label><input type="radio" name="q1" value="b"> Interpretado</label><br>
          <label><input type="radio" name="q1" value="c"> Ensamblador</label><br>

          <p><strong>2. Python fue creado por Guido van Rossum. (V/F)</strong></p>
          <label><input type="radio" name="q2" value="v"> Verdadero</label><br>
          <label><input type="radio" name="q2" value="f"> Falso</label><br>

          <p><strong>3. Menciona una razón por la que Python es tan popular hoy en día.</strong></p>
          <textarea id="q3" placeholder="Escribe tu respuesta aquí" style="width:100%; height:80px;"></textarea>

          <button onclick="gradeIntroPython()">Enviar respuestas</button>
        </div>
      </section>
    `;
  }

  if (id === "install") {
    return `
        <section class="section">

        <div class="section-header">
            <h1>Instalación y Configuración del Entorno</h1>
        </div>

        <div class="content-block">
            <h2>1. Descargando Python</h2>
            <p>
            Para instalar Python en tu computadora, visita el sitio oficial:
            <a href="https://www.python.org/downloads/" target="_blank"><strong>python.org</strong></a>.
            </p>
            <ul>
            <li>Compatible con Windows, Linux y macOS.</li>
            <li>Incluye el intérprete de Python y herramientas básicas.</li>
            <li>Recomendación: Instalar la versión estable más reciente.</li>
            </ul>

            <h2>2. Verificar instalación</h2>
            <p>Después de instalar, abre tu terminal o consola y escribe:</p>
            <pre class="code-snippet">python --version</pre>
            <p>Deberías ver algo como:</p>
            <pre class="code-snippet">Python 3.xx.x</pre>

            <h2>3. Editores recomendados</h2>
            <ul>
            <li><strong>VS Code</strong> (ligero, rápido y con soporte para Python).</li>
            <li><strong>PyCharm</strong> (más avanzado, ideal para proyectos grandes).</li>
            <li><strong>Jupyter Notebook</strong> (excelente para ciencia de datos).</li>
            </ul>

            <h2>4. Primeros pasos en VS Code</h2>
            <ol>
            <li>Abre VS Code</li>
            <li>Instala la extensión "Python" de Microsoft</li>
            <li>Crea un archivo <code>.py</code></li>
            <li>Escribe tu primer comando</li>
            </ol>

            <pre class="code-snippet">print("Instalación completa ")</pre>

        </div>

        <!-- QUIZ -->
        <div class="content-block">
            <h2>Quiz: Instalación y entorno</h2>

            <p><strong>1. ¿Qué comando se usa para ver la versión instalada de Python?</strong></p>
            <label><input type="radio" name="qi1" value="a"> python --version</label><br>
            <label><input type="radio" name="qi1" value="b"> python version</label><br>
            <label><input type="radio" name="qi1" value="c"> py --install</label><br>

            <p><strong>2. Python requiere compilación para ejecutarse. (V/F)</strong></p>
            <label><input type="radio" name="qi2" value="v"> Verdadero</label><br>
            <label><input type="radio" name="qi2" value="f"> Falso</label><br>

            <p><strong>3. ¿Qué editor te gustaría usar para programar en Python y por qué?</strong></p>
            <textarea id="qi3" placeholder="Escribe tu respuesta aquí" style="width:100%; height:80px;"></textarea>

            <button onclick="gradeInstallLesson()">Enviar respuestas</button>
        </div>

        </section>
    `;
  }

  if (id === "hola-mundo") {
    return `
        <section class="section">

        <div class="section-header">
            <h1>Tu primer programa en Python: "Hola Mundo"</h1>
        </div>

        <div class="content-block">
            <h2>1. Introducción al primer programa</h2>
            <p>
            Tradicionalmente, cuando se aprende un nuevo lenguaje de programación, el primer programa que se escribe es el famoso 
            <strong>"Hola Mundo"</strong>.  
            Este programa simplemente muestra un mensaje en la pantalla, pero marca el inicio oficial de tu camino como programador/a.
            </p>

            <h2>2. El comando <code>print()</code></h2>
            <p>
            En Python, usamos la función <code>print()</code> para mostrar información en pantalla.  
            Esta función recibe un texto o valor y lo imprime en la consola.
            </p>

            <pre class="code-snippet">print("Hola Mundo")</pre>

            <p>
            Cuando ejecutas este código, Python muestra exactamente el texto que está entre comillas.
            </p>

            <h2>3. Ejecutando el programa</h2>
            <p>Puedes ejecutar tu archivo <code>.py</code> de dos formas:</p>
            <ul>
            <li>Desde una terminal:</li>
            </ul>

            <pre class="code-snippet">python hola_mundo.py</pre>

            <ul>
            <li>Desde VS Code presionando <strong>Run ▶</strong></li>
            </ul>

            <h2>4. Experimenta cambiando el mensaje</h2>
            <p>Prueba modificar el texto:</p>

            <pre class="code-snippet">print("Mi nombre es Alex")</pre>

        </div>

        <!-- QUIZ DE LA LECCIÓN -->
        <div class="content-block">
            <h2>Quiz: Hola Mundo</h2>

            <p><strong>1. ¿Qué función se usa para imprimir texto en Python?</strong></p>
            <label><input type="radio" name="qh1" value="a"> echo()</label><br>
            <label><input type="radio" name="qh1" value="b"> print()</label><br>
            <label><input type="radio" name="qh1" value="c"> write()</label><br>

            <p><strong>2. El código <code>print("Hola")</code> mostrará Hola en pantalla. (V/F)</strong></p>
            <label><input type="radio" name="qh2" value="v"> Verdadero</label><br>
            <label><input type="radio" name="qh2" value="f"> Falso</label><br>

            <p><strong>3. Escribe un comando print que muestre tu edad:</strong></p>
            <textarea id="qh3" placeholder="Ej: print(20)" style="width:100%; height:80px;"></textarea>

            <button onclick="gradeHolaMundo()">Enviar respuestas</button>
        </div>

        </section>
    `;
  }

  if (id === "variables") {
    return `
        <section class="section">

        <div class="section-header">
            <h1>Variables y Tipos de Datos en Python</h1>
        </div>

        <div class="content-block">
            <h2>1. ¿Qué es una variable?</h2>
            <p>
            Una <strong>variable</strong> es un nombre que almacena un valor dentro de la memoria del programa.
            Puedes pensar en una variable como una “caja” donde guardas un dato que luego podrás usar.
            </p>

            <pre class="code-snippet">
    nombre = "Griss"
    edad = 23
    pi = 3.1416
    activo = True
            </pre>

            <p>
            En Python, no necesitas indicar el tipo; Python lo detecta automáticamente.
            </p>

            <h2>2. Tipos de datos básicos</h2>
            <ul>
            <li><strong>int</strong> → números enteros (23, -5, 100)</li>
            <li><strong>float</strong> → números decimales (3.14, 2.0)</li>
            <li><strong>str</strong> → cadenas de texto ("Hola", "Python")</li>
            <li><strong>bool</strong> → booleanos (True, False)</li>
            </ul>

            <h2>3. Tipos de datos compuestos</h2>
            <ul>
            <li><strong>list</strong> → lista de valores: <code>[1, 2, 3]</code></li>
            <li><strong>tuple</strong> → lista inmutable: <code>(4, 5, 6)</code></li>
            <li><strong>dict</strong> → clave-valor: <code>{"nombre": "Alex", "edad": 20}</code></li>
            </ul>

            <h2>4. Tipado dinámico en Python</h2>
            <p>Python permite cambiar el tipo de una variable simplemente asignándole un nuevo valor:</p>

            <pre class="code-snippet">
    x = 10      # x es entero
    x = "Hola"  # x ahora es cadena
            </pre>

            <h2>5. Errores comunes con variables</h2>
            <ul>
            <li>No usar comillas en cadenas de texto</li>
            <li>Olvidar mayúsculas/minúsculas (Python distingue entre ellas)</li>
            <li>Reemplazar variables sin darte cuenta</li>
            </ul>
        </div>

        <!-- QUIZ DE LA LECCIÓN -->
        <div class="content-block">
            <h2>Quiz: Variables y tipos</h2>

            <p><strong>1. ¿Cuál de los siguientes NO es un tipo de dato básico en Python?</strong></p>
            <label><input type="radio" name="qv1" value="a"> int</label><br>
            <label><input type="radio" name="qv1" value="b"> float</label><br>
            <label><input type="radio" name="qv1" value="c"> character</label><br>

            <p><strong>2. Python es un lenguaje de tipado dinámico. (V/F)</strong></p>
            <label><input type="radio" name="qv2" value="v"> Verdadero</label><br>
            <label><input type="radio" name="qv2" value="f"> Falso</label><br>

            <p><strong>3. Escribe una variable llamada <code>edad</code> con tu edad real:</strong></p>
            <textarea id="qv3" placeholder='Ej: edad = 23' style="width:100%; height:80px;"></textarea>

            <button onclick="gradeVariables()">Enviar respuestas</button>
        </div>

        </section>
    `;
  }
}

function renderImageLesson() {
  return `
    <section class="section">

      <div class="section-header">
        <h1>Infografía: Tipos de Datos en Python</h1>
      </div>

      <div class="content-block">
        <p>
          En Python existen diferentes tipos de datos que permiten almacenar información según su naturaleza.
          Esta infografía resume los principales tipos que verás a lo largo de tu aprendizaje:
        </p>

        <img class="content-image" 
             src="https://cdn.programiz.com/sites/tutorial2program/files/python-data-types.jpg" 
             alt="Tipos de datos en Python"/>

        <h2>Explicación de los principales tipos</h2>
        <ul>
          <li><strong>int</strong> → números enteros (ej: 10, -3, 200)</li>
          <li><strong>float</strong> → números decimales (ej: 3.14, 2.0)</li>
          <li><strong>str</strong> → cadenas de texto ("Python")</li>
          <li><strong>bool</strong> → valores lógicos (True o False)</li>
          <li><strong>list</strong> → colecciones ordenadas y mutables (ej: [1,2,3])</li>
          <li><strong>tuple</strong> → colecciones ordenadas e inmutables (ej: (1,2,3))</li>
          <li><strong>dict</strong> → estructura clave-valor (ej: {"nombre": "Griss"})</li>
        </ul>

        <p>
          La elección del tipo adecuado es importante para procesar datos correctamente y evitar errores.
        </p>
      </div>

      <!-- QUIZ -->
      <div class="content-block">
        <h2>Quiz: Tipos de Datos</h2>

        <p><strong>1. ¿Cuál de las siguientes estructuras es inmutable?</strong></p>
        <label><input type="radio" name="qt1" value="a"> list</label><br>
        <label><input type="radio" name="qt1" value="b"> tuple</label><br>
        <label><input type="radio" name="qt1" value="c"> dict</label><br>

        <p><strong>2. Una lista puede modificarse después de ser creada. (V/F)</strong></p>
        <label><input type="radio" name="qt2" value="v"> Verdadero</label><br>
        <label><input type="radio" name="qt2" value="f"> Falso</label><br>

        <p><strong>3. ¿Para qué usarías un diccionario en Python?</strong></p>
        <textarea id="qt3" placeholder="Ej: Para guardar datos por claves" 
                  style="width:100%; height:80px;"></textarea>

        <button onclick="gradeTipos()">Enviar respuestas</button>
      </div>

    </section>
  `;
}

function renderQuiz(id) {
  if (id === "quiz1") {
    return `
      <section class="section">

        <div class="section-header">
          <h1>Checkpoint 1 — Fundamentos de Python</h1>
        </div>

        <div class="content-block">
          <p>
            Este checkpoint evalúa tus conocimientos fundamentales antes de avanzar.
            Responde las siguientes preguntas:
          </p>

          <h2>1. ¿Cuál de las siguientes opciones describe mejor a Python?</h2>
          <label><input type="radio" name="cq1" value="a"> Un lenguaje compilado y de bajo nivel</label><br>
          <label><input type="radio" name="cq1" value="b"> Un lenguaje interpretado, fácil de aprender y multiplataforma</label><br>
          <label><input type="radio" name="cq1" value="c"> Un sistema operativo basado en Linux</label><br>

          <h2>2. El comando <code>python --version</code> sirve para verificar la versión instalada. (V/F)</h2>
          <label><input type="radio" name="cq2" value="v"> Verdadero</label><br>
          <label><input type="radio" name="cq2" value="f"> Falso</label><br>

          <h2>3. Escribe un ejemplo válido de una variable en Python:</h2>
          <textarea id="cq3" placeholder='Ej: nombre = "Griss"' 
                    style="width:100%; height:80px;"></textarea>

          <button onclick="gradeCheckpoint1()">Enviar respuestas</button>
        </div>

      </section>
    `;
  }

  return `
    <section class="section">
      <div class="content-block">
        <p>No hay un quiz configurado para esta lección.</p>
      </div>
    </section>
  `;
}

function renderFinalExam() {
  return `
    <section class="section">

      <div class="section-header">
        <h1>Evaluación Final del Módulo: Fundamentos de Python</h1>
      </div>

      <div class="content-block">
        <p>
          Esta evaluación determinará si dominas los conceptos básicos de Python.
          Debes responder correctamente al menos <strong>4 de 6</strong> preguntas para aprobar.
        </p>

        <h2>1. ¿Qué función se usa para imprimir texto en Python?</h2>
        <label><input type="radio" name="fe1" value="a"> echo()</label><br>
        <label><input type="radio" name="fe1" value="b"> print()</label><br>
        <label><input type="radio" name="fe1" value="c"> write()</label><br>

        <h2>2. Python es un lenguaje…</h2>
        <label><input type="radio" name="fe2" value="a"> Compilado</label><br>
        <label><input type="radio" name="fe2" value="b"> Interpretado</label><br>
        <label><input type="radio" name="fe2" value="c"> Basado en hardware</label><br>

        <h2>3. El comando <code>python --version</code> sirve para ver la versión instalada. (V/F)</h2>
        <label><input type="radio" name="fe3" value="v"> Verdadero</label><br>
        <label><input type="radio" name="fe3" value="f"> Falso</label><br>

        <h2>4. ¿Qué tipo de dato es <code>[1,2,3]</code>?</h2>
        <label><input type="radio" name="fe4" value="a"> list</label><br>
        <label><input type="radio" name="fe4" value="b"> tuple</label><br>
        <label><input type="radio" name="fe4" value="c"> dict</label><br>

        <h2>5. En Python, la variable <code>x = "Hola"</code> es de tipo:</h2>
        <label><input type="radio" name="fe5" value="a"> str</label><br>
        <label><input type="radio" name="fe5" value="b"> int</label><br>
        <label><input type="radio" name="fe5" value="c"> float</label><br>

        <h2>6. Escribe un ejemplo válido de variable en Python:</h2>
        <textarea id="fe6" placeholder='Ej: mensaje = "Hola"' 
                  style="width:100%; height:80px;"></textarea>

        <button onclick="gradeFinalExam()">Enviar evaluación</button>
      </div>

    </section>
  `;
}

//Registra progreso
window.completeLesson = function (lessonId) {
  localStorage.setItem(`${lessonId}_completed`, true);
  unlockNextLesson(lessonId); 
  alert("¡Bien hecho! La siguiente lección se ha desbloqueado.");
};

//sección 1
window.gradeIntroPython = function () {
  const q1 = document.querySelector("input[name=\"q1\"]:checked")?.value;
  const q2 = document.querySelector("input[name=\"q2\"]:checked")?.value;
  const q3 = document.getElementById("q3").value.trim();

  if (!q1 || !q2 || q3 === "") {
    alert("Por favor responde todas las preguntas.");
    return;
  }

  let score = 0;

  if (q1 === "b") score++; //interpretado
  if (q2 === "v") score++; //verdadero
  if (q3.length >= 10) score++; //respuesta mínima

  if (score < 2) {
    alert(
      "Has obtenido un puntaje bajo. Repite la lección y vuelve a intentarlo."
    );
    return;
  }

  localStorage.setItem("intro-python_completed", true);
  refreshSidebar();
  unlockNextLesson("intro-python");
  alert(
    "¡Excelente! Has completado la lección. La siguiente lección fue desbloqueada."
  );
};

//seciion2
window.gradeInstallLesson = function () {
  const q1 = document.querySelector("input[name=\"qi1\"]:checked")?.value;
  const q2 = document.querySelector("input[name=\"qi2\"]:checked")?.value;
  const q3 = document.getElementById("qi3").value.trim();

  if (!q1 || !q2 || q3 === "") {
    alert("Responde todas las preguntas antes de continuar.");
    return;
  }

  let score = 0;

  if (q1 === "a") score++; //python --version
  if (q2 === "f") score++; //Falso
  if (q3.length >= 10) score++; //respuesta válida

  if (score < 2) {
    alert("Puntaje insuficiente. Revisa la lección y vuelve a intentarlo.");
    return;
  }

  localStorage.setItem("install_completed", true);
  refreshSidebar();
  unlockNextLesson("install");
  alert(
    "¡Muy bien! Has completado la lección. La siguiente lección fue desbloqueada."
  );
};

//sección 3
window.gradeHolaMundo = function () {
  const q1 = document.querySelector("input[name=\"qh1\"]:checked")?.value;
  const q2 = document.querySelector("input[name=\"qh2\"]:checked")?.value;
  const q3 = document.getElementById("qh3").value.trim();

  if (!q1 || !q2 || q3 === "") {
    alert("Por favor completa todas las respuestas.");
    return;
  }

  let score = 0;

  if (q1 === "b") score++; //print()
  if (q2 === "v") score++; //verdadero
  if (q3.includes("print")) score++; //respuesta válida

  if (score < 2) {
    alert(
      "Tu puntaje no es suficiente. Revisa la lección y vuelve a intentarlo."
    );
    return;
  }

  localStorage.setItem("hola-mundo_completed", true);
  refreshSidebar();
  unlockNextLesson("hola-mundo");
  alert(
    "¡Perfecto! Has completado la lección. La siguiente ya está desbloqueada."
  );
};

//seccion4
window.gradeVariables = function () {
  const q1 = document.querySelector("input[name=\"qv1\"]:checked")?.value;
  const q2 = document.querySelector("input[name=\"qv2\"]:checked")?.value;
  const q3 = document.getElementById("qv3").value.trim();

  if (!q1 || !q2 || q3 === "") {
    alert("Por favor completa todas las preguntas.");
    return;
  }

  let score = 0;

  if (q1 === "c") score++; //character NO existe en Python
  if (q2 === "v") score++; //verdadero
  if (q3.includes("edad")) score++; //respuesta aceptable

  if (score < 2) {
    alert("Puntaje insuficiente. Revisa la lección y vuelve a intentarlo.");
    return;
  }

  localStorage.setItem("variables_completed", true);
  refreshSidebar();
  unlockNextLesson("variables");
  alert(
    "¡Perfecto! Has completado la lección. La siguiente ya está desbloqueada."
  );
};

//sección 5
window.gradeTipos = function () {
  const q1 = document.querySelector("input[name=\"qt1\"]:checked")?.value;
  const q2 = document.querySelector("input[name=\"qt2\"]:checked")?.value;
  const q3 = document.getElementById("qt3").value.trim();

  if (!q1 || !q2 || q3 === "") {
    alert("Responde todas las preguntas antes de continuar.");
    return;
  }

  let score = 0;

  if (q1 === "b") score++; //tuple
  if (q2 === "v") score++; //Verdadero
  if (q3.length >= 5) score++; //respuesta válida

  if (score < 2) {
    alert("Puntaje insuficiente. Revisa la lección y vuelve a intentarlo.");
    return;
  }

  localStorage.setItem("tipos-imagen_completed", true);
  refreshSidebar();
  unlockNextLesson("tipos-imagen");
  alert("¡Excelente! La siguiente lección está desbloqueada.");
};

//quiz
window.gradeCheckpoint1 = function () {
  const q1 = document.querySelector("input[name=\"cq1\"]:checked")?.value;
  const q2 = document.querySelector("input[name=\"cq2\"]:checked")?.value;
  const q3 = document.getElementById("cq3").value.trim();

  if (!q1 || !q2 || q3 === "") {
    alert("Responde todas las preguntas antes de continuar.");
    return;
  }

  let score = 0;

  if (q1 === "b") score++; //Python: interpretado y fácil
  if (q2 === "v") score++; //Verdadero
  if (q3.includes("=")) score++; //variable válida

  if (score < 2) {
    alert(
      "Necesitas reforzar los contenidos. Revisa las lecciones e inténtalo de nuevo."
    );
    return;
  }

  localStorage.setItem("quiz1_completed", true);
  refreshSidebar();
  unlockNextLesson("quiz1");
  alert(
    "¡Excelente! Has aprobado el checkpoint. La evaluación final fue desbloqueada."
  );
};

//Final
window.gradeFinalExam = function () {
  const q1 = document.querySelector("input[name=\"fe1\"]:checked")?.value;
  const q2 = document.querySelector("input[name=\"fe2\"]:checked")?.value;
  const q3 = document.querySelector("input[name=\"fe3\"]:checked")?.value;
  const q4 = document.querySelector("input[name=\"fe4\"]:checked")?.value;
  const q5 = document.querySelector("input[name=\"fe5\"]:checked")?.value;
  const q6 = document.getElementById("fe6").value.trim();

  if (!q1 || !q2 || !q3 || !q4 || !q5 || q6 === "") {
    alert("Por favor completa todas las respuestas.");
    return;
  }

  let score = 0;

  if (q1 === "b") score++; //print()
  if (q2 === "b") score++; //interpretado
  if (q3 === "v") score++; //verdadero
  if (q4 === "a") score++; //list
  if (q5 === "a") score++; //str
  if (q6.includes("=")) score++; //respuesta válida

  if (score < 4) {
    alert(
      "No alcanzaste el puntaje mínimo. Revisa las lecciones y vuelve a intentarlo."
    );
    return;
  }

  localStorage.setItem("final-exam_completed", true);
  refreshSidebar();
  unlockNextLesson("final-exam");
  alert("¡Felicidades! Has completado el Módulo 1: Fundamentos de Python.");
};

function renderModuleCompleted() {
  return `
    <section class="section">

      <div class="section-header">
        <h1>¡Módulo completado!</h1>
      </div>

      <div class="content-block">

        <h2>Has completado el Módulo 1: Fundamentos de Python</h2>
        <p>
          ¡Felicidades, has dominado los conceptos esenciales para comenzar a programar en Python!
          Aprendiste desde qué es Python hasta variables, tipos de datos, impresión de mensajes
          y conceptos fundamentales que te acompañarán en todos tus futuros proyectos.
        </p>

        <h3>Progreso del módulo</h3>
        <div class="progress-bar-custom">
          <div class="progress-bar-fill" style="width: 100%;"></div>
        </div>

        <p style="margin-top: 15px;">
          Ahora estás listo/a para avanzar al siguiente tópico:
          <strong>Estructuras de Datos</strong>
        </p>

        <button onclick="goToNextTopic()">Continuar al siguiente tópico</button>

      </div>
    </section>
  `;
}

window.goToNextTopic = function () {
  alert("Aquí iría el Tópico 2: Estructuras de Datos");
};

function renderOverview() {
  return `
    <section class="topic-banner">

      <div class="banner-header">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python Logo">
        <div>
          <h1>Fundamentos de Python</h1>
          <p class="subtitle">Tu primer acercamiento profesional al lenguaje más usado del mundo.</p>
        </div>
      </div>

      <div class="banner-body">
        <p>
          En este módulo conocerás los pilares esenciales de Python: qué es, cómo funciona,
          cómo instalarlo, cómo ejecutar tus primeros programas, variables, tipos de datos,
          estructuras básicas y más.
        </p>

        <p>
          A medida que completes las lecciones, irás desbloqueando contenidos nuevos,
          infografías visuales, un checkpoint interactivo y la evaluación final del módulo.
        </p>

        <div class="banner-badge">
          <span class="badge">Nivel: Principiante</span>
          <span class="badge">Duración aproximada: 1 hora</span>
          <span class="badge">Incluye evaluación final ✔</span>
        </div>
      </div>

    </section>
  `;
}

function unlockNextLesson(currentId) {
  let flatLessons = courseData[0].lessons;
  let index = flatLessons.findIndex((l) => l.id === currentId);
  let nextLesson = flatLessons[index + 1];
  if (!nextLesson) return;

  localStorage.setItem(`${nextLesson.id}_unlocked`, "true");

  refreshSidebar();

  const nextLink = document.querySelector(
    `.lesson-link[data-id="${nextLesson.id}"]`
  );
  nextLink?.classList.add("active");

  loadLesson(nextLesson.id);
}

window.loadLesson = loadLesson;
