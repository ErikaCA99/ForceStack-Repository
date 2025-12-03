const pool = require("../config/database");

const versionController = {
  // 1. Obtener historial de versiones
  getVersionHistory: async (req, res) => {
    const { topicId } = req.params;
    try {
      const result = await pool.query(
        `SELECT v.id, v.version_num, v.change_log, v.created_at, u.nombre as autor
         FROM topic_versions v
         JOIN users u ON v.created_by = u.id
         WHERE v.topic_id = $1
         ORDER BY v.version_num DESC`,
        [topicId]
      );
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al obtener historial" });
    }
  },

  // 2. Obtener una versión específica por ID interno
  getVersionById: async (req, res) => {
    const { versionId } = req.params;
    try {
      const result = await pool.query(
        `SELECT * FROM topic_versions WHERE id = $1`,
        [versionId]
      );
      if (result.rows.length === 0)
        return res.status(404).json({ msg: "Versión no encontrada" });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Error de servidor" });
    }
  },

  // 3. Obtener versión por número (ej: Versión 2 del Tópico 5)
  getVersionByNumber: async (req, res) => {
    const { topicId, versionNum } = req.params;
    try {
      const result = await pool.query(
        `SELECT * FROM topic_versions WHERE topic_id = $1 AND version_num = $2`,
        [topicId, versionNum]
      );
      if (result.rows.length === 0)
        return res.status(404).json({ msg: "Versión no encontrada" });
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: "Error de servidor" });
    }
  },

  // 4. Comparar dos versiones (Diff lógico)
  compareVersions: async (req, res) => {
    const { topicId, version1, version2 } = req.params;
    try {
      // Obtenemos ambas versiones
      const v1Query = await pool.query(
        `SELECT content FROM topic_versions WHERE topic_id = $1 AND version_num = $2`,
        [topicId, version1]
      );
      const v2Query = await pool.query(
        `SELECT content FROM topic_versions WHERE topic_id = $1 AND version_num = $2`,
        [topicId, version2]
      );

      if (!v1Query.rows[0] || !v2Query.rows[0]) {
        return res.status(404).json({ msg: "Una de las versiones no existe" });
      }

      const contentV1 = v1Query.rows[0].content;
      const contentV2 = v2Query.rows[0].content;

      // Aquí realizamos una comparación básica.
      // Para un sistema real, usarías una librería como 'jsondiffpatch'
      // Esto devuelve solo los bloques que cambiaron.

      const comparisonResult = {
        versionA: version1,
        versionB: version2,
        // Simplificación: devolvemos ambos para que el frontend resalte cambios
        dataA: contentV1,
        dataB: contentV2,
        timestamp: new Date(),
      };

      res.json(comparisonResult);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error al comparar" });
    }
  },

  // 5. Restaurar una versión antigua
  restoreVersion: async (req, res) => {
    const { topicId, versionId } = req.params;
    const userId = req.user.id; // Asumiendo req.user por passport

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // A. Obtener el contenido de la versión antigua
      const oldVersionResult = await client.query(
        `SELECT content, version_num FROM topic_versions WHERE id = $1 AND topic_id = $2`,
        [versionId, topicId]
      );

      if (oldVersionResult.rows.length === 0) {
        throw new Error("Versión no encontrada");
      }

      const oldContent = oldVersionResult.rows[0].content;
      const restoredFromNum = oldVersionResult.rows[0].version_num;

      // B. Obtener el número de versión actual para crear la siguiente (N+1)
      const currentTopic = await client.query(
        `SELECT current_version FROM topics WHERE id = $1 FOR UPDATE`,
        [topicId]
      );

      const nextVersion = currentTopic.rows[0].current_version + 1;

      // C. Insertar nueva versión en el historial (snapshot)
      await client.query(
        `INSERT INTO topic_versions (topic_id, version_num, content, change_log, created_by)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          topicId,
          nextVersion,
          oldContent,
          `Restaurado desde versión ${restoredFromNum}`,
          userId,
        ]
      );

      // D. Actualizar el tópico "vivo"
      await client.query(
        `UPDATE topics 
         SET current_content = $1, current_version = $2, updated_at = NOW()
         WHERE id = $3`,
        [oldContent, nextVersion, topicId]
      );

      await client.query("COMMIT");

      // Notificar (opcional)
      await createNotification(
        userId,
        `Has restaurado el tópico a la versión ${restoredFromNum}`
      );

      res.json({
        msg: `Tópico restaurado exitosamente a la versión ${nextVersion}`,
      });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(err);
      res.status(500).json({ error: err.message });
    } finally {
      client.release();
    }
  },

  // 6. Notificaciones (Lógica básica)
  getNotifications: async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 20",
        [req.user.id]
      );
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: "Error fetching notifications" });
    }
  },

  markAsRead: async (req, res) => {
    /* Lógica simple de UPDATE */
  },
  markAllAsRead: async (req, res) => {
    /* Lógica simple de UPDATE */
  },
};

// Función auxiliar interna
async function createNotification(userId, message) {
  await pool.query(
    "INSERT INTO notifications (user_id, message) VALUES ($1, $2)",
    [userId, message]
  );
}

module.exports = versionController;
