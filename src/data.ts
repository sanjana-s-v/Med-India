export type Provider = {
  id: string
  name: string
  specialty: string
  qualification: string
  city: string
  fee: number
  experience: number
  category: 'Modern medicine' | 'Ayurveda & AYUSH'
  image: string
  about: string
  languages: string[]
  verified: boolean
  slots: string[]
}

export const doctors: Provider[] = [
  {
    id: 'ananya-rao',
    name: 'Dr. Ananya Rao',
    specialty: 'Dermatology',
    qualification: 'MBBS, MD (Dermatology)',
    city: 'Mumbai',
    fee: 900,
    experience: 12,
    category: 'Modern medicine',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=700&q=85',
    about: 'A fictional profile for this product demo. Offers consultations for general skin health and dermatology concerns.',
    languages: ['English', 'Hindi', 'Marathi'],
    verified: false,
    slots: ['10:30 AM', '12:00 PM', '04:30 PM'],
  },
  {
    id: 'arjun-mehta',
    name: 'Dr. Arjun Mehta',
    specialty: 'Orthopaedics',
    qualification: 'MBBS, MS (Orthopaedics)',
    city: 'Pune',
    fee: 750,
    experience: 15,
    category: 'Modern medicine',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=700&q=85',
    about: 'A fictional orthopaedics profile used to demonstrate provider discovery and booking.',
    languages: ['English', 'Hindi', 'Marathi'],
    verified: false,
    slots: ['09:00 AM', '11:30 AM', '03:00 PM'],
  },
  {
    id: 'kavita-sharma',
    name: 'Dr. Kavita Sharma',
    specialty: 'General Medicine',
    qualification: 'MBBS, MD (General Medicine)',
    city: 'Bengaluru',
    fee: 600,
    experience: 10,
    category: 'Modern medicine',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=700&q=85',
    about: 'A fictional general medicine profile for illustrative purposes only.',
    languages: ['English', 'Hindi', 'Kannada'],
    verified: false,
    slots: ['10:00 AM', '01:00 PM', '05:00 PM'],
  },
  {
    id: 'dev-iyer',
    name: 'Vaidya Dev Iyer',
    specialty: 'Ayurveda',
    qualification: 'BAMS (illustrative)',
    city: 'Kochi',
    fee: 800,
    experience: 14,
    category: 'Ayurveda & AYUSH',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=700&q=85',
    about: 'A fictional Ayurveda practitioner profile. Traditional wellness services are not a substitute for emergency care.',
    languages: ['English', 'Hindi', 'Malayalam'],
    verified: false,
    slots: ['09:30 AM', '12:30 PM', '03:30 PM'],
  },
]

export type Facility = {
  id: string
  name: string
  city: string
  category: string
  description: string
  image: string
  services: string[]
  stay: string
}

export const facilities: Facility[] = [
  {
    id: 'harbour-care',
    name: 'Harbour Care Centre',
    city: 'Mumbai',
    category: 'Multispecialty hospital · Demo listing',
    description: 'A fictional hospital listing for exploring provider and facility information.',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1000&q=85',
    services: ['Outpatient consultations', 'Diagnostics', 'Day care'],
    stay: 'Inpatient facilities listed in demo',
  },
  {
    id: 'sattva-wellness',
    name: 'Sattva Wellness Retreat',
    city: 'Kochi',
    category: 'Ayurveda & wellness · Demo listing',
    description: 'A fictional wellness centre listing with illustrative programme information.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85',
    services: ['Ayurveda consultation', 'Panchakarma enquiry', 'Yoga & wellness'],
    stay: 'Residential option shown for demo',
  },
  {
    id: 'lotus-clinic',
    name: 'Lotus Family Clinic',
    city: 'Pune',
    category: 'Outpatient clinic · Demo listing',
    description: 'A fictional outpatient clinic listing for this frontend demonstration.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=85',
    services: ['General medicine', 'Dermatology', 'Diagnostics'],
    stay: 'Outpatient care',
  },
]

export const treatments = [
  { id: 'general-consultation', name: 'General physician consultation', category: 'Modern medicine', duration: '20–30 min', fee: 600, icon: '✚', description: 'A one-to-one consultation with a general medicine provider. Illustrative pricing.' },
  { id: 'dermatology-consultation', name: 'Dermatology consultation', category: 'Modern medicine', duration: '20–30 min', fee: 900, icon: '◉', description: 'Discuss skin, hair, or nail concerns with a listed provider. No diagnosis is offered by this demo.' },
  { id: 'orthopaedics-consultation', name: 'Orthopaedics consultation', category: 'Modern medicine', duration: '20–30 min', fee: 750, icon: '⌁', description: 'Explore an appointment with an orthopaedics provider.' },
  { id: 'ayurveda-consultation', name: 'Ayurveda consultation', category: 'Ayurveda & AYUSH', duration: '30 min', fee: 800, icon: '✿', description: 'An introductory consultation with a traditional wellness practitioner.' },
  { id: 'panchakarma', name: 'Panchakarma programme enquiry', category: 'Ayurveda & AYUSH', duration: '7 days · illustrative', fee: 28000, icon: '❋', description: 'Share your preferences for a multi-day programme. Provider assessment is required before confirmation.' },
  { id: 'yoga-wellness', name: 'Yoga & wellness programme', category: 'Ayurveda & AYUSH', duration: '5 days · illustrative', fee: 12000, icon: '☼', description: 'A sample multi-day wellness programme; availability and suitability require provider confirmation.' },
]

export const travelServices = [
  { id: 'hotel', name: 'Serviced accommodation', category: 'Accommodation', price: 4200, unit: 'per night', icon: '⌂', description: 'Illustrative mid-range accommodation estimate.' },
  { id: 'pickup', name: 'Airport pickup', category: 'Transport', price: 1800, unit: 'per transfer', icon: '↗', description: 'Optional pickup request; subject to availability.' },
  { id: 'dropoff', name: 'Airport drop-off', category: 'Transport', price: 1600, unit: 'per transfer', icon: '↘', description: 'Optional drop-off request; subject to availability.' },
  { id: 'taxi', name: 'Local taxi', category: 'Transport', price: 1200, unit: 'per day', icon: '↔', description: 'Illustrative local transport estimate.' },
  { id: 'assistance', name: 'Travel assistance', category: 'Other', price: 900, unit: 'per request', icon: '♡', description: 'An enquiry for trip-planning support; no travel approvals are promised.' },
]
