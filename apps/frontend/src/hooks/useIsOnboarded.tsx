import { useLocalStorage } from 'react-use';

const IS_ONBOARDED_TOKEN = 'isOnboarded';

export default function useIsOnboarded() {
  const [isOnboarded, setIsOnboarded] = useLocalStorage(
    IS_ONBOARDED_TOKEN,
    false
  );

  return { isOnboarded, setIsOnboarded };
}
