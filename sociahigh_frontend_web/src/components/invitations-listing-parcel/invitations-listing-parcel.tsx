import {useContext, useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import EnvelopSVG from '../../assets/svgs/envelop.svg';
import LocationMarkerSVG from '../../assets/svgs/location-marker.svg';
import TimeSVG from '../../assets/svgs/time.svg';
import {AppContext} from '../../contexts/app-context/app-context';
import {useEventsAPI} from '../../hooks/use-events-api';
import {
  Event,
  Item,
  PaginationRequest,
  UserInvitationsResponse,
} from '../../hooks/use-events-api/types';
import {AnswerEnum} from '../../utils/enums';
import {Button} from '../button';
import {Card} from '../card';
import {Checkbox} from '../checkbox';
import {ItemNameAndPrice} from '../item';
import {Modal} from '../modal';
import {StatusText} from '../status';
import {PageTitle, SectionTitle} from '../title';
import {Tooltip} from '../tooltip';
import styles from './styles.module.css';

export function InvitationsListingParcel(props: {
  page_size: number;
  page: 'listing' | 'home';
}) {
  const {page_size, page} = props;
  const {user} = useContext(AppContext);
  const {
    retrieveEventItemsPaginated,
    retrieveUserInvitationsPaginated,
    updateInvitation,
    updateItem,
    retrieveEventById,
  } = useEventsAPI();

  const [modalOpen, setModalOpen] = useState(false);
  const [event_items, setEventItems] = useState([] as Item[]);
  const [selected_item, setSelectedItem] = useState(0);
  const [invitation_loading, setInvitationLoading] = useState(false);
  const [current_invitation, setCurrentInvitation] = useState(
    {} as UserInvitationsResponse,
  );
  const [invitations, setInvitations] = useState(
    [] as UserInvitationsResponse[],
  );

  useEffect(() => {
    const query = {
      page: '1',
      page_size: String(page_size),
    } as PaginationRequest;

    retrieveUserInvitationsPaginated({
      ...query,
      answer: [AnswerEnum.ACCEPTED, AnswerEnum.PENDING],
    }).then(response => setInvitations(response.data.items));
  }, []);

  function onInvitationAccept(user_invitation: UserInvitationsResponse) {
    retrieveEventItemsPaginated(user_invitation.id, {
      page: '1',
      page_size: String(page_size),
      with_user: false,
    }).then(res => {
      if (!res.data.items.length) {
        submitInvitationAnswer(user_invitation, AnswerEnum.ACCEPTED);
        return;
      }
      setCurrentInvitation(user_invitation);
      setEventItems(res.data.items);
      setModalOpen(true);
    });
  }

  async function submitInvitationAnswer(
    user_invitation: UserInvitationsResponse,
    answer: AnswerEnum,
    item_id?: string,
  ) {
    updateInvitation(user_invitation.invitation.id, answer)
      .then(res => {
        toast.success(
          `Convite ${
            answer === AnswerEnum.ACCEPTED ? 'aceito' : 'recusado'
          } com sucesso`,
        );

        if (item_id) {
          updateItem(user_invitation.id, item_id, {user_id: user.id}).then(
            _ => {
              toast.success('Item escolhido com sucesso');
            },
          );
        }

        const invitation_index = invitations.findIndex(
          el => el.id === user_invitation.id,
        );

        if (!!~invitation_index) {
          const invitations_copy = [...invitations];
          if (answer === AnswerEnum.ACCEPTED) {
            invitations_copy[invitation_index].invitation = res.data;
          } else {
            invitations_copy.splice(invitation_index, 1);
          }
          setInvitations(invitations_copy);
        }

        if (modalOpen) setModalOpen(false);
      })
      .catch(() => {
        toast.error('Falha ao responder convite');
      })
      .finally(() => {
        setInvitationLoading(false);
      });
  }

  return (
    <>
      {invitations.length ? (
        <div className={`${styles[`scroll-content-${page}`]} mt-5`}>
          {invitations.map(invitation => (
            <Card key={invitation.id} className='mb-2'>
              <div className='flex align-center flex-wrap'>
                <div>
                  <span>{invitation.name}</span>
                  <div className='flex items-center'>
                    <img src={LocationMarkerSVG} />
                    <span className='ml-1'>{`${invitation.address.place}, ${invitation.address.number}`}</span>
                  </div>
                </div>

                <div className='flex items-end flex-col justify-center ml-auto'>
                  <div
                    data-tip
                    data-for='invitations_envelop'
                    className='flex items-center'
                  >
                    <span className='mr-1'>
                      {new Date(
                        invitation.invitation.invited_at,
                      ).toLocaleString()}
                    </span>
                    <img src={EnvelopSVG} />

                    <Tooltip id='invitations_envelop'>
                      <span>Data de envio do convite</span>
                    </Tooltip>
                  </div>

                  <div
                    className='flex items-center'
                    data-tip
                    data-for='invitations_time'
                  >
                    <span className='mr-1'>
                      {new Date(invitation.starts_at).toLocaleString()}
                    </span>
                    <img src={TimeSVG} />

                    <Tooltip id='invitations_time'>
                      <span>Data de início do evento</span>
                    </Tooltip>
                  </div>
                </div>
              </div>

              {invitation.invitation.answer === AnswerEnum.PENDING ? (
                <div className='flex items-center justify-between gap-3 mt-3'>
                  <Button
                    outlined={false}
                    variant={'red'}
                    onClick={_ => {
                      setInvitationLoading(true);
                      submitInvitationAnswer(invitation, AnswerEnum.REFUSED);
                    }}
                    loading={invitation_loading}
                    className='w-20'
                  >
                    Recusar
                  </Button>
                  <Button
                    outlined={false}
                    variant={'green'}
                    onClick={_ => {
                      onInvitationAccept(invitation);
                    }}
                    loading={invitation_loading}
                    className='w-20'
                  >
                    Aceitar
                  </Button>
                </div>
              ) : (
                <div className='mt-3'>
                  <StatusText variant={'green'}>Aceito</StatusText>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <span className={'font-sans text-lg'}>
          Você ainda não possui nenhum convite.
        </span>
      )}

      <Modal open={modalOpen} setOpen={setModalOpen}>
        <>
          <PageTitle className='text-3xl'>Escolha de item</PageTitle>
          <p className='font-sans text-sm mt-3 mb-5'>
            Este evento possui alguns itens solicitados para sua realização.
            Selecione um item a sua escolha:
          </p>

          <SectionTitle>Itens</SectionTitle>

          <div className='mt-5 flex flex-col gap-2 max-h-32 overflow-auto'>
            {event_items.map((item, i) => (
              <div key={i} className='flex items-center gap-2'>
                <Checkbox
                  checked={selected_item === i + 1}
                  onClick={() => {
                    if (selected_item !== i + 1) setSelectedItem(i + 1);
                    else setSelectedItem(0);
                  }}
                />
                <ItemNameAndPrice name={item.name} value={item.value} />
              </div>
            ))}
          </div>

          <div className='flex justify-between mt-5'>
            <Button
              type={'button'}
              variant={'orange'}
              outlined={true}
              onClick={() => {
                setCurrentInvitation({} as UserInvitationsResponse);
                setEventItems([]);
                setModalOpen(false);
              }}
            >
              Voltar
            </Button>

            <Button
              form={'event'}
              type={'submit'}
              variant={'orange'}
              disabled={!selected_item}
              className='w-24'
              onClick={_ => {
                setInvitationLoading(true);
                submitInvitationAnswer(
                  current_invitation,
                  AnswerEnum.ACCEPTED,
                  event_items[selected_item - 1].id,
                );
              }}
              loading={invitation_loading}
            >
              Confirmar
            </Button>
          </div>
        </>
      </Modal>
    </>
  );
}
