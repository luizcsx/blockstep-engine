import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    try {
      await sql`INSERT INTO usuarios (username, email, password) VALUES (${username}, ${email}, ${password});`;
      return res.status(200).json({ message: 'Conta criada com sucesso!' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar conta.' });
    }
  } else {
    res.status(405).json({ message: 'Método não permitido' });
  }
}
