import { PrismaClient } from '@prisma/client';

const activities: {
  category: { name: string; translations: { code: string; content: string }[] };
  items: { name: string; translations: { code: string; content: string }[] }[];
}[] = [
  {
    category: {
      name: 'La société',
      translations: [
        { code: 'en', content: 'Society' },
        { code: 'es', content: 'Sociedad' },
        { code: 'de', content: 'Gesellschaft' },
        { code: 'it', content: 'Società' },
        { code: 'pt', content: 'Sociedade' },
      ],
    },
    items: [
      {
        name: 'Politique',
        translations: [
          { code: 'en', content: 'Debate/Politics' },
          { code: 'es', content: 'Debate/Política' },
          { code: 'de', content: 'Politik' },
          { code: 'it', content: 'Politica' },
          { code: 'pt', content: 'Debate/Política' },
        ],
      },
      {
        name: 'Economie',
        translations: [
          { code: 'en', content: 'Economy' },
          { code: 'es', content: 'Economía' },
          { code: 'de', content: 'Wirtschaft' },
          { code: 'it', content: 'Economia' },
          { code: 'pt', content: 'Economia' },
        ],
      },
      {
        name: 'Environnement',
        translations: [
          { code: 'en', content: 'Environment' },
          { code: 'es', content: 'Medio Ambiente' },
          { code: 'de', content: 'Umwelt' },
          { code: 'it', content: 'Ambiente' },
          { code: 'pt', content: 'Ambiente' },
        ],
      },
      {
        name: 'Finance',
        translations: [
          { code: 'en', content: 'Finances' },
          { code: 'es', content: 'Finanzas' },
          { code: 'de', content: 'Finanzen' },
          { code: 'it', content: 'Finanze' },
          { code: 'pt', content: 'Finanças' },
        ],
      },
      {
        name: 'Migration',
        translations: [
          { code: 'en', content: 'Migration' },
          { code: 'es', content: 'Migración' },
          { code: 'de', content: 'Migration' },
          { code: 'it', content: 'Migrazione' },
          { code: 'pt', content: 'Migração' },
        ],
      },
      {
        name: 'Actualités',
        translations: [
          { code: 'en', content: 'News' },
          { code: 'es', content: 'Noticias' },
          { code: 'de', content: 'Nachrichten' },
          { code: 'it', content: 'Mass media' },
          { code: 'pt', content: 'Notícias' },
        ],
      },
      {
        name: 'Problèmes sociaux',
        translations: [
          { code: 'en', content: 'Social Issues' },
          { code: 'es', content: 'Asuntos sociales' },
          { code: 'de', content: 'Soziales' },
          { code: 'it', content: 'Problemi sociali' },
          { code: 'pt', content: 'Questões sociais' },
        ],
      },
    ],
  },
  {
    category: {
      name: 'Le quotidien',
      translations: [
        { code: 'en', content: 'Daily Life' },
        { code: 'es', content: 'Vida Diaria' },
        { code: 'de', content: 'Alltag' },
        { code: 'it', content: 'Vita quotidiana' },
        { code: 'pt', content: 'Vida diária' },
      ],
    },
    items: [
      {
        name: 'Budget',
        translations: [
          { code: 'en', content: 'Budget' },
          { code: 'es', content: 'Presupuestos' },
          { code: 'de', content: 'Budget' },
          { code: 'it', content: 'Budget' },
          { code: 'pt', content: 'Orçamento' },
        ],
      },
      {
        name: 'Médecin',
        translations: [
          { code: 'en', content: 'Doctor' },
          { code: 'es', content: 'Atención médica' },
          { code: 'de', content: 'Arztbesuch' },
          { code: 'it', content: 'Dal medico' },
          { code: 'pt', content: 'Doutor' },
        ],
      },
      {
        name: 'Vie quotidienne',
        translations: [
          { code: 'en', content: 'Every Day Life' },
          { code: 'es', content: 'Rutinas' },
          { code: 'de', content: 'Alltag' },
          { code: 'it', content: 'Vita di tutti i giorni' },
          { code: 'pt', content: 'Dia-a-dia' },
        ],
      },
      {
        name: 'La mode',
        translations: [
          { code: 'en', content: 'Fashion' },
          { code: 'es', content: 'Moda' },
          { code: 'de', content: 'Mode' },
          { code: 'it', content: 'Moda' },
          { code: 'pt', content: 'Moda' },
        ],
      },
      {
        name: 'Alimentation et recettes',
        translations: [
          { code: 'en', content: 'Food & Recipes' },
          { code: 'es', content: 'Comida y recetas' },
          { code: 'de', content: 'Essen und Rezepte' },
          { code: 'it', content: 'Alimentazione e ricette' },
          { code: 'pt', content: 'Comida e receitas' },
        ],
      },
      {
        name: 'Loisirs',
        translations: [
          { code: 'en', content: 'Hobbies' },
          { code: 'es', content: 'Aficiones' },
          { code: 'de', content: 'Hobbys' },
          { code: 'it', content: 'Hobby' },
          { code: 'pt', content: 'Hobbies' },
        ],
      },
      {
        name: 'Fêtes et traditions',
        translations: [
          { code: 'en', content: 'Holidays/Traditions' },
          { code: 'es', content: 'Vacaciones/Tradiciones' },
          { code: 'de', content: 'Feste und Traditionen' },
          { code: 'it', content: 'Feste e tradizioni' },
          { code: 'pt', content: 'Feriados/Tradições' },
        ],
      },
      {
        name: 'La vie de tous les jours',
        translations: [
          { code: 'en', content: 'Life Experiences' },
          { code: 'es', content: 'Experiencias vitales' },
          { code: 'de', content: 'Lebenserfahrungen' },
          { code: 'it', content: 'Esperienze di vita' },
          { code: 'pt', content: 'Experiências da vida' },
        ],
      },
      {
        name: 'Se rencontrer',
        translations: [
          { code: 'en', content: 'Meeting Up' },
          { code: 'es', content: 'Quedar con gente' },
          { code: 'de', content: 'Treffen' },
          { code: 'it', content: 'Incontri' },
          { code: 'pt', content: 'Encontrando-se' },
        ],
      },
      {
        name: 'Organiser une fête',
        translations: [
          { code: 'en', content: 'Partyplanning' },
          { code: 'es', content: 'Hacer planes' },
          { code: 'de', content: 'Partyplanung' },
          { code: 'it', content: 'Programmare una festa' },
          { code: 'pt', content: 'Planejamento de festa' },
        ],
      },
      {
        name: 'Faire des achats',
        translations: [
          { code: 'en', content: 'Shopping' },
          { code: 'es', content: 'Compras' },
          { code: 'de', content: 'Einkaufen' },
          { code: 'it', content: 'Fare la spesa' },
          { code: 'pt', content: 'Shopping' },
        ],
      },
      {
        name: "Vie d'étudiant et de salarié",
        translations: [
          { code: 'en', content: 'Student Life and Jobs' },
          { code: 'es', content: 'Vida y trabajo de estudiante' },
          { code: 'de', content: 'Studentenleben und Jobs' },
          { code: 'it', content: 'Vita studentesca e lavoro' },
          { code: 'pt', content: 'Vida estudantil e trabalhos' },
        ],
      },
      {
        name: 'Voyages et vacances',
        translations: [
          { code: 'en', content: 'Travels/Holidays' },
          { code: 'es', content: 'Viajes/Vacaciones' },
          { code: 'de', content: 'Reisen und Urlaub' },
          { code: 'it', content: 'Viaggi e vacanze' },
          { code: 'pt', content: 'Viagens/Feriados' },
        ],
      },
    ],
  },
  {
    category: {
      name: 'Les autres et moi',
      translations: [
        { code: 'en', content: 'Me & the Others' },
        { code: 'es', content: 'Gente' },
        { code: 'de', content: 'Ich und die Anderen' },
        { code: 'it', content: 'Io e gli altri' },
        { code: 'pt', content: 'Eu e os outros' },
      ],
    },
    items: [
      {
        name: 'Accommodation (& Housing)',
        translations: [
          { code: 'en', content: 'Accommodation (& Housing)' },
          { code: 'es', content: 'Accommodation (& Housing)' },
          { code: 'de', content: 'Accommodation (& Housing)' },
          { code: 'it', content: 'Accommodation (& Housing)' },
          { code: 'pt', content: 'Accommodation (& Housing)' },
        ],
      },
      {
        name: 'Rêves, espoirs et ambitions',
        translations: [
          { code: 'en', content: 'Dreams, Hopes and Ambitions' },
          { code: 'es', content: 'Sueños, esperanzas y ambiciones' },
          { code: 'de', content: 'Träume, Hoffnungen und Ziele' },
          { code: 'it', content: 'Sogni, speranze e ambizioni' },
          { code: 'pt', content: 'Sonhos, esperanças e ambições' },
        ],
      },
      {
        name: 'La famille',
        translations: [
          { code: 'en', content: 'Family' },
          { code: 'es', content: 'Familia' },
          { code: 'de', content: 'Familie' },
          { code: 'it', content: 'Famiglia' },
          { code: 'pt', content: 'Família' },
        ],
      },
      {
        name: 'La mode',
        translations: [
          { code: 'en', content: 'Fashion' },
          { code: 'es', content: 'Moda' },
          { code: 'de', content: 'Mode' },
          { code: 'it', content: 'Moda' },
          { code: 'pt', content: 'Moda' },
        ],
      },
      {
        name: 'Amis et connaissances',
        translations: [
          { code: 'en', content: 'Friends/People' },
          { code: 'es', content: 'Amigos/Gente' },
          { code: 'de', content: 'Freunde/Bekannte' },
          { code: 'it', content: 'Amici/conoscenti' },
          { code: 'pt', content: 'Amigos/Pessoas' },
        ],
      },
      {
        name: 'Loisirs',
        translations: [
          { code: 'en', content: 'Hobbies' },
          { code: 'es', content: 'Aficiones' },
          { code: 'de', content: 'Hobbys' },
          { code: 'it', content: 'Hobby' },
          { code: 'pt', content: 'Hobbies' },
        ],
      },
      {
        name: 'Se présenter',
        translations: [
          { code: 'en', content: 'Introduction' },
          { code: 'es', content: 'Presentarse' },
          { code: 'de', content: 'Sich vorstellen' },
          { code: 'it', content: 'Presentarsi' },
          { code: 'pt', content: 'Apresentação' },
        ],
      },
      {
        name: 'La vie de tous les jours',
        translations: [
          { code: 'en', content: 'Life Experiences' },
          { code: 'es', content: 'Experiencias vitales' },
          { code: 'de', content: 'Lebenserfahrungen' },
          { code: 'it', content: 'Esperienze di vita' },
          { code: 'pt', content: 'Experiências da vida' },
        ],
      },
      {
        name: 'Se rencontrer',
        translations: [
          { code: 'en', content: 'Meeting Up' },
          { code: 'es', content: 'Quedar con gente' },
          { code: 'de', content: 'Treffen' },
          { code: 'it', content: 'Incontri' },
          { code: 'pt', content: 'Encontrando-se' },
        ],
      },
      {
        name: 'Organiser une fête',
        translations: [
          { code: 'en', content: 'Partyplanning' },
          { code: 'es', content: 'Hacer planes' },
          { code: 'de', content: 'Partyplanung' },
          { code: 'it', content: 'Programmare una festa' },
          { code: 'pt', content: 'Planejamento de festa' },
        ],
      },
      {
        name: 'Stéréotypes',
        translations: [
          { code: 'en', content: 'Stereotypes' },
          { code: 'es', content: 'Estereotipos' },
          { code: 'de', content: 'Klischees' },
          { code: 'it', content: 'Stereotipi' },
          { code: 'pt', content: 'Estereótipos' },
        ],
      },
      {
        name: "Vie d'étudiant et de salarié",
        translations: [
          { code: 'en', content: 'Student Life and Jobs' },
          { code: 'es', content: 'Vida y trabajo de estudiante' },
          { code: 'de', content: 'Studentenleben und Jobs' },
          { code: 'it', content: 'Vita studentesca e lavoro' },
          { code: 'pt', content: 'Vida estudantil e trabalhos' },
        ],
      },
    ],
  },
  {
    category: {
      name: 'Les études et la vie professionnelle',
      translations: [
        { code: 'en', content: 'Studies and Careers' },
        { code: 'es', content: 'Estudios y Trabajo' },
        { code: 'de', content: 'Studium und Arbeit' },
        { code: 'it', content: 'Studio e mondo del lavoro' },
        { code: 'pt', content: 'Estudos e carreiras' },
      ],
    },
    items: [
      {
        name: 'Rêves, espoirs et ambitions',
        translations: [
          { code: 'en', content: 'Dreams, Hopes and Ambitions' },
          { code: 'es', content: 'Sueños, esperanzas y ambiciones' },
          { code: 'de', content: 'Träume, Hoffnungen und Ziele' },
          { code: 'it', content: 'Sogni, speranze e ambizioni' },
          { code: 'pt', content: 'Sonhos, esperanças e ambições' },
        ],
      },
      {
        name: 'Système éducatif',
        translations: [
          { code: 'en', content: 'Educational System' },
          { code: 'es', content: 'Sistema educativo' },
          { code: 'de', content: 'Bildungssystem' },
          { code: 'it', content: 'Sistema educativo' },
          { code: 'pt', content: 'Sistema educacional' },
        ],
      },
      {
        name: 'Marché du travail',
        translations: [
          { code: 'en', content: 'Employability' },
          { code: 'es', content: 'Empleo' },
          { code: 'de', content: 'Chancen auf dem Arbeitsmarkt' },
          { code: 'it', content: 'Mercato del lavoro' },
          { code: 'pt', content: 'Empregabilidade' },
        ],
      },
      {
        name: "Vivre à l'étranger",
        translations: [
          { code: 'en', content: 'Moving Countries' },
          { code: 'es', content: 'Mudarse al extranjero' },
          { code: 'de', content: 'Im Ausland leben' },
          { code: 'it', content: "Esperienze all'estero" },
          { code: 'pt', content: 'Países em movimento' },
        ],
      },
      {
        name: "Vie d'étudiant et de salarié",
        translations: [
          { code: 'en', content: 'Student Life and Jobs' },
          { code: 'es', content: 'Vida y trabajo de estudiante' },
          { code: 'de', content: 'Studentenleben und Jobs' },
          { code: 'it', content: 'Vita studentesca e lavoro' },
          { code: 'pt', content: 'Vida estudantil e trabalhos' },
        ],
      },
      {
        name: 'Les études et le projet professionnel',
        translations: [
          { code: 'en', content: 'Studies & Careers' },
          { code: 'es', content: 'Estudios y carrera profesional' },
          { code: 'de', content: 'Studium und Karriere' },
          { code: 'it', content: 'Studio e carriera' },
          { code: 'pt', content: 'Estudos e carreiras' },
        ],
      },
      {
        name: 'Études & travail',
        translations: [
          { code: 'en', content: 'Studies & Jobs' },
          { code: 'es', content: 'Estudios y trabajo' },
          { code: 'de', content: 'Studium und Beruf' },
          { code: 'it', content: 'Studio & mondo del lavoro' },
          { code: 'pt', content: 'Estudos e trabalhos' },
        ],
      },
    ],
  },
  {
    category: {
      name: 'La culture',
      translations: [
        { code: 'en', content: 'Culture' },
        { code: 'es', content: 'Cultura' },
        { code: 'de', content: 'Kultur' },
        { code: 'it', content: 'Cultura' },
        { code: 'pt', content: 'Cultura' },
      ],
    },
    items: [
      {
        name: "L'architecture",
        translations: [
          { code: 'en', content: 'Architecture' },
          { code: 'es', content: 'Arquitectura' },
          { code: 'de', content: 'Architektur' },
          { code: 'it', content: 'Architettura' },
          { code: 'pt', content: 'Arquitetura' },
        ],
      },
      {
        name: 'Livres & auteurs',
        translations: [
          { code: 'en', content: 'Books & Authors' },
          { code: 'es', content: 'Libros y autores' },
          { code: 'de', content: 'Bücher und Autoren' },
          { code: 'it', content: 'Libri & autori' },
          { code: 'pt', content: 'Livros e autores' },
        ],
      },
      {
        name: 'Films & TV',
        translations: [
          { code: 'en', content: 'Films & TV' },
          { code: 'es', content: 'Cine y Televisión' },
          { code: 'de', content: 'Film und Fernsehen' },
          { code: 'it', content: 'Film & TV' },
          { code: 'pt', content: 'Filmes e TV' },
        ],
      },
      {
        name: 'Alimentation et recettes',
        translations: [
          { code: 'en', content: 'Food & Recipes' },
          { code: 'es', content: 'Comida y recetas' },
          { code: 'de', content: 'Essen und Rezepte' },
          { code: 'it', content: 'Alimentazione e ricette' },
          { code: 'pt', content: 'Comida e receitas' },
        ],
      },
      {
        name: 'Les musées',
        translations: [
          { code: 'en', content: 'Museums' },
          { code: 'es', content: 'Museos' },
          { code: 'de', content: 'Museen' },
          { code: 'it', content: 'Musei' },
          { code: 'pt', content: 'Museus' },
        ],
      },
      {
        name: 'La musique',
        translations: [
          { code: 'en', content: 'Music' },
          { code: 'es', content: 'Música' },
          { code: 'de', content: 'Musik' },
          { code: 'it', content: 'Musica' },
          { code: 'pt', content: 'Música' },
        ],
      },
      {
        name: 'Stéréotypes',
        translations: [
          { code: 'en', content: 'Stereotypes' },
          { code: 'es', content: 'Estereotipos' },
          { code: 'de', content: 'Klischees' },
          { code: 'it', content: 'Stereotipi' },
          { code: 'pt', content: 'Estereótipos' },
        ],
      },
    ],
  },
  {
    category: {
      name: 'La santé et le sport',
      translations: [
        { code: 'en', content: 'Health & Sports' },
        { code: 'es', content: 'Salud y Deporte' },
        { code: 'de', content: 'Gesundheit und Sport' },
        { code: 'it', content: 'Sport e salute' },
        { code: 'pt', content: 'Saúde & esportes' },
      ],
    },
    items: [
      {
        name: 'La beauté',
        translations: [
          { code: 'en', content: 'Beauty' },
          { code: 'es', content: 'Belleza' },
          { code: 'de', content: 'Schönheit' },
          { code: 'it', content: 'Bellezza' },
          { code: 'pt', content: 'Beleza' },
        ],
      },
      {
        name: 'Médecin',
        translations: [
          { code: 'en', content: 'Doctor' },
          { code: 'es', content: 'Atención médica' },
          { code: 'de', content: 'Arztbesuch' },
          { code: 'it', content: 'Dal medico' },
          { code: 'pt', content: 'Doutor' },
        ],
      },
      {
        name: 'Alimentation et recettes',
        translations: [
          { code: 'en', content: 'Food & Recipes' },
          { code: 'es', content: 'Comida y recetas' },
          { code: 'de', content: 'Essen und Rezepte' },
          { code: 'it', content: 'Alimentazione e ricette' },
          { code: 'pt', content: 'Comida e receitas' },
        ],
      },
      {
        name: 'Système de santé',
        translations: [
          { code: 'en', content: 'Health Systems' },
          { code: 'es', content: 'Sistema sanitario' },
          { code: 'de', content: 'Gesundheitssystem' },
          { code: 'it', content: 'Il sistema sanitario' },
          { code: 'pt', content: 'Sistemas de saúde' },
        ],
      },
      {
        name: 'Sport',
        translations: [
          { code: 'en', content: 'Sports' },
          { code: 'es', content: 'Deportes' },
          { code: 'de', content: 'Sport' },
          { code: 'it', content: 'Sport' },
          { code: 'pt', content: 'Esportes' },
        ],
      },
      {
        name: 'Vegetarianism',
        translations: [
          { code: 'en', content: 'Vegetarianism' },
          { code: 'es', content: 'Vegetarianismo' },
          { code: 'de', content: 'Vegetarismus' },
          { code: 'it', content: 'Vegetarismo' },
          { code: 'pt', content: 'Vegetarianismo' },
        ],
      },
    ],
  },
  {
    category: {
      name: 'Les lieux et espaces',
      translations: [
        { code: 'en', content: 'Places & Spaces' },
        { code: 'es', content: 'Lugares y Espacios' },
        { code: 'de', content: 'Orte und Räume' },
        { code: 'it', content: 'Luoghi e spazi' },
        { code: 'pt', content: 'Lugares e espaços' },
      ],
    },
    items: [
      {
        name: 'Accommodation (& Housing)',
        translations: [
          { code: 'en', content: 'Accommodation (& Housing)' },
          { code: 'es', content: 'Accommodation (& Housing)' },
          { code: 'de', content: 'Accommodation (& Housing)' },
          { code: 'it', content: 'Accommodation (& Housing)' },
          { code: 'pt', content: 'Accommodation (& Housing)' },
        ],
      },
      {
        name: 'Budget',
        translations: [
          { code: 'en', content: 'Budget' },
          { code: 'es', content: 'Presupuestos' },
          { code: 'de', content: 'Budget' },
          { code: 'it', content: 'Budget' },
          { code: 'pt', content: 'Orçamento' },
        ],
      },
      {
        name: 'Villes',
        translations: [
          { code: 'en', content: 'Cities' },
          { code: 'es', content: 'Ciudades' },
          { code: 'de', content: 'Städte' },
          { code: 'it', content: 'Città' },
          { code: 'pt', content: 'Cidades' },
        ],
      },
      {
        name: 'Géographie',
        translations: [
          { code: 'en', content: 'Geography' },
          { code: 'es', content: 'Geografía' },
          { code: 'de', content: 'Geographie' },
          { code: 'it', content: 'Geografia' },
          { code: 'pt', content: 'Geografia' },
        ],
      },
      {
        name: 'Fêtes et traditions',
        translations: [
          { code: 'en', content: 'Holidays/Traditions' },
          { code: 'es', content: 'Vacaciones/Tradiciones' },
          { code: 'de', content: 'Feste und Traditionen' },
          { code: 'it', content: 'Feste e tradizioni' },
          { code: 'pt', content: 'Feriados/Tradições' },
        ],
      },
      {
        name: "Vivre à l'étranger",
        translations: [
          { code: 'en', content: 'Moving Countries' },
          { code: 'es', content: 'Mudarse al extranjero' },
          { code: 'de', content: 'Im Ausland leben' },
          { code: 'it', content: "Esperienze all'estero" },
          { code: 'pt', content: 'Países em movimento' },
        ],
      },
      {
        name: 'Voisinage',
        translations: [
          { code: 'en', content: 'Neighbourhoods' },
          { code: 'es', content: 'Barrios' },
          { code: 'de', content: 'Umgebung' },
          { code: 'it', content: 'Ambiente' },
          { code: 'pt', content: 'Vizinhanças' },
        ],
      },
      {
        name: 'Voyages et vacances',
        translations: [
          { code: 'en', content: 'Travels/Holidays' },
          { code: 'es', content: 'Viajes/Vacaciones' },
          { code: 'de', content: 'Reisen und Urlaub' },
          { code: 'it', content: 'Viaggi e vacanze' },
          { code: 'pt', content: 'Viagens/Feriados' },
        ],
      },
    ],
  },
  {
    category: {
      name: 'Les sujets académiques (CALP)',
      translations: [
        { code: 'en', content: 'Academic Topics (CALP)' },
        { code: 'es', content: 'Temas Académicos (CALP)' },
        { code: 'de', content: 'Wissenschaftliche Themen (CALP)' },
        { code: 'it', content: 'Temi accademici (CALP)' },
        { code: 'pt', content: 'Tópicos acadêmicos' },
      ],
    },
    items: [
      {
        name: 'Système de santé',
        translations: [
          { code: 'en', content: 'Health Systems' },
          { code: 'es', content: 'Sistema sanitario' },
          { code: 'de', content: 'Gesundheitssystem' },
          { code: 'it', content: 'Il sistema sanitario' },
          { code: 'pt', content: 'Sistemas de saúde' },
        ],
      },
      {
        name: 'Humanités',
        translations: [
          { code: 'en', content: 'Humanities' },
          { code: 'es', content: 'Humanidades' },
          { code: 'de', content: 'Geisteswissenschaften' },
          { code: 'it', content: 'Scienze umanistiche' },
          { code: 'pt', content: 'Humanidades' },
        ],
      },
      {
        name: 'Sciences naturelles & médecine',
        translations: [
          { code: 'en', content: 'Natural & Medical Sciences' },
          { code: 'es', content: 'Ciencias Médicas y Naturales' },
          { code: 'de', content: 'Natur- und Gesundheitswissenschaften' },
          { code: 'it', content: 'Scienze naturali e scienze della salute' },
          { code: 'pt', content: 'Ciências Médicas e Naturais' },
        ],
      },
      {
        name: 'Sciences sociales, économie & droit',
        translations: [
          { code: 'en', content: 'Social Sciences, Economics & Law' },
          { code: 'es', content: 'Ciencias Sociales, Económicas y Derecho' },
          {
            code: 'de',
            content: 'Sozial-, Wirtschafts- und Rechtswissenschaften',
          },
          { code: 'it', content: 'Scienze sociali, economia e giurisprudenza' },
          { code: 'pt', content: 'Ciências Sociais, Economia e Direito' },
        ],
      },
    ],
  },
];

export const createActivityThemes = async (
  prisma: PrismaClient,
): Promise<void> => {
  for (const activity of activities) {
    const category = await prisma.activityThemeCategories.create({
      data: {
        TextContent: {
          create: {
            text: activity.category.name,
            LanguageCode: { connect: { code: 'en' } },
            Translations: {
              create: activity.category.translations?.map((translation) => ({
                text: translation.content,
                LanguageCode: { connect: { code: translation.code } },
              })),
            },
          },
        },
      },
    });

    for (const item of activity.items) {
      await prisma.activityThemes.create({
        data: {
          Category: {
            connect: {
              id: category.id,
            },
          },
          TextContent: {
            create: {
              text: item.name,
              Translations: {
                create: item.translations?.map((translation) => ({
                  text: translation.content,
                  LanguageCode: { connect: { code: translation.code } },
                })),
              },
              LanguageCode: { connect: { code: 'en' } },
            },
          },
        },
      });
    }
  }
};
