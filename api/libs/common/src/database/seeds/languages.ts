import { PrismaClient } from '@prisma/client';

const isoCodes = {
  aa: {
    iso6391: 'aa',
    iso6392: 'aar',
    family: 'Afro-Asiatic',
    name: 'Afar',
    wikiUrl: 'https://en.wikipedia.org/wiki/Afar_language',
  },
  ab: {
    iso6391: 'ab',
    iso6392: 'abk',
    family: 'Northwest Caucasian',
    name: 'Abkhaz',
    wikiUrl: 'https://en.wikipedia.org/wiki/Abkhaz_language',
  },
  ae: {
    iso6391: 'ae',
    iso6392: 'ave',
    family: 'Indo-European',
    name: 'Avestan',
    wikiUrl: 'https://en.wikipedia.org/wiki/Avestan_language',
  },
  af: {
    iso6391: 'af',
    iso6392: 'afr',
    family: 'Indo-European',
    name: 'Afrikaans',
    wikiUrl: 'https://en.wikipedia.org/wiki/Afrikaans_language',
  },
  ak: {
    iso6391: 'ak',
    iso6392: 'aka',
    family: 'Niger–Congo',
    name: 'Akan',
    wikiUrl: 'https://en.wikipedia.org/wiki/Akan_language',
  },
  am: {
    iso6391: 'am',
    iso6392: 'amh',
    family: 'Afro-Asiatic',
    name: 'Amharic',
    wikiUrl: 'https://en.wikipedia.org/wiki/Amharic_language',
  },
  an: {
    iso6391: 'an',
    iso6392: 'arg',
    family: 'Indo-European',
    name: 'Aragonese',
    wikiUrl: 'https://en.wikipedia.org/wiki/Aragonese_language',
  },
  ar: {
    iso6391: 'ar',
    iso6392: 'ara',
    family: 'Afro-Asiatic',
    name: 'Arabic',
    wikiUrl: 'https://en.wikipedia.org/wiki/Arabic_language',
  },
  as: {
    iso6391: 'as',
    iso6392: 'asm',
    family: 'Indo-European',
    name: 'Assamese',
    wikiUrl: 'https://en.wikipedia.org/wiki/Assamese_language',
  },
  av: {
    iso6391: 'av',
    iso6392: 'ava',
    family: 'Northeast Caucasian',
    name: 'Avaric',
    wikiUrl: 'https://en.wikipedia.org/wiki/Avar_language',
  },
  ay: {
    iso6391: 'ay',
    iso6392: 'aym',
    family: 'Aymaran',
    name: 'Aymara',
    wikiUrl: 'https://en.wikipedia.org/wiki/Aymara_language',
  },
  az: {
    iso6391: 'az',
    iso6392: 'aze',
    family: 'Turkic',
    name: 'Azerbaijani',
    wikiUrl: 'https://en.wikipedia.org/wiki/Azerbaijani_language',
  },
  ba: {
    iso6391: 'ba',
    iso6392: 'bak',
    family: 'Turkic',
    name: 'Bashkir',
    wikiUrl: 'https://en.wikipedia.org/wiki/Bashkir_language',
  },
  be: {
    iso6391: 'be',
    iso6392: 'bel',
    family: 'Indo-European',
    name: 'Belarusian',
    wikiUrl: 'https://en.wikipedia.org/wiki/Belarusian_language',
  },
  bg: {
    iso6391: 'bg',
    iso6392: 'bul',
    family: 'Indo-European',
    name: 'Bulgarian',
    wikiUrl: 'https://en.wikipedia.org/wiki/Bulgarian_language',
  },
  bh: {
    iso6391: 'bh',
    iso6392: 'bih',
    family: 'Indo-European',
    name: 'Bihari',
    wikiUrl: 'https://en.wikipedia.org/wiki/Bihari_languages',
  },
  bi: {
    iso6391: 'bi',
    iso6392: 'bis',
    family: 'Creole',
    name: 'Bislama',
    wikiUrl: 'https://en.wikipedia.org/wiki/Bislama_language',
  },
  bm: {
    iso6391: 'bm',
    iso6392: 'bam',
    family: 'Niger–Congo',
    name: 'Bambara',
    wikiUrl: 'https://en.wikipedia.org/wiki/Bambara_language',
  },
  bn: {
    iso6391: 'bn',
    iso6392: 'ben',
    family: 'Indo-European',
    name: 'Bengali, Bangla',
    wikiUrl: 'https://en.wikipedia.org/wiki/Bengali_language',
  },
  bo: {
    iso6391: 'bo',
    iso6392: 'bod',
    '639-2/B': 'tib',
    family: 'Sino-Tibetan',
    name: 'Tibetan Standard, Tibetan, Central',
    wikiUrl: 'https://en.wikipedia.org/wiki/Standard_Tibetan',
  },
  br: {
    iso6391: 'br',
    iso6392: 'bre',
    family: 'Indo-European',
    name: 'Breton',
    wikiUrl: 'https://en.wikipedia.org/wiki/Breton_language',
  },
  bs: {
    iso6391: 'bs',
    iso6392: 'bos',
    family: 'Indo-European',
    name: 'Bosnian',
    wikiUrl: 'https://en.wikipedia.org/wiki/Bosnian_language',
  },
  ca: {
    iso6391: 'ca',
    iso6392: 'cat',
    family: 'Indo-European',
    name: 'Catalan',
    wikiUrl: 'https://en.wikipedia.org/wiki/Catalan_language',
  },
  ce: {
    iso6391: 'ce',
    iso6392: 'che',
    family: 'Northeast Caucasian',
    name: 'Chechen',

    wikiUrl: 'https://en.wikipedia.org/wiki/Chechen_language',
  },
  ch: {
    iso6391: 'ch',
    iso6392: 'cha',
    family: 'Austronesian',
    name: 'Chamorro',
    wikiUrl: 'https://en.wikipedia.org/wiki/Chamorro_language',
  },
  co: {
    iso6391: 'co',
    iso6392: 'cos',
    family: 'Indo-European',
    name: 'Corsican',

    wikiUrl: 'https://en.wikipedia.org/wiki/Corsican_language',
  },
  cr: {
    iso6391: 'cr',
    iso6392: 'cre',
    family: 'Algonquian',
    name: 'Cree',

    wikiUrl: 'https://en.wikipedia.org/wiki/Cree_language',
  },
  cs: {
    iso6391: 'cs',
    iso6392: 'ces',
    '639-2/B': 'cze',
    family: 'Indo-European',
    name: 'Czech',

    wikiUrl: 'https://en.wikipedia.org/wiki/Czech_language',
  },
  cu: {
    iso6391: 'cu',
    iso6392: 'chu',
    family: 'Indo-European',
    name: 'Old Church Slavonic, Church Slavonic, Old Bulgarian',

    wikiUrl: 'https://en.wikipedia.org/wiki/Old_Church_Slavonic',
  },
  cv: {
    iso6391: 'cv',
    iso6392: 'chv',
    family: 'Turkic',
    name: 'Chuvash',

    wikiUrl: 'https://en.wikipedia.org/wiki/Chuvash_language',
  },
  cy: {
    iso6391: 'cy',
    iso6392: 'cym',
    '639-2/B': 'wel',
    family: 'Indo-European',
    name: 'Welsh',

    wikiUrl: 'https://en.wikipedia.org/wiki/Welsh_language',
  },
  da: {
    iso6391: 'da',
    iso6392: 'dan',
    family: 'Indo-European',
    name: 'Danish',

    wikiUrl: 'https://en.wikipedia.org/wiki/Danish_language',
  },
  de: {
    iso6391: 'de',
    iso6392: 'deu',
    '639-2/B': 'ger',
    family: 'Indo-European',
    name: 'German',

    wikiUrl: 'https://en.wikipedia.org/wiki/German_language',
  },
  dv: {
    iso6391: 'dv',
    iso6392: 'div',
    family: 'Indo-European',
    name: 'Divehi, Dhivehi, Maldivian',

    wikiUrl: 'https://en.wikipedia.org/wiki/Dhivehi_language',
  },
  dz: {
    iso6391: 'dz',
    iso6392: 'dzo',
    family: 'Sino-Tibetan',
    name: 'Dzongkha',

    wikiUrl: 'https://en.wikipedia.org/wiki/Dzongkha_language',
  },
  ee: {
    iso6391: 'ee',
    iso6392: 'ewe',
    family: 'Niger–Congo',
    name: 'Ewe',

    wikiUrl: 'https://en.wikipedia.org/wiki/Ewe_language',
  },
  el: {
    iso6391: 'el',
    iso6392: 'ell',
    '639-2/B': 'gre',
    family: 'Indo-European',
    name: 'Greek (modern)',

    wikiUrl: 'https://en.wikipedia.org/wiki/Greek_language',
  },
  en: {
    iso6391: 'en',
    iso6392: 'eng',
    family: 'Indo-European',
    name: 'English',

    wikiUrl: 'https://en.wikipedia.org/wiki/English_language',
  },
  eo: {
    iso6391: 'eo',
    iso6392: 'epo',
    family: 'Constructed',
    name: 'Esperanto',

    wikiUrl: 'https://en.wikipedia.org/wiki/Esperanto',
  },
  es: {
    iso6391: 'es',
    iso6392: 'spa',
    family: 'Indo-European',
    name: 'Spanish',

    wikiUrl: 'https://en.wikipedia.org/wiki/Spanish_language',
  },
  et: {
    iso6391: 'et',
    iso6392: 'est',
    family: 'Uralic',
    name: 'Estonian',

    wikiUrl: 'https://en.wikipedia.org/wiki/Estonian_language',
  },
  eu: {
    iso6391: 'eu',
    iso6392: 'eus',
    '639-2/B': 'baq',
    family: 'Language isolate',
    name: 'Basque',

    wikiUrl: 'https://en.wikipedia.org/wiki/Basque_language',
  },
  fa: {
    iso6391: 'fa',
    iso6392: 'fas',
    '639-2/B': 'per',
    family: 'Indo-European',
    name: 'Persian (Farsi)',

    wikiUrl: 'https://en.wikipedia.org/wiki/Persian_language',
  },
  ff: {
    iso6391: 'ff',
    iso6392: 'ful',
    family: 'Niger–Congo',
    name: 'Fula, Fulah, Pulaar, Pular',

    wikiUrl: 'https://en.wikipedia.org/wiki/Fula_language',
  },
  fi: {
    iso6391: 'fi',
    iso6392: 'fin',
    family: 'Uralic',
    name: 'Finnish',

    wikiUrl: 'https://en.wikipedia.org/wiki/Finnish_language',
  },
  fj: {
    iso6391: 'fj',
    iso6392: 'fij',
    family: 'Austronesian',
    name: 'Fijian',

    wikiUrl: 'https://en.wikipedia.org/wiki/Fijian_language',
  },
  fo: {
    iso6391: 'fo',
    iso6392: 'fao',
    family: 'Indo-European',
    name: 'Faroese',

    wikiUrl: 'https://en.wikipedia.org/wiki/Faroese_language',
  },
  fr: {
    iso6391: 'fr',
    iso6392: 'fra',
    '639-2/B': 'fre',
    family: 'Indo-European',
    name: 'French',

    wikiUrl: 'https://en.wikipedia.org/wiki/French_language',
  },
  fy: {
    iso6391: 'fy',
    iso6392: 'fry',
    family: 'Indo-European',
    name: 'Western Frisian',

    wikiUrl: 'https://en.wikipedia.org/wiki/West_Frisian_language',
  },
  ga: {
    iso6391: 'ga',
    iso6392: 'gle',
    family: 'Indo-European',
    name: 'Irish',

    wikiUrl: 'https://en.wikipedia.org/wiki/Irish_language',
  },
  gd: {
    iso6391: 'gd',
    iso6392: 'gla',
    family: 'Indo-European',
    name: 'Scottish Gaelic, Gaelic',

    wikiUrl: 'https://en.wikipedia.org/wiki/Scottish_Gaelic_language',
  },
  gl: {
    iso6391: 'gl',
    iso6392: 'glg',
    family: 'Indo-European',
    name: 'Galician',

    wikiUrl: 'https://en.wikipedia.org/wiki/Galician_language',
  },
  gn: {
    iso6391: 'gn',
    iso6392: 'grn',
    family: 'Tupian',
    name: 'Guaraní',
    nativeName: "Avañe'ẽ",
    wikiUrl: 'https://en.wikipedia.org/wiki/Guaran%C3%AD_language',
  },
  gu: {
    iso6391: 'gu',
    iso6392: 'guj',
    family: 'Indo-European',
    name: 'Gujarati',

    wikiUrl: 'https://en.wikipedia.org/wiki/Gujarati_language',
  },
  gv: {
    iso6391: 'gv',
    iso6392: 'glv',
    family: 'Indo-European',
    name: 'Manx',

    wikiUrl: 'https://en.wikipedia.org/wiki/Manx_language',
  },
  ha: {
    iso6391: 'ha',
    iso6392: 'hau',
    family: 'Afro-Asiatic',
    name: 'Hausa',

    wikiUrl: 'https://en.wikipedia.org/wiki/Hausa_language',
  },
  he: {
    iso6391: 'he',
    iso6392: 'heb',
    family: 'Afro-Asiatic',
    name: 'Hebrew (modern)',

    wikiUrl: 'https://en.wikipedia.org/wiki/Hebrew_language',
  },
  hi: {
    iso6391: 'hi',
    iso6392: 'hin',
    family: 'Indo-European',
    name: 'Hindi',

    wikiUrl: 'https://en.wikipedia.org/wiki/Hindi',
  },
  ho: {
    iso6391: 'ho',
    iso6392: 'hmo',
    family: 'Austronesian',
    name: 'Hiri Motu',

    wikiUrl: 'https://en.wikipedia.org/wiki/Hiri_Motu_language',
  },
  hr: {
    iso6391: 'hr',
    iso6392: 'hrv',
    family: 'Indo-European',
    name: 'Croatian',

    wikiUrl: 'https://en.wikipedia.org/wiki/Croatian_language',
  },
  ht: {
    iso6391: 'ht',
    iso6392: 'hat',
    family: 'Creole',
    name: 'Haitian, Haitian Creole',

    wikiUrl: 'https://en.wikipedia.org/wiki/Haitian_Creole_language',
  },
  hu: {
    iso6391: 'hu',
    iso6392: 'hun',
    family: 'Uralic',
    name: 'Hungarian',

    wikiUrl: 'https://en.wikipedia.org/wiki/Hungarian_language',
  },
  hy: {
    iso6391: 'hy',
    iso6392: 'hye',
    '639-2/B': 'arm',
    family: 'Indo-European',
    name: 'Armenian',

    wikiUrl: 'https://en.wikipedia.org/wiki/Armenian_language',
  },
  hz: {
    iso6391: 'hz',
    iso6392: 'her',
    family: 'Niger–Congo',
    name: 'Herero',

    wikiUrl: 'https://en.wikipedia.org/wiki/Herero_language',
  },
  ia: {
    iso6391: 'ia',
    iso6392: 'ina',
    family: 'Constructed',
    name: 'Interlingua',

    wikiUrl: 'https://en.wikipedia.org/wiki/Interlingua',
  },
  id: {
    iso6391: 'id',
    iso6392: 'ind',
    family: 'Austronesian',
    name: 'Indonesian',

    wikiUrl: 'https://en.wikipedia.org/wiki/Indonesian_language',
  },
  ie: {
    iso6391: 'ie',
    iso6392: 'ile',
    family: 'Constructed',
    name: 'Interlingue',

    wikiUrl: 'https://en.wikipedia.org/wiki/Interlingue_language',
  },
  ig: {
    iso6391: 'ig',
    iso6392: 'ibo',
    family: 'Niger–Congo',
    name: 'Igbo',

    wikiUrl: 'https://en.wikipedia.org/wiki/Igbo_language',
  },
  ii: {
    iso6391: 'ii',
    iso6392: 'iii',
    family: 'Sino-Tibetan',
    name: 'Nuosu',

    wikiUrl: 'https://en.wikipedia.org/wiki/Nuosu_language',
  },
  ik: {
    iso6391: 'ik',
    iso6392: 'ipk',
    family: 'Eskimo–Aleut',
    name: 'Inupiaq',

    wikiUrl: 'https://en.wikipedia.org/wiki/Inupiaq_language',
  },
  io: {
    iso6391: 'io',
    iso6392: 'ido',
    family: 'Constructed',
    name: 'Ido',

    wikiUrl: 'https://en.wikipedia.org/wiki/Ido_(language)',
  },
  is: {
    iso6391: 'is',
    iso6392: 'isl',
    '639-2/B': 'ice',
    family: 'Indo-European',
    name: 'Icelandic',

    wikiUrl: 'https://en.wikipedia.org/wiki/Icelandic_language',
  },
  it: {
    iso6391: 'it',
    iso6392: 'ita',
    family: 'Indo-European',
    name: 'Italian',

    wikiUrl: 'https://en.wikipedia.org/wiki/Italian_language',
  },
  iu: {
    iso6391: 'iu',
    iso6392: 'iku',
    family: 'Eskimo–Aleut',
    name: 'Inuktitut',

    wikiUrl: 'https://en.wikipedia.org/wiki/Inuktitut',
  },
  ja: {
    iso6391: 'ja',
    iso6392: 'jpn',
    family: 'Japonic',
    name: 'Japanese',

    wikiUrl: 'https://en.wikipedia.org/wiki/Japanese_language',
  },
  jv: {
    iso6391: 'jv',
    iso6392: 'jav',
    family: 'Austronesian',
    name: 'Javanese',

    wikiUrl: 'https://en.wikipedia.org/wiki/Javanese_language',
  },
  ka: {
    iso6391: 'ka',
    iso6392: 'kat',
    '639-2/B': 'geo',
    family: 'South Caucasian',
    name: 'Georgian',

    wikiUrl: 'https://en.wikipedia.org/wiki/Georgian_language',
  },
  kg: {
    iso6391: 'kg',
    iso6392: 'kon',
    family: 'Niger–Congo',
    name: 'Kongo',

    wikiUrl: 'https://en.wikipedia.org/wiki/Kongo_language',
  },
  ki: {
    iso6391: 'ki',
    iso6392: 'kik',
    family: 'Niger–Congo',
    name: 'Kikuyu, Gikuyu',

    wikiUrl: 'https://en.wikipedia.org/wiki/Gikuyu_language',
  },
  kj: {
    iso6391: 'kj',
    iso6392: 'kua',
    family: 'Niger–Congo',
    name: 'Kwanyama, Kuanyama',

    wikiUrl: 'https://en.wikipedia.org/wiki/Kwanyama',
  },
  kk: {
    iso6391: 'kk',
    iso6392: 'kaz',
    family: 'Turkic',
    name: 'Kazakh',

    wikiUrl: 'https://en.wikipedia.org/wiki/Kazakh_language',
  },
  kl: {
    iso6391: 'kl',
    iso6392: 'kal',
    family: 'Eskimo–Aleut',
    name: 'Kalaallisut, Greenlandic',

    wikiUrl: 'https://en.wikipedia.org/wiki/Kalaallisut_language',
  },
  km: {
    iso6391: 'km',
    iso6392: 'khm',
    family: 'Austroasiatic',
    name: 'Khmer',

    wikiUrl: 'https://en.wikipedia.org/wiki/Khmer_language',
  },
  kn: {
    iso6391: 'kn',
    iso6392: 'kan',
    family: 'Dravidian',
    name: 'Kannada',

    wikiUrl: 'https://en.wikipedia.org/wiki/Kannada_language',
  },
  ko: {
    iso6391: 'ko',
    iso6392: 'kor',
    family: 'Koreanic',
    name: 'Korean',

    wikiUrl: 'https://en.wikipedia.org/wiki/Korean_language',
  },
  kr: {
    iso6391: 'kr',
    iso6392: 'kau',
    family: 'Nilo-Saharan',
    name: 'Kanuri',

    wikiUrl: 'https://en.wikipedia.org/wiki/Kanuri_language',
  },
  ks: {
    iso6391: 'ks',
    iso6392: 'kas',
    family: 'Indo-European',
    name: 'Kashmiri',

    wikiUrl: 'https://en.wikipedia.org/wiki/Kashmiri_language',
  },
  ku: {
    iso6391: 'ku',
    iso6392: 'kur',
    family: 'Indo-European',
    name: 'Kurdish',

    wikiUrl: 'https://en.wikipedia.org/wiki/Kurdish_language',
  },
  kv: {
    iso6391: 'kv',
    iso6392: 'kom',
    family: 'Uralic',
    name: 'Komi',

    wikiUrl: 'https://en.wikipedia.org/wiki/Komi_language',
  },
  kw: {
    iso6391: 'kw',
    iso6392: 'cor',
    family: 'Indo-European',
    name: 'Cornish',

    wikiUrl: 'https://en.wikipedia.org/wiki/Cornish_language',
  },
  ky: {
    iso6391: 'ky',
    iso6392: 'kir',
    family: 'Turkic',
    name: 'Kyrgyz',

    wikiUrl: 'https://en.wikipedia.org/wiki/Kyrgyz_language',
  },
  la: {
    iso6391: 'la',
    iso6392: 'lat',
    family: 'Indo-European',
    name: 'Latin',

    wikiUrl: 'https://en.wikipedia.org/wiki/Latin',
  },
  lb: {
    iso6391: 'lb',
    iso6392: 'ltz',
    family: 'Indo-European',
    name: 'Luxembourgish, Letzeburgesch',

    wikiUrl: 'https://en.wikipedia.org/wiki/Luxembourgish_language',
  },
  lg: {
    iso6391: 'lg',
    iso6392: 'lug',
    family: 'Niger–Congo',
    name: 'Ganda',

    wikiUrl: 'https://en.wikipedia.org/wiki/Luganda',
  },
  li: {
    iso6391: 'li',
    iso6392: 'lim',
    family: 'Indo-European',
    name: 'Limburgish, Limburgan, Limburger',

    wikiUrl: 'https://en.wikipedia.org/wiki/Limburgish_language',
  },
  ln: {
    iso6391: 'ln',
    iso6392: 'lin',
    family: 'Niger–Congo',
    name: 'Lingala',

    wikiUrl: 'https://en.wikipedia.org/wiki/Lingala_language',
  },
  lo: {
    iso6391: 'lo',
    iso6392: 'lao',
    family: 'Tai–Kadai',
    name: 'Lao',

    wikiUrl: 'https://en.wikipedia.org/wiki/Lao_language',
  },
  lt: {
    iso6391: 'lt',
    iso6392: 'lit',
    family: 'Indo-European',
    name: 'Lithuanian',

    wikiUrl: 'https://en.wikipedia.org/wiki/Lithuanian_language',
  },
  lu: {
    iso6391: 'lu',
    iso6392: 'lub',
    family: 'Niger–Congo',
    name: 'Luba-Katanga',

    wikiUrl: 'https://en.wikipedia.org/wiki/Tshiluba_language',
  },
  lv: {
    iso6391: 'lv',
    iso6392: 'lav',
    family: 'Indo-European',
    name: 'Latvian',

    wikiUrl: 'https://en.wikipedia.org/wiki/Latvian_language',
  },
  mg: {
    iso6391: 'mg',
    iso6392: 'mlg',
    family: 'Austronesian',
    name: 'Malagasy',

    wikiUrl: 'https://en.wikipedia.org/wiki/Malagasy_language',
  },
  mh: {
    iso6391: 'mh',
    iso6392: 'mah',
    family: 'Austronesian',
    name: 'Marshallese',

    wikiUrl: 'https://en.wikipedia.org/wiki/Marshallese_language',
  },
  mi: {
    iso6391: 'mi',
    iso6392: 'mri',
    '639-2/B': 'mao',
    family: 'Austronesian',
    name: 'Māori',

    wikiUrl: 'https://en.wikipedia.org/wiki/M%C4%81ori_language',
  },
  mk: {
    iso6391: 'mk',
    iso6392: 'mkd',
    '639-2/B': 'mac',
    family: 'Indo-European',
    name: 'Macedonian',

    wikiUrl: 'https://en.wikipedia.org/wiki/Macedonian_language',
  },
  ml: {
    iso6391: 'ml',
    iso6392: 'mal',
    family: 'Dravidian',
    name: 'Malayalam',

    wikiUrl: 'https://en.wikipedia.org/wiki/Malayalam_language',
  },
  mn: {
    iso6391: 'mn',
    iso6392: 'mon',
    family: 'Mongolic',
    name: 'Mongolian',

    wikiUrl: 'https://en.wikipedia.org/wiki/Mongolian_language',
  },
  mr: {
    iso6391: 'mr',
    iso6392: 'mar',
    family: 'Indo-European',
    name: 'Marathi (Marāṭhī)',

    wikiUrl: 'https://en.wikipedia.org/wiki/Marathi_language',
  },
  ms: {
    iso6391: 'ms',
    iso6392: 'msa',
    '639-2/B': 'may',
    family: 'Austronesian',
    name: 'Malay',

    wikiUrl: 'https://en.wikipedia.org/wiki/Malay_language',
  },
  mt: {
    iso6391: 'mt',
    iso6392: 'mlt',
    family: 'Afro-Asiatic',
    name: 'Maltese',

    wikiUrl: 'https://en.wikipedia.org/wiki/Maltese_language',
  },
  my: {
    iso6391: 'my',
    iso6392: 'mya',
    '639-2/B': 'bur',
    family: 'Sino-Tibetan',
    name: 'Burmese',

    wikiUrl: 'https://en.wikipedia.org/wiki/Burmese_language',
  },
  na: {
    iso6391: 'na',
    iso6392: 'nau',
    family: 'Austronesian',
    name: 'Nauruan',

    wikiUrl: 'https://en.wikipedia.org/wiki/Nauruan_language',
  },
  nb: {
    iso6391: 'nb',
    iso6392: 'nob',
    family: 'Indo-European',
    name: 'Norwegian Bokmål',

    wikiUrl: 'https://en.wikipedia.org/wiki/Bokm%C3%A5l',
  },
  nd: {
    iso6391: 'nd',
    iso6392: 'nde',
    family: 'Niger–Congo',
    name: 'Northern Ndebele',

    wikiUrl: 'https://en.wikipedia.org/wiki/Northern_Ndebele_language',
  },
  ne: {
    iso6391: 'ne',
    iso6392: 'nep',
    family: 'Indo-European',
    name: 'Nepali',

    wikiUrl: 'https://en.wikipedia.org/wiki/Nepali_language',
  },
  ng: {
    iso6391: 'ng',
    iso6392: 'ndo',
    family: 'Niger–Congo',
    name: 'Ndonga',

    wikiUrl: 'https://en.wikipedia.org/wiki/Ndonga',
  },
  nl: {
    iso6391: 'nl',
    iso6392: 'nld',
    '639-2/B': 'dut',
    family: 'Indo-European',
    name: 'Dutch',

    wikiUrl: 'https://en.wikipedia.org/wiki/Dutch_language',
  },
  nn: {
    iso6391: 'nn',
    iso6392: 'nno',
    family: 'Indo-European',
    name: 'Norwegian Nynorsk',

    wikiUrl: 'https://en.wikipedia.org/wiki/Nynorsk',
  },
  no: {
    iso6391: 'no',
    iso6392: 'nor',
    family: 'Indo-European',
    name: 'Norwegian',

    wikiUrl: 'https://en.wikipedia.org/wiki/Norwegian_language',
  },
  nr: {
    iso6391: 'nr',
    iso6392: 'nbl',
    family: 'Niger–Congo',
    name: 'Southern Ndebele',

    wikiUrl: 'https://en.wikipedia.org/wiki/Southern_Ndebele_language',
  },
  nv: {
    iso6391: 'nv',
    iso6392: 'nav',
    family: 'Dené–Yeniseian',
    name: 'Navajo, Navaho',

    wikiUrl: 'https://en.wikipedia.org/wiki/Navajo_language',
  },
  ny: {
    iso6391: 'ny',
    iso6392: 'nya',
    family: 'Niger–Congo',
    name: 'Chichewa, Chewa, Nyanja',
    wikiUrl: 'https://en.wikipedia.org/wiki/Chichewa_language',
  },
  oc: {
    iso6391: 'oc',
    iso6392: 'oci',
    family: 'Indo-European',
    name: 'Occitan',
    nativeName: "occitan, lenga d'òc",
    wikiUrl: 'https://en.wikipedia.org/wiki/Occitan_language',
  },
  oj: {
    iso6391: 'oj',
    iso6392: 'oji',
    family: 'Algonquian',
    name: 'Ojibwe, Ojibwa',
    wikiUrl: 'https://en.wikipedia.org/wiki/Ojibwe_language',
  },
  om: {
    iso6391: 'om',
    iso6392: 'orm',
    family: 'Afro-Asiatic',
    name: 'Oromo',
    wikiUrl: 'https://en.wikipedia.org/wiki/Oromo_language',
  },
  or: {
    iso6391: 'or',
    iso6392: 'ori',
    family: 'Indo-European',
    name: 'Oriya',
    wikiUrl: 'https://en.wikipedia.org/wiki/Oriya_language',
  },
  os: {
    iso6391: 'os',
    iso6392: 'oss',
    family: 'Indo-European',
    name: 'Ossetian, Ossetic',
    wikiUrl: 'https://en.wikipedia.org/wiki/Ossetic_language',
  },
  pa: {
    iso6391: 'pa',
    iso6392: 'pan',
    family: 'Indo-European',
    name: '(Eastern) Punjabi',
    wikiUrl: 'https://en.wikipedia.org/wiki/Eastern_Punjabi_language',
  },
  pi: {
    iso6391: 'pi',
    iso6392: 'pli',
    family: 'Indo-European',
    name: 'Pāli',
    wikiUrl: 'https://en.wikipedia.org/wiki/P%C4%81li_language',
  },
  pl: {
    iso6391: 'pl',
    iso6392: 'pol',
    family: 'Indo-European',
    name: 'Polish',
    wikiUrl: 'https://en.wikipedia.org/wiki/Polish_language',
  },
  ps: {
    iso6391: 'ps',
    iso6392: 'pus',
    family: 'Indo-European',
    name: 'Pashto, Pushto',
    wikiUrl: 'https://en.wikipedia.org/wiki/Pashto_language',
  },
  pt: {
    iso6391: 'pt',
    iso6392: 'por',
    family: 'Indo-European',
    name: 'Portuguese',
    wikiUrl: 'https://en.wikipedia.org/wiki/Portuguese_language',
  },
  qu: {
    iso6391: 'qu',
    iso6392: 'que',
    family: 'Quechuan',
    name: 'Quechua',
    wikiUrl: 'https://en.wikipedia.org/wiki/Quechua_language',
  },
  rm: {
    iso6391: 'rm',
    iso6392: 'roh',
    family: 'Indo-European',
    name: 'Romansh',

    wikiUrl: 'https://en.wikipedia.org/wiki/Romansh_language',
  },
  rn: {
    iso6391: 'rn',
    iso6392: 'run',
    family: 'Niger–Congo',
    name: 'Kirundi',
    wikiUrl: 'https://en.wikipedia.org/wiki/Kirundi',
  },
  ro: {
    iso6391: 'ro',
    iso6392: 'ron',
    family: 'Indo-European',
    name: 'Romanian',
    wikiUrl: 'https://en.wikipedia.org/wiki/Romanian_language',
  },
  ru: {
    iso6391: 'ru',
    iso6392: 'rus',
    family: 'Indo-European',
    name: 'Russian',
    wikiUrl: 'https://en.wikipedia.org/wiki/Russian_language',
  },
  rw: {
    iso6391: 'rw',
    iso6392: 'kin',
    family: 'Niger–Congo',
    name: 'Kinyarwanda',
    wikiUrl: 'https://en.wikipedia.org/wiki/Kinyarwanda',
  },
  sa: {
    iso6391: 'sa',
    iso6392: 'san',
    family: 'Indo-European',
    name: 'Sanskrit (Saṁskṛta)',
    wikiUrl: 'https://en.wikipedia.org/wiki/Sanskrit',
  },
  sc: {
    iso6391: 'sc',
    iso6392: 'srd',
    family: 'Indo-European',
    name: 'Sardinian',
    wikiUrl: 'https://en.wikipedia.org/wiki/Sardinian_language',
  },
  sd: {
    iso6391: 'sd',
    iso6392: 'snd',
    family: 'Indo-European',
    name: 'Sindhi',
    wikiUrl: 'https://en.wikipedia.org/wiki/Sindhi_language',
  },
  se: {
    iso6391: 'se',
    iso6392: 'sme',
    family: 'Uralic',
    name: 'Northern Sami',
    wikiUrl: 'https://en.wikipedia.org/wiki/Northern_Sami',
  },
  sg: {
    iso6391: 'sg',
    iso6392: 'sag',
    family: 'Creole',
    name: 'Sango',
    wikiUrl: 'https://en.wikipedia.org/wiki/Sango_language',
  },
  si: {
    iso6391: 'si',
    iso6392: 'sin',
    family: 'Indo-European',
    name: 'Sinhalese, Sinhala',
    wikiUrl: 'https://en.wikipedia.org/wiki/Sinhalese_language',
  },
  sk: {
    iso6391: 'sk',
    iso6392: 'slk',
    family: 'Indo-European',
    name: 'Slovak',

    wikiUrl: 'https://en.wikipedia.org/wiki/Slovak_language',
  },
  sl: {
    iso6391: 'sl',
    iso6392: 'slv',
    family: 'Indo-European',
    name: 'Slovene',
    wikiUrl: 'https://en.wikipedia.org/wiki/Slovene_language',
  },
  sm: {
    iso6391: 'sm',
    iso6392: 'smo',
    family: 'Austronesian',
    name: 'Samoan',
    wikiUrl: 'https://en.wikipedia.org/wiki/Samoan_language',
  },
  sn: {
    iso6391: 'sn',
    iso6392: 'sna',
    family: 'Niger–Congo',
    name: 'Shona',
    wikiUrl: 'https://en.wikipedia.org/wiki/Shona_language',
  },
  so: {
    iso6391: 'so',
    iso6392: 'som',
    family: 'Afro-Asiatic',
    name: 'Somali',
    wikiUrl: 'https://en.wikipedia.org/wiki/Somali_language',
  },
  sq: {
    iso6391: 'sq',
    iso6392: 'sqi',
    '639-2/B': 'alb',
    family: 'Indo-European',
    name: 'Albanian',
    wikiUrl: 'https://en.wikipedia.org/wiki/Albanian_language',
  },
  sr: {
    iso6391: 'sr',
    iso6392: 'srp',
    family: 'Indo-European',
    name: 'Serbian',
    wikiUrl: 'https://en.wikipedia.org/wiki/Serbian_language',
  },
  ss: {
    iso6391: 'ss',
    iso6392: 'ssw',
    family: 'Niger–Congo',
    name: 'Swati',
    wikiUrl: 'https://en.wikipedia.org/wiki/Swati_language',
  },
  st: {
    iso6391: 'st',
    iso6392: 'sot',
    family: 'Niger–Congo',
    name: 'Southern Sotho',
    wikiUrl: 'https://en.wikipedia.org/wiki/Sotho_language',
  },
  su: {
    iso6391: 'su',
    iso6392: 'sun',
    family: 'Austronesian',
    name: 'Sundanese',
    wikiUrl: 'https://en.wikipedia.org/wiki/Sundanese_language',
  },
  sv: {
    iso6391: 'sv',
    iso6392: 'swe',
    family: 'Indo-European',
    name: 'Swedish',
    wikiUrl: 'https://en.wikipedia.org/wiki/Swedish_language',
  },
  sw: {
    iso6391: 'sw',
    iso6392: 'swa',
    family: 'Niger–Congo',
    name: 'Swahili',
    wikiUrl: 'https://en.wikipedia.org/wiki/Swahili_language',
  },
  ta: {
    iso6391: 'ta',
    iso6392: 'tam',
    family: 'Dravidian',
    name: 'Tamil',
    wikiUrl: 'https://en.wikipedia.org/wiki/Tamil_language',
  },
  te: {
    iso6391: 'te',
    iso6392: 'tel',
    family: 'Dravidian',
    name: 'Telugu',
    wikiUrl: 'https://en.wikipedia.org/wiki/Telugu_language',
  },
  tg: {
    iso6391: 'tg',
    iso6392: 'tgk',
    family: 'Indo-European',
    name: 'Tajik',
    wikiUrl: 'https://en.wikipedia.org/wiki/Tajik_language',
  },
  th: {
    iso6391: 'th',
    iso6392: 'tha',
    family: 'Tai–Kadai',
    name: 'Thai',
    wikiUrl: 'https://en.wikipedia.org/wiki/Thai_language',
  },
  ti: {
    iso6391: 'ti',
    iso6392: 'tir',
    family: 'Afro-Asiatic',
    name: 'Tigrinya',
    wikiUrl: 'https://en.wikipedia.org/wiki/Tigrinya_language',
  },
  tk: {
    iso6391: 'tk',
    iso6392: 'tuk',
    family: 'Turkic',
    name: 'Turkmen',
    wikiUrl: 'https://en.wikipedia.org/wiki/Turkmen_language',
  },
  tl: {
    iso6391: 'tl',
    iso6392: 'tgl',
    family: 'Austronesian',
    name: 'Tagalog',
    wikiUrl: 'https://en.wikipedia.org/wiki/Tagalog_language',
  },
  tn: {
    iso6391: 'tn',
    iso6392: 'tsn',
    family: 'Niger–Congo',
    name: 'Tswana',
    wikiUrl: 'https://en.wikipedia.org/wiki/Tswana_language',
  },
  to: {
    iso6391: 'to',
    iso6392: 'ton',
    family: 'Austronesian',
    name: 'Tonga (Tonga Islands)',
    wikiUrl: 'https://en.wikipedia.org/wiki/Tongan_language',
  },
  tr: {
    iso6391: 'tr',
    iso6392: 'tur',
    family: 'Turkic',
    name: 'Turkish',
    wikiUrl: 'https://en.wikipedia.org/wiki/Turkish_language',
  },
  ts: {
    iso6391: 'ts',
    iso6392: 'tso',
    family: 'Niger–Congo',
    name: 'Tsonga',
    wikiUrl: 'https://en.wikipedia.org/wiki/Tsonga_language',
  },
  tt: {
    iso6391: 'tt',
    iso6392: 'tat',
    family: 'Turkic',
    name: 'Tatar',
    wikiUrl: 'https://en.wikipedia.org/wiki/Tatar_language',
  },
  tw: {
    iso6391: 'tw',
    iso6392: 'twi',
    family: 'Niger–Congo',
    name: 'Twi',
    wikiUrl: 'https://en.wikipedia.org/wiki/Twi',
  },
  ty: {
    iso6391: 'ty',
    iso6392: 'tah',
    family: 'Austronesian',
    name: 'Tahitian',
    wikiUrl: 'https://en.wikipedia.org/wiki/Tahitian_language',
  },
  ug: {
    iso6391: 'ug',
    iso6392: 'uig',
    family: 'Turkic',
    name: 'Uyghur',
    wikiUrl: 'https://en.wikipedia.org/wiki/Uyghur_language',
  },
  uk: {
    iso6391: 'uk',
    iso6392: 'ukr',
    family: 'Indo-European',
    name: 'Ukrainian',
    wikiUrl: 'https://en.wikipedia.org/wiki/Ukrainian_language',
  },
  ur: {
    iso6391: 'ur',
    iso6392: 'urd',
    family: 'Indo-European',
    name: 'Urdu',
    wikiUrl: 'https://en.wikipedia.org/wiki/Urdu',
  },
  uz: {
    iso6391: 'uz',
    iso6392: 'uzb',
    family: 'Turkic',
    name: 'Uzbek',
    wikiUrl: 'https://en.wikipedia.org/wiki/Uzbek_language',
  },
  ve: {
    iso6391: 've',
    iso6392: 'ven',
    family: 'Niger–Congo',
    name: 'Venda',
    wikiUrl: 'https://en.wikipedia.org/wiki/Venda_language',
  },
  vi: {
    iso6391: 'vi',
    iso6392: 'vie',
    family: 'Austroasiatic',
    name: 'Vietnamese',
    wikiUrl: 'https://en.wikipedia.org/wiki/Vietnamese_language',
  },
  vo: {
    iso6391: 'vo',
    iso6392: 'vol',
    family: 'Constructed',
    name: 'Volapük',
    wikiUrl: 'https://en.wikipedia.org/wiki/Volap%C3%BCk',
  },
  wa: {
    iso6391: 'wa',
    iso6392: 'wln',
    family: 'Indo-European',
    name: 'Walloon',
    wikiUrl: 'https://en.wikipedia.org/wiki/Walloon_language',
  },
  wo: {
    iso6391: 'wo',
    iso6392: 'wol',
    family: 'Niger–Congo',
    name: 'Wolof',
    wikiUrl: 'https://en.wikipedia.org/wiki/Wolof_language',
  },
  xh: {
    iso6391: 'xh',
    iso6392: 'xho',
    family: 'Niger–Congo',
    name: 'Xhosa',
    wikiUrl: 'https://en.wikipedia.org/wiki/Xhosa_language',
  },
  yi: {
    iso6391: 'yi',
    iso6392: 'yid',
    family: 'Indo-European',
    name: 'Yiddish',
    wikiUrl: 'https://en.wikipedia.org/wiki/Yiddish_language',
  },
  yo: {
    iso6391: 'yo',
    iso6392: 'yor',
    family: 'Niger–Congo',
    name: 'Yoruba',
    wikiUrl: 'https://en.wikipedia.org/wiki/Yoruba_language',
  },
  za: {
    iso6391: 'za',
    iso6392: 'zha',
    family: 'Tai–Kadai',
    name: 'Zhuang, Chuang',
    wikiUrl: 'https://en.wikipedia.org/wiki/Zhuang_languages',
  },
  zh: {
    iso6391: 'zh',
    iso6392: 'zho',
    family: 'Sino-Tibetan',
    name: 'Chinese',
    wikiUrl: 'https://en.wikipedia.org/wiki/Chinese_language',
  },
  zu: {
    iso6391: 'zu',
    iso6392: 'zul',
    family: 'Niger–Congo',
    name: 'Zulu',
    wikiUrl: 'https://en.wikipedia.org/wiki/Zulu_language',
  },
  '*': {
    iso6391: '*',
    iso6392: '*',
    family: 'joker',
    name: 'joker',
    wikiUrl: '*',
  },
};

export const createLanguageCodes = async (prisma: PrismaClient) => {
  for (const code in isoCodes) {
    await prisma.languageCodes.create({
      data: {
        code: code,
        name: isoCodes[code].name,
      },
    });
  }
};
