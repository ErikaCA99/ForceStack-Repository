const updateTopic = async (req, res) => {
  const client = await pool.connect();
  try {
    const { topicId } = req.params;
    const { newContent, changeLog } = req.body; // newContent es el JSON completo
    const userId = req.user.id;

    await client.query("BEGIN");

    // 1. Obtener versión actual
    const topicRes = await client.query(
      "SELECT current_version FROM topics WHERE id = $1",
      [topicId]
    );
    const nextVersion = topicRes.rows[0].current_version + 1;

    // 2. Guardar en el historial
    await client.query(
      `INSERT INTO topic_versions (topic_id, version_num, content, change_log, created_by)
             VALUES ($1, $2, $3, $4, $5)`,
      [
        topicId,
        nextVersion,
        newContent,
        changeLog || "Actualización regular",
        userId,
      ]
    );

    // 3. Actualizar tabla principal
    await client.query(
      "UPDATE topics SET current_content = $1, current_version = $2, updated_at = NOW() WHERE id = $3",
      [newContent, nextVersion, topicId]
    );

    await client.query("COMMIT");
    res.json({
      message: "Tópico actualizado y versión guardada",
      newVersion: nextVersion,
    });
  } catch (e) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: e.message });
  } finally {
    client.release();
  }
};
