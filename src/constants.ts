import { Event } from './types';

export const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Tech Summit 2026',
    description: 'A deep dive into the latest in AI, Web3, and Quantum Computing. Join industry leaders and academic experts for a day of innovation.',
    date: '2026-04-15',
    time: '10:00 AM',
    venue: 'Main Auditorium',
    category: 'Academic',
    organiser: 'Computer Science Dept',
    capacity: 200,
    attendees: ['user1', 'user2'],
    bannerImage: 'https://picsum.photos/seed/tech/1200/600',
  },
  {
    id: '2',
    title: 'Spring Music Festival',
    description: 'Celebrate the arrival of spring with live performances from student bands and local artists. Food stalls and fun activities included!',
    date: '2026-04-20',
    time: '04:00 PM',
    venue: 'Campus Green',
    category: 'Social',
    organiser: 'Student Union',
    capacity: 500,
    attendees: [],
    bannerImage: 'https://picsum.photos/seed/music/1200/600',
    gallery: [
      'https://picsum.photos/seed/m1/800/600',
      'https://picsum.photos/seed/m2/800/600',
      'https://picsum.photos/seed/m3/800/600',
    ]
  },
  {
    id: '3',
    title: 'Inter-College Basketball Finals',
    description: 'The final showdown between the top two teams. Come cheer for our home team and witness high-octane sports action!',
    date: '2026-04-22',
    time: '02:00 PM',
    venue: 'Sports Complex',
    category: 'Sports',
    organiser: 'Athletics Club',
    capacity: 300,
    attendees: ['user1', 'user3', 'user4'],
    bannerImage: 'https://picsum.photos/seed/sports/1200/600',
  },
  {
    id: '4',
    title: 'Photography Workshop',
    description: 'Learn the art of visual storytelling. Bring your cameras and explore the campus through a new lens.',
    date: '2026-04-25',
    time: '11:00 AM',
    venue: 'Art Studio B',
    category: 'Workshop',
    organiser: 'Media Society',
    capacity: 25,
    attendees: Array(25).fill('user'), // Full capacity
    bannerImage: 'https://picsum.photos/seed/photo/1200/600',
  }
];
