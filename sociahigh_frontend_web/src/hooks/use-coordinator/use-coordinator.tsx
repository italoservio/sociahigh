import {useNavigate} from 'react-router-dom';
import {RoutesEnum} from '../../utils/enums';

export function useCoordinator() {
  const navigate = useNavigate();

  function goToLogin() {
    navigate(RoutesEnum.LOGIN);
  }

  function goToCreateAccount() {
    navigate(RoutesEnum.CREATE_ACCOUNT);
  }

  function goToHome() {
    navigate(RoutesEnum.HOME);
  }

  function goToEventDetail(id?: string) {
    navigate(RoutesEnum.EVENTS_DETAIL.replace(':id', !!id ? id : ''));
  }

  return {
    goToLogin,
    goToHome,
    goToEventDetail,
    goToCreateAccount,
  };
}
