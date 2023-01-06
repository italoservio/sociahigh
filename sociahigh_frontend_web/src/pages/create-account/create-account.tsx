import {ChangeEvent, FormEvent, useState} from 'react';
import toast from 'react-hot-toast';
import CreateAccountBalloonsSVG from '../../assets/svgs/create-account-balloons.svg';
import {Button} from '../../components/button';
import {Input} from '../../components/input';
import {PageTitle} from '../../components/title';
import {useCoordinator} from '../../hooks/use-coordinator';
import {useUsersAPI} from '../../hooks/use-users-api';
import {CreateAccountRequest} from '../../hooks/use-users-api/types';
import styles from './styles.module.css';

export function CreateAccount() {
  const [form, setForm] = useState({} as CreateAccountRequest);
  const [loading, setLoading] = useState(false);
  const {create} = useUsersAPI();
  const {goToLogin} = useCoordinator();

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    create(form)
      .then(() => {
        toast.success('Conta criada com sucesso!');
        setForm({} as CreateAccountRequest);
        goToLogin();
      })
      .catch(() => {
        toast.error('Falha ao criar conta. Tente novamente mais tarde.');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <main className='container px-4 py-4 mx-auto h-screen flex flex-col justify-center items-center'>
      <section className={styles['scroll-content']}>
        <div className='pb-4'>
          <div className='max-w-lg'>
            <img src={CreateAccountBalloonsSVG} alt={'Balloons'} />
          </div>

          <div className='my-5'>
            <PageTitle>Criar conta</PageTitle>
          </div>

          <form className='flex flex-col gap-4 max-w-lg' onSubmit={onSubmit}>
            <div
              className='grid grid-cols-2 gap-4'
              style={{maxWidth: '21.25rem'}}
            >
              <Input
                name={'first_name'}
                label={'Primeiro nome:'}
                value={form.first_name || ''}
                required={true}
                onChange={onInputChange}
              />
              <Input
                name={'last_name'}
                label={'Último nome:'}
                value={form.last_name || ''}
                required={true}
                onChange={onInputChange}
              />
            </div>

            <Input
              name={'email'}
              label={'E-mail:'}
              value={form.email || ''}
              type={'email'}
              required={true}
              onChange={onInputChange}
            />
            <Input
              name={'phone'}
              label={'Telefone:'}
              value={form.phone || ''}
              required={true}
              onChange={onInputChange}
            />
            <Input
              name={'password'}
              label={'Senha:'}
              value={form.password || ''}
              type={'password'}
              required={true}
              onChange={onInputChange}
            />

            <div className='flex justify-between'>
              <Button
                type={'button'}
                variant={'orange'}
                outlined={true}
                onClick={() => goToLogin()}
              >
                Voltar
              </Button>

              <Button
                type={'submit'}
                variant={'orange'}
                loading={loading}
                className='w-28'
              >
                Criar conta
              </Button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
