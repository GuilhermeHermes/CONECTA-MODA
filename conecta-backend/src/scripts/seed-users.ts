import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AuthService } from '../modules/auth/auth.service';
import { DocumentType } from '../modules/users/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';

// Gerador de dados aleatórios
const random = {
  pick: <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)],
  boolean: (): boolean => Math.random() > 0.5,
  number: (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min,
  phone: (): string => `(${random.number(10, 99)}) ${random.number(10000, 99999)}-${random.number(1000, 9999)}`,
  cpf: (): string => `${random.number(100, 999)}.${random.number(100, 999)}.${random.number(100, 999)}-${random.number(10, 99)}`,
  cnpj: (): string => `${random.number(10, 99)}.${random.number(100, 999)}.${random.number(100, 999)}/${random.number(1000, 9999)}-${random.number(10, 99)}`,
  date: (start: Date, end: Date): Date => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  },
  // Cores aleatórias no formato HSL
  color: (): string => {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(random.number(70, 90));
    const l = Math.floor(random.number(60, 80)); 
    return `hsl(${h}, ${s}%, ${l}%)`;
  }
};

// Base de dados para gerar usuários
const userData = {
  nomes: ['Ana', 'Carlos', 'Marina', 'Pedro', 'Juliana', 'Roberto', 'Fernanda', 'Paulo', 'Marcia', 'Gabriel', 'Bianca', 'André', 'Camila', 'Lucas', 'Tatiana'],
  sobrenomes: ['Silva', 'Santos', 'Oliveira', 'Pereira', 'Costa', 'Rodrigues', 'Ferreira', 'Almeida', 'Nascimento', 'Lima', 'Araújo', 'Ribeiro', 'Martins'],
  cidades: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Fortaleza', 'Brasília', 'Curitiba', 'Recife', 'Porto Alegre', 'Manaus'],
  estados: ['SP', 'RJ', 'MG', 'BA', 'CE', 'DF', 'PR', 'PE', 'RS', 'AM'],
  bairros: ['Centro', 'Jardim América', 'Vila Nova', 'Boa Vista', 'Santa Cecília', 'Pituba', 'Leblon', 'Copacabana', 'Barra', 'Ipanema'],
  endereco: ['Rua das Flores', 'Avenida Brasil', 'Rua do Comércio', 'Alameda Santos', 'Avenida Paulista', 'Rua da Praia', 'Avenida Atlântica', 'Rua XV de Novembro'],
  
  // Profissionais
  habilidades: ['costura', 'modelagem', 'pilotagem', 'estilismo', 'desenho', 'estamparia', 'bordado', 'crochet', 'tricot', 'gestao', 'corte', 'acabamento'],
  nomesAtelier: ['Ateliê Criativo', 'Costura & Arte', 'Moda Sob Medida', 'Criações Personalizadas', 'Alta Costura', 'Arte em Tecido', 'Mãos de Ouro', 'Feito com Amor', 'Moda Exclusiva', 'Corte Perfeito'],
  biosProfissionais: [
    'Especialista em modelagem e costura de peças sob medida para ocasiões especiais.',
    'Designer de moda com foco em sustentabilidade e upcycling. Transformo roupas antigas em peças modernas.',
    'Costureiro com mais de 10 anos de experiência em alta costura e ajustes de roupas femininas.',
    'Modelista especializada em alfaiataria feminina com técnicas tradicionais italianas.',
    'Estilista de moda praia com design exclusivo e acabamento de qualidade.'
  ],
  
  // Marcas
  nomesMarcsas: ['Elegance', 'Modas Brasil', 'Estilo Urbano', 'Moda & Cia', 'Fashion Style', 'Bella Moda', 'Chic & Cool', 'Urban Street', 'Golden Style', 'Pure Fashion'],
  segmentos: ['feminino', 'masculino', 'infantil', 'plus-size', 'moda-praia', 'fitness', 'jeans', 'underwear'],
  biosMarcas: [
    'Marca de roupas femininas com foco em peças versáteis e atemporais para a mulher moderna.',
    'Marca de moda praia que celebra a diversidade de corpos com estampas exclusivas.',
    'Moda masculina casual com toques de alfaiataria, para homens que valorizam conforto e estilo.',
    'Moda infantil lúdica e confortável, feita com materiais sustentáveis e seguros.',
    'Jeanswear premium com modelagens exclusivas e acabamento de qualidade.'
  ],
  
  // Fornecedores
  nomesEmpresas: ['TextilTech', 'AviMaster', 'Fios & Tecidos', 'EcoTecidos', 'TecnoFabric', 'StampArt', 'BordaTech', 'Aviamentos Premium', 'Tecidos Especiais', 'Embalagens Modernas'],
  produtos: ['tecidos', 'aviamentos', 'estamparia', 'bordado', 'embalagens', 'etiquetas', 'maquinas', 'manequins', 'acabamento'],
  biosFornecedores: [
    'Fornecedor de tecidos importados de alta qualidade para confecção de roupas de festa e noivas.',
    'Especializado em aviamentos diferenciados, com acabamentos em metal e pedrarias para confecção de alta costura.',
    'Empresa de estamparia digital com tecnologia de ponta para pequenas e grandes produções.',
    'Fornecimento de embalagens personalizadas e etiquetas sustentáveis para marcas de moda.',
    'Tecidos tecnológicos com proteção UV, antimicrobianos e termorreguladores para moda esportiva.'
  ]
};

