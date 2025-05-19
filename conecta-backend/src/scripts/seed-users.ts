import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../modules/users/users.service';
import { DocumentType, UserRole, Gender } from '../modules/users/entities/user.entity';
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
  names: [
    'Ana', 'Carlos', 'Marina', 'Pedro', 'Juliana', 'Roberto', 'Fernanda', 'Paulo', 'Marcia', 'Gabriel',
    'Bianca', 'André', 'Camila', 'Lucas', 'Tatiana', 'Rafael', 'Isabela', 'Bruno', 'Larissa', 'Diego',
    'Amanda', 'Thiago', 'Carolina', 'Felipe', 'Beatriz', 'Leonardo', 'Mariana', 'Rodrigo', 'Júlia', 'Matheus',
    'Laura', 'Guilherme', 'Luiza', 'Daniel', 'Vitória', 'Eduardo', 'Sofia', 'João', 'Valentina', 'Miguel'
  ],
  surnames: [
    'Silva', 'Santos', 'Oliveira', 'Pereira', 'Costa', 'Rodrigues', 'Ferreira', 'Almeida', 'Nascimento', 'Lima',
    'Araújo', 'Ribeiro', 'Martins', 'Carvalho', 'Melo', 'Cardoso', 'Souza', 'Cavalcanti', 'Dias', 'Castro',
    'Gomes', 'Mendes', 'Barbosa', 'Fernandes', 'Lopes', 'Monteiro', 'Moraes', 'Nunes', 'Pinto', 'Rocha'
  ],
  cities: [
    'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Fortaleza', 'Brasília', 'Curitiba', 'Recife',
    'Porto Alegre', 'Manaus', 'Belém', 'Goiânia', 'Guarulhos', 'Campinas', 'São Luís', 'Maceió', 'Teresina',
    'Natal', 'Campo Grande', 'João Pessoa', 'São José dos Campos', 'Ribeirão Preto', 'Uberlândia', 'Sorocaba'
  ],
  states: [
    'SP', 'RJ', 'MG', 'BA', 'CE', 'DF', 'PR', 'PE', 'RS', 'AM', 'PA', 'GO', 'MA', 'AL', 'PI', 'RN', 'MS',
    'PB', 'SC', 'ES', 'RO', 'TO', 'AC', 'AP', 'RR'
  ],
  neighborhoods: [
    'Centro', 'Jardim América', 'Vila Nova', 'Boa Vista', 'Santa Cecília', 'Pituba', 'Leblon', 'Copacabana',
    'Barra', 'Ipanema', 'Moema', 'Vila Mariana', 'Pinheiros', 'Jardins', 'Vila Madalena', 'Brooklin',
    'Campo Belo', 'Morumbi', 'Itaim Bibi', 'Jardim Paulista', 'Vila Olímpia', 'Paraíso', 'Bela Vista',
    'Consolação', 'Higienópolis', 'Vila Leopoldina', 'Lapa', 'Vila Pompéia', 'Perdizes', 'Vila Buarque'
  ],
  streets: [
    'Rua das Flores', 'Avenida Brasil', 'Rua do Comércio', 'Alameda Santos', 'Avenida Paulista',
    'Rua da Praia', 'Avenida Atlântica', 'Rua XV de Novembro', 'Rua Augusta', 'Avenida Rebouças',
    'Rua Oscar Freire', 'Avenida Brigadeiro Faria Lima', 'Rua Haddock Lobo', 'Avenida Berrini',
    'Rua Maria Antônia', 'Avenida Jabaquara', 'Rua da Consolação', 'Avenida São João',
    'Rua 25 de Março', 'Avenida Ipiranga', 'Rua Vergueiro', 'Avenida 9 de Julho',
    'Rua Bela Cintra', 'Avenida Europa', 'Rua Estados Unidos'
  ],
  
  // Profissionais
  skills: [
    'costura', 'modelagem', 'pilotagem', 'estilismo', 'desenho', 'estamparia', 'bordado', 'crochet',
    'tricot', 'gestao', 'corte', 'acabamento', 'alfaiataria', 'alta costura', 'moda praia',
    'moda íntima', 'moda fitness', 'moda infantil', 'moda masculina', 'moda feminina',
    'moda plus size', 'moda sustentável', 'upcycling', 'customização', 'serigrafia',
    'estampa digital', 'bordado à máquina', 'bordado à mão', 'patchwork', 'quiltagem'
  ],
  atelierNames: [
    'Ateliê Criativo', 'Costura & Arte', 'Moda Sob Medida', 'Criações Personalizadas', 'Alta Costura',
    'Arte em Tecido', 'Mãos de Ouro', 'Feito com Amor', 'Moda Exclusiva', 'Corte Perfeito',
    'Ateliê da Moda', 'Costura Premium', 'Moda & Estilo', 'Criações Únicas', 'Alta Moda',
    'Arte & Costura', 'Mãos Talentosas', 'Feito à Mão', 'Moda Personalizada', 'Corte & Costura',
    'Ateliê Fashion', 'Costura Elegante', 'Moda & Design', 'Criações Especiais', 'Alta Fashion',
    'Arte & Moda', 'Mãos Especiais', 'Feito com Carinho', 'Moda Sob Medida', 'Corte & Estilo'
  ],
  professionalBios: [
    'Especialista em modelagem e costura de peças sob medida para ocasiões especiais.',
    'Designer de moda com foco em sustentabilidade e upcycling. Transformo roupas antigas em peças modernas.',
    'Costureiro com mais de 10 anos de experiência em alta costura e ajustes de roupas femininas.',
    'Modelista especializada em alfaiataria feminina com técnicas tradicionais italianas.',
    'Estilista de moda praia com design exclusivo e acabamento de qualidade.',
    'Especialista em moda sustentável e upcycling, criando peças únicas a partir de materiais reciclados.',
    'Costureira com expertise em moda íntima e lingerie de alta qualidade.',
    'Modelista especializado em alfaiataria masculina com técnicas inglesas tradicionais.',
    'Designer de moda infantil com foco em conforto e durabilidade.',
    'Especialista em moda plus size, criando peças que valorizam todas as formas.',
    'Costureira com experiência em alta costura e vestidos de noiva.',
    'Modelista especializada em moda fitness e performance.',
    'Designer de moda masculina contemporânea com toque clássico.',
    'Especialista em customização e personalização de peças.',
    'Costureira com expertise em bordados e técnicas artesanais.'
  ],
  
  // Marcas
  brandNames: [
    'Elegance', 'Modas Brasil', 'Estilo Urbano', 'Moda & Cia', 'Fashion Style',
    'Bella Moda', 'Chic & Cool', 'Urban Street', 'Golden Style', 'Pure Fashion',
    'Moda Express', 'Style Brasil', 'Fashion House', 'Moda & Design', 'Elegant Style',
    'Fashion Lab', 'Moda & Arte', 'Style & Co', 'Fashion Box', 'Moda & Estilo',
    'Elegant Fashion', 'Style House', 'Fashion & Co', 'Moda & Style', 'Elegant Lab',
    'Fashion Art', 'Moda & Design', 'Style Box', 'Fashion & Style', 'Moda & Co'
  ],
  brandBios: [
    'Marca de moda feminina com foco em peças atemporais e sustentáveis.',
    'Especialista em moda casual e confortável para o dia a dia.',
    'Marca de moda praia com design exclusivo e qualidade premium.',
    'Moda masculina contemporânea com estilo urbano e sofisticado.',
    'Marca de moda infantil com peças divertidas e confortáveis.',
    'Especialista em moda sustentável e eco-friendly.',
    'Marca de moda plus size com design exclusivo e confortável.',
    'Especialista em moda fitness e performance.',
    'Marca de moda íntima com design sofisticado e confortável.',
    'Especialista em moda masculina casual e elegante.',
    'Marca de moda feminina com foco em peças versáteis e atemporais.',
    'Especialista em moda praia e verão com design exclusivo.',
    'Marca de moda infantil com foco em conforto e durabilidade.',
    'Especialista em moda sustentável e upcycling.',
    'Marca de moda masculina com design contemporâneo e sofisticado.'
  ],
  segments: [
    'feminino', 'masculino', 'infantil', 'praia', 'plus-size', 'outros',
    'sustentável', 'fitness', 'íntima', 'casual', 'formal', 'esportivo',
    'praia', 'verão', 'inverno', 'primavera', 'outono', 'alta costura',
    'fast fashion', 'slow fashion', 'luxo', 'contemporâneo', 'clássico',
    'urbano', 'streetwear', 'minimalista', 'romântico', 'vintage'
  ],
  
  // Fornecedores
  supplierNames: [
    'Tecidos Premium', 'Materiais Moda', 'Fornecedor Express', 'Tecidos & Acessórios', 'Moda Supply',
    'Tecidos Brasil', 'Materiais Fashion', 'Fornecedor Total', 'Tecidos & Cia', 'Moda Materiais',
    'Tecidos Express', 'Materiais & Cia', 'Fornecedor Premium', 'Tecidos & Moda', 'Moda & Materiais',
    'Tecidos Fashion', 'Materiais Express', 'Fornecedor & Cia', 'Tecidos & Style', 'Moda & Tecidos',
    'Tecidos & Design', 'Materiais & Style', 'Fornecedor Fashion', 'Tecidos & Arte', 'Moda & Design'
  ],
  supplierBios: [
    'Fornecedor de tecidos de alta qualidade para confecções.',
    'Especialista em materiais para moda praia e fitness.',
    'Fornecedor de acessórios e aviamentos para confecções.',
    'Distribuidor de tecidos nacionais e importados.',
    'Fornecedor completo para confecções de moda feminina.',
    'Especialista em tecidos sustentáveis e eco-friendly.',
    'Fornecedor de materiais para alta costura e luxo.',
    'Distribuidor de aviamentos e acessórios premium.',
    'Fornecedor de tecidos para moda masculina.',
    'Especialista em materiais para moda infantil.',
    'Fornecedor de tecidos para moda plus size.',
    'Distribuidor de materiais para moda fitness.',
    'Fornecedor de tecidos para moda íntima.',
    'Especialista em materiais para moda praia.',
    'Fornecedor completo para moda sustentável.'
  ],
  products: [
    'tecidos', 'aviamentos', 'acessórios', 'materiais', 'ferramentas', 'equipamentos',
    'linhas', 'botões', 'zíperes', 'elásticos', 'entretelas', 'forros',
    'etiquetas', 'tags', 'embalagens', 'máquinas', 'agulhas', 'alicates',
    'tesouras', 'régua', 'esquadro', 'alfinetes', 'alfineteiras', 'dedais',
    'moldes', 'papel', 'cartolina', 'plástico', 'metal', 'madeira'
  ]
};

