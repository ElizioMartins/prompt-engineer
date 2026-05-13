import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

/**
 * GET /api/templates
 * Lista todos os templates (opcionalmente filtrados por categoria)
 */
router.get('/', async (req, res) => {
  try {
    const { categoria } = req.query;
    
    let query = 'SELECT * FROM templates';
    const params = [];
    
    if (categoria) {
      query += ' WHERE categoria = ?';
      params.push(categoria);
    }
    
    query += ' ORDER BY nome ASC';
    
    const [rows] = await pool.query(query, params);
    
    res.json({
      success: true,
      total: rows.length,
      categoria: categoria || 'todas',
      templates: rows
    });
  } catch (error) {
    console.error('Erro ao listar templates:', error);
    res.status(500).json({ erro: error.message });
  }
});

/**
 * GET /api/templates/categorias
 * Lista todas as categorias disponíveis
 */
router.get('/categorias', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT DISTINCT categoria FROM templates WHERE categoria IS NOT NULL ORDER BY categoria'
    );
    
    const categorias = rows.map(row => row.categoria);
    
    res.json({
      success: true,
      total: categorias.length,
      categorias: categorias
    });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({ erro: error.message });
  }
});

/**
 * GET /api/templates/:id
 * Busca um template específico por ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.query(
      'SELECT * FROM templates WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ 
        erro: 'Template não encontrado',
        id: id
      });
    }
    
    res.json({
      success: true,
      template: rows[0]
    });
  } catch (error) {
    console.error('Erro ao buscar template:', error);
    res.status(500).json({ erro: error.message });
  }
});

/**
 * POST /api/templates
 * Cria um novo template
 */
router.post('/', async (req, res) => {
  try {
    const {
      nome,
      descricao,
      taskContext,
      toneContext,
      backgroundData,
      detailedTask,
      examples,
      conversationHistory,
      immediateTask,
      thinkingStep,
      outputFormat,
      categoria
    } = req.body;

    // Validação
    if (!nome || nome.trim() === '') {
      return res.status(400).json({ 
        erro: 'Nome é obrigatório' 
      });
    }

    const [result] = await pool.query(
      `INSERT INTO templates 
      (nome, descricao, taskContext, toneContext, backgroundData, 
       detailedTask, examples, conversationHistory, immediateTask, 
       thinkingStep, outputFormat, categoria)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome,
        descricao || null,
        taskContext || null,
        toneContext || null,
        backgroundData || null,
        detailedTask || null,
        examples || null,
        conversationHistory || null,
        immediateTask || null,
        thinkingStep || null,
        outputFormat || null,
        categoria || null
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Template criado com sucesso',
      id: result.insertId
    });
  } catch (error) {
    console.error('Erro ao criar template:', error);
    res.status(500).json({ erro: error.message });
  }
});

/**
 * PUT /api/templates/:id
 * Atualiza um template existente
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nome,
      descricao,
      taskContext,
      toneContext,
      backgroundData,
      detailedTask,
      examples,
      conversationHistory,
      immediateTask,
      thinkingStep,
      outputFormat,
      categoria
    } = req.body;

    // Verificar se existe
    const [existing] = await pool.query(
      'SELECT id FROM templates WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ 
        erro: 'Template não encontrado',
        id: id
      });
    }

    await pool.query(
      `UPDATE templates SET
        nome = ?,
        descricao = ?,
        taskContext = ?,
        toneContext = ?,
        backgroundData = ?,
        detailedTask = ?,
        examples = ?,
        conversationHistory = ?,
        immediateTask = ?,
        thinkingStep = ?,
        outputFormat = ?,
        categoria = ?
      WHERE id = ?`,
      [
        nome,
        descricao || null,
        taskContext || null,
        toneContext || null,
        backgroundData || null,
        detailedTask || null,
        examples || null,
        conversationHistory || null,
        immediateTask || null,
        thinkingStep || null,
        outputFormat || null,
        categoria || null,
        id
      ]
    );

    res.json({
      success: true,
      message: 'Template atualizado com sucesso',
      id: id
    });
  } catch (error) {
    console.error('Erro ao atualizar template:', error);
    res.status(500).json({ erro: error.message });
  }
});

/**
 * DELETE /api/templates/:id
 * Deleta um template
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM templates WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        erro: 'Template não encontrado',
        id: id
      });
    }

    res.json({
      success: true,
      message: 'Template deletado com sucesso',
      id: id
    });
  } catch (error) {
    console.error('Erro ao deletar template:', error);
    res.status(500).json({ erro: error.message });
  }
});

export default router;
