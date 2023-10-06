import { PrismaClient } from '@prisma/client';

export const createInstance = async (prisma: PrismaClient) => {
  await prisma.instance.create({
    data: {
      name: 'Instance',
      email: 'email@contact.com',
      cgu_url: 'https://cgu.exemple.com',
      confidentiality_url: 'https://confidentiality.exemple.com',
      ressource_url: 'https://ressource.exemple.com',
      primary_color: '#FDEE66',
      primary_dark_color: '#B6AA43',
      primary_background_color: '#EDDF5E',
      secondary_color: '#8BC4C4',
      secondary_dark_color: '#4B7676',
      secondary_background_color: '#7CB8B8',
    },
  });
};
