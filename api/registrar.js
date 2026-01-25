import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { username, email, password } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    try {
        // 1. Verifica se o IP está banido antes de qualquer coisa
        const blacklist = await sql`SELECT * FROM blacklist_ips WHERE ip = ${ip}`;
        if (blacklist.rowCount > 0) {
            return res.status(403).json({ error: 'Seu acesso foi negado por violação de conduta.' });
        }

        // 2. Insere o novo usuário
        await sql`
            INSERT INTO usuarios (username, email, password, ip_registro)
            VALUES (${username}, ${email}, ${password}, ${ip})
        `;

        return res.status(200).json({ message: 'Conta criada com sucesso!' });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Este nome ou e-mail já foi registrado.' });
        }
        return res.status(500).json({ error: 'Erro no servidor: ' + error.message });
    }
}
