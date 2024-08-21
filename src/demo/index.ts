import '../lib/object-inspector/object-inspector.js';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const inspector = document.querySelector('ix-object-inspector')!;
inspector.name = 'Demo';
inspector.expandLevel = 3;
inspector.data = [
  {
    _id: '56dcf573b09c217d39fd7621',
    name: 'Howard Christensen',
    email: 'howardchristensen@isotronic.com',
    phone: '+1 (830) 529-3176',
    address: '511 Royce Street, Hilltop, Tennessee, 9712',
  },
  {
    _id: '56dcf57323630b06251e93cd',
    name: 'Eleanor Lynn',
    email: 'eleanorlynn@isotronic.com',
    phone: '+1 (911) 576-2345',
    address: '547 Dearborn Court, Trona, California, 8629',
  },
  {
    _id: '56dcf5738279cac6b081e512',
    name: 'Baxter Mooney',
    email: 'baxtermooney@isotronic.com',
    phone: '+1 (954) 456-3456',
    address: '349 Cumberland Walk, Washington, Alaska, 3154',
  },
  {
    _id: '56dcf57303accabd43740957',
    name: 'Calhoun Tyson',
    email: 'calhountyson@isotronic.com',
    phone: '+1 (818) 456-2529',
    address: '367 Lyme Avenue, Ladera, Louisiana, 6292',
  },
  {
    _id: '56dcf57391ea6a9d1f60df0c',
    name: 'Judith Jimenez',
    email: 'judithjimenez@isotronic.com',
    phone: '+1 (950) 587-3415',
    address: '269 Bogart Street, Sultana, Vermont, 7833',
  },
  {
    _id: '56dcf5735a7a0718a61f294d',
    name: 'Newman Lawson',
    email: 'newmanlawson@isotronic.com',
    phone: '+1 (814) 484-2827',
    address: '969 Conduit Boulevard, Lowell, Oregon, 4118',
  },
];