// Função para gerar imagem de perfil como base64 - imagem SVG gerada dinamicamente
function generateProfileImage(name: string, type: 'professional' | 'enterprise' | 'supplier'): string {
  // Extrair iniciais do nome
  const nameParts = name.split(' ');
  const initials = nameParts.length > 1 
    ? `${nameParts[0][0]}${nameParts[1][0]}` 
    : name.substring(0, 2);
  
  // Cores diferentes por tipo de usuário
  let bgColor = '';
  let textColor = '#FFFFFF';
  
  switch (type) {
    case 'professional':
      bgColor = random.color(); 
      break;
    case 'enterprise':
      bgColor = random.color(); 
      break;
    case 'supplier':
      bgColor = random.color(); 
      break;
  }
  
  // SVG para a imagem de perfil
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <rect width="200" height="200" fill="${bgColor}" />
    <text x="100" y="115" font-family="Arial" font-size="70" text-anchor="middle" fill="${textColor}" font-weight="bold">${initials}</text>
  </svg>`;
  
  // Converter para base64
  const base64 = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  return base64;
}

// Função para criar um usuário profissional
function createProfessional(index: number) {
  const firstName = random.pick(userData.nomes);
  const lastName = random.pick(userData.sobrenomes);
  const fullName = `${firstName} ${lastName}`;
  const habilidades = Array(random.number(2, 4)).fill(0).map(() => random.pick(userData.habilidades));
  
  return {
    nome: fullName,
    email: `profissional${index}@exemplo.com`,
    password: 'Senha123!',
    telefone: random.phone(),
    documentType: DocumentType.CPF,
    cpf: random.cpf(),
    cnpj: '',
    dataNascimento: random.date(new Date(1970, 0, 1), new Date(2000, 0, 1)),
    genero: random.pick(['Masculino', 'Feminino', 'Outro']),
    endereco: random.pick(userData.endereco),
    numero: random.number(1, 999).toString(),
    bairro: random.pick(userData.bairros),
    cidade: random.pick(userData.cidades),
    estado: random.pick(userData.estados),
    pais: 'Brasil',
    cep: `${random.number(10000, 99999)}-${random.number(100, 999)}`,
    
    // Dados profissionais
    role: 'profissional',
    professionalName: `${random.pick(userData.nomesAtelier)} - ${firstName}`,
    emailProfissional: `contato.${firstName.toLowerCase()}@exemplo.com`,
    telefoneProfissional: random.phone(),
    miniBio: random.pick(userData.biosProfissionais),
    localizacaoProfissional: `${random.pick(userData.bairros)}, ${random.pick(userData.cidades)} - ${random.pick(userData.estados)}`,
    habilidades,
    instagram: `@${firstName.toLowerCase()}costura`,
    facebook: `${firstName.toLowerCase()}.costura`,
    linkedin: `${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
    website: random.boolean() ? `https://www.${firstName.toLowerCase()}costura.com.br` : '',
    
    // Imagem de perfil
    profileImageUrl: generateProfileImage(fullName, 'professional')
  };
}

