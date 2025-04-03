/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import { PrismaClient } from '@prisma/client';
const interests: {
  category: { name: string; translations: { code: string; content: string }[] };
  items: { name: string; translations: { code: string; content: string }[] }[];
}[] = [
  {
    category: {
      name: 'Sports',
      translations: [
        { code: 'en', content: 'Sports' },
        { code: 'zh', content: '体育' },
        { code: 'de', content: 'Sport' },
        { code: 'es', content: 'Deportes' },
      ],
    },
    items: [
      {
        name: 'Basketball',
        translations: [
          { code: 'en', content: 'Basketball' },
          { code: 'zh', content: '篮球' },
          { code: 'de', content: 'Basketball' },
          { code: 'es', content: 'Baloncesto' },
        ],
      },
      {
        name: 'BMX/Skateboard',
        translations: [
          { code: 'en', content: 'BMX/Skateboard' },
          { code: 'zh', content: '小轮车/滑板' },
          { code: 'de', content: 'BMX/Skateboard' },
          { code: 'es', content: 'BMX/Skateboard' },
        ],
      },
      {
        name: 'Danse',
        translations: [
          { code: 'en', content: 'Dance' },
          { code: 'zh', content: '舞蹈' },
          { code: 'de', content: 'Tanzen' },
          { code: 'es', content: 'Baile' },
        ],
      },
      {
        name: 'Équitation',
        translations: [
          { code: 'en', content: 'Horse riding' },
          { code: 'zh', content: '骑术' },
          { code: 'de', content: 'Reiten' },
          { code: 'es', content: 'Equitación' },
        ],
      },
      {
        name: 'Football',
        translations: [
          { code: 'en', content: 'Football' },
          { code: 'zh', content: '足球' },
          { code: 'de', content: 'Fußball' },
          { code: 'es', content: 'Fútbol' },
        ],
      },
      {
        name: 'Musculation',
        translations: [
          { code: 'en', content: 'Bodybuilding' },
          { code: 'zh', content: '健美运动' },
          { code: 'de', content: 'Krafttraining' },
          { code: 'es', content: 'Culturismo' },
        ],
      },
      {
        name: 'Natation',
        translations: [
          { code: 'en', content: 'Swimming' },
          { code: 'zh', content: '游泳' },
          { code: 'de', content: 'Schwimmen' },
          { code: 'es', content: 'Natación' },
        ],
      },
      {
        name: 'Randonnée',
        translations: [
          { code: 'en', content: 'Hiking' },
          { code: 'zh', content: '远足' },
          { code: 'de', content: 'Wandern' },
          { code: 'es', content: 'Senderismo' },
        ],
      },
      {
        name: 'Rugby',
        translations: [
          { code: 'en', content: 'Rugby' },
          { code: 'zh', content: '橄榄球' },
          { code: 'de', content: 'Rugby' },
          { code: 'es', content: 'Rugby' },
        ],
      },
      {
        name: 'Running',
        translations: [
          { code: 'en', content: 'Running' },
          { code: 'zh', content: '跑步' },
          { code: 'de', content: 'Laufen' },
          { code: 'es', content: 'Correr' },
        ],
      },
      {
        name: 'Salsa',
        translations: [
          { code: 'en', content: 'Salsa' },
          { code: 'zh', content: '莎莎' },
          { code: 'de', content: 'Salsa' },
          { code: 'es', content: 'Salsa' },
        ],
      },
      {
        name: 'Ski',
        translations: [
          { code: 'en', content: 'Skiing' },
          { code: 'zh', content: '滑雪' },
          { code: 'de', content: 'Skifahren' },
          { code: 'es', content: 'Esquí' },
        ],
      },
      {
        name: 'Surf',
        translations: [
          { code: 'en', content: 'Surfing' },
          { code: 'zh', content: '冲浪运动' },
          { code: 'de', content: 'Surfen' },
          { code: 'es', content: 'Surf' },
        ],
      },
      {
        name: 'Tennis',
        translations: [
          { code: 'en', content: 'Tennis' },
          { code: 'zh', content: '网球运动' },
          { code: 'de', content: 'Tennis' },
          { code: 'es', content: 'Tenis' },
        ],
      },
      {
        name: 'Velo',
        translations: [
          { code: 'en', content: 'Cycling' },
          { code: 'zh', content: '骑自行车' },
          { code: 'de', content: 'Fahrrad' },
          { code: 'es', content: 'Bicicleta' },
        ],
      },
      {
        name: 'Volleyball',
        translations: [
          { code: 'en', content: 'Volleyball' },
          { code: 'zh', content: '排球' },
          { code: 'de', content: 'Volleyball' },
          { code: 'es', content: 'Voleibol' },
        ],
      },
      {
        name: 'Yoga Méditation',
        translations: [
          { code: 'en', content: 'Yoga meditation' },
          { code: 'zh', content: '瑜伽冥想' },
          { code: 'de', content: 'Yoga Meditation' },
          { code: 'es', content: 'Yoga meditación' },
        ],
      },
    ],
  },
  {
    category: {
      name: 'Arts',
      translations: [
        { code: 'en', content: 'Arts' },
        { code: 'zh', content: '艺术' },
        { code: 'de', content: 'Kunst' },
        { code: 'es', content: 'Artes' },
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
      name: 'Ciné/séries',
      translations: [
        { code: 'en', content: 'Cinema/TV series' },
        { code: 'zh', content: '电影/连续剧' },
        { code: 'de', content: 'Film/Serien' },
        { code: 'es', content: 'Cine/series' },
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
      name: 'Voyage',
      translations: [
        { code: 'en', content: 'Travel' },
        { code: 'zh', content: '旅行' },
        { code: 'de', content: 'Reisen' },
        { code: 'es', content: 'Viaje' },
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
      name: 'Musique',
      translations: [
        { code: 'en', content: 'Music' },
        { code: 'zh', content: '音乐' },
        { code: 'de', content: 'Musik' },
        { code: 'es', content: 'Música' },
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
      name: 'Loisirs',
      translations: [
        { code: 'en', content: 'Hobbies' },
        { code: 'zh', content: '消遣' },
        { code: 'de', content: 'Freizeit' },
        { code: 'es', content: 'Ocio' },
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

export const createInterests = async (prisma: PrismaClient): Promise<void> => {
  for (const interest of interests) {
    const category = await prisma.interestCategories.create({
      data: {
        TextContent: {
          create: {
            text: interest.category.name,
            LanguageCode: { connect: { code: 'en' } },
            Translations: {
              create: interest.category.translations?.map((translation) => ({
                text: translation.content,
                LanguageCode: { connect: { code: translation.code } },
              })),
            },
          },
        },
      },
    });

    for (const item of interest.items) {
      await prisma.interests.create({
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
