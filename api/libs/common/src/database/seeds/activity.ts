import { PrismaClient } from '@prisma/client';

//TODO: Update values with client infos
const activities: {
  category: { name: string; translations: { code: string; content: string }[] };
  items: { name: string; translations: { code: string; content: string }[] }[];
}[] = [
  {
    category: {
      name: 'Société',
      translations: [
        { code: 'en', content: 'Society' },
        { code: 'zh', content: '社会' },
        { code: 'de', content: 'Gesellschaft' },
        { code: 'es', content: 'Sociedad' },
      ],
    },
    items: [
      {
        name: 'Débats / Politique',
        translations: [
          { code: 'en', content: 'Debates / Politics' },
          { code: 'zh', content: '辩论/政治' },
          { code: 'de', content: 'Debates / Politik' },
          { code: 'es', content: 'Debates / Política' },
        ],
      },
      {
        name: 'Economie',
        translations: [
          { code: 'en', content: 'Economy' },
          { code: 'zh', content: '经济' },
          { code: 'de', content: 'Wirtschaft' },
          { code: 'es', content: 'Economía' },
        ],
      },
      {
        name: 'Environnement',
        translations: [
          { code: 'en', content: 'Environment' },
          { code: 'zh', content: '环境' },
          { code: 'de', content: 'Umwelt' },
          { code: 'es', content: 'Medio ambiente' },
        ],
      },
      {
        name: 'Finances',
        translations: [
          { code: 'en', content: 'Finances' },
          { code: 'zh', content: '金融' },
          { code: 'de', content: 'Finanzen' },
          { code: 'es', content: 'Finanzas' },
        ],
      },
      {
        name: 'Immigration',
        translations: [
          { code: 'en', content: 'Immigration' },
          { code: 'zh', content: '移民' },
          { code: 'de', content: 'Immigration' },
          { code: 'es', content: 'Inmigración' },
        ],
      },
      {
        name: 'Actualités',
        translations: [
          { code: 'en', content: 'News' },
          { code: 'zh', content: '新闻' },
          { code: 'de', content: 'News' },
          { code: 'es', content: 'Noticias' },
        ],
      },
      {
        name: 'Sujets de société',
        translations: [
          { code: 'en', content: 'Subjects of society' },
          { code: 'zh', content: '社会话题' },
          { code: 'de', content: 'Gesellschaftsfragen' },
          { code: 'es', content: 'Temas de la sociedad' },
        ],
      },
    ],
  },
  {
    category: {
      name: 'Vie quotidienne',
      translations: [
        { code: 'en', content: 'Daily life' },
        { code: 'zh', content: '日常生活' },
        { code: 'de', content: 'Alltag' },
        { code: 'es', content: 'Vida cotidiana' },
      ],
    },
    items: [
      {
        name: 'Dessin/peinture',
        translations: [
          { code: 'en', content: 'Drawing/painting' },
          { code: 'zh', content: '素描/绘画' },
          { code: 'de', content: 'Zeichnen/Malen' },
          { code: 'es', content: 'Dibujo / pintura' },
        ],
      },
      {
        name: 'Écriture',
        translations: [
          { code: 'en', content: 'Writing' },
          { code: 'zh', content: '写作' },
          { code: 'de', content: 'Schreiben' },
          { code: 'es', content: 'Escritura' },
        ],
      },
      {
        name: 'Gastronomie',
        translations: [
          { code: 'en', content: 'Gastronomy' },
          { code: 'zh', content: '美食' },
          { code: 'de', content: 'Gastronomie' },
          { code: 'es', content: 'Gastronomía' },
        ],
      },
      {
        name: 'Mode',
        translations: [
          { code: 'en', content: 'Fashion' },
          { code: 'zh', content: '时尚' },
          { code: 'de', content: 'Mode' },
          { code: 'es', content: 'Moda' },
        ],
      },
      {
        name: 'Photographie',
        translations: [
          { code: 'en', content: 'Photography' },
          { code: 'zh', content: '摄影' },
          { code: 'de', content: 'Fotografie' },
          { code: 'es', content: 'Fotografía' },
        ],
      },
      {
        name: 'Théâtre',
        translations: [
          { code: 'en', content: 'Theatre' },
          { code: 'zh', content: '戏剧' },
          { code: 'de', content: 'Theater' },
          { code: 'es', content: 'Teatro' },
        ],
      },
    ],
  },
  {
    category: {
      name: 'Moi & les autres',
      translations: [
        { code: 'en', content: 'Me & others' },
        { code: 'zh', content: '我和别人' },
        { code: 'de', content: 'Ich & andere' },
        { code: 'es', content: 'Yo & otros' },
      ],
    },
    items: [
      {
        name: 'À plusieurs',
        translations: [
          { code: 'en', content: 'Multiple' },
          { code: 'zh', content: '好几个' },
          { code: 'de', content: 'Mit anderen' },
          { code: 'es', content: 'Con varias personas' },
        ],
      },
      {
        name: 'Action',
        translations: [
          { code: 'en', content: 'Action' },
          { code: 'zh', content: '动作片' },
          { code: 'de', content: 'Action' },
          { code: 'es', content: 'Acción' },
        ],
      },
      {
        name: 'Comédie',
        translations: [
          { code: 'en', content: 'Comedy' },
          { code: 'zh', content: '喜剧' },
          { code: 'de', content: 'Komödie' },
          { code: 'es', content: 'Comedias' },
        ],
      },
      {
        name: 'Documentaire',
        translations: [
          { code: 'en', content: 'Documentary' },
          { code: 'zh', content: '纪录影片' },
          { code: 'de', content: 'Dokumentarfilm' },
          { code: 'es', content: 'Documental' },
        ],
      },
      {
        name: 'Drame',
        translations: [
          { code: 'en', content: 'Drama' },
          { code: 'zh', content: '戏剧' },
          { code: 'de', content: 'Drama' },
          { code: 'es', content: 'Drama' },
        ],
      },
      {
        name: 'Fantastique',
        translations: [
          { code: 'en', content: 'Fantasy' },
          { code: 'zh', content: '神怪题材' },
          { code: 'de', content: 'Fantasy' },
          { code: 'es', content: 'Fantástico' },
        ],
      },
      {
        name: 'Horreur',
        translations: [
          { code: 'en', content: 'Horror' },
          { code: 'zh', content: '恐怖' },
          { code: 'de', content: 'Horror' },
          { code: 'es', content: 'Horror' },
        ],
      },
      {
        name: 'Policier',
        translations: [
          { code: 'en', content: 'Detective fiction' },
          { code: 'zh', content: '侦探' },
          { code: 'de', content: 'Krimi' },
          { code: 'es', content: 'Policíacas' },
        ],
      },
      {
        name: 'Romance',
        translations: [
          { code: 'en', content: 'Romance' },
          { code: 'zh', content: '浪漫' },
          { code: 'de', content: 'Romantik' },
          { code: 'es', content: 'Romance' },
        ],
      },
      {
        name: 'Seul·e',
        translations: [
          { code: 'en', content: 'Alone' },
          { code: 'zh', content: '单独一个人' },
          { code: 'de', content: 'Allein' },
          { code: 'es', content: 'Solo/a' },
        ],
      },
      {
        name: 'Science fiction',
        translations: [
          { code: 'en', content: 'Science Fiction' },
          { code: 'zh', content: '科幻' },
          { code: 'de', content: 'Science-Fiction' },
          { code: 'es', content: 'Ciencia ficción' },
        ],
      },
      {
        name: 'Thriller',
        translations: [
          { code: 'en', content: 'Thriller' },
          { code: 'zh', content: '恐怖小说' },
          { code: 'de', content: 'Thriller' },
          { code: 'es', content: 'Thriller' },
        ],
      },
    ],
  },
  {
    category: {
      name: 'Etudes et carrières',
      translations: [
        { code: 'en', content: 'Studies and careers' },
        { code: 'zh', content: '学习和工作' },
        { code: 'de', content: 'Studien und Karriere' },
        { code: 'es', content: 'Estudios y carreras' },
      ],
    },
    items: [
      {
        name: 'Chaleur',
        translations: [
          { code: 'en', content: 'Warm' },
          { code: 'zh', content: '炎热' },
          { code: 'de', content: 'Wärme' },
          { code: 'es', content: 'Calor' },
        ],
      },
      {
        name: 'Froid',
        translations: [
          { code: 'en', content: 'Cold' },
          { code: 'zh', content: '寒冷' },
          { code: 'de', content: 'Kälte' },
          { code: 'es', content: 'Frío' },
        ],
      },
      {
        name: 'Montagne',
        translations: [
          { code: 'en', content: 'Mountain hiking' },
          { code: 'zh', content: '登山' },
          { code: 'de', content: 'Berge' },
          { code: 'es', content: 'Montaña' },
        ],
      },
      {
        name: 'Plage',
        translations: [
          { code: 'en', content: 'Beach' },
          { code: 'zh', content: '海滩' },
          { code: 'de', content: 'Strand' },
          { code: 'es', content: 'Playa' },
        ],
      },
      {
        name: 'Sorties culturelles',
        translations: [
          { code: 'en', content: 'Cultural trips' },
          { code: 'zh', content: '文化外出' },
          { code: 'de', content: 'Kulturelle Ausflüge' },
          { code: 'es', content: 'Salidas culturales' },
        ],
      },
      {
        name: 'Ville',
        translations: [
          { code: 'en', content: 'Town' },
          { code: 'zh', content: '城市' },
          { code: 'de', content: 'Stadt' },
          { code: 'es', content: 'Ciudad' },
        ],
      },
    ],
  },
  {
    category: {
      name: 'Culture',
      translations: [
        { code: 'en', content: 'Culture' },
        { code: 'zh', content: '文化' },
        { code: 'de', content: 'Kultur' },
        { code: 'es', content: 'Cultura' },
      ],
    },
    items: [
      {
        name: 'Chant',
        translations: [
          { code: 'en', content: 'Singing' },
          { code: 'zh', content: '唱歌' },
          { code: 'de', content: 'Gesang' },
          { code: 'es', content: 'Canción' },
        ],
      },
      {
        name: 'Classique',
        translations: [
          { code: 'en', content: 'Classical' },
          { code: 'zh', content: '古典' },
          { code: 'de', content: 'Klassisch' },
          { code: 'es', content: 'Clásico' },
        ],
      },
      {
        name: 'Electro',
        translations: [
          { code: 'en', content: 'Electro' },
          { code: 'zh', content: '电子音乐' },
          { code: 'de', content: 'Elektro' },
          { code: 'es', content: 'Electro' },
        ],
      },
      {
        name: 'Jazz',
        translations: [
          { code: 'en', content: 'Jazz' },
          { code: 'zh', content: '爵士乐' },
          { code: 'de', content: 'Jazz' },
          { code: 'es', content: 'Jazz' },
        ],
      },
      {
        name: 'Musique latine',
        translations: [
          { code: 'en', content: 'Latin music' },
          { code: 'zh', content: '拉丁音乐' },
          { code: 'de', content: 'Latin Music' },
          { code: 'es', content: 'Música latina' },
        ],
      },
      {
        name: 'Pop',
        translations: [
          { code: 'en', content: 'Pop' },
          { code: 'zh', content: '流行音乐' },
          { code: 'de', content: 'Pop' },
          { code: 'es', content: 'Pop' },
        ],
      },
      {
        name: 'R&B',
        translations: [
          { code: 'en', content: 'R&B' },
          { code: 'zh', content: '节奏蓝调' },
          { code: 'de', content: 'R&B' },
          { code: 'es', content: 'R&B' },
        ],
      },
      {
        name: 'Rock',
        translations: [
          { code: 'en', content: 'Rock' },
          { code: 'zh', content: '摇滚' },
          { code: 'de', content: 'Rock' },
          { code: 'es', content: 'Rock' },
        ],
      },
    ],
  },
  {
    category: {
      name: 'Sport & Santé',
      translations: [
        { code: 'en', content: 'Sport & Health' },
        { code: 'zh', content: '体育和健康' },
        { code: 'de', content: 'Sport & Gesundheit' },
        { code: 'es', content: 'Deporte y salud' },
      ],
    },
    items: [
      {
        name: 'Bénévolat',
        translations: [
          { code: 'en', content: 'Volunteering' },
          { code: 'zh', content: '志愿服务' },
          { code: 'de', content: 'Ehrenamtliche Arbeit' },
          { code: 'es', content: 'Voluntario' },
        ],
      },
      {
        name: 'Bricolage',
        translations: [
          { code: 'en', content: 'DIY' },
          { code: 'zh', content: '自己动手修修弄弄' },
          { code: 'de', content: 'Basteln' },
          { code: 'es', content: 'Bricolage' },
        ],
      },
      {
        name: 'Couture/crochet',
        translations: [
          { code: 'en', content: 'Sewing/crochet' },
          { code: 'zh', content: '缝纫/钩织' },
          { code: 'de', content: 'Nähen/Häkeln' },
          { code: 'es', content: 'Costura / ganchillo' },
        ],
      },
      {
        name: 'Cuisine',
        translations: [
          { code: 'en', content: 'Cooking' },
          { code: 'zh', content: '烹饪' },
          { code: 'de', content: 'Kochen' },
          { code: 'es', content: 'Cocina' },
        ],
      },
      {
        name: 'Histoire',
        translations: [
          { code: 'en', content: 'History' },
          { code: 'zh', content: '历史' },
          { code: 'de', content: 'Geschichte' },
          { code: 'es', content: 'Historia' },
        ],
      },
      {
        name: 'Informatique',
        translations: [
          { code: 'en', content: 'Computer science' },
          { code: 'zh', content: '信息科学' },
          { code: 'de', content: 'Computer' },
          { code: 'es', content: 'Informática' },
        ],
      },
      {
        name: 'Jardinage',
        translations: [
          { code: 'en', content: 'Gardening' },
          { code: 'zh', content: '园艺' },
          { code: 'de', content: 'Gartenarbeit' },
          { code: 'es', content: 'Jardinería' },
        ],
      },
      {
        name: 'Jeux de societé',
        translations: [
          { code: 'en', content: 'Board games' },
          { code: 'zh', content: '室内游戏' },
          { code: 'de', content: 'Gesellschaftsspiele' },
          { code: 'es', content: 'Juegos de sociedad' },
        ],
      },
      {
        name: 'Jeux videos',
        translations: [
          { code: 'en', content: 'Video games' },
          { code: 'zh', content: '电子游戏' },
          { code: 'de', content: 'Videospiele' },
          { code: 'es', content: 'Juegos de video' },
        ],
      },
      {
        name: 'Langues étrangeres',
        translations: [
          { code: 'en', content: 'Foreign languages' },
          { code: 'zh', content: '外语' },
          { code: 'de', content: 'Fremdsprachen' },
          { code: 'es', content: 'Idiomas extranjeros' },
        ],
      },
      {
        name: 'Lecture',
        translations: [
          { code: 'en', content: 'Reading' },
          { code: 'zh', content: '阅读' },
          { code: 'de', content: 'Lesen' },
          { code: 'es', content: 'Lectura' },
        ],
      },
      {
        name: 'Sciences',
        translations: [
          { code: 'en', content: 'Science' },
          { code: 'zh', content: '科学' },
          { code: 'de', content: 'Naturwissenschaft' },
          { code: 'es', content: 'Ciencias' },
        ],
      },
      {
        name: 'Psychologie',
        translations: [
          { code: 'en', content: 'Psychology' },
          { code: 'zh', content: '心理学' },
          { code: 'de', content: 'Psychologie' },
          { code: 'es', content: 'Psicología' },
        ],
      },
    ],
  },
  {
    category: {
      name: 'Lieux & espaces',
      translations: [
        { code: 'en', content: 'Places & Spaces' },
        { code: 'zh', content: '地点和空间' },
        { code: 'de', content: 'Orte & Räume' },
        { code: 'es', content: 'Lugares y espacios' },
      ],
    },
    items: [
      {
        name: 'Bénévolat',
        translations: [
          { code: 'en', content: 'Volunteering' },
          { code: 'zh', content: '志愿服务' },
          { code: 'de', content: 'Ehrenamtliche Arbeit' },
          { code: 'es', content: 'Voluntario' },
        ],
      },
      {
        name: 'Bricolage',
        translations: [
          { code: 'en', content: 'DIY' },
          { code: 'zh', content: '自己动手修修弄弄' },
          { code: 'de', content: 'Basteln' },
          { code: 'es', content: 'Bricolage' },
        ],
      },
      {
        name: 'Couture/crochet',
        translations: [
          { code: 'en', content: 'Sewing/crochet' },
          { code: 'zh', content: '缝纫/钩织' },
          { code: 'de', content: 'Nähen/Häkeln' },
          { code: 'es', content: 'Costura / ganchillo' },
        ],
      },
      {
        name: 'Cuisine',
        translations: [
          { code: 'en', content: 'Cooking' },
          { code: 'zh', content: '烹饪' },
          { code: 'de', content: 'Kochen' },
          { code: 'es', content: 'Cocina' },
        ],
      },
      {
        name: 'Histoire',
        translations: [
          { code: 'en', content: 'History' },
          { code: 'zh', content: '历史' },
          { code: 'de', content: 'Geschichte' },
          { code: 'es', content: 'Historia' },
        ],
      },
      {
        name: 'Informatique',
        translations: [
          { code: 'en', content: 'Computer science' },
          { code: 'zh', content: '信息科学' },
          { code: 'de', content: 'Computer' },
          { code: 'es', content: 'Informática' },
        ],
      },
      {
        name: 'Jardinage',
        translations: [
          { code: 'en', content: 'Gardening' },
          { code: 'zh', content: '园艺' },
          { code: 'de', content: 'Gartenarbeit' },
          { code: 'es', content: 'Jardinería' },
        ],
      },
      {
        name: 'Jeux de societé',
        translations: [
          { code: 'en', content: 'Board games' },
          { code: 'zh', content: '室内游戏' },
          { code: 'de', content: 'Gesellschaftsspiele' },
          { code: 'es', content: 'Juegos de sociedad' },
        ],
      },
      {
        name: 'Jeux videos',
        translations: [
          { code: 'en', content: 'Video games' },
          { code: 'zh', content: '电子游戏' },
          { code: 'de', content: 'Videospiele' },
          { code: 'es', content: 'Juegos de video' },
        ],
      },
      {
        name: 'Langues étrangeres',
        translations: [
          { code: 'en', content: 'Foreign languages' },
          { code: 'zh', content: '外语' },
          { code: 'de', content: 'Fremdsprachen' },
          { code: 'es', content: 'Idiomas extranjeros' },
        ],
      },
      {
        name: 'Lecture',
        translations: [
          { code: 'en', content: 'Reading' },
          { code: 'zh', content: '阅读' },
          { code: 'de', content: 'Lesen' },
          { code: 'es', content: 'Lectura' },
        ],
      },
      {
        name: 'Sciences',
        translations: [
          { code: 'en', content: 'Science' },
          { code: 'zh', content: '科学' },
          { code: 'de', content: 'Naturwissenschaft' },
          { code: 'es', content: 'Ciencias' },
        ],
      },
      {
        name: 'Psychologie',
        translations: [
          { code: 'en', content: 'Psychology' },
          { code: 'zh', content: '心理学' },
          { code: 'de', content: 'Psychologie' },
          { code: 'es', content: 'Psicología' },
        ],
      },
    ],
  },
  {
    category: {
      name: 'Sujets académiques',
      translations: [
        { code: 'en', content: 'Academic subjects' },
        { code: 'zh', content: '学术主题' },
        { code: 'de', content: 'Akademische Themen' },
        { code: 'es', content: 'Temas académicos' },
      ],
    },
    items: [
      {
        name: 'Bénévolat',
        translations: [
          { code: 'en', content: 'Volunteering' },
          { code: 'zh', content: '志愿服务' },
          { code: 'de', content: 'Ehrenamtliche Arbeit' },
          { code: 'es', content: 'Voluntario' },
        ],
      },
      {
        name: 'Bricolage',
        translations: [
          { code: 'en', content: 'DIY' },
          { code: 'zh', content: '自己动手修修弄弄' },
          { code: 'de', content: 'Basteln' },
          { code: 'es', content: 'Bricolage' },
        ],
      },
      {
        name: 'Couture/crochet',
        translations: [
          { code: 'en', content: 'Sewing/crochet' },
          { code: 'zh', content: '缝纫/钩织' },
          { code: 'de', content: 'Nähen/Häkeln' },
          { code: 'es', content: 'Costura / ganchillo' },
        ],
      },
      {
        name: 'Cuisine',
        translations: [
          { code: 'en', content: 'Cooking' },
          { code: 'zh', content: '烹饪' },
          { code: 'de', content: 'Kochen' },
          { code: 'es', content: 'Cocina' },
        ],
      },
      {
        name: 'Histoire',
        translations: [
          { code: 'en', content: 'History' },
          { code: 'zh', content: '历史' },
          { code: 'de', content: 'Geschichte' },
          { code: 'es', content: 'Historia' },
        ],
      },
      {
        name: 'Informatique',
        translations: [
          { code: 'en', content: 'Computer science' },
          { code: 'zh', content: '信息科学' },
          { code: 'de', content: 'Computer' },
          { code: 'es', content: 'Informática' },
        ],
      },
      {
        name: 'Jardinage',
        translations: [
          { code: 'en', content: 'Gardening' },
          { code: 'zh', content: '园艺' },
          { code: 'de', content: 'Gartenarbeit' },
          { code: 'es', content: 'Jardinería' },
        ],
      },
      {
        name: 'Jeux de societé',
        translations: [
          { code: 'en', content: 'Board games' },
          { code: 'zh', content: '室内游戏' },
          { code: 'de', content: 'Gesellschaftsspiele' },
          { code: 'es', content: 'Juegos de sociedad' },
        ],
      },
      {
        name: 'Jeux videos',
        translations: [
          { code: 'en', content: 'Video games' },
          { code: 'zh', content: '电子游戏' },
          { code: 'de', content: 'Videospiele' },
          { code: 'es', content: 'Juegos de video' },
        ],
      },
      {
        name: 'Langues étrangeres',
        translations: [
          { code: 'en', content: 'Foreign languages' },
          { code: 'zh', content: '外语' },
          { code: 'de', content: 'Fremdsprachen' },
          { code: 'es', content: 'Idiomas extranjeros' },
        ],
      },
      {
        name: 'Lecture',
        translations: [
          { code: 'en', content: 'Reading' },
          { code: 'zh', content: '阅读' },
          { code: 'de', content: 'Lesen' },
          { code: 'es', content: 'Lectura' },
        ],
      },
      {
        name: 'Sciences',
        translations: [
          { code: 'en', content: 'Science' },
          { code: 'zh', content: '科学' },
          { code: 'de', content: 'Naturwissenschaft' },
          { code: 'es', content: 'Ciencias' },
        ],
      },
      {
        name: 'Psychologie',
        translations: [
          { code: 'en', content: 'Psychology' },
          { code: 'zh', content: '心理学' },
          { code: 'de', content: 'Psychologie' },
          { code: 'es', content: 'Psicología' },
        ],
      },
    ],
  },
  {
    category: {
      name: 'Autres',
      translations: [
        { code: 'en', content: 'Other' },
        { code: 'zh', content: '其他' },
        { code: 'de', content: 'Andere' },
        { code: 'es', content: 'Otros' },
      ],
    },
    items: [
      {
        name: 'Bénévolat',
        translations: [
          { code: 'en', content: 'Volunteering' },
          { code: 'zh', content: '志愿服务' },
          { code: 'de', content: 'Ehrenamtliche Arbeit' },
          { code: 'es', content: 'Voluntario' },
        ],
      },
      {
        name: 'Bricolage',
        translations: [
          { code: 'en', content: 'DIY' },
          { code: 'zh', content: '自己动手修修弄弄' },
          { code: 'de', content: 'Basteln' },
          { code: 'es', content: 'Bricolage' },
        ],
      },
      {
        name: 'Couture/crochet',
        translations: [
          { code: 'en', content: 'Sewing/crochet' },
          { code: 'zh', content: '缝纫/钩织' },
          { code: 'de', content: 'Nähen/Häkeln' },
          { code: 'es', content: 'Costura / ganchillo' },
        ],
      },
      {
        name: 'Cuisine',
        translations: [
          { code: 'en', content: 'Cooking' },
          { code: 'zh', content: '烹饪' },
          { code: 'de', content: 'Kochen' },
          { code: 'es', content: 'Cocina' },
        ],
      },
      {
        name: 'Histoire',
        translations: [
          { code: 'en', content: 'History' },
          { code: 'zh', content: '历史' },
          { code: 'de', content: 'Geschichte' },
          { code: 'es', content: 'Historia' },
        ],
      },
      {
        name: 'Informatique',
        translations: [
          { code: 'en', content: 'Computer science' },
          { code: 'zh', content: '信息科学' },
          { code: 'de', content: 'Computer' },
          { code: 'es', content: 'Informática' },
        ],
      },
      {
        name: 'Jardinage',
        translations: [
          { code: 'en', content: 'Gardening' },
          { code: 'zh', content: '园艺' },
          { code: 'de', content: 'Gartenarbeit' },
          { code: 'es', content: 'Jardinería' },
        ],
      },
      {
        name: 'Jeux de societé',
        translations: [
          { code: 'en', content: 'Board games' },
          { code: 'zh', content: '室内游戏' },
          { code: 'de', content: 'Gesellschaftsspiele' },
          { code: 'es', content: 'Juegos de sociedad' },
        ],
      },
      {
        name: 'Jeux videos',
        translations: [
          { code: 'en', content: 'Video games' },
          { code: 'zh', content: '电子游戏' },
          { code: 'de', content: 'Videospiele' },
          { code: 'es', content: 'Juegos de video' },
        ],
      },
      {
        name: 'Langues étrangeres',
        translations: [
          { code: 'en', content: 'Foreign languages' },
          { code: 'zh', content: '外语' },
          { code: 'de', content: 'Fremdsprachen' },
          { code: 'es', content: 'Idiomas extranjeros' },
        ],
      },
      {
        name: 'Lecture',
        translations: [
          { code: 'en', content: 'Reading' },
          { code: 'zh', content: '阅读' },
          { code: 'de', content: 'Lesen' },
          { code: 'es', content: 'Lectura' },
        ],
      },
      {
        name: 'Sciences',
        translations: [
          { code: 'en', content: 'Science' },
          { code: 'zh', content: '科学' },
          { code: 'de', content: 'Naturwissenschaft' },
          { code: 'es', content: 'Ciencias' },
        ],
      },
      {
        name: 'Psychologie',
        translations: [
          { code: 'en', content: 'Psychology' },
          { code: 'zh', content: '心理学' },
          { code: 'de', content: 'Psychologie' },
          { code: 'es', content: 'Psicología' },
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