// Função para criar um usuário marca (empresa)
function createEnterprise(index: number) {
  const nomeMarca = random.pick(userData.nomesMarcsas);
  const segmentos = Array(random.number(1, 3)).fill(0).map(() => random.pick(userData.segmentos));
  
  return {
    nome: random.pick(userData.nomes) + ' ' + random.pick(userData.sobrenomes),
    email: `marca${index}@exemplo.com`,
    password: 'Senha123!',
    telefone: random.phone(),
    documentType: DocumentType.CNPJ,
    cpf: '',
    cnpj: random.cnpj(),
    endereco: random.pick(userData.endereco),
    numero: random.number(1, 999).toString(),
    bairro: random.pick(userData.bairros),
    cidade: random.pick(userData.cidades),
    estado: random.pick(userData.estados),
    pais: 'Brasil',
    cep: `${random.number(10000, 99999)}-${random.number(100, 999)}`,
    
    // Dados profissionais
    role: 'marca',
    professionalName: nomeMarca,
    emailProfissional: `contato@${nomeMarca.toLowerCase().replace(/\s+/g, '')}.com.br`,
    telefoneProfissional: random.phone(),
    miniBio: random.pick(userData.biosMarcas),
    localizacaoProfissional: `${random.pick(userData.bairros)}, ${random.pick(userData.cidades)} - ${random.pick(userData.estados)}`,
    segmentos,
    instagram: `@${nomeMarca.toLowerCase().replace(/\s+/g, '')}`,
    facebook: `${nomeMarca.toLowerCase().replace(/\s+/g, '')}`,
    linkedin: `${nomeMarca.toLowerCase().replace(/\s+/g, '-')}`,
    website: `https://www.${nomeMarca.toLowerCase().replace(/\s+/g, '')}.com.br`,
    possuiLojaTisica: random.boolean(),
    possuiEcommerce: random.boolean(),
    
    // Imagem de perfil
    profileImageUrl: generateProfileImage(nomeMarca, 'enterprise')
  };
}

// Função para criar um usuário fornecedor
function createSupplier(index: number) {
  const nomeEmpresa = random.pick(userData.nomesEmpresas);
  const produtos = Array(random.number(2, 4)).fill(0).map(() => random.pick(userData.produtos));
  
  return {
    nome: random.pick(userData.nomes) + ' ' + random.pick(userData.sobrenomes),
    email: `fornecedor${index}@exemplo.com`,
    password: 'Senha123!',
    telefone: random.phone(),
    documentType: DocumentType.CNPJ,
    cpf: '',
    cnpj: random.cnpj(),
    endereco: random.pick(userData.endereco),
    numero: random.number(1, 999).toString(),
    bairro: random.pick(userData.bairros),
    cidade: random.pick(userData.cidades),
    estado: random.pick(userData.estados),
    pais: 'Brasil',
    cep: `${random.number(10000, 99999)}-${random.number(100, 999)}`,
    
    // Dados profissionais
    role: 'fornecedor',
    professionalName: nomeEmpresa,
    emailProfissional: `contato@${nomeEmpresa.toLowerCase().replace(/\s+/g, '')}.com.br`,
    telefoneProfissional: random.phone(),
    miniBio: random.pick(userData.biosFornecedores),
    localizacaoProfissional: `${random.pick(userData.bairros)}, ${random.pick(userData.cidades)} - ${random.pick(userData.estados)}`,
    produtos,
    instagram: `@${nomeEmpresa.toLowerCase().replace(/\s+/g, '')}`,
    facebook: `${nomeEmpresa.toLowerCase().replace(/\s+/g, '')}`,
    linkedin: `${nomeEmpresa.toLowerCase().replace(/\s+/g, '-')}`,
    website: `https://www.${nomeEmpresa.toLowerCase().replace(/\s+/g, '')}.com.br`,
    
    // Imagem de perfil
    profileImageUrl: generateProfileImage(nomeEmpresa, 'supplier')
  };
}

async function seedDatabase() {
  // Inicializar a aplicação NestJS
  const app = await NestFactory.createApplicationContext(AppModule);
  const authService = app.get(AuthService);
  
  try {
    console.log('Iniciando processo de seed...');
    
    // Garantir que o diretório de uploads existe
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('Diretório de uploads criado:', uploadsDir);
    }
    
    // Criar 5 profissionais
    console.log('Criando profissionais...');
    for (let i = 1; i <= 5; i++) {
      const professionalData = createProfessional(i);
      await authService.register(professionalData);
      console.log(`Profissional ${i} criado: ${professionalData.email}`);
    }
    
    // Criar 5 marcas
    console.log('Criando marcas...');
    for (let i = 1; i <= 5; i++) {
      const enterpriseData = createEnterprise(i);
      await authService.register(enterpriseData);
      console.log(`Marca ${i} criada: ${enterpriseData.email}`);
    }
    
    // Criar 5 fornecedores
    console.log('Criando fornecedores...');
    for (let i = 1; i <= 5; i++) {
      const supplierData = createSupplier(i);
      await authService.register(supplierData);
      console.log(`Fornecedor ${i} criado: ${supplierData.email}`);
    }
    
    console.log('Seed concluído com sucesso!');
  } catch (error) {
    console.error('Erro ao executar seed:', error);
  } finally {
    await app.close();
  }
}

// Executar o seed
seedDatabase(); 