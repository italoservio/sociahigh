import {FormEvent, useContext, useEffect, useRef, useState} from 'react';
import toast from 'react-hot-toast';
import {useNavigate} from 'react-router-dom';
import LoginBalloonsSVG from '../../assets/svgs/login-balloons.svg';
import {Button} from '../../components/button';
import {Input} from '../../components/input';
import {PageTitle} from '../../components/title';
import {AppContext} from '../../contexts/app-context/app-context';
import {useCoordinator} from '../../hooks/use-coordinator';
import {useUsersAPI} from '../../hooks/use-users-api';
import {ACCESS_TOKEN_KEY} from '../../utils/constants';
import styles from './styles.module.css';

export function Login() {
  const {setUser} = useContext(AppContext);
  const {authenticate, profile} = useUsersAPI();
  const {goToHome, goToCreateAccount} = useCoordinator();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const email_ref = useRef<HTMLInputElement>(null);
  const password_ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const access_token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!!access_token) {
      profile().then(response => {
        setUser(response.data);
        if (document.referrer) navigate(document.referrer, {replace: true});
        else goToHome();
      });
    }
  }, []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const email = email_ref.current?.value;
    const password = password_ref.current?.value;

    if (email && password) {
      authenticate(email, password)
        .then(response => {
          const access_token = response.data.access_token;
          localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
          return profile();
        })
        .then(response => {
          setUser(response.data);
          goToHome();
        })
        .catch(() => {
          toast.error('Falha ao autenticar usuário');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }

  return (
    <main className='container px-4 py-4 mx-auto h-screen flex flex-col justify-center items-center'>
      <section className={styles['scroll-content']}>
        <div className='pb-4'>
          <div className='max-w-lg'>
            <img src={LoginBalloonsSVG} alt={'Balloons'} />
          </div>

          <div className='my-5'>
            <PageTitle>Acesso</PageTitle>
          </div>

          <form onSubmit={onSubmit}>
            <div className='flex flex-col gap-4'>
              <Input
                ref={email_ref}
                label={'E-mail:'}
                id={'name'}
                type={'email'}
                required={true}
              />
              <Input
                ref={password_ref}
                label={'Senha:'}
                id={'password'}
                type={'password'}
                required={true}
              />
            </div>

            <div className={'flex justify-between mt-4'}>
              <Button
                type='button'
                variant={'orange'}
                outlined={true}
                onClick={() => goToCreateAccount()}
              >
                Criar conta
              </Button>

              <Button
                type={'submit'}
                variant={'orange'}
                loading={loading}
                className='w-20'
              >
                Acessar
              </Button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