// Função para gerar URL do avatar
function generateAvatarUrl(email: string): string {
  // Usar o email como seed para gerar um avatar consistente
  const seed = email.split('@')[0];
  // Usar o estilo 'adventurer' do DiceBear que gera avatares mais profissionais
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=b6e3f4`;
}

// Função para criar um usuário profissional
function createProfessional(index: number) {
  const firstName = random.pick(userData.names);
  const lastName = random.pick(userData.surnames);
  const fullName = `${firstName} ${lastName}`;
  const email = `profissional${index}@exemplo.com`;
  const skills = Array(random.number(2, 4)).fill(0).map(() => random.pick(userData.skills));
  
  return {
    name: fullName,
    email,
    password: 'Senha123!',
    phone: random.phone(),
    documentType: DocumentType.CPF,
    documentNumber: random.cpf(),
    birthDate: random.date(new Date(1970, 0, 1), new Date(2000, 0, 1)),
    gender: random.pick([Gender.MALE, Gender.FEMALE, Gender.OTHER]),
    profilePicture: generateAvatarUrl(email),
    address: {
      street: random.pick(userData.streets),
      number: random.number(1, 999).toString(),
      neighborhood: random.pick(userData.neighborhoods),
      city: random.pick(userData.cities),
      state: random.pick(userData.states),
      country: 'Brazil',
      zipCode: `${random.number(10000, 99999)}-${random.number(100, 999)}`
    },
    
    // Dados profissionais
    roles: [UserRole.PROFESSIONAL],
    professionalName: `${random.pick(userData.atelierNames)} - ${firstName}`,
    professionalEmail: `contato.${firstName.toLowerCase()}@exemplo.com`,
    professionalPhone: random.phone(),
    miniBio: random.pick(userData.professionalBios),
    professionalLocation: `${random.pick(userData.neighborhoods)}, ${random.pick(userData.cities)} - ${random.pick(userData.states)}`,
    skills,
    instagram: `@${firstName.toLowerCase()}costura`,
    facebook: `${firstName.toLowerCase()}.costura`,
    linkedin: `${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
    website: random.boolean() ? `https://www.${firstName.toLowerCase()}costura.com.br` : '',
    
  };
}

