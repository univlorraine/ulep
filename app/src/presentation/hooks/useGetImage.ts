import { useState, useEffect } from 'react';
import { useConfig } from '../../context/ConfigurationContext';

interface useGetImageProps {
  id: string;
}

const useGetImage = ({ id }: useGetImageProps, deps: any[]) => {
  const [image, setImage] = useState<string | undefined>(undefined);
  const { accessToken, getAvatar } = useConfig();

  useEffect(() => {
    const getImage = async () => {
      const result = await getAvatar.execute(id, accessToken);

      if (result instanceof Error) {
        return;
      }

      setImage(result.url);
    };

    getImage();
  }, [id, ...deps]);

  return { image };
};

export default useGetImage;