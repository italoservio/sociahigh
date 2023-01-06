import {useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import CoinSVG from '../../assets/svgs/coin.svg';
import LocationMarkerSVG from '../../assets/svgs/location-marker.svg';
import PersonSVG from '../../assets/svgs/person.svg';
import TimeSVG from '../../assets/svgs/time.svg';
import {Button} from '../../components/button';
import {Card} from '../../components/card';
import {Link} from '../../components/link';
import {Modal} from '../../components/modal';
import {PageTitle} from '../../components/title';
import {Tooltip} from '../../components/tooltip';
import {useEventsAPI} from '../../hooks/use-events-api';
import {
  EventPaginationResponse,
  PaginationRequest,
} from '../../hooks/use-events-api/types';
import {RoutesEnum} from '../../utils/enums';
import styles from './styles.module.css';

export default function EventsListingParcel(props: {
  page_size: number;
  page: 'listing' | 'home';
}) {
  const {page_size, page} = props;
  const {retrieveEventPaginated, removeEvent} = useEventsAPI();
  const [modalOpen, setModalOpen] = useState(false);
  const [eventIdToRemove, setEventIdToRemove] = useState('');
  const [events, setEvents] = useState([] as EventPaginationResponse[]);

  useEffect(() => {
    const query = {
      page: '1',
      page_size: String(page_size),
    } as PaginationRequest;

    retrieveEventPaginated(query).then(response =>
      setEvents(response.data.items),
    );
  }, []);

  function removeEventById() {
    removeEvent(eventIdToRemove)
      .then(() => {
        toast.success('Evento removido');
        setEvents(prev => prev.filter(ev => ev.id !== eventIdToRemove));
      })
      .catch(() => {
        toast.error('Falha ao remover evento');
      })
      .finally(() => {
        setEventIdToRemove('');
        setModalOpen(false);
      });
  }

  return (
    <>
      {events.length ? (
        <div className={`${styles[`scroll-content-${page}`]} mt-5`}>
          {events.map(event => (
            <Card key={event.id} className='mb-2'>
              <div className='flex justify-between items-center'>
                <span>{event.name}</span>
                <div
                  data-tip
                  data-for='event_invitations'
                  className='flex items-center'
                >
                  <span className='mr-1'>
                    {`${event.accepted_guests}/${event.total_guests}`}
                  </span>
                  <img src={PersonSVG} />

                  <Tooltip id='event_invitations' place='left'>
                    <span>Convites aceitos / Total de convites</span>
                  </Tooltip>
                </div>
              </div>

              <div className='flex justify-between items-center'>
                <div className='flex items-center'>
                  <img src={LocationMarkerSVG} />
                  <span className='ml-1'>{`${event.address.place}, ${event.address.number}`}</span>
                </div>
                <div
                  data-tip
                  data-for='event_amount'
                  className='flex items-center'
                >
                  <span className='mr-1'>
                    {
                      /* prettier-ignore */
                      `${event.items_with_user.toFixed(2)
                      }/${event.total_items.toFixed(2)
                      }`
                    }
                  </span>
                  <img src={CoinSVG} />

                  <Tooltip id='event_amount' place='left'>
                    <span>Itens confirmados / Somatório dos itens</span>
                  </Tooltip>
                </div>
              </div>

              <div className='flex justify-between items-center'>
                <div></div>
                <div
                  data-tip
                  data-for='event_starts'
                  className='flex items-center'
                >
                  <span className='mr-1'>
                    {new Date(event.starts_at).toLocaleString()}
                  </span>
                  <img src={TimeSVG} />

                  <Tooltip id='event_starts' place='top'>
                    <span>Data de início do evento</span>
                  </Tooltip>
                </div>
              </div>

              <div className='flex justify-between items-center'>
                <div className='flex items-center gap-3 mt-2'>
                  <Link to={RoutesEnum.EVENTS_DETAIL.replace(':id', event.id)}>
                    Editar
                  </Link>
                  <Link to={RoutesEnum.EVENTS_GUESTS.replace(':id', event.id)}>
                    Meus convidados
                  </Link>
                </div>

                <span
                  onClick={() => {
                    setEventIdToRemove(event.id);
                    setModalOpen(true);
                  }}
                  className='font-sans border-b h-6 border-red-600 text-red-600 transition hover:text-red-700 hover:border-red-700 cursor-pointer'
                >
                  Finalizar
                </span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <span className={'font-sans text-lg'}>
          Você ainda não criou nenhum evento.
        </span>
      )}

      <Modal open={modalOpen} setOpen={setModalOpen}>
        <>
          <PageTitle className='text-3xl text-center'>Remover evento</PageTitle>
          <p className='font-sans text-lg text-center mt-3 mb-5'>
            Deseja realmente remover o evento?
          </p>

          <div className={'flex justify-between gap-3'}>
            <Button
              outlined={true}
              variant={'orange'}
              onClick={() => {
                setModalOpen(false);
                setEventIdToRemove('');
              }}
            >
              Cancelar
            </Button>
            <Button variant={'orange'} onClick={() => removeEventById()}>
              Remover
            </Button>
          </div>
        </>
      </Modal>
    </>
  );
}
