import { useMutation } from '@tanstack/react-query';
import useAxiosSecure from '../../axios/useAxiosSecure';
import { saveGoogleUser } from '../../api/usersApi';

const useSaveGoogleUser = () => {

  const axiosSecure = useAxiosSecure();

  const mutation = useMutation({
    mutationFn: async (user) => {
      return await saveGoogleUser(user, axiosSecure);
    }
  });

  return mutation;
};

export default useSaveGoogleUser;