import { PrismaClient } from '@prisma/client';

const questions = {
  A1: [
    {
      name: 'Je peux reconnaître une information concrète à propos d’un sujet familier et quotidien, à condition que le débit soit lent et que l’information soit claire.',
      translations: [
        {
          code: 'en',
          content:
            'Can recognise concrete information (e.g. places and times) on familiar topics encountered in everyday life, provided it is delivered slowly and clearly.',
        },
        {
          code: 'zh',
          content:
            '我能明白熟悉和日常相关的主题的具体信息，只要语速不快并且信息明确。',
        },
        {
          code: 'de',
          content:
            'Kann konkrete Informationen (z.B. Orts- und Zeitangaben) zu vertrauten Themen im Alltagsleben erfassen, sofern diese langsam und klar artikuliert werden.',
        },
        {
          code: 'es',
          content:
            'Reconoce información concreta (por ejemplo, lugares y horarios) relativa a temas conocidos y cotidianos, siempre que sea expresada con claridad y despacio.',
        },
      ],
    },
    {
      name: 'Je peux reconnaître des mots ou des expressions familiers et identifier les sujets dans les gros titres et les résumés des nouvelles ainsi que la plupart des produits dans les publicités, en utilisant les informations visuelles.',
      translations: [
        {
          code: 'en',
          content:
            'Can recognise familiar words/signs and phrases and identify the topics in headline news summaries and many of the products in advertisements, by exploiting visual information and general knowledge.',
        },
        {
          code: 'zh',
          content:
            '我能通过视觉信息辨认出通俗的单词或词组，识别出大标题里的主题和新闻的摘要，以及广告中的大多数产品。',
        },
        {
          code: 'de',
          content:
            'Kann vertraute Wörter, Gebärden und Wendungen erkennen und die Themen in den Überschriften von Nachrichtenüberblicken identifizieren sowie viele der Produkte in Anzeigen erkennen, indem visuelle Informationen und allgemeines Wissen genutzt wird.',
        },
        {
          code: 'es',
          content:
            'Reconoce palabras/signos y expresiones conocidas/os, e identifica los temas en los resúmenes de titulares de noticias y muchos de los productos de los anuncios publicitarios, apoyándose para ello en la información visual y en sus conocimientos de cultura general.',
        },
      ],
    },
    {
      name: 'Je peux participer à une conversation simple de nature factuelle et sur un sujet prévisible (par ex. sur son logement, son pays, sa famille, ses études).',
      translations: [
        {
          code: 'en',
          content:
            'Can take part in a simple conversation of a basic factual nature on a predictable topic (e.g. their home country, family, school).',
        },
        {
          code: 'zh',
          content:
            '我能参与实质性的简单交谈，以及关于可预测的主题的简单交谈 (比如，关于他的住房，他的国家，他的家庭，他的学习)。',
        },
        {
          code: 'de',
          content:
            'Kann an einem einfachen sachbezogenen Gespräch über ein vorhersagbares Thema teilnehmen (z.B. das eigene Land, die Familie, die Schule).',
        },
        {
          code: 'es',
          content:
            'Participa en una conversación sencilla y con información básica de carácter fáctico sobre un tema predecible (por ejemplo, su país, la familia, la escuela).',
        },
      ],
    },
    {
      name: 'Je peux présenter quelqu’un et utiliser des expressions élémentaires de salutation et de congé.',
      translations: [
        {
          code: 'en',
          content:
            'Can make an introduction and use basic greeting and leave-taking expressions.',
        },
        {
          code: 'zh',
          content: '我能介绍某人，使用基础的问候语和告别语。',
        },
        {
          code: 'de',
          content:
            'Kann jemanden vorstellen und einfache Gruß- und Abschiedsformeln gebrauchen.',
        },
        {
          code: 'es',
          content:
            'Se presenta y utiliza saludos y expresiones de despedida básicos.',
        },
      ],
    },
    {
      name: 'Je peux demander à quelqu’un de ses nouvelles et y réagir.',
      translations: [
        {
          code: 'en',
          content: 'Can ask how people are and react to news.',
        },
        {
          code: 'zh',
          content: '我能询问某人的消息并进行互动。',
        },
        {
          code: 'de',
          content:
            'Kann jemanden nach dem Befinden fragen und auf Neuigkeiten reagieren.',
        },
        {
          code: 'es',
          content:
            'Pregunta cómo están las personas y expresa sus reacciones ante las noticias.',
        },
      ],
    },
    {
      name: 'Je peux échanger sur mes goûts pour le sport, la nourriture, etc. en utilisant un répertoire limité d’expressions et à condition qu’on s’adresse directement à moi clairement et lentement.',
      translations: [
        {
          code: 'en',
          content:
            'Can exchange likes and dislikes for sports, foods, etc., using a limited repertoire of expressions, when addressed clearly, slowly and directly.',
        },
        {
          code: 'zh',
          content:
            '我能通过使用有限的表达法，并且在大家直接对我清晰和缓慢地说的情况下，就我对体育，食物等的喜好进行交流。',
        },
        {
          code: 'de',
          content:
            'Kann sich über Vorlieben und Abneigungen beim Sport, bei Speisen usw. austauschen und dabei ein begrenztes Repertoire an Wendungen einsetzen, wenn man klar, langsam und direkt angesprochen wird.',
        },
        {
          code: 'es',
          content:
            'Expresa agrado y desagrado sobre deportes, comidas, etc., utilizando un repertorio limitado de expresiones cuando se dirigen a él/ella con claridad, lenta y directamente.',
        },
      ],
    },
    {
      name: "Je peux écrire des messages et des publications personnelles en ligne très simples, sur mes loisirs, ce que j'aime ou n’aime pas, etc. avec des phrases très courtes et à l’aide d’un outil de traduction.",
      translations: [
        {
          code: 'en',
          content:
            'Can formulate very simple messages and personal online postings as a series of very short sentences about hobbies, likes/dislikes, etc., relying on the aid of a translation tool.',
        },
        {
          code: 'zh',
          content:
            '我能写一些消息，并且我能用很短的句子和翻译工具，在网上发表一些很简单的，关于我的消遣，我喜欢什么或不喜欢什么等的信息。',
        },
        {
          code: 'de',
          content:
            'Kann sehr einfache Mitteilungen und persönliche online Postings über Hobbys, Vorlieben und Abneigungen usw. in einer Abfolge von sehr kurzen Sätzen verfassen und sich dabei auf Übersetzungshilfen stützen.',
        },
        {
          code: 'es',
          content:
            'Elabora mensajes y entradas personales, muy sencillos y compuestos de una serie de frases muy cortas, sobre aficiones, lo que le gusta/no le gusta, etc., con la ayuda de una herramienta de traducción.',
        },
      ],
    },
    {
      name: 'Je peux comprendre les grandes lignes d’une information simple, donnée dans une situation prévisible, comme par ex. celle d’un guide touristique (« Voici où habite le Président »).',
      translations: [
        {
          code: 'en',
          content:
            'Can understand the outline of simple information given in a predictable situation, such as on a guided tour (e.g. “This is where the President lives”).',
        },
        {
          code: 'zh',
          content:
            '我能理解一条在可预测的情况下给出的简单信息的大概，比如一条导游的信息("这是总统居住的地方")。',
        },
        {
          code: 'de',
          content:
            'Kann die Grundzüge einer einfachen Information verstehen, die in einer vorhersehbaren Situation wie z.B. bei einer Stadtrundfahrt gegeben wird (z.B. „Hier wohnt der Präsident.“).',
        },
        {
          code: 'es',
          content:
            'Comprende las líneas generales de información sencilla dada en una situación predecible, como en una visita guiada (por ejemplo, Esta es la residencia del/la Presidente/a).',
        },
      ],
    },
  ],
  A2: [
    {
      name: "Je peux discuter de ce qu'il faut faire, où aller et prendre les dispositions nécessaires pour se rencontrer.",
      translations: [
        {
          code: 'en',
          content:
            'Can describe their family, living conditions, educational background, present or most recent job.',
        },
        {
          code: 'zh',
          content: '我能就需要做什么，去哪里和为了会面采取必要的措施进行讨论。',
        },
        {
          code: 'de',
          content:
            'Kann die Familie, Lebensverhältnisse, die Ausbildung und die gegenwärtige oder die letzte berufliche Tätigkeit beschreiben.',
        },
        {
          code: 'es',
          content:
            'Describe a su familia, sus condiciones de vida, su trayectoria educativa y su trabajo actual, o el último que tuvo.',
        },
      ],
    },
    {
      name: 'Je peux décrire ma famille, mes conditions de vie, ma formation, mon travail actuel ou le dernier en date.',
      translations: [
        {
          code: 'en',
          content:
            'Can describe people, places and possessions in simple terms.',
        },
        {
          code: 'zh',
          content:
            '我能描述我的家庭，我的生活条件，我的教育，我目前的工作或我的最后一份工作。',
        },
        {
          code: 'de',
          content:
            'Kann mit einfachen Worten Personen, Orte, Dinge beschreiben.',
        },
        {
          code: 'es',
          content:
            'Describe personas, lugares y posesiones en términos sencillos.',
        },
      ],
    },
    {
      name: "Je peux décrire les gens, les lieux et les choses qui m'appartiennent en termes simples.",
      translations: [
        {
          code: 'en',
          content:
            'Can express what they are good at and not so good at (e.g. sports, games, skills, subjects).',
        },
        {
          code: 'zh',
          content: '我能用简单的词语描述人，地点和属于我的东西。',
        },
        {
          code: 'de',
          content:
            'Kann sagen, was man gut oder nicht so gut kann (z.B. Sport, Spiele, Fertigkeiten, Fächer).',
        },
        {
          code: 'es',
          content:
            'Indica qué se le da o no bien (por ejemplo, deportes, juegos, habilidades, asignaturas).',
        },
      ],
    },
    {
      name: 'Je peux dire ce que je sais bien faire et ce que je fais moins bien (par ex. en sport, pour les jeux, mes compétences, mes matières à l’école).',
      translations: [
        {
          code: 'en',
          content:
            'Can briefly describe what they plan to do at the weekend or during the holidays.',
        },
        {
          code: 'zh',
          content:
            '我能讲述我很会做什么和我什么做得不太好(比如，在体育上，关于游戏，我的能力，我在学校里学习的科目)。',
        },
        {
          code: 'de',
          content:
            'Kann kurz darüber sprechen, was man am Wochenende oder in den Ferien vorhat.',
        },
        {
          code: 'es',
          content:
            'Describe brevemente sus planes para el fin de semana o las vacaciones.',
        },
      ],
    },
    {
      name: 'Je peux parler brièvement de mes projets de fin de semaine ou de vacances.',
      translations: [
        {
          code: 'en',
          content:
            'Can give simple directions on how to get from X to Y, using basic expressions such as “turn right” and “go straight” along with sequential connectors such as “first”, “then” and “next”.',
        },
        {
          code: 'zh',
          content: '我能简短的讲我的周末计划或假期计划。',
        },
        {
          code: 'de',
          content:
            'Kann einfache Anweisungen geben, wie man von einem Ort zum anderen kommt, indem man elementare Ausdrücke verwendet wie „rechts abbiegen“ und „weiter geradeaus“ zusammen mit Konnektoren zum Ausdruck von zeitlichen Abfolgen wie „zuerst“, „dann“ und „danach“.',
        },
        {
          code: 'es',
          content:
            'Da indicaciones sencillas sobre cómo ir de un sitio a otro, empleando expresiones básicas, tales como Gire a la derecha o Siga todo recto, junto con conectores de secuencia tales como primero, después y a continuación.',
        },
      ],
    },
    {
      name: 'Je peux donner des consignes simples pour aller d’un endroit à un autre en utilisant des expressions simples telles que « tournez à droite », « allez tout droit » et avec des connecteurs tels que « d’abord », « ensuite », « et puis ».',
      translations: [
        {
          code: 'en',
          content:
            'Can discuss what to do, where to go and make arrangements to meet.',
        },
        {
          code: 'zh',
          content:
            '我能通过使用简单的词组，给出从一个地点到另一个地点的指令，比如"右转"，"直行"和使用有"首先"，"然后"，"接下来"这些连词的简单词组。',
        },
        {
          code: 'de',
          content:
            'Kann mit anderen besprechen, was man tun oder wohin man gehen will; kann Verabredungen treffen.',
        },
        {
          code: 'es',
          content:
            'Discute sobre qué hacer, a dónde ir y se pone de acuerdo con alguien sobre cómo quedar.',
        },
      ],
    },
  ],
  B1: [
    {
      name: 'Je peux raconter l’intrigue d’un livre ou d’un film et décrire mes propres réactions.',
      translations: [
        {
          code: 'en',
          content:
            'Can relate the plot of a book or film and describe their reactions.',
        },
        {
          code: 'zh',
          content: '我能讲述一本书或一部电影的情节，描述我自己的感受。',
        },
        {
          code: 'de',
          content:
            'Kann die Handlung eines Films oder eines Buchs wiedergeben und die eigenen Reaktionen beschreiben.',
        },
        {
          code: 'es',
          content:
            'Relata el argumento de un libro o una película y describe sus reacciones.',
        },
      ],
    },
    {
      name: 'Je peux aborder sans préparation une conversation sur un sujet familier, exprimer des opinions personnelles et échanger des informations sur des sujets familiers d’intérêt personnel, ou pertinents pour la vie quotidienne (par ex. la famille, les loisirs, le travail, les voyages et les faits divers).',
      translations: [
        {
          code: 'en',
          content:
            'Can exploit a wide range of simple language to deal with most situations likely to arise whilst travelling. Can enter unprepared into conversation on familiar topics, and express personal opinions and exchange information on topics that are familiar, of personal interest or pertinent to everyday life (e.g. family, hobbies, work, travel and current events).',
        },
        {
          code: 'zh',
          content:
            '我能在没有准备的情况下就一个熟悉的主题进行交谈，表达自己的个人观点，就个人喜好的熟悉主题或关于日常生活的恰当主题交流信息(比如，家庭，消遣，工作，旅行和新闻实事)。',
        },
        {
          code: 'de',
          content:
            'Kann ein breites Spektrum einfacher sprachlicher Mittel einsetzen, um die meisten Situationen zu bewältigen, die typischerweise beim Reisen auftreten. Kann ohne Vorbereitung an Gesprächen über vertraute Themen teilnehmen, persönliche Meinungen ausdrücken und Informationen austauschen über Themen, die vertraut sind, persönlich interessieren oder sich auf das alltägliche Leben beziehen (z.B. Familie, Hobbys, Arbeit, Reisen und aktuelles Geschehen).',
        },
        {
          code: 'es',
          content:
            'Hace uso de un amplio repertorio lingüístico sencillo para enfrentarse a la mayoría de las situaciones que pueden surgir cuando se viaja. Participa sin preparación previa en conversaciones sobre temas conocidos, y expresa opiniones personales e intercambia información sobre temas conocidos de interés personal o relativos a la vida diaria (por ejemplo, familia, aficiones, trabajo, viajes y acontecimientos actuales).',
        },
      ],
    },
    {
      name: 'Je peux, en règle générale, suivre les points principaux d’une discussion informelle entre amis à condition qu’elle ait lieu en langue standard ou dans une variété familière clairement articulée, bien qu’il moi soit parfois nécessaire de faire répéter certains mots ou expressions.',
      translations: [
        {
          code: 'en',
          content:
            'Can generally follow the main points in an informal discussion with friends provided they articulate clearly in standard language or a familiar variety.',
        },
        {
          code: 'zh',
          content:
            '通常情况下，我能明白朋友间的非正式讨论的要点，只要讨论用的是标准语言或发音清晰地通俗语言，即便有时我需要让对方重复某些单词或词组。',
        },
        {
          code: 'de',
          content:
            'Kann im Allgemeinen den wesentlichen Punkten einer informellen Diskussion mit Freunden folgen, sofern deutlich gesprochen und Standardsprache oder eine vertraute Varietät verwendet wird. ',
        },
        {
          code: 'es',
          content:
            'Comprende generalmente la información principal de una discusión informal con amigos siempre que articulen con claridad en lengua estándar o en una variedad lingüística conocida.',
        },
      ],
    },
    {
      name: 'Je peux exprimer poliment mes convictions, mes opinions, mon accord et mon désaccord.',
      translations: [
        {
          code: 'en',
          content:
            'Can express beliefs, opinions and agreement and disagreement politely.',
        },
        {
          code: 'zh',
          content: '我能礼貌地表达我的信念，我的观点，我的赞同和我的异议。',
        },
        {
          code: 'de',
          content:
            'Kann höflich Überzeugungen und Meinungen, Zustimmung und Ablehnung ausdrücken.',
        },
        {
          code: 'es',
          content:
            'Expresa con amabilidad creencias, opiniones, acuerdo y desacuerdo.',
        },
      ],
    },
    {
      name: 'Je peux exprimer ma pensée sur un sujet abstrait ou culturel comme un film ou de la musique. ',
      translations: [
        {
          code: 'en',
          content:
            'Can express their thoughts about abstract or cultural topics such as music or films.',
        },
        {
          code: 'zh',
          content:
            '我能根据一个抽象的或文化的主题发表我的想法，比如电影或音乐。',
        },
        {
          code: 'de',
          content:
            'Kann die eigenen Gedanken über abstrakte oder kulturelle Themen, z.B. über Musik oder Filme ausdrücken. ',
        },
        {
          code: 'es',
          content:
            'Expresa sus ideas sobre temas abstractos o culturales como la música y el cine.',
        },
      ],
    },
    {
      name: 'Je peux comparer et opposer des alternatives en discutant de ce qu’il faut faire, où il faut aller, qui ou quoi choisir, etc.',
      translations: [
        {
          code: 'en',
          content:
            'Can compare and contrast alternatives, discussing what to do, where to go, who or which to choose, etc.',
        },
        {
          code: 'zh',
          content:
            '我能通过谈论必须做什么，必须去哪里，谁或者选择什么等对选择进行比较和对照。',
        },
        {
          code: 'de',
          content:
            'Kann in Gesprächen darüber, was man tun, wohin man gehen oder was man auswählen sollte, Vergleiche anstellen und verschiedene Möglichkeiten einander gegenüberstellen.',
        },
        {
          code: 'es',
          content:
            'Compara y contrasta alternativas, discutiendo qué hacer, a dónde ir, qué o a quién elegir, etc.',
        },
      ],
    },
    {
      name: 'Je peux comparer et opposer des alternatives en discutant de ce qu’il faut faire, où il faut aller, qui ou quoi choisir, etc.',
      translations: [
        {
          code: 'en',
          content:
            'Can compare and contrast alternatives, discussing what to do, where to go, who or which to choose, etc.',
        },
        {
          code: 'zh',
          content:
            '我能通过谈论必须做什么，必须去哪里，谁或者选择什么等对选择进行比较和对照。',
        },
        {
          code: 'de',
          content:
            'Kann in Gesprächen darüber, was man tun, wohin man gehen oder was man auswählen sollte, Vergleiche anstellen und verschiedene Möglichkeiten einander gegenüberstellen.',
        },
        {
          code: 'es',
          content:
            'Compara y contrasta alternativas, discutiendo qué hacer, a dónde ir, qué o a quién elegir, etc.',
        },
      ],
    },
    {
      name: 'Je peux relater en détail mes expériences en décrivant mes sentiments et mes réactions.',
      translations: [
        {
          code: 'en',
          content:
            'Can give detailed accounts of experiences, describing feelings and reactions.',
        },
        {
          code: 'zh',
          content: '我能通过描述我的感受和反应详细地叙述我的经历。',
        },
        {
          code: 'de',
          content:
            'Kann detailliert über eigene Erfahrungen berichten und dabei die eigenen Gefühle und Reaktionen beschreiben.',
        },
        {
          code: 'es',
          content:
            'Relata de forma detallada experiencias describiendo sentimientos y reacciones.',
        },
      ],
    },
  ],
  B2: [
    {
      name: 'Je peux reconnaître le point de vue exprimé et le distinguer de faits rapportés.',
      translations: [
        {
          code: 'en',
          content:
            'Can understand the main ideas of propositionally and linguistically complex discourse on both concrete and abstract topics delivered in standard language or a familiar variety, including technical discussions in their field of specialisation.',
        },
        {
          code: 'zh',
          content: '我能明白表达的观点并且能把它与转述的事件区分开。',
        },
        {
          code: 'de',
          content:
            'Kann die Hauptaussagen von inhaltlich und sprachlich komplexen Diskursen zu konkreten und abstrakten Themen verstehen, wenn Standardsprache oder einer vertrauten Varietät gesprochen wird; versteht auch Fachdiskussionen im eigenen Spezialgebiet.',
        },
        {
          code: 'es',
          content:
            'Comprende las ideas principales de un discurso lingüísticamente complejo tanto sobre temas concretos como abstractos en lengua estándar o una variedad lingüística conocida, incluidas discusiones técnicas dentro de su especialidad.',
        },
      ],
    },
    {
      name: 'Je peux comprendre les idées principales d’interventions complexes du point de vue du fond et de la forme sur un sujet concret ou abstrait et dans une langue standard ou une variété familière, y compris des discussions techniques dans mon domaine de spécialisation.',
      translations: [
        {
          code: 'en',
          content:
            'Can recognise the point of view expressed and distinguish this from facts being reporting.',
        },
        {
          code: 'zh',
          content:
            '我能理解，从实质和形式的角度看，在使用标准语言或通俗语言表达的关于一个具体或抽象主题的复杂讨论的主要看法，包括我专业领域的技术性讨论。',
        },
        {
          code: 'de',
          content:
            'Kann den Standpunkt des Sprechers/der Sprecherin erkennen und von Fakten, über die berichtet wird, unterscheiden.',
        },
        {
          code: 'es',
          content:
            'Identifica el punto de vista expresado y lo distingue de los hechos de los que se informa.',
        },
      ],
    },
    {
      name: 'Je peux faire une description et une présentation claires et détaillées sur une gamme étendue de sujets relatifs à mon domaine d’intérêt en développant et justifiant les idées par des points secondaires et des exemples pertinents.',
      translations: [
        {
          code: 'en',
          content:
            'Can give clear, detailed descriptions and presentations on a wide range of subjects related to their field of interest, expanding and supporting ideas with subsidiary points and relevant examples.',
        },
        {
          code: 'zh',
          content:
            '我能对关于我兴趣领域的广泛主题进行清楚详细的描述和介绍，同时我能通过次要点和恰当的例子来详述和论证观点。',
        },
        {
          code: 'de',
          content:
            'Kann zu einer großen Bandbreite von Themen aus dem eigenen  Interessengebiet klare und detaillierte Beschreibungen und Darstellungen geben, Ideen ausführen und durch untergeordnete Punkte und relevante Beispiele abstützen.',
        },
        {
          code: 'es',
          content:
            'Realiza descripciones y presentaciones claras y detalladas sobre una amplia variedad de asuntos relacionados con su área de interés, ampliando y defendiendo sus ideas con aspectos complementarios y ejemplos relevantes.',
        },
      ],
    },
    {
      name: 'Je peux participer activement à une discussion informelle dans un contexte familier, en faisant des commentaires, en exposant un point de vue clairement, en évaluant d’autres propositions, ainsi qu’en émettant et en réagissant à des hypothèses.',
      translations: [
        {
          code: 'en',
          content:
            'Can take an active part in informal discussion in familiar contexts, commenting, putting a point of view clearly, evaluating alternative proposals and making and responding to hypotheses.',
        },
        {
          code: 'zh',
          content:
            '我能通过评论，清楚地表明看法，评估其它的提议以及发表假设和对假设作出反应的方式积极地参与一个熟悉背景下的非正式讨论。',
        },
        {
          code: 'de',
          content:
            'Kann sich in vertrauten Situationen aktiv an informellen Diskussionen beteiligen, indem man Stellung nimmt, einen Standpunkt klar darlegt, verschiedene Vorschläge beurteilt, Hypothesen aufstellt oder auf Hypothesen reagiert.',
        },
        {
          code: 'es',
          content:
            'Toma parte activa en discusiones informales en contextos conocidos haciendo comentarios, expresando con claridad un punto de vista, evaluando propuestas alternativas, realizando hipótesis y respondiendo a estas.',
        },
      ],
    },
    {
      name: 'Je peux exprimer et exposer mes opinions dans une discussion et les défendre avec pertinence en fournissant explications, arguments et commentaires.',
      translations: [
        {
          code: 'en',
          content:
            'Can account for and sustain their opinions in discussion by providing relevant explanations, arguments and comments.',
        },
        {
          code: 'zh',
          content:
            '我能在一个讨论中表达和阐述我的观点，并且能通过提供解释，论据和评论恰当地为自己的观点辩护。',
        },
        {
          code: 'de',
          content:
            'Kann in Diskussionen die eigenen Ansichten durch relevante Erklärungen, Argumente und Kommentare begründen und verteidigen.',
        },
        {
          code: 'es',
          content:
            'Expresa y mantiene sus opiniones en discusiones proporcionando explicaciones, argumentos y comentarios adecuados.',
        },
      ],
    },
    {
      name: 'Je peux me rendre compte de malentendus et de désaccords lors d’une interaction et je peux les gérer, à condition que le ou les interlocuteurs soient prêts à coopérer.',
      translations: [
        {
          code: 'en',
          content:
            'Can recognise misunderstandings and disagreements that arise in an online interaction and deal with them, provided the interlocutor(s) are willing to co-operate.',
        },
        {
          code: 'zh',
          content:
            '在交流中，我能意识到误解和异议，我能处理好它们，只要与我对话的人配合。',
        },
        {
          code: 'de',
          content:
            'Kann Missverständnisse und Meinungsverschiedenheiten, die bei einer Online-Interaktion entstehen können, erkennen und damit umgehen, sofern die Gesprächspartner/innen zur Kooperation bereit sind.',
        },
        {
          code: 'es',
          content:
            'Reconoce malentendidos y discrepancias que surgen en una interacción en línea y los gestiona, siempre que el/la interlocutor o interlocutores estén dispuestos a cooperar.',
        },
      ],
    },
    {
      name: 'Je peux comprendre une langue standard, ou une variété familière, en direct ou dans les média, sur des sujets familiers ou non (vie personnelle, sociale, académique ou professionnelle). Seul un très fort fond sonore ou visuel, une structure inadaptée du discours ou l’utilisation d’expressions idiomatiques peuvent gêner ma compréhension.',
      translations: [
        {
          code: 'en',
          content:
            'Can understand standard language or a familiar variety, live or broadcast, on both familiar and unfamiliar topics normally encountered in personal, social, academic or vocational life. Only extreme [auditory/visual] background noise, inadequate discourse structure and/or idiomatic usage influence the ability to understand.',
        },
        {
          code: 'zh',
          content:
            '在现场或是通过媒体，我能明白一门标准语言，或一门通俗语言，无论相关主题熟悉与否 (私人生活，社会生活，校园生活或职业生活)。只有非常响亮的背景声音或非常强烈的视觉背景，话语的不合适的结构或特有的表达方式的使用会影响我的理解。',
        },
        {
          code: 'de',
          content:
            'Kann im direkten Kontakt und in den Medien gesprochene Standardsprache oder einer vertrauten Varietät verstehen, wenn es um vertraute oder auch um weniger vertraute Themen geht, wie man ihnen normalerweise im privaten, gesellschaftlichen, beruflichen Leben oder in der Ausbildung begegnet. Nur extreme [auditive/visuelle] Hintergrundgeräusche, unangemessene Diskursstrukturen oder starke Idiomatik beeinträchtigen das Verständnis.',
        },
        {
          code: 'es',
          content:
            'Comprende lengua estándar o una variedad lingüística conocida, tanto cara a cara como en discursos retransmitidos, sobre temas, conocidos o no, de la vida personal, social, académica o profesional. Solo inciden en su capacidad de comprensión un ruido de fondo [auditivo/visual] excesivo, una estructuración inadecuada del discurso o un uso idiomático de la lengua.',
        },
      ],
    },
  ],
  C1: [
    {
      name: 'Je peux faire remarquer des distinctions très précises entre des idées, des notions et des choses qui se ressemblent nettement.',
      translations: [
        {
          code: 'en',
          content:
            'Can understand enough to follow extended discourse on abstract and complex topics beyond their own field, though they may need to confirm occasional details, especially if the variety is unfamiliar.',
        },
        {
          code: 'zh',
          content: '我能清楚地指出相似的观点，概念和事情之间的很精确的区别。',
        },
        {
          code: 'de',
          content:
            'Kann genug verstehen, um längeren Diskursen über nicht vertraute abstrakte und komplexe Themen zu folgen, wenn auch gelegentlich Details bestätigt werden müssen, insbesondere bei ungewohnter Varietät.',
        },
        {
          code: 'es',
          content:
            'Comprende lo suficiente como para seguir un discurso extenso sobre temas abstractos y complejos que sobrepasan su especialidad, aunque puede que tenga que confirmar algún que otro detalle, sobre todo si no está acostumbrado/a a la variedad lingüística.',
        },
      ],
    },
    {
      name: 'Je peux suivre une intervention d’une certaine longueur sur des sujets abstraits ou complexes hors de mon domaine mais je peux avoir besoin de faire confirmer quelques détails, notamment si le registre n’est pas familier.',
      translations: [
        {
          code: 'en',
          content:
            'Can recognise a wide range of idiomatic expressions and colloquialisms, appreciating register shifts.',
        },
        {
          code: 'zh',
          content:
            '我能理解我领域外的一定长度的抽象或复杂的主题的发言，但是我会需要确认几个细节，尤其是语调不通俗的情况下。',
        },
        {
          code: 'de',
          content:
            'Kann ein breites Spektrum idiomatischer Wendungen und umgangssprachlicher Ausdrucksformen verstehen und Registerwechsel richtig beurteilen.',
        },
        {
          code: 'es',
          content:
            'Reconoce una amplia variedad de expresiones idiomáticas y coloquiales, y aprecia cambios de registro.',
        },
      ],
    },
    {
      name: 'Je peux reconnaître une gamme étendue d’expressions idiomatiques et de tournures courantes ainsi que des changements de registre.',
      translations: [
        {
          code: 'en',
          content:
            'Can communicate clearly detailed distinctions between ideas, concepts and things that closely resemble one other.',
        },
        {
          code: 'zh',
          content:
            '我能明白广泛范围的特有的表达方式和常用表达，以及语调的变换。',
        },
        {
          code: 'de',
          content:
            'Kann detaillierte Unterschiede zwischen Ideen, Konzepten und Dingen, die einander sehr ähnlich sind, klar vermitteln.',
        },
        {
          code: 'es',
          content:
            'Transmite con claridad y detalle la distinción que existe entre ideas, conceptos y cuestiones que se parecen mucho entre sí.',
        },
      ],
    },
    {
      name: 'Je peux m’exprimer couramment et spontanément, presque sans effort. Je possède une bonne maîtrise d’un vaste répertoire lexical me permettant de surmonter facilement des lacunes par des périphrases, sans recherche apparente d’expressions ou de stratégies d’évitement. Seul un sujet conceptuellement difficile est susceptible de gêner le flot naturel et fluide du discours.',
      translations: [
        {
          code: 'en',
          content:
            'Can express themselves fluently and spontaneously, almost effortlessly. Has a good command of a broad lexical repertoire allowing gaps to be readily overcome with circumlocutions. There is little obvious searching for expressions or avoidance strategies; only a conceptually difficult subject can hinder a natural, smooth flow of language.',
        },
        {
          code: 'zh',
          content:
            '我能几乎不费力地，流利地并自发地表达自己的想法。我对大量的词汇有很好的掌握，它能使我在不需要明显寻找词组或是回避策略的情况下，通过迂回说法很容易地克服缺陷。只有概念上难以理解的主题才有可能干扰自然流畅的讲话。',
        },
        {
          code: 'de',
          content:
            'Kann sich beinahe mühelos spontan und fließend ausdrücken. Beherrscht einen großen Wortschatz und kann bei Wortschatzlücken problemlos Umschreibungen gebrauchen; offensichtliches Suchen nach Worten oder der Rückgriff auf Vermeidungsstrategien sind selten; nur begrifflich schwierige Themen können den natürlichen Sprachfluss beeinträchtigen.',
        },
        {
          code: 'es',
          content:
            'Se expresa con fluidez y espontaneidad sin apenas esfuerzo. Tiene un buen dominio de un amplio repertorio léxico que le permite suplir con soltura sus deficiencias mediante circunloquios Apenas se hace notable la búsqueda de expresiones o de estrategias de evitación; solo un tema conceptualmente difícil puede obstaculizar la fluidez natural del discurso.',
        },
      ],
    },
    {
      name: 'Je peux engager des échanges avec plusieurs participants, et comprendre les intentions de communication et les implications culturelles des différentes contributions.',
      translations: [
        {
          code: 'en',
          content:
            'Can use language flexibly and effectively for social purposes, including emotional, allusive and joking usage.',
        },
        {
          code: 'zh',
          content:
            '我能与多个参与者进行交流，理解不同的参与者给出的信息的意图和文化蕴涵。',
        },
        {
          code: 'de',
          content:
            'Kann Sprache wirksam und flexibel für soziale Zwecke gebrauchen, auch für den Ausdruck von Emotionen, Anspielungen oder zum Scherzen.',
        },
        {
          code: 'es',
          content:
            'Hace un uso flexible y efectivo de la lengua para fines sociales, incluidos los usos emocionales, alusivos y humorísticos.',
        },
      ],
    },
    {
      name: 'Je peux m’exprimer en société avec souplesse et efficacité, y compris dans un registre affectif, allusif ou humoristique.',
      translations: [
        {
          code: 'en',
          content:
            'Can engage in real-time online exchanges with several participants, understanding the communicative intentions and cultural implications of the various contributions.',
        },
        {
          code: 'zh',
          content:
            '我能在社会上灵活有效地表达自己，包括用富有情感的，暗示的或幽默的语调表达。',
        },
        {
          code: 'de',
          content:
            'Kann sich mit mehreren Gesprächspartnern/-partnerinnen online austauschen und versteht dabei die kommunikativen Absichten und die kulturellen Implikationen der verschiedenen Beiträge.',
        },
        {
          code: 'es',
          content:
            'Participa en intercambios en línea en tiempo real con varios participantes, entendiendo las intenciones comunicativas y las implicaciones culturales de las diversas intervenciones.',
        },
      ],
    },
    {
      name: 'Je peux évaluer des arguments, les reformuler et les contester dans une conversation ou une discussion professionnelle ou académique.',
      translations: [
        {
          code: 'en',
          content:
            'Can evaluate, restate and challenge arguments in professional or academic live online chat and discussion.',
        },
        {
          code: 'zh',
          content:
            '我能在一项对话中，专业或学术讨论中评估论据，重新表述它们，以及对它们提出质疑。',
        },
        {
          code: 'de',
          content:
            'Kann die Argumente in einem beruflichen oder wissenschaftlichen Online-Chat oder in einer Online-Diskussion beurteilen, wiederholen und infrage stellen.',
        },
        {
          code: 'es',
          content:
            'Sopesa, replantea y rebate argumentos en discusiones y chats en línea síncronos de índole profesional o académica.',
        },
      ],
    },
  ],
  C2: [
    {
      name: 'Je peux suivre une conférence ou un exposé spécialisé employant des formes relâchées, des régionalismes ou une terminologie non familière.',
      translations: [
        {
          code: 'en',
          content:
            'Can understand with ease virtually any kind of language, whether live or broadcast, delivered at fast natural speed.',
        },
        {
          code: 'zh',
          content:
            '我能不间断地去听一场讨论会或一场使用非正式，方言或非通俗术语的专业报告。',
        },
        {
          code: 'de',
          content:
            'Kann praktisch alle Arten von Sprache ohne Schwierigkeiten verstehen, sei dies live oder in den Medien, und zwar auch wenn schnell und in natürlicher Geschwindigkeit gesprochen wird.',
        },
        {
          code: 'es',
          content:
            'Comprende con facilidad prácticamente cualquier tipo de discurso, tanto cara a cara como retransmitido, que se desarrolla a una velocidad rápida natural.',
        },
      ],
    },
    {
      name: 'Je peux suivre une conférence ou un exposé spécialisé employant des formes relâchées, des régionalismes ou une terminologie non familière.',
      translations: [
        {
          code: 'en',
          content:
            'Can understand with ease virtually any kind of language, whether live or broadcast, delivered at fast natural speed.',
        },
        {
          code: 'zh',
          content:
            '我能不间断地去听一场讨论会或一场使用非正式，方言或非通俗术语的专业报告。',
        },
        {
          code: 'de',
          content:
            'Kann praktisch alle Arten von Sprache ohne Schwierigkeiten verstehen, sei dies live oder in den Medien, und zwar auch wenn schnell und in natürlicher Geschwindigkeit gesprochen wird.',
        },
        {
          code: 'es',
          content:
            'Comprende con facilidad prácticamente cualquier tipo de discurso, tanto cara a cara como retransmitido, que se desarrolla a una velocidad rápida natural.',
        },
      ],
    },
    {
      name: 'Peut reconnaître les implications socioculturelles dans la plupart des interventions faites dans le cadre de discussions familières et ayant lieu à un débit normal.',
      translations: [
        {
          code: 'en',
          content:
            'Can identify the sociocultural implications of most of the language used in colloquial discussions that take place at a natural speed.',
        },
        {
          code: 'zh',
          content: '能明白通俗讨论中，大多数的正常语速发言的社会文化蕴涵。',
        },
        {
          code: 'de',
          content:
            'Kann die soziokulturellen Implikationen in den meisten informellen, in natürlicher Sprechgeschwindigkeit geführten Gesprächen erkennen, die diese in informellen Gesprächen in natürlicher Sprechgeschwindigkeit verwenden. ',
        },
        {
          code: 'es',
          content:
            'Identifica las implicaciones socioculturales de la mayoría de la lengua empleada en discusiones coloquiales que transcurren a una velocidad natural.',
        },
      ],
    },
    {
      name: 'Je peux comprendre sans effort pratiquement toute langue et tous signes, en direct ou enregistrés, si le débit est naturel.',
      translations: [
        {
          code: 'en',
          content:
            'Can follow specialised lectures and presentations employing colloquialism, regional usage or unfamiliar terminology.',
        },
        {
          code: 'zh',
          content:
            '如果语速自然，我能不费力气地理解现场或是录制的任何语言和手势。',
        },
        {
          code: 'de',
          content:
            'Kann Fachvorträge und Präsentationen verstehen, die umgangssprachliche oder regional gefärbte Ausdrücke oder auch fremde Terminologie enthalten.',
        },
        {
          code: 'es',
          content:
            'Comprende conferencias y presentaciones especializadas que contienen coloquialismos, regionalismos o terminología poco conocida.',
        },
      ],
    },
    {
      name: 'Je possède une bonne maîtrise d’expressions idiomatiques et de tournures courantes et suis sensible aux niveaux de sens connotatif. Je peux exprimer avec précision des nuances fines de sens, en utilisant assez correctement une gamme étendue de modalités. Je peux revenir sur une difficulté et la restructurer de manière si habile que l’interlocuteur s’en rende à peine compte.',
      translations: [
        {
          code: 'en',
          content:
            'Has a good command of idiomatic expressions and colloquialisms with awareness of connotative levels of meaning. Can convey finer shades of meaning precisely by using, with reasonable accuracy, a wide range of modification devices. Can backtrack and restructure around a difficulty so smoothly that the interlocutor is hardly aware of it.',
        },
        {
          code: 'zh',
          content:
            '我对特有的表达方式和常用语有很好的掌握，并且我对词的隐含意义敏感。我能以较正确的方式使用很多形态的方式，准确地表达意义上的微妙差别。我能回到一个困难，并以一种巧妙的方式重组它，以至于对话者几乎没有察觉。',
        },
        {
          code: 'de',
          content:
            'Beherrscht idiomatische und umgangssprachliche Wendungen gut und ist sich der jeweiligen Konnotationen bewusst. Kann ein großes Repertoire an Graduierungs- und Abtönungsmitteln weitgehend korrekt verwenden und damit feinere Bedeutungsnuancen deutlich machen. Kann bei Ausdrucksschwierigkeiten so reibungslos neu ansetzen und umformulieren, dass die Gesprächspartner/innen kaum etwas davon bemerken.',
        },
        {
          code: 'es',
          content:
            'Tiene un buen dominio de expresiones idiomáticas y coloquiales y es consciente de los niveles connotativos del significado. Transmite con precisión matices de significado más sutiles utilizando, con razonable precisión, una amplia variedad de procedimientos de modificación. Sortea las dificultades y reestructura su discurso con tanta soltura que el/la interlocutor/a apenas se da cuenta de ello.',
        },
      ],
    },
    {
      name: 'Je peux conseiller quelqu’un ou discuter de problèmes délicats sans maladresse, comprendre les allusions familières et traiter avec diplomatie de différences d’opinion et de critiques.',
      translations: [
        {
          code: 'en',
          content:
            'Can advise on or discuss sensitive issues without awkwardness, understanding colloquial references and dealing diplomatically with disagreement and criticism.',
        },
        {
          code: 'zh',
          content:
            '我能给某人建议或巧妙地讨论敏感问题，明白通俗的讽喻和机智地处理意见的不同和批评。',
        },
        {
          code: 'de',
          content:
            'Kann über heikle Sachverhalte diskutieren oder Ratschläge dazu geben, ohne sich dabei unbehaglich zu fühlen; versteht dabei umgangssprachliche Hinweise und kann diplomatisch mit Meinungsverschiedenheiten und Kritik umgehen.',
        },
        {
          code: 'es',
          content:
            'Aconseja o discute sobre cuestiones sensibles sin incomodidad, entendiendo referencias coloquiales y manejando con diplomacia el desacuerdo y la crítica.',
        },
      ],
    },
    {
      name: 'Je peux anticiper et gérer efficacement d’éventuels malentendus (y compris culturels), des problèmes de communication et des réactions émotionnelles lors d’une discussion.',
      translations: [
        {
          code: 'en',
          content:
            'Can anticipate and deal effectively with possible misunderstandings (including cultural ones), communication issues and emotional reactions in an online discussion.',
        },
        {
          code: 'zh',
          content:
            '在讨论中，我能有效地预测和处理潜在的误解(包括文化上的误解)，交流问题和情绪反应。',
        },
        {
          code: 'de',
          content:
            'Kann mögliche Missverständnisse (einschließlich kultureller), Kommunikationsprobleme und emotionale Reaktionen in Online-Diskussionen vorhersehen und erfolgreich damit umgehen.',
        },
        {
          code: 'es',
          content:
            'Anticipa y gestiona con eficacia posibles malentendidos (incluidos los culturales), problemas de comunicación y reacciones emocionales en una discusión en línea.',
        },
      ],
    },
    {
      name: 'Je peux adapter aisément et rapidement mon registre et mon style pour qu’ils correspondent aux différents contextes, aux objectifs de communication et aux actes de parole.',
      translations: [
        {
          code: 'en',
          content:
            'Can easily and quickly adapt their register and style to suit different online environments, communication purposes and speech acts.',
        },
        {
          code: 'zh',
          content:
            '我能轻松地快速地根据不同的背景，交流目标和语言行为来调整我的语调和风格。',
        },
        {
          code: 'de',
          content:
            'Kann Register und Stil einfach und schnell an unterschiedliche Online-Umgebungen, Kommunikationszwecke und Sprechhandlungen anpassen.',
        },
        {
          code: 'es',
          content:
            'Adapta con facilidad y rapidez su registro y estilo para adecuarse a diferentes entornos en línea, objetivos comunicativos y actos de habla.',
        },
      ],
    },
  ],
};

export const createProficiencyTests = async (prisma: PrismaClient) => {
  for (const level of Object.keys(questions)) {
    await prisma.proficiencyTests.create({
      data: {
        level: level,
        Questions: {
          create: questions[level].map((question) => ({
            TextContent: {
              create: {
                text: question.name,
                Translations: {
                  create: question.translations?.map((translation) => ({
                    text: translation.content,
                    LanguageCode: { connect: { code: translation.code } },
                  })),
                },
                LanguageCode: { connect: { code: 'fr' } },
              },
            },
            answer: true,
          })),
        },
      },
    });
  }
};
