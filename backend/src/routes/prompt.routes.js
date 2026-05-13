import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

/**
 * GET /api/prompts
 * Lista todos os prompts salvos (mais recentes primeiro)
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM prompts ORDER BY createdAt DESC LIMIT 100'
    );
    
    res.json({
      success: true,
      total: rows.length,
      prompts: rows
    });
  } catch (error) {
    console.error('Erro ao listar prompts:', error);
    res.status(500).json({ erro: error.message });
  }
});

/**
 * GET /api/prompts/:id
 * Busca um prompt específico por ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.query(
      'SELECT * FROM prompts WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ 
        erro: 'Prompt não encontrado',
        id: id
      });
    }
    
    res.json({
      success: true,
      prompt: rows[0]
    });
  } catch (error) {
    console.error('Erro ao buscar prompt:', error);
    res.status(500).json({ erro: error.message });
  }
});

/**
 * POST /api/prompts
 * Cria um novo prompt
 */
router.post('/', async (req, res) => {
  try {
    const {
      titulo,
      taskContext,
      toneContext,
      backgroundData,
      detailedTask,
      examples,
      conversationHistory,
      immediateTask,
      thinkingStep,
      outputFormat,
      jsonOutput,
      toonOutput
    } = req.body;

    // Validação
    if (!titulo || titulo.trim() === '') {
      return res.status(400).json({ 
        erro: 'Título é obrigatório' 
      });
    }

    const [result] = await pool.query(
      `INSERT INTO prompts 
      (titulo, taskContext, toneContext, backgroundData, detailedTask, 
       examples, conversationHistory, immediateTask, thinkingStep, 
       outputFormat, jsonOutput, toonOutput)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        titulo,
        taskContext || null,
        toneContext || null,
        backgroundData || null,
        detailedTask || null,
        examples || null,
        conversationHistory || null,
        immediateTask || null,
        thinkingStep || null,
        outputFormat || null,
        jsonOutput || null,
        toonOutput || null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Prompt criado com sucesso',
      id: result.insertId
    });
  } catch (error) {
    console.error('Erro ao criar prompt:', error);
    res.status(500).json({ erro: error.message });
  }
});

/**
 * PUT /api/prompts/:id
 * Atualiza um prompt existente
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      titulo,
      taskContext,
      toneContext,
      backgroundData,
      detailedTask,
      examples,
      conversationHistory,
      immediateTask,
      thinkingStep,
      outputFormat,
      jsonOutput,
      toonOutput
    } = req.body;

    // Verificar se existe
    const [existing] = await pool.query(
      'SELECT id FROM prompts WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ 
        erro: 'Prompt não encontrado',
        id: id
      });
    }

    await pool.query(
      `UPDATE prompts SET
        titulo = ?,
        taskContext = ?,
        toneContext = ?,
        backgroundData = ?,
        detailedTask = ?,
        examples = ?,
        conversationHistory = ?,
        immediateTask = ?,
        thinkingStep = ?,
        outputFormat = ?,
        jsonOutput = ?,
        toonOutput = ?
      WHERE id = ?`,
      [
        titulo,
        taskContext || null,
        toneContext || null,
        backgroundData || null,
        detailedTask || null,
        examples || null,
        conversationHistory || null,
        immediateTask || null,
        thinkingStep || null,
        outputFormat || null,
        jsonOutput || null,
        toonOutput || null,
        id
      ]
    );

    res.json({
      success: true,
      message: 'Prompt atualizado com sucesso',
      id: id
    });
  } catch (error) {
    console.error('Erro ao atualizar prompt:', error);
    res.status(500).json({ erro: error.message });
  }
});

/**
 * DELETE /api/prompts/:id
 * Deleta um prompt
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM prompts WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        erro: 'Prompt não encontrado',
        id: id
      });
    }

    res.json({
      success: true,
      message: 'Prompt deletado com sucesso',
      id: id
    });
  } catch (error) {
    console.error('Erro ao deletar prompt:', error);
    res.status(500).json({ erro: error.message });
  }
});

export default router;
