// Shared domain types for Kush.

export type Gender = "Woman" | "Man" | "Nonbinary";
export type ShowMe = "Women" | "Men" | "Everyone";
export type LocationFocus = "Home" | "Diaspora" | "Both";
export type SwipeDirection = "like" | "pass" | "star";

export interface Profile {
  id: string;
  name: string;
  age: number;
  city: string;
  country: string;
  route: string;
  bio: string;
  tags: string[];
  photos: string[]; // storage paths in the `photos` bucket; empty => gradient placeholder
  gender: Gender | null;
  looking_for: ShowMe | null; // who they want to see
  tribe: string;
  location_focus: LocationFocus | null;
  tint: string; // CSS gradient placeholder color, e.g. "linear-gradient(150deg,#E0A24F,#A85A22)"
  initial: string; // first letter, used in avatars
  created_at: string;
  last_active_at: string;
}

export interface Match {
  id: string;
  user_a: string;
  user_b: string;
  created_at: string;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}

// A match joined to the other person's profile + last message, for list views.
export interface Conversation {
  matchId: string;
  profile: Profile;
  lastMessage: Message | null;
  unread: number;
}

export interface Filters {
  showMe: ShowMe;
  ageMin: number;
  ageMax: number;
  distance: number;
  locationFocus: LocationFocus;
}

export const DEFAULT_FILTERS: Filters = {
  showMe: "Women",
  ageMin: 23,
  ageMax: 33,
  distance: 120,
  locationFocus: "Both",
};
