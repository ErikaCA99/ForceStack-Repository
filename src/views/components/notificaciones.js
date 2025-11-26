/* global io */

// Sistema de Notificaciones - Mínimo y Funcional
(function() {
    const socket = io("http://localhost:3000");
    let notificaciones = [];

    function init() {
        createContainer();
        setupSocket();
    }

    function createContainer() {
        if (document.getElementById("notificaciones-container")) return;

        const container = document.createElement("div");
        container.id = "notificaciones-container";
        container.innerHTML = `
            <div style="position:fixed; top:20px; right:20px; background:white; padding:15px; border-radius:10px; box-shadow:0 2px 10px rgba(0,0,0,0.2); width:250px; z-index:9999; max-height:400px; overflow-y:auto;">
                <h4 style="margin:0 0 10px 0;">🔔 Notificaciones</h4>
                <div id="notificaciones-list"></div>
            </div>
        `;
        document.body.appendChild(container);
    }

    function setupSocket() {
        socket.on("notificacion", (data) => {
            addNotification(data.mensaje);
        });

        socket.on("connect", () => {
            addNotification("Conectado ✅");
        });
    }

    function addNotification(mensaje) {
        notificaciones.unshift(mensaje);
        if (notificaciones.length > 5) notificaciones = notificaciones.slice(0, 5);
        
        const list = document.getElementById("notificaciones-list");
        if (list) {
            list.innerHTML = notificaciones.map(msg => 
                `<div style="padding:8px; margin-bottom:5px; background:#f5f5f5; border-radius:5px; font-size:14px;">${msg}</div>`
            ).join("");
        }
    }

    // Inicializar
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    window.addNotification = addNotification;

})();