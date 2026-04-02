import {
  Wrench,
  MapPin,
  Eye,
  Layout,
  Layers,
  Building2,
  Settings,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
} from 'lucide-react'
// import { ClerkLogo } from '@/assets/clerk-logo'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Marina Pearl Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        // {
        //   title: 'Users',
        //   url: '/users',
        //   icon: Users,
        // },
        {
          title: 'Overviews',
          url: '/overviews',
          icon: Eye,
        },
        {
          title: 'Region Links',
          url: '/region-links',
          icon: MapPin,
        },
        {
          title: 'Utility Premises',
          url: '/utility-premises',
          icon: Wrench,
        },
        {
          title: 'Typical Layouts',
          url: '/typical-layouts',
          icon: Layout,
        },
        {
          title: 'Floor Plan',
          url: '/floor-plan',
          icon: Layers,
        },
        {
          title: 'Apartment Interiors',
          url: '/apartment-interiors',
          icon: Building2,
        },
        {
          title: 'Other Info',
          url: '/other-info',
          icon: Settings,
        },
      ],
    },
  ],
}
