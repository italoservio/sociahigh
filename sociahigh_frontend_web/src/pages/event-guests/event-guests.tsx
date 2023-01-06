import {Input} from '../../components/input';
import {FormEvent, useEffect, useRef, useState} from 'react';
import {Template} from '../../components/template';
import {SectionTitle} from '../../components/title';
import {Button} from '../../components/button';
import {useParams} from 'react-router-dom';
import {useEventsAPI} from '../../hooks/use-events-api';
import {
  EventGuestsRequest,
  EventGuestsResponse,
} from '../../hooks/use-events-api/types';
import toast from 'react-hot-toast';
import {User} from '../../hooks/use-users-api/types';
import classnames from 'classnames';
import {AnswerEnum} from '../../utils/enums';
import style from './style.module.css';
import {useCoordinator} from '../../hooks/use-coordinator';

export function EventGuests() {
  const {id} = useParams();
  const {retrieveEventGuestsPaginated, inviteByPhoneOrEmail} = useEventsAPI();
  const {goToHome} = useCoordinator();

  const [guests, setGuests] = useState([] as EventGuestsResponse[]);
  const [query_params, setQueryParams] = useState({
    page: '1',
    page_size: '10',
  } as EventGuestsRequest);
  const [invite_loading, setInviteLoading] = useState(false);
  const [search_loading, setSearchLoading] = useState(false);

  const email_ref = useRef<HTMLInputElement>(null);
  const name_ref = useRef<HTMLInputElement>(null);

  const translated_status = {
    [AnswerEnum.ACCEPTED]: 'Aceito',
    [AnswerEnum.PENDING]: 'Talvez',
    [AnswerEnum.REFUSED]: 'Negado',
  };

  useEffect(() => {
    if (id) {
      retrieveEventGuestsPaginated(id, query_params)
        .then(res => {
          setGuests(res.data.items);
        })
        .catch(() => {
          toast.error('Falha ao obter convidados do evento');
        })
        .finally(() => {
          if (search_loading) setSearchLoading(false);
        });
    }
  }, [query_params]);

  function onSubmitInvitation(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const email = email_ref.current?.value;
    if (id && email) {
      setInviteLoading(true);
      inviteByPhoneOrEmail(id, {email})
        .then(() => {
          toast.success('Usuário convidado com sucesso');

          retrieveEventGuestsPaginated(id, query_params)
            .then(res => {
              setGuests(res.data.items);
            })
            .catch(() => {
              toast.error('Falha ao obter convidados do evento');
            });
        })
        .catch(() => {
          toast.error('Falha ao convidar usuário');
        })
        .finally(() => {
          setInviteLoading(false);
        });
      email_ref.current.value = '';
    }
  }

  function onSubmitSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearchLoading(true);

    const guest_name = name_ref.current?.value;
    const query_params_copy = {...query_params};

    if (guest_name) {
      query_params_copy.name = guest_name;
      name_ref.current.value = '';
    } else {
      delete query_params_copy.name;
    }
    setQueryParams(query_params_copy);
  }

  function userInitials(user: User) {
    if (Object.keys(user).length)
      return (
        user.first_name.charAt(0).toLocaleUpperCase() +
        user.last_name.charAt(0).toLocaleUpperCase()
      );
    return '';
  }

  return (
    <Template title='Convidados' back={goToHome}>
      <SectionTitle>Convidar</SectionTitle>

      <form className='mt-3 mb-9' onSubmit={onSubmitInvitation}>
        <Input
          ref={email_ref}
          label={'E-mail do convidado:'}
          id={'name'}
          type={'email'}
          required={true}
        />
        <div className='flex justify-end mt-2'>
          <Button
            className={'w-20'}
            type={'submit'}
            variant={'orange'}
            loading={invite_loading}
          >
            Convidar
          </Button>
        </div>
      </form>

      <SectionTitle>Convidados</SectionTitle>

      <form className='mt-3 mb-9' onSubmit={onSubmitSearch}>
        <Input
          ref={name_ref}
          label={'Nome do convidado:'}
          id={'name'}
          type={'text'}
        />
        <div className='flex justify-end mt-2'>
          <Button
            className={'w-20'}
            type={'submit'}
            variant={'orange'}
            loading={search_loading}
          >
            Buscar
          </Button>
        </div>
      </form>

      <div className={`${style['scroll-content']} mt-5 flex flex-col gap-4`}>
        {guests.length ? (
          guests.map(guest => (
            <div className={style['guest-grid']} key={guest.id}>
              <div className='flex flex-col items-center justify-center'>
                <div className='flex justify-center items-center bg-neutral-300 rounded-full h-9 w-9 text-white font-bold text-lg'>
                  {userInitials(guest.user)}
                </div>
                <div
                  className={classnames(
                    '-mt-3 text-xs leading-5 px-1 rounded-sm text-white uppercase font-bold',
                    {
                      ['bg-green-500']: guest.answer === AnswerEnum.ACCEPTED,
                      ['bg-red-500']: guest.answer === AnswerEnum.REFUSED,
                      ['bg-gray-400']: guest.answer === AnswerEnum.PENDING,
                    },
                  )}
                >
                  {translated_status[guest.answer]}
                </div>
              </div>

              <div className='flex flex-col gap-0'>
                <b>{`${guest.user.first_name} ${guest.user.last_name}`}</b>
                <span className='-mt-1'>{guest.user.email}</span>
              </div>
            </div>
          ))
        ) : (
          <span className={'font-sans text-lg'}>
            Você ainda não convidou ninguém.
          </span>
        )}
      </div>
    </Template>
  );
}