// Função para criar um usuário marca (empresa)
function createBrand(index: number) {
  const brandName = random.pick(userData.brandNames);
  const email = `marca${index}@exemplo.com`;
  const segments = Array(random.number(1, 3)).fill(0).map(() => random.pick(userData.segments));
  
  return {
    name: random.pick(userData.names) + ' ' + random.pick(userData.surnames),
    email,
    password: 'Senha123!',
    phone: random.phone(),
    documentType: DocumentType.CNPJ,
    documentNumber: random.cnpj(),
    profilePicture: generateAvatarUrl(email),
    address: {
      street: random.pick(userData.streets),
      number: random.number(1, 999).toString(),
      neighborhood: random.pick(userData.neighborhoods),
      city: random.pick(userData.cities),
      state: random.pick(userData.states),
      country: 'Brazil',
      zipCode: `${random.number(10000, 99999)}-${random.number(100, 999)}`
    },
    
    // Dados profissionais
    roles: [UserRole.BRAND],
    professionalName: brandName,
    professionalEmail: `contato@${brandName.toLowerCase().replace(/\s+/g, '')}.com.br`,
    professionalPhone: random.phone(),
    miniBio: random.pick(userData.brandBios),
    professionalLocation: `${random.pick(userData.neighborhoods)}, ${random.pick(userData.cities)} - ${random.pick(userData.states)}`,
    segments,
    instagram: `@${brandName.toLowerCase().replace(/\s+/g, '')}`,
    facebook: `${brandName.toLowerCase().replace(/\s+/g, '')}`,
    linkedin: `${brandName.toLowerCase().replace(/\s+/g, '-')}`,
    website: `https://www.${brandName.toLowerCase().replace(/\s+/g, '')}.com.br`,
    hasPhysicalStore: random.boolean(),
    hasEcommerce: random.boolean(),
    
  };
}

