export interface Alumni {
  id: string;
  name: string;
  gradYear: number;
  industry: string;
  currentRole: string;
  bio: string;
  accomplishments: string;
  location: string;
  college?: string;
  coordinates?: [number, number]; // [longitude, latitude] — school location
  schoolName?: string;            // canonical school name for map grouping
  enrollmentStatus?: "enrolled" | "graduated";
}
