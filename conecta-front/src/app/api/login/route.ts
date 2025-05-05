import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Recebe os dados do corpo da requisição
    const body = await request.json();
    const { email, password } = body;

    // Aqui você implementaria a verificação real com seu banco de dados
    // Este é apenas um exemplo de validação básica
    if (email === 'admin@exemplo.com' && password === 'senha123') {
      // Em uma implementação real, você deve:
      // 1. Verificar as credenciais no banco de dados
      // 2. Nunca armazenar senhas em texto puro (usar hash)
      // 3. Gerar um token JWT ou similar
      // 4. Configurar cookies de sessão

      return NextResponse.json(
        {
          success: true,
          message: 'Login realizado com sucesso',
          user: {
            id: 1,
            email,
            name: 'Administrador'
          }
        },
        { status: 200 }
      );
    }

    // Caso as credenciais estejam incorretas
    return NextResponse.json(
      {
        success: false,
        message: 'Email ou senha inválidos'
      },
      { status: 401 }
    );

  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Erro ao processar o login'
      },
      { status: 500 }
    );
  }
}