// Função para criar um usuário fornecedor
function createSupplier(index: number) {
  const supplierName = random.pick(userData.supplierNames);
  const email = `fornecedor${index}@exemplo.com`;
  const products = Array(random.number(2, 4)).fill(0).map(() => random.pick(userData.products));
  
  return {
    name: random.pick(userData.names) + ' ' + random.pick(userData.surnames),
    email,
    password: 'Senha123!',
    phone: random.phone(),
    documentType: DocumentType.CNPJ,
    documentNumber: random.cnpj(),
    profilePicture: generateAvatarUrl(email),
    address: {
      street: random.pick(userData.streets),
      number: random.number(1, 999).toString(),
      neighborhood: random.pick(userData.neighborhoods),
      city: random.pick(userData.cities),
      state: random.pick(userData.states),
      country: 'Brazil',
      zipCode: `${random.number(10000, 99999)}-${random.number(100, 999)}`
    },
    
    // Dados profissionais
    roles: [UserRole.SUPPLIER],
    professionalName: supplierName,
    professionalEmail: `contato@${supplierName.toLowerCase().replace(/\s+/g, '')}.com.br`,
    professionalPhone: random.phone(),
    miniBio: random.pick(userData.supplierBios),
    professionalLocation: `${random.pick(userData.neighborhoods)}, ${random.pick(userData.cities)} - ${random.pick(userData.states)}`,
    products,
    instagram: `@${supplierName.toLowerCase().replace(/\s+/g, '')}`,
    facebook: `${supplierName.toLowerCase().replace(/\s+/g, '')}`,
    linkedin: `${supplierName.toLowerCase().replace(/\s+/g, '-')}`,
    website: `https://www.${supplierName.toLowerCase().replace(/\s+/g, '')}.com.br`,
    
  };
}

async function seedDatabase() {
  // Inicializar a aplicação NestJS
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);
  
  try {
    console.log('Iniciando processo de seed...');
    
    // Garantir que o diretório de uploads existe
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('Diretório de uploads criado:', uploadsDir);
    }
    
    // Criar 30 profissionais
    console.log('Criando profissionais...');
    for (let i = 1; i <= 30; i++) {
      const professionalData = createProfessional(i);
      await usersService.create(professionalData);
      console.log(`Profissional ${i} criado: ${professionalData.email}`);
    }
    
    // Criar 20 marcas
    console.log('Criando marcas...');
    for (let i = 1; i <= 20; i++) {
      const enterpriseData = createBrand(i);
      await usersService.create(enterpriseData);
      console.log(`Marca ${i} criada: ${enterpriseData.email}`);
    }
    
    // Criar 25 fornecedores
    console.log('Criando fornecedores...');
    for (let i = 1; i <= 25; i++) {
      const supplierData = createSupplier(i);
      await usersService.create(supplierData);
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