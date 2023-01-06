import {Button} from '../../components/button';
import EventsListingParcel from '../../components/events-listing-parcel/events-listing-parcel';
import {InvitationsListingParcel} from '../../components/invitations-listing-parcel';
import {Template} from '../../components/template';
import {SectionTitle} from '../../components/title';
import {useCoordinator} from '../../hooks/use-coordinator';

export function Home() {
  const {goToEventDetail} = useCoordinator();

  return (
    <Template title='Página inicial'>
      <div className='flex justify-between items-center'>
        <SectionTitle>Meus Eventos</SectionTitle>
        <Button
          variant='orange'
          outlined={false}
          onClick={() => goToEventDetail()}
        >
          Criar evento
        </Button>
      </div>
      <EventsListingParcel page_size={5} page={'home'} />

      <div className='mt-5'>
        <SectionTitle>Meus Convites</SectionTitle>
      </div>
      <InvitationsListingParcel page_size={5} page={'home'} />
    </Template>
  );
}
