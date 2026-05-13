import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Script para inicializar o banco de dados
// Cria as 2 tabelas necessárias: prompts e templates

async function initDatabase() {
  let connection;
  
  try {
    // Conectar ao MySQL (sem especificar o banco)
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    console.log('✓ Conectado ao MySQL');

    // Criar banco de dados se não existir
    const dbName = process.env.DB_DATABASE || 'PromptEngineer';
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✓ Banco de dados '${dbName}' criado/verificado`);

    // Usar o banco de dados
    await connection.query(`USE ${dbName}`);

    // Criar tabela 'prompts'
    await connection.query(`
      CREATE TABLE IF NOT EXISTS prompts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        titulo VARCHAR(500) NOT NULL,
        taskContext TEXT,
        toneContext TEXT,
        backgroundData TEXT,
        detailedTask TEXT,
        examples TEXT,
        conversationHistory TEXT,
        immediateTask TEXT,
        thinkingStep TEXT,
        outputFormat TEXT,
        jsonOutput LONGTEXT,
        toonOutput LONGTEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_titulo (titulo(255)),
        INDEX idx_created (createdAt)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ Tabela "prompts" criada/verificada');

    // Criar tabela 'templates'
    await connection.query(`
      CREATE TABLE IF NOT EXISTS templates (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        taskContext TEXT,
        toneContext TEXT,
        backgroundData TEXT,
        detailedTask TEXT,
        examples TEXT,
        conversationHistory TEXT,
        immediateTask TEXT,
        thinkingStep TEXT,
        outputFormat TEXT,
        categoria VARCHAR(100),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_nome (nome),
        INDEX idx_categoria (categoria)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log('✓ Tabela "templates" criada/verificada');

    // Inserir templates de exemplo
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM templates');
    if (rows[0].count === 0) {
      await connection.query(`
        INSERT INTO templates 
        (nome, descricao, taskContext, toneContext, detailedTask, categoria) 
        VALUES 
        (
          'Code Generation', 
          'Template para geração de código', 
          'You are an expert software engineer', 
          'Professional, precise, well-documented',
          'Generate clean, efficient, and well-tested code following best practices',
          'development'
        ),
        (
          'Data Analysis', 
          'Template para análise de dados', 
          'You are a data scientist specialized in statistical analysis', 
          'Analytical, objective, data-driven',
          'Analyze the provided data and extract meaningful insights with statistical support',
          'analysis'
        ),
        (
          'Creative Writing', 
          'Template para escrita criativa', 
          'You are a creative writer with expertise in storytelling', 
          'Engaging, imaginative, descriptive',
          'Create compelling narratives with rich characters and vivid descriptions',
          'writing'
        )
      `);
      console.log('✓ Templates de exemplo inseridos');
    }

    console.log('\n✅ Inicialização do banco de dados concluída com sucesso!');
    console.log(`\n📊 Estrutura criada:`);
    console.log(`   - Banco: ${dbName}`);
    console.log(`   - Tabelas: prompts, templates`);
    console.log(`   - Templates de exemplo: 3 inseridos`);

  } catch (error) {
    console.error('\n❌ Erro ao inicializar banco de dados:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✓ Conexão fechada');
    }
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  initDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export default initDatabase;
