// M07 — Tipagem oficial do módulo de dados

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  level: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  slug: string;
  title: string;
  description: string | null;
  video_url: string | null;
  order_index: number;
  is_preview: boolean;
  created_at: string;
  updated_at: string;
}
