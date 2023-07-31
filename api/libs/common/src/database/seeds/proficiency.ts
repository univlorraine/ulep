import { PrismaClient } from '@prisma/client';

const questions = {
  A1: [
    'Je peux reconnaître une information concrète à propos d’un sujet familier et quotidien, à condition que le débit soit lent et que l’information soit claire.',
    'Je peux reconnaître des mots ou des expressions familiers et identifier les sujets dans les gros titres et les résumés des nouvelles ainsi que la plupart des produits dans les publicités, en utilisant les informations visuelles.',
    'Je peux participer à une conversation simple de nature factuelle et sur un sujet prévisible (par ex. sur son logement, son pays, sa famille, ses études).',
    'Je peux présenter quelqu’un et utiliser des expressions élémentaires de salutation et de congé.',
    'Je peux demander à quelqu’un de ses nouvelles et y réagir.',
    'Je peux échanger sur mes goûts pour le sport, la nourriture, etc. en utilisant un répertoire limité d’expressions et à condition qu’on s’adresse directement à moi clairement et lentement.',
    "Je peux écrire des messages et des publications personnelles en ligne très simples, sur mes loisirs, ce que j'aime ou n’aime pas, etc. avec des phrases très courtes et à l’aide d’un outil de traduction.",
  ],
  A2: [
    'Je peux comprendre les grandes lignes d’une information simple, donnée dans une situation prévisible, comme par ex. celle d’un guide touristique («Voici où habite le Président»).',
    "Je peux discuter de ce qu'il faut faire, où aller et prendre les dispositions nécessaires pour se rencontrer.",
    'Je peux décrire ma famille, mes conditions de vie, ma formation, mon travail actuel ou le dernier en date.',
    "Je peux décrire les gens, les lieux et les choses qui m'appartiennent en termes simples.",
    'Je peux dire ce que je sais bien faire et ce que je fais moins bien (par ex. en sport, pour les jeux, mes compétences, mes matières à l’école).',
    'Je peux parler brièvement de mes projets de fin de semaine ou de vacances.',
    'Je peux donner des consignes simples pour aller d’un endroit à un autre en utilisant des expressions simples telles que «tournez à droite», «allez tout droit» et avec des connecteurs tels que «d’abord», «ensuite», «et puis».',
  ],
  B1: [
    'Je peux relater en détail mes expériences en décrivant mes sentiments et mes réactions.',
    'Je peux raconter l’intrigue d’un livre ou d’un film et décrire mes propres réactions.',
    'Je peux aborder sans préparation une conversation sur un sujet familier, exprimer des opinions personnelles et échanger des informations sur des sujets familiers d’intérêt personnel, ou pertinents pour la vie quotidienne (par ex. la famille, les loisirs, le travail, les voyages et les faits divers).',
    'Je peux, en règle générale, suivre les points principaux d’une discussion informelle entre amis à condition qu’elle ait lieu en langue standard ou dans une variété familière clairement articulée, bien qu’il moi soit parfois nécessaire de faire répéter certains mots ou expressions.',
    'Je peux exprimer poliment mes convictions, mes opinions, mon accord et mon désaccord.',
    'Je peux exprimer ma pensée sur un sujet abstrait ou culturel comme un film ou de la musique.',
    'Je peux comparer et opposer des alternatives en discutant de ce qu’il faut faire, où il faut aller, qui ou quoi choisir, etc.',
  ],
  B2: [
    'Je peux reconnaître le point de vue exprimé et le distinguer de faits rapportés.',
    'Je peux comprendre les idées principales d’interventions complexes du point de vue du fond et de la forme sur un sujet concret ou abstrait et dans une langue standard ou une variété familière, y compris des discussions techniques dans mon domaine de spécialisation.',
    'Je peux faire une description et une présentation claires et détaillées sur une gamme étendue de sujets relatifs à mon domaine d’intérêt en développant et justifiant les idées par des points secondaires et des exemples pertinents.',
    'Je peux participer activement à une discussion informelle dans un contexte familier, en faisant des commentaires, en exposant un point de vue clairement, en évaluant d’autres propositions, ainsi qu’en émettant et en réagissant à des hypothèses.',
    'Je peux exprimer et exposer mes opinions dans une discussion et les défendre avec pertinence en fournissant explications, arguments et commentaires.',
    'Je peux me rendre compte de malentendus et de désaccords lors d’une interaction et je peux les gérer, à condition que le ou les interlocuteurs soient prêts à coopérer.',
    'Je peux comprendre une langue standard, ou une variété familière, en direct ou dans les média, sur des sujets familiers ou non (vie personnelle, sociale, académique ou professionnelle). Seul un très fort fond sonore ou visuel, une structure inadaptée du discours ou l’utilisation d’expressions idiomatiques peuvent gêner ma compréhension.',
  ],
  C1: [
    'Je peux faire remarquer des distinctions très précises entre des idées, des notions et des choses qui se ressemblent nettement.',
    'Je peux suivre une intervention d’une certaine longueur sur des sujets abstraits ou complexes hors de mon domaine mais je peux avoir besoin de faire confirmer quelques détails, notamment si le registre n’est pas familier.',
    'Je peux reconnaître une gamme étendue d’expressions idiomatiques et de tournures courantes ainsi que des changements de registre.',
    'Je peux m’exprimer couramment et spontanément, presque sans effort. Je possède une bonne maîtrise d’un vaste répertoire lexical me permettant de surmonter facilement des lacunes par des périphrases, sans recherche apparente d’expressions ou de stratégies d’évitement. Seul un sujet conceptuellement difficile est susceptible de gêner le flot naturel et fluide du discours.',
    'Je peux engager des échanges avec plusieurs participants, et comprendre les intentions de communication et les implications culturelles des différentes contributions.',
    'Je peux m’exprimer en société avec souplesse et efficacité, y compris dans un registre affectif, allusif ou humoristique.',
    'Je peux évaluer des arguments, les reformuler et les contester dans une conversation ou une discussion professionnelle ou académique.',
  ],
  C2: [
    'Je peux suivre une conférence ou un exposé spécialisé employant des formes relâchées, des régionalismes ou une terminologie non familière.',
    'Peut reconnaître les implications socioculturelles dans la plupart des interventions faites dans le cadre de discussions familières et ayant lieu à un débit normal.',
    'Je peux comprendre sans effort pratiquement toute langue et tous signes, en direct ou enregistrés, si le débit est naturel.',
    'Je possède une bonne maîtrise d’expressions idiomatiques et de tournures courantes et suis sensible aux niveaux de sens connotatif. Je peux exprimer avec précision des nuances fines de sens, en utilisant assez correctement une gamme étendue de modalités. Je peux revenir sur une difficulté et la restructurer de manière si habile que l’interlocuteur s’en rende à peine compte.',
    'Je peux conseiller quelqu’un ou discuter de problèmes délicats sans maladresse, comprendre les allusions familières et traiter avec diplomatie de différences d’opinion et de critiques.',
    'Je peux anticiper et gérer efficacement d’éventuels malentendus (y compris culturels), des problèmes de communication et des réactions émotionnelles lors d’une discussion.',
    'Je peux adapter aisément et rapidement mon registre et mon style pour qu’ils correspondent aux différents contextes, aux objectifs de communication et aux actes de parole.',
  ],
};

export const createProficiencyTests = async (prisma: PrismaClient) => {
  for (const level of Object.keys(questions)) {
    await prisma.proficiencyTests.create({
      data: {
        level: level,
        Questions: {
          create: questions[level].map((question: string) => ({
            TextContent: {
              create: {
                text: question,
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
