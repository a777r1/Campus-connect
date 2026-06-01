export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: 'Academic' | 'Social' | 'Sports' | 'Workshop' | 'Cultural';
  organiser: string;
  capacity: number;
  attendees: string[]; // userIds
  bannerImage: string;
  registrationLink?: string;
  gallery?: string[]; // image URLs
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'faculty';
  avatar?: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  eventTitle: string;
  eventDate: string;
  category: string;
  uploadedBy: string;
  uploadedAt: string;
}
